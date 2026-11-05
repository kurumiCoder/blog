const n=`# Nellie



当前20帧实验入口：\`D:\\ai\\dy\\mitochondria\\nellie\\exp\\启动_private_first20.py\`。正常运行会先清空本实验 \`nellie_output\` 旧结果，保留输入图像，再填入实验配置并停在 File validation。修改参数在该启动脚本的 \`SETTINGS\` 中进行。

**只查看已有结果时，加 \`--keep-output\`，避免清空：**

\`\`\`powershell
D:\\ai\\dy\\mitochondria\\nellie\\.venv\\Scripts\\python.exe D:\\ai\\dy\\mitochondria\\nellie\\exp\\启动_private_first20.py --keep-output
\`\`\`

**当前可视化已恢复官方按钮和默认轨迹显示**：自定义回放、像素定位和整段候选面板已撤回；仅保留菜单报错、标签识别的两处兼容修复。恢复程序默认显示不代表跟踪准确性已获验证。



## 简要



### 摘要




细胞器不断发生形态变化和动态相互作用，这些过程对细胞稳态、应激反应和疾病进展至关重要。尽管它们很重要，但由于细胞器结构复杂、运动迅速以及现有分析工具的技术限制，量化细胞器形态和运动性仍然具有挑战性。



通过用户友好的基于 Napari 的界面，Nellie 使无需编程专业知识也能进行全面细胞器分析。我们通过从单通道数据中解混多个细胞器、通过图自编码器量化线粒体对离子霉素的响应，以及表征不同细胞类型和时间点的内质网网络，展示了 Nellie 的多功能性。该工具通过提供可访问、自动化的细胞器动力学分析，满足了细胞生物学中的关键需求。

**Nellie 的 pipeline 和 Napari 插件都仍处于非常早期的阶段，** 因此[我非常鼓励任何及所有反馈](#getting-help)。





- 一个自动化且无偏的 pipeline
- 可用于多种细胞内结构的分割、追踪和特征提取
- Nellie 可自适应图像元数据，并采用分层分割来解析亚细胞器区域，而其半径自适应模式匹配可实现精确的运动追踪



### 2D时间序列数据集处理流程



依据本机 \`D:\\ai\\dy\\mitochondria\\nellie\` 的代码整理（2026-11-02）。总调度是 \`nellie_napari/nellie_processor.py\`。

**读图 → 增强结构 → 分割区域 → 提取骨架与分支 → 找标记点 → 匹配标记点 → 重分配标签 → 导出特征。**

界面只有6个处理步骤，因为 **Run segmentation 同时运行 Label（区域分割）和 Network（骨架、分支提取）**。

![image-20261031154141824](Nellie.assets/image-20261031154141824.png)



#### 0. File validation：读图并核对单位



读取轴顺序、帧数、通道、像素尺寸及帧间隔。对应代码：\`nellie/im_info/verifier.py\`。

个人数据按 **TYX** 处理，即时间、图像高、图像宽；前20帧为 \`20 × 1053 × 1043\`，像素尺寸约 \`0.1243 μm\`，帧间隔约 \`6.4216 s\`。没有Z轴，但不能据此判断采集时是否做过投影。



#### 1. Run preprocessing：让结构更突出



对应代码：\`nellie/segmentation/filtering.py\`，类 \`Filter\`。

- **读入**：原图及像素尺寸
- **做什么**：用多个粗细尺度检查局部结构，计算修改过的 Frangi 增强响应，让细长、管状等结构更突出，并筛除部分背景响应
- **输出**：\`im_preprocessed.ome.tif\`，界面中的 **Pre-processed**

此时还没有把线粒体分成一块一块；输出是后续分割使用的结构增强图，不是还原出的真实图像。

![image-20261030204332101](Nellie.assets/image-20261030204332101.png)



#### 2. Run segmentation → Label：圈出区域并编号



对应代码：\`nellie/segmentation/labelling.py\`，类 \`Label\`。

- **读入**：增强图；启用原始亮度筛选时还使用原图亮度
- **做什么**：把细胞器从背景中“抠出来”，再给区域编号：
  1. 默认在增强响应上计算 Triangle 和 Otsu 两种自动阈值，取较小值，选出前景
  2. 给连在一起的区域编号
  3. 删除过小区域、整理边界
- **输出**：\`im_instance_label.ome.tif\`，界面中的 **Labels: Organelles**

- **实例**：分出来的一块区域；
- **标签**：这块区域的编号
- **每帧独立分割、编号**：此时还没有跨帧身份对应
- **二维重叠的影响**：两根重叠后连在一起，可能被算成同一块



#### 3. Run segmentation → Network：提取骨架和分支



对应代码：\`nellie/segmentation/networking.py\`，类 \`Network\`。

它紧接着 Label 执行，不需要额外点一个处理按钮。

- **读入**：本帧分割区域
- **做什么**：
  - 把区域缩成内部的中心细线，也就是骨架，再区分端点、连接点和分支
  - 可以理解为给复杂区域画出内部的路线
- **输出**：
  - \`im_skel\`（骨架）
  - \`im_skel_relabelled\`（分支标签）
  - \`im_pixel_class\`（骨架点的类别）
  - 界面 **Labels: Branches** 对应分支标签，显示铺满区域的色块，不是细骨架线

- **骨架与界面分支图的区别**：
  - 程序先生成细骨架，并给骨架分支编号，保存为 \`im_skel\`
  - 再把骨架分支编号分配给同一分割区域内附近的像素，得到铺满区域的 \`im_skel_relabelled\`
  - **Open segmentation images** 只加载细胞器标签和铺满区域的分支标签，不会自动加载 \`im_skel\`
  - 要看细骨架，可通过 Napari 的 **File → Open** 打开输出目录里以 \`-im_skel.ome.tif\` 结尾的文件


这一步仍在分析每帧形状，没有跟踪。分割中的错连也可能出现在骨架中。

![image-20261030204546272](Nellie.assets/image-20261030204546272.png)

![image-20261030204614204](Nellie.assets/image-20261030204614204.png)



#### 4. Run mocap marking：挑出后面用于匹配的“小路标”



对应代码：\`nellie/segmentation/mocap_marking.py\`，类 \`Markers\`

**目的**：在线粒体内部挑出一些位置，下一步再去找这些位置在后一帧去了哪里；这里先不做前后帧匹配

- **输入**：分割区域和原始荧光图
- **当前选择**：\`Use image = distance\`，启动脚本第72行明确设置了这一项
- **增强图是什么**：就是第1步预处理的 \`im_preprocessed\`；只有选择 \`frangi\` 时，才改用它找候选点

**① 先把分割区域变成距离图**

- 区域外是背景，距离为0
- 区域里的像素，记录它到最近背景像素有多远，单位为像素
- 靠边的值通常小，较厚区域的内部通常较大
- 这张距离图在本步骤生成，不是之前已有的输入

**② 在距离图里，先挑出一些可能做路标的位置**

- 可以把距离值想成地形高度：靠边低，内部较高
- 程序分别用较小、较大的范围检查局部形状，寻找不同宽度的凸起；这就是“多个尺度”
- 每次检查都会生成一张分数图，数值表示这种检查下的凸起响应
- 在分数图里，比附近位置的分数都不低、且分数大于0的位置，先记为候选点
- 汇集各次找到的候选，同一位置只记一次

这里找的是**经过计算后的分数图里的局部高点**，不是直接选距离图里数值最大的那个像素

**③ 候选挤在一起时，回到原图，留下附近更亮的那个**

下面只是假设的数值例子，不是本实验测量值：第②步找到了A、B、C三个候选，其中A、B只相隔1个像素，C离它们很远，周围也没有其他候选

| 候选位置 | 在原始荧光图中的亮度 | 处理结果 |
|---|---|---|
| A | 100 | 留下：比旁边的B亮 |
| B | 80 | 去掉：旁边有更亮的A |
| C | 60 | 留下：虽然比A暗，但离A远，不参与同一次近邻比较 |

- **先用距离图找位置，再用原图亮度减少附近的重复候选**
- 比较的是附近候选，不是整张图只留最亮的点
- 如果附近候选并列最亮，代码允许同时保留
- 一段线粒体可以留下多个标记点，标记点数量不是线粒体数量

**输出**：

- \`im_marker\`：最后留下的标记点；界面 **Mocap Markers** 显示这一张
- \`im_distance\`：上面生成的距离图
- \`im_border\`：区域外侧的一圈边界像素



>

<details>
<summary>展开查看与代码逐项对应的计算细节</summary>

- 第②步使用不同 sigma 的负LoG响应：\`-gaussian_laplace(image, sigma)\`，再乘以 \`sigma²\`，负值置0
- 二维局部比较使用3×3窗口，候选必须位于分割前景内；响应为正、且等于窗口最大值时保留，所以相同高度的平台可能贡献多个候选
- 第③步只在候选坐标处放入原图亮度，其他位置记0，再用最大值滤波比较
- 当前 \`Peak min distance = 2\`，比较窗口为 \`2×2+1 = 5\`，即5×5；保留亮度等于窗口最大值且大于0的位置
- 当前 \`Num sigma = 5\` 参与确定尺度步长，实际尺度数还受半径范围和最小步长限制，不保证恰好5个
- 距离图是到最近背景像素的欧氏距离；代码会把超过 \`2 × max_radius_px\` 的值截到这个上限，所以内部距离也不一定一直增加

</details>



>

![image-20261030204855279](Nellie.assets/image-20261030204855279.png)



#### 5. Run tracking：匹配前后帧的标记点



对应代码：\`nellie/tracking/hu_tracking.py\`，类 \`HuMomentTracking\`。

- **读入**：相邻帧的标记点，以及点附近的图像信息
- **做什么**：
  - 在允许距离内找候选点，比较距离、局部亮度统计和局部形状
  - Hu矩是描述形状的一组数值
  - 综合这些差异选出匹配，记录位移和匹配代价
- **输出**：\`flow_vector_array.npy\`，保存标记点的运动向量及匹配代价

例如：本帧的点A对应下一帧的点B，若B在A左边2个像素，就记录“向左移动2个像素”。**本步直接匹配的是标记点及局部结构，不是把每一整根线粒体做一对一配对。**

![image-20261102165829866](Nellie.assets/image-20261102165829866.png)









#### 6. Run voxel reassignment：推算其他像素的对应，延续编号



对应代码：\`nellie/tracking/flow_interpolation.py\` 和 \`voxel_reassignment.py\`。

1. **估计普通像素的移动**：普通像素未必是标记点。Nellie参考附近“小路标”分别移动了多少，再结合距离和匹配代价，加权估计这个像素应该往哪里走；这叫插值

2. **寻找像素对应**：结合向前、向后的运动估计，构建前后帧像素匹配

3. **传递编号**：根据候选对应关系进行加权投票，把之前的区域编号分配给下一帧像素

输出：

| 文件 | 内容 |
|---|---|
| \`voxel_matches.npy\` | 保存的逐帧像素匹配；每个目标保留最佳来源像素对，不能等同于最终标签投票的全部候选 |
| \`im_obj_label_reassigned\` | 延续区域编号后的图 |
| \`im_branch_label_reassigned\` | 延续分支编号后的图 |

界面 **Reassigned Labels** 显示后两种图。完整流程是否自动执行此步，由 **Auto-run voxel reassignment** 控制。

**分割图看“这一帧分出了哪些块”；重分配图看“这些像素的编号从哪里延续来”。** 假如首帧红、蓝两块后来碰在一起，当前分割可能成为一整块，而重分配图里仍可能一部分红、一部分蓝。它没有保证每帧一整块都对应一个稳定身份。

检查颜色要叠加原图：看颜色是否跟着原来结构移动、是否突然跳到旁边。**同色本身不是跟踪正确的证据**；二维重叠或弱信号处可能无法判断，也不能直接把多色或分开的同色区域认作真实融合、分裂。

![image-20261102173841917](Nellie.assets/image-20261102173841917.png)









#### 7. Run feature export：计算并导出数值



对应代码：\`nellie/feature_extraction/hierarchical.py\`，类 \`Hierarchy\`。

- **读入**：原图、区域与分支分割、骨架、运动信息等结果
- **做什么**：在像素、节点、分支、细胞器区域和整图层级计算亮度、形态及运动特征；节点统计、运动等内容受配置控制
- **输出**：\`features_voxels\`、\`features_nodes\`、\`features_branches\`、\`features_organelles\`、\`features_image\` 对应的CSV，以及邻接关系等文件

结果保存在实验的 \`nellie_output\` 下。\`Analyze\` 用于查看特征，不代表已经确认跟踪正确。



#### Visualize里的彩色轨迹线是怎么生成的



这属于结果展示，**不是上面的第8个处理步骤**。对应代码：\`nellie/tracking/all_tracks_for_label.py\` 的 \`LabelTracks\`；按钮调用位于 \`nellie_napari/nellie_visualizer.py\`。

点击 **Visualize selected label's tracks** 后：

1. 从所选标签区域取一批像素，抽样间隔由显示设置决定

2. 利用保存的标记点运动向量，逐帧插值估计这些像素的位置；不重新运行标记点匹配

3. 当前实现会过滤落在前景外或图像外的预测位置

4. 交给 Napari 连成彩色轨迹线

所以，轨迹ID指向一条像素轨迹，不等于整根线粒体的身份编号。某一帧没有显示位置，也不能直接断定线粒体消失。

| 界面内容 | 展示什么 |
|---|---|
| Mocap Markers | 参与运动估计的标记点 |
| Tracks彩线 | 根据运动信息估计的一批像素轨迹 |
| Reassigned Labels | 根据像素对应关系延续编号的图 |

三者使用相关的运动信息，但不是同一份展示结果。整个流程不能保证二维图中每一根真实线粒体都有始终正确的身份编号。

![image-20261101163059240](Nellie.assets/image-20261101163059240.png)

![image-20261102122617860](Nellie.assets/image-20261102122617860.png)

分步按钮用于逐步运行、查看中间结果；**Run Nellie** 会按顺序连续运行，某一步报错则停止后续流程。



## 操作手册



### 1. 安装（Windows 11）



Nellie 有两种安装方式：

方式 A：已经安装 Napari

1. 打开 Napari
2. 点击 \`Plugins → Install/Uninstall Plugins\`
3. 搜索 \`Nellie\`
4. 点击 Install
5. 重启 Napari

方式 B：直接通过 Python 安装

打开 PowerShell：

\`\`\`bash
python -m pip install nellie
\`\`\`

启动：

\`\`\`bash
napari
\`\`\`

要求 Python ≥ 3.10，支持 Windows。你可以直接在 Windows 本机运行，不必先折腾 WSL 图形界面。



### 2. 导入自己的线粒体数据



![image-20261102122918250](Nellie.assets/image-20261102122918250.png)

建议准备：

- 格式：\`.ome.tif\`（优先）或 \`.nd2\`
- 数据维度：\`TYX\`，即时间、Y、X
- 单通道线粒体荧光图像
- 尽量保留原始图像和时间信息

在 Nellie 中：

1. 打开 \`Plugins → Nellie\`
2. 进入 \`File select\`
3. 点击 \`Select File\`
4. 选择你的时序图像
5. 检查图像维度、像素尺寸等元数据
6. 点击 \`Open preview\` 检查图像

如果元数据识别失败，需要手动填写。



### 3. 开始处理



![image-20261102122956298](Nellie.assets/image-20261102122956298.png)

进入 \`Process\`：

点击 Run Nellie，执行完整流程。

主要包括：

1. 图像预处理
2. 线粒体实例分割
3. 骨架与分支提取
4. 运动标记点检测
5. 跨帧追踪
6. 体素关联与重新分配
7. 特征提取



### 4. 查看追踪效果



![image-20261102123016294](Nellie.assets/image-20261102123016294.png)

进入 \`Visualization\`：

| 选项              | 用途             |
| ----------------- | ---------------- |
| Raw               | 原始图像         |
| Preprocessed      | 预处理图像       |
| Segmentation      | 实例分割结果     |
| Mocap Markers     | 运动标记点       |
| Reassigned Labels | 跨帧重新关联结果 |

查看追踪：

- 选择 Segmentation 图层
- 点击 \`Visualize all frame labels' tracks\`
- 也可以使用取色工具选择单个线粒体，查看它的追踪轨迹



### 5. 输出在哪里？



默认输出：

\`\`\`
原始图像目录/
└── nellie_output/
    ├── 中间处理结果
    └── CSV 特征数据
\`\`\`

还可以进入 \`Analyze\`，查看和导出不同层级的形态、运动等特征。



### 6. 我建议你怎么开始？



不要一上来就处理完整的私有数据。

先做一个小实验：

1. 选取一段2D线粒体时序图像
2. 用 Nellie 默认参数跑完整流程
3. 检查分割是否准确
4. 检查跨帧追踪是否发生错误关联
5. 保存结果，作为后续与 mitoTNT、其他算法对比的基线

特别提醒： Nellie 能够输出追踪结果，不代表这些追踪一定符合真实生物学变化。仍然需要我们设计独立的质量评估。

官方资源：

- [Nellie GitHub（安装、操作视频、示例数据）](https://github.com/aelefebv/nellie?utm_source=chatgpt.com)
- [Nellie Nature Methods 论文](https://www.nature.com/articles/s41592-025-02612-7?utm_source=chatgpt.com)

我建议下一步先拿 Nellie 自带的示例数据跑通，再导入你的私有数据。这样能把安装问题和算法效果问题分开。



## 本机使用与个人数据适配（2026-10-30）






这一节只记录操作和数据适配，不包含安装教程。项目位置为 \`D:\\ai\\dy\\mitochondria\\nellie\`，所有新实验放在 \`D:\\ai\\dy\\mitochondria\\experiments\\nellie\`。



### 先启动，再打开试跑数据






双击项目根目录的 \`启动Nellie.py\`，会打开 Napari 和右侧 Nellie 面板。它使用项目自己的 \`.venv\`，不需要手工激活环境。

也可以在 PowerShell 中运行：

\`\`\`powershell
& 'D:\\ai\\dy\\mitochondria\\nellie\\.venv\\Scripts\\python.exe' 'D:\\ai\\dy\\mitochondria\\nellie\\启动Nellie.py'
\`\`\`

面板依次有 \`Home\`、\`File validation\`、\`Process\`、\`Visualize\`、\`Analyze\`、\`Settings\`。英文README使用的“File select”“Visualization”是旧称，以实际按钮为准。

先进入 \`File validation\`，点击 \`Select File\`，选择：

\`\`\`text
D:\\ai\\dy\\mitochondria\\experiments\\nellie\\private_first20\\C1-sample_0_first20.ome.tif
\`\`\`

这是原始数据前20帧的OME-TIFF副本，像素值与原图对应帧完全一致，没有先做去噪或增亮。使用它可以让输出留在实验目录，也能缩短调参时间。



### 核对个人数据的维度与标定






你的原图是 \`D:\\ai\\dy\\DATASET\\mito\\C1-sample_0.tif\`，不是官方酵母三维示例。

| 项目 | 本机读取结果 | 在界面中核对什么 |
|---|---|---|
| 轴顺序 | TYX | T是时间，Y/X是图像高/宽；不要填TZYX |
| 原图形状 | 118 × 1053 × 1043 | 118帧，每帧1053×1043像素 |
| 试跑形状 | 20 × 1053 × 1043 | 本次只使用前20帧 |
| X/Y像素尺寸 | 0.1242961266 μm/像素 | \`X & Y resolution (µm)\` |
| 帧间隔 | 6.4215660095 秒 | \`T resolution (s)\` |
| Z | 不存在 | 不要把时间帧当作Z层；也不要编造Z间距 |
| 通道 | 单通道 | 有通道选项时使用0 |
| 试跑起止帧 | 0到19 | 索引从0开始，结束帧包含在内，共20帧 |

读取后若参数已自动填好，核对后点击 \`Confirm metadata\`，再点击 \`Preview image\`，确认播放滑块改变的是时间。不要将6.421566秒填成毫秒，也不要将像素尺寸的倒数8.045303误填为μm/像素。

以上数值来自文件元数据。文件没有Z轴只能说明当前保存的是二维时间序列，不能据此判断采集时是单层，还是由Z-stack投影而来。



### 本次起始设置：先保留一份普通模式基线






进入 \`Settings\`，保留中间图像，不勾选 \`Remove intermediate files\`，否则后面无法查看预处理、分割等结果。

在高级设置中，先使用以下基线。不同阶段的参数分组独立；不要只改预处理，却忘记后面的阶段仍有自己的设置。

| 设置 | 基线 | 作用 |
|---|---|---|
| Device | GPU | 当前实验启动脚本为各阶段指定gpu；GPU运行依赖已配置 |
| Low memory | 关闭 | 本次验证的是普通模式；与此前低内存模式区分 |
| Filter min radius | 0.25 μm | 控制增强的最小结构尺度，不是线粒体长度下限 |
| Filter max radius | 1.0 μm | 控制增强的较大结构尺度 |
| Remove image edges | 关闭 | 避免先丢掉边缘结构 |
| Label threshold | 不启用手动覆盖 | 先使用每帧自动阈值；不是手动填0 |
| Use Otsu threshold | 关闭 | 该开关会额外按原始亮度筛选，可能丢掉暗结构 |
| Label min radius | 0.25 μm | 二维小连通区域筛除；本图对应小于13像素的初始区域被删除 |
| Tracking max distance | 1.0 μm | 特征点匹配的搜索距离参数，本图约8像素；不是测得的运动速度 |
| Tracking mode | auto | 由实现选择匹配计算方式 |
| Auto-run voxel reassignment | 开启 | 完整流程包含标签重分配，但不保证身份正确 |

\`alpha_sq=0.5\`、\`beta_sq=0.5\`先保持默认，其中alpha项不参与当前二维增强公式。\`Frob threshold\`先不手动覆盖，分割直方图bins保持256。不要一开始同时改变这些内部参数。

这套设置是可运行的基线，不是已经证明最适合本数据的最优参数。



### 按顺序处理，并在每一步查看结果






在 \`File validation\` 确认数据后点击 \`Process image(s)\`，进入 \`Process\`。排查自己的数据时优先使用分步按钮：

1. \`Run preprocessing\`：生成结构增强图。到 \`Visualize\` 点击 \`Open raw image\` 和 \`Open preprocessed image\`，切换查看同一时间、同一位置。增强图不是“还原真相”的图，弱信号也可能被筛掉
2. \`Run segmentation\`：生成细胞器标签，并做网络／骨架分析。点击 \`Open segmentation images\`，先核对细胞器掩膜，再看分支。不同颜色首先表示本帧的连通区域，不表示已识别出真实且独立的每条线粒体
3. \`Run mocap marking\`：在结构内找用于匹配的特征点，点击 \`Open mocap marker image\` 查看。点数不是线粒体数量
4. \`Run tracking\`：跨帧匹配特征点并生成运动向量，后续通过插值估计其他像素的运动
5. \`Run voxel reassignment\`：用估计运动传播像素标签，点击 \`Open reassigned labels image\` 查看；它不是边界修复工具，也不能保证融合、分裂、遮挡后ID一定正确
6. \`Run feature export\`：导出体素、节点、分支、细胞器和整图层级的CSV。运行结束后使用 \`Analyze\` 查看特征分布或导出选定数据

单独按钮只有在前序结果齐备时才能使用。\`Run Nellie\`可以连续运行全部步骤；本数据仍建议先看增强和分割，再决定是否继续跟踪。



### 怎么叠加和逐帧核对






Napari左侧图层列表中的眼睛图标控制显示。先保持 \`Raw\` 可见；选择标签图层，将不透明度降低，或使用轮廓显示，再让标签覆盖在原图上。显示对比度滑块只影响观看，不会重新计算分割；不要把拉亮后看到的结构直接当作算法已经识别出来。

要看某个标签的轨迹，先选择对应分割图层，用吸管选中标签，再点击 \`Visualize selected label's tracks\`。\`Visualize all frame labels' tracks\`会显示大量估计轨迹，重叠时先不要全开。

至少检查第1、11、20帧，并连续播放中间帧：暗结构是否漏掉、背景是否被选中、原本分开的结构是否被连起来、标签是否仅因亮度变化而断开。对交叉和重叠处，记录“身份不确定”；一张二维图里看不清的上下关系不会因为出现一条轨迹就变成已知。

原先的ChimeraX查看器仍指向旧低内存试跑文件。本次普通模式结果位于新实验目录，不要把旧查看器中的图误当成这次输出。



### 参数怎么适配弱荧光、粗细不均与重叠






先复制试跑文件到新的实验子目录，再修改一个参数重跑。相同输入、相同输出目录重新处理会覆盖相应中间文件；仅改显示亮度不需要重跑。

| 观察到的问题 | 先检查什么 | 下一步可尝试什么 |
|---|---|---|
| 原图能看见，增强图几乎没有 | 尺度设置是否漏掉细结构，信号是否已接近背景 | 试将Filter min radius从0.25改为0.15 μm，max先保留1.0；再核对同一位置是否同时增强了背景 |
| 增强图有，标签图没有 | 自动阈值和小区域筛除 | 在新目录对比Label min radius 0.25与0.15 μm；必要时再试手动降低增强图阈值，不直接套用原图的0–4095亮度 |
| 出现很多背景小点 | 原图是否真的有对应结构，是否降低了阈值或min radius | 恢复较保守的min radius或阈值，比较漏检与误检，而不是只追求检测更多 |
| 两条相邻结构被标成一个区域 | 原图和增强图之间是否本来就连通 | 用轮廓核对连接处；阈值提高可能切开连接，也可能切断真的细线，不能据此判定真实融合 |
| 一条细长结构断成几段 | 增强响应是否在暗段消失 | 先处理前两行的漏检问题；单纯扩大跟踪搜索距离不会修复分割 |
| 轨迹突然跳到旁边结构 | 相邻帧是否亮度变化、分割断裂或重叠 | 先核对分割，再尝试调整Tracking max distance；加大距离也会增加错配，不盲目设很大 |

表中的0.15 μm等调整属于待试建议，不是本次已完成的参数优化。提高显示亮度、去噪、局部对比度增强和实际阈值分割是不同操作；暂不额外串接强去噪，避免改变结构后无法判断是哪一步造成结果变化。



### 输出在哪里，怎么再次查看






本次个人试跑目录：

\`\`\`text
D:\\ai\\dy\\mitochondria\\experiments\\nellie\\private_first20\\
  C1-sample_0_first20.ome.tif
  nellie_output\\
    nellie_necessities\\
    ...各层级CSV...
\`\`\`

\`im_preprocessed.ome.tif\`结尾的是增强图，\`im_instance_label.ome.tif\`是本帧细胞器标签，\`im_skel\`／\`im_skel_relabelled\`是骨架和分支，\`im_marker\`是特征点，\`flow_vector_array.npy\`是匹配向量，\`im_obj_label_reassigned\`／\`im_branch_label_reassigned\`是传播后的标签。文件名前面还带有标定、通道和帧范围，不要把这些前缀删掉。

在GUI中重新选择同一份实验输入，核对相同通道和帧范围并确认元数据，Nellie会检测已存在的处理结果，再从 \`Visualize\` 打开。输入、输出和前缀对应关系必须保留；只移动输入或只移动输出可能导致无法找到旧结果。

\`Analyze\`用于查看或导出特征，并不等于确认跟踪正确。不要把同帧标签编号、重分配标签或运动向量直接作为人工真值。



### 扩展到原图全部118帧






先完成20帧核对。要处理全部118帧，先在实验目录建立完整数据副本，再让GUI选择该副本，起止帧填0和117。不要在原始数据目录直接输出实验。

\`\`\`powershell
New-Item -ItemType Directory -Force 'D:\\ai\\dy\\mitochondria\\experiments\\nellie\\private_full'
Copy-Item -LiteralPath 'D:\\ai\\dy\\DATASET\\mito\\C1-sample_0.tif' -Destination 'D:\\ai\\dy\\mitochondria\\experiments\\nellie\\private_full\\C1-sample_0.tif'
\`\`\`

这两行是准备完整实验副本的方法，本次没有自动处理全部118帧。原始ImageJ-TIFF的元数据已经能被本机Nellie读取，不必为了运行而重采样或先转换成三维。



### 文档入口与已验证范围






- 主项目中文说明：\`D:\\ai\\dy\\mitochondria\\nellie\\README_CN.md\`
- API中文入口：\`D:\\ai\\dy\\mitochondria\\nellie\\docs\\api\\index_cn.md\`
- 官方三维示例的前3帧完整流程已验证；你的前20帧普通模式流程已验证；随后旧CPU结果及临时报告已清理，当前个人实验目录已有输入和nellie_output；流程能运行不代表跟踪准确
- 此前低内存试跑仍在 \`D:\\ai\\dy\\gpt\\mito-tracking-assessment\`，本次没有覆盖
- 全部118帧尚未处理；普通模式是否比旧低内存模式更准确，尚无人工标注依据，不能用连通区域数量替代准确率




### GPU使用更新（2026-10-30）



GPU环境已完成实际验证：RTX 5060、CuPy 14.2.0、CUDA 13.2运行组件。关闭旧窗口后，重新双击项目内“启动Nellie.py”。Settings中的Device可以用auto，已验证会选择cuda；需要强制GPU时，在相应阶段选择gpu。Low memory不因使用GPU而自动开启。

当前参数表已更新为GPU设置。启动器只在本进程指向项目内运行组件，不需要改系统CUDA_PATH，也不依赖旧CUDA10.0。官方三维示例前3帧完整流程已用GPU跑通；个人前20帧已有结果；不能仅凭文件存在就断定每个阶段都在GPU上运行。GPU并不保证全部阶段提速，首次编译和小样本的数据传输可能更慢。图形界面7个结果图层加载亦已复核。




### 当前实验目录



个人实验位于 \`experiments/nellie/private_first20\`，当前包含20帧输入图像和 \`nellie_output\`。GPU编译缓存在项目 \`.venv/.cupy-cache\`，版本清单位于 \`requirements-local.txt\`，兼容补丁位于 \`patches\`。查看现有结果按本文顶部的 \`--keep-output\` 命令启动；不要为了查看而重新运行处理。



## Settings配置说明






按界面保留各步骤的配置，只略去当前二维不生效的Alpha sq和Chunk Z。每项简要解释；**实际参数不改。**

- **Override**：勾选后才使用旁边的手填值；不勾就由程序决定
- **各阶段Device＝gpu，Low memory不勾**：请求显卡、使用普通模式；低内存模式的处理细节可能不同
- **各阶段Limit timepoints (num_t)不勾Override**：处理选定的全部20帧；启用后才按手填帧数限制
- **um/μm是微米**：本图约8个像素等于1 μm



### Basic：保留结果、选择统计与显示方式






| 配置 | 当前值 | 含义 |
|---|---|---|
| Remove intermediate files | 不勾 | 保留增强、分割等图像，方便检查。 |
| Remove image edges | 不勾 | 保留图像边缘。 |
| Analyze node level | 勾选 | 给骨架上的局部节点计算特征。骨架是结构内部的中心细线。 |
| Auto-run voxel reassignment | 勾选 | 跟踪后继续传递像素标签。 |
| Visualize all frames’ voxel tracks | 勾选 | 显示整个时间段的轨迹。 |
| Subsample voxel tracks；N | 勾选；5 | 每隔5个像素取一条轨迹显示，避免画面挤满；跟踪计算不变。 |

注意：本实验脚本**正常启动会清空旧输出**，与 Remove intermediate files 不同；加 \`--keep-output\` 才保留结果。



### Preprocessing：先突出图里的结构






程序在不同粗细尺度下找线状等结构，生成增强图，供下一步分割使用。

| 配置 | 当前值 | 含义 |
|---|---|---|
| Min radius (um) | 0.25 | 从较细的尺度开始检查。 |
| Max radius (um) | 1.0 | 检查到较粗的尺度。 |
| Beta sq | 0.5 | 控制增强时对细长结构与较圆结构的偏好，不是亮度阈值。 |
| Frobenius threshold | Override不勾 | 筛掉缺少明显结构变化的位置；当前让程序自动计算这道分界值。 |
| Frobenius thresh division | 2 | 将上面的分界值除以2；在同一阈值下，除数越大，筛选越宽松。 |
| Max chunk voxels | 1,000,000 | 涉及分块时的块规模参数，控制一次计算的数据量，不是目标大小阈值。 |
| Max threshold samples | 1,000,000 | 自动计算分界值时的采样规模；不改变输出图的大小。 |

这里的radius是半径尺度参数，程序还会换算成滤波尺度。**不是线粒体长度限制，也不是超出范围就直接删除。**



### Segmentation → Label：把结构圈成区域






程序从增强图里选出前景，把连在一起的位置圈成一个区域并编号。

| 配置 | 当前值 | 含义 |
|---|---|---|
| Threshold | Override不勾 | 自动确定增强图的圈选分界线；手动降低选入更多位置，提高则更严格。 |
| Use Otsu threshold | 不勾 | 不额外按原图亮度再筛一次。 |
| Min radius (um) | 0.25 | 换算成最小初始区域面积；本图剔除小于13像素的初始区域。调小也可能保留噪点。 |
| Flush interval | 1 | 每处理1帧刷新输出缓存；控制写出节奏。 |
| Threshold sampling pixels | 1,000,000 | 自动分割阈值统计的采样规模，不是只分割这些像素。 |
| Histogram bins | 256 | 将响应分数分成256组，帮助计算自动阈值；不改变原图位深。 |
| Max chunk voxels | 1,000,000 | 分块计算的规模参数，主要控制内存占用。 |



### Segmentation → Network：把区域缩成骨架






在已经圈出的区域内找中心细线，再划分分支和连接处。二维图里两条结构粘在一起，骨架也可能连在一起；不等于真实发生了融合。

| 配置 | 当前值 | 含义 |
|---|---|---|
| Min radius (um) | 0.2 | 骨架分析使用的最小物理尺度参数，不同于Label的小区域筛除。 |
| Max radius (um) | 1.0 | 骨架分析使用的最大物理尺度参数。 |
| Max chunk voxels | 1,000,000 | 分块计算的规模参数，不限制分支总数。 |



### Mocap：找前后帧匹配用的特征点






特征点是结构中便于匹配的局部位置。一条线粒体可以有多个点，点数不等于线粒体数量。

| 配置 | 当前值 | 含义 |
|---|---|---|
| Use image | distance | 根据结构内部各位置离边界的距离来找特征点；frangi则使用增强图。 |
| Peak min distance | 2像素 | 用5×5窗口比较候选点的原图亮度，剔除较暗的近邻；并列最亮可以保留 |
| Min radius (um) | 0.2 | 特征点检测使用的最小结构尺度。 |
| Max radius (um) | 1.0 | 特征点检测使用的最大结构尺度。 |
| Num sigma | 5 | 参与确定多尺度滤波的步长；实际尺度数由半径范围和最小步长共同决定，不保证恰好5个 |
| Prefer GPU | 勾选 | 本步骤优先尝试GPU，与Device配合使用。 |
| Max chunk voxels | 1,000,000 | 分块计算的规模参数，不限制整张图的特征点数量。 |



### Tracking：在后一帧寻找对应点






程序结合位置、局部亮度和形状，将前后两帧的特征点匹配起来，估计它们移动了多少。

| 配置 | 当前值 | 含义 |
|---|---|---|
| Max distance (um) | 1.0 μm | 相邻帧匹配的搜索距离参数，本图约8个像素。调大可能找到位移更大的点，也更容易错配到旁边结构。 |
| Mode | auto | 自动选择dense或sparse：分别偏向密集点对计算或减少候选点对。 |
| Max dense pairs | 10,000,000 | dense候选点对的规模门槛，参与计算方式选择及内存控制。 |
| Max dense ROI voxels (CPU) | 50,000,000 | CPU下dense局部图像区域的规模门槛；ROI就是局部分析区域。 |
| Max dense ROI voxels (GPU) | 20,000,000 | GPU下dense局部区域的规模门槛，用于控制显存压力。 |

先检查分割。分割已经断裂或粘连时，单纯扩大搜索距离不能修复它。



### Reassignment：把编号传到后一帧






利用估计的移动关系，尝试把前一帧的区域编号传给后一帧的对应像素。匹配错了，编号也可能传错。

| 配置 | 当前值 | 含义 |
|---|---|---|
| Store running matches | 勾选 | 保存逐帧像素对应记录，供后续分析使用。 |
| Max refine iterations | 3 | 传播标签时最多进行3轮细化，不是只处理3帧。 |
| Max query points | 1,000,000 | 查找对应点时，每个查询分块的点数规模参数。 |
| Max bruteforce pairs | 10,000,000 | GPU直接比较距离时的点对规模限制，控制显存占用。 |



### Feature export：计算数值并导出表格






根据前面的区域、骨架和运动估计计算特征，保存为CSV。分割或跟踪错误也会影响这些数值。

| 配置 | 当前值 | 含义 |
|---|---|---|
| Skip node-level features | Override不勾 | 由Basic的节点统计开关决定；当前会计算节点特征。 |
| Enable motility | 勾选 | 计算速度等运动特征。 |
| Enable adjacency | 勾选 | 记录结构各部分的邻接关系。 |
| Use GPU | 勾选 | 尝试GPU特征计算；Device明确选cpu/gpu时优先按Device决定。 |
| Node chunk size | Override不勾 | 给像素分配骨架节点时的目标分块大小；当前不手动覆盖。 |
| Max node mask elems | 50,000,000 | 节点与像素对应的中间表规模上限依据，用来控制内存。 |



### 当前操作顺序






实验脚本已经填好上述值。先运行**预处理 → 分割**，叠加原图查看暗结构有没有漏掉、相邻结构有没有错连，再继续跟踪。二维重叠处无法看清的身份，仍需标为不确定。
`;export{n as default};
