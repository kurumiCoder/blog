const n=`# MitoTNT

## 5. 过滤与箭头修正



全局最优分配可能产生 \`misassignments\`，通过一些物理约束识别并修正：

1. **位移约束**：同一 \`segment\` 中单个箭头位移 < 3 × 该片段最大协同追踪箭头集合的平均位移，去除过长箭头

2. **方向约束**：
- 计算 \`segment average tracking vector\`
   
- 偏离角度 < 30° 的箭头为 \`reference vectors\`
   
- 其余节点按参考向量预测位置重新寻找最近 2 个节点并重新分配
   
- 基于 \`concerted motion\` 观察，有效纠正 \`crossing arrows\`

<img src="260930.assets/image-20260928100229714.png" alt="image-20260928100229714" style="zoom:67%;" />

<img src="260930.assets/image-20260928100259915.png" alt="image-20260928100259915" style="zoom:67%;" />



## 6. 轨迹更新

延续/终止已有轨迹, 为新节点开启轨迹;

每条轨迹 = 7 个等长列表，逐帧记录：

- 帧号
- 节点号
- 段 id
- 连通体 id
- 坐标
- 灰度
- 宽度



对每个帧对，分两种情况：

- **首帧对（frame == start_frame，:747）**：直接给每条 linked 建一条新轨迹，每条正好 2 帧。
- **之后的帧对（:763）**：遍历所有"进行中"的轨迹，看它的末点。
  - **末点在 terminated 里** → 轨迹到此结束，归档（:766-768）。
  - **否则** → 从 linked 的映射里查到它会连到哪个 n 点，把这个点的 7 个字段各追加到轨迹尾部（:770-781）。
- **再处理新生**：每个 initiated 点开一条只有 1 帧的新轨迹（:788-797）





## 7. 轨迹收尾与间隙闭合 (gap closing)

**背景：**逐帧匹配是“一对一”的，只要某一帧没接上，轨迹就断成两条。

**触发时间**：处理完所有帧的帧间对，offline

**资格筛选**：只有长度超过 \`min_track_size = 4 \` 的轨迹才进行 \`gap closing\`

- lap-cost：
  - 端点距离 ≤ \`(gap+1)×(3σ)²\`（:1290）
  - 拓扑代价达标

![image-20260928101038633](260930.assets/image-20260928101038633.png)

**流程：**

**1. 先算每条轨迹的逐帧位移**（:842-846）——供后面的距离阈值使用。

**2. 找候选对**（\`_compute_gap_cost_entries\`，:1105）：

- 源轨迹（时间在前）只能连“起始帧 = 源结束帧 + (gap+1)×Δ”的目标，gap = 1~3
- 用 KD-tree 在半径 \`3×最大位移×√(max_gap+1)\` 内快速找附近目标
- 两个硬判据：端点距离 ≤ \`(gap+1)×(3σ)²\`（:1290），拓扑代价达标
- 输出 entries = [(源, 目标, 代价), ...]，可分块并行算

**3. 用稀疏 LAP 做一对一配对**（\`_solve_gap_lap_sparse\`，:1419）：

- 每个源最多配一个目标、每个目标最多被一个源配
- 配不上就不连，不会被硬凑

**4. 沿配对指针串成链并合并**（:893-933）：

- A→B、B→C 可以接力，一条链上所有轨迹的 7 个字段列表首尾拼起来
- 拼出来的帧号列表会“跳过”缺失帧，比如 0,1,2,3,4,5,7,8,9

**5. 排序**（:941-946）：先按长度降序、再按起始帧升序；最后打印闭合前后轨迹数和平均长度（:953-956）。



## 分析重塑事件

追踪完成后，MitoTNT 可以量化关键的线粒体行为

每项分析都会写入一个 CSV 文件：

* \`remodeling_events.csv\` → 检测到的融合/分裂事件列表。
* \`node_diffusivity.csv\`、\`segment_diffusivity.csv\`、\`fragment_diffusivity.csv\` → 定量运动性指标。

这些文件可以被导入，用于下游分析和绘图。

\`\`\`css
第一层：for 每个分析帧（每隔 tracking_interval 取一帧）
    把这一帧的线粒体网络切成一"坨"一"坨"（fragment = 图上互相连通的一大块）
    第二层：for 每一坨
        只收集这一坨上"被追踪到"的节点
        按真实相邻关系，把相邻节点两两连成"边"
        第三层：for 每一对相邻节点 (A, B)
            向前看 half_win_size 个被追踪帧，记下每帧 A、B 各属于哪一坨
            向后看 half_win_size 个被追踪帧，同样记下
            算两个得分：过去"分开的帧占比" + 未来"分开的帧占比"
            未来=1 且 过去=0 → 这条边标记为"分裂边"
            未来=0 且 过去=1 → 这条边标记为"融合边"
        把靠得近（图上 5 步以内）的事件边合并成一次事件
\`\`\`

**容易误解的 4 点**

- 分数必须恰好 0/1，中间值一律不算
- \`min_tracked_frames=2\` 数的是“两侧都有记录的帧数”，不要求连续
- 只在能放下完整窗口的帧上检测，数据集首尾各 4Δ 帧是盲区







# 2D尝试

- 2D 工具：只能处理平面图像
  
  - \`MyToe\` 
  - \`MitoSPT\` 
  
    [未命名会话 - Kimi](https://www.kimi.com/chat/1a0ec9c1-4772-81ad-8000-098fdfa00843?chat_enter_method=home)
  
    - 根据 MitoSPT 的发布协议，预处理流程如下：
    
      1. **卷积**：对时间序列图像应用 **5×5 边缘检测**（edge-detection）卷积核。
      2. **傅里叶变换**：将图像从空间域转换到**频域**（Fast Fourier Transform, FFT）。
      3. **带通滤波**：应用一个**带通滤波器**，通常保留 **2 像素（约 0.3 μm）到 100 像素（约 16 μm）** 的频率范围，以滤除高频噪声和低频背景。
      4. **手动阈值化**：将滤波后的图像进行**手动阈值化**，以消除残留的噪声，最终生成一系列**二值化图像序列**。软件也支持 Otsu 等自动阈值方法。
    
      ![Figure 1](260930.assets/nihms664825f1.jpg)
    
      **注意**：预处理的每一步参数（如滤波范围）可能需要根据你的具体成像条件进行微调，以达到最佳的线粒体分割效果
  - \`QuoVadoPro\` 
- 3D：
  - **MitoGraph**：能做3D分割，但无时间维度
- 4D
  - 软件包 \`TrackMate\` [20] 和 \`Mitometer\` [21] 可以通过执行 \`质心追踪\` 来处理 \`四维延时荧光显微镜数据\`。然而，将每个 \`线粒体片段\` 抽象为单个对象，对 \`分割网络结构\` 和探究 \`亚片段水平信息\` 存在固有局限性。



## 做法

它做的事：把“一个多页 TIFF”拆成 MitoTNT 要的输入布局
C1-sample_6.tif (一个文件装 72 帧, TYX uint16)
        │
        ├─ 解析 ImageJ 元数据 → 帧数 / 帧间隔 / 分辨率
        ├─ 逐页读取，可裁剪 ROI
        └─ 写出 → out/frame_000/frame_000.tif
                  out/frame_001/frame_001.tif
                  ...            （每个文件夹一帧，MitoGraph 的约定）

MitoTNT需要3D数据，这里每个tif中是2D的时序数据

1. 解析元数据，帧数 / 帧间隔 / 分辨率
2. 逐帧提取，导出为MitoGraph所需要的目录约定方式
3. 将z-stack的数量设置成1，也就是直接将2D充当为3D

> 其他尝试

\`光流\`：用光流在相邻帧间补中间帧，使帧间位移减半。

<img src="260930.assets/image-20260928170735623.png" alt="image-20260928170735623" style="zoom: 67%;" />

\`mitosegnet+预训练模型\` 

**整体分隔效果**

<img src="260930.assets/image-20260928192729560.png" alt="image-20260928192729560" style="zoom: 67%;" /> <img src="260930.assets/image-20260928192740858.png" alt="image-20260928192740858" style="zoom: 67%;" />

**局部分隔效果**

<img src="260930.assets/image-20260929144226298.png" alt="image-20260929144226298" style="zoom: 150%;" />![image-20260929144241050](260930.assets/image-20260929144241050.png)



**中心线提取情况**

<a href="E:\\ai\\dy\\mitochondria\\mitoTNT\\exp\\preproc\\roi10\\mitosegnet_min10\\visualization\\visualize_tracking.cxc">mitosegnet_min10的visualize_tracking.cxc</a>



<img src="260930.assets/image-20260929145140907.png" alt="image-20260929145140907" style="zoom:67%;" />

**跟踪情况**

<img src="260930.assets/image-20260928193307737.png" alt="image-20260928193307737" style="zoom: 67%;" />	<img src="260930.assets/image-20260929145709382.png" alt="image-20260929145709382" style="zoom:67%;" />

\`TrackMate\`

能做4D，但把每个片段当成一个质点（质心追踪），丢失内部网络结构

<img src="260930.assets/image-20260928202718634.png" alt="image-20260928202718634" style="zoom:67%;" />





## 论文推荐做法

要实现高质量的 \`MitoGraph\` 分割，需要提供 \`signal to noise ratio（信噪比）\` 高（线粒体与背景之间对比明显）且分辨率足够高（如 \`diffraction limited（衍射极限）\` 或更高）的数据，以便将各个线粒体片段彼此分开。

连续帧之间线粒体定位的高相关性意味着线粒体片段在帧间不能移动太远。通常，这需要以足够高的 \`temporal resolution（时间分辨率）\` 记录线粒体网络的运动和动态。我们发现，以每体积帧约3秒或更快的速度记录网络，可获得良好的追踪效果。



我们建议通过以下方法评估追踪质量：

1. 在原始显微镜数据与分割结果叠加的可视化图像中，目视检查 \`MitoGraph\` 的分割质量。此步骤必须处理分割错误。
2. 使用 \`MitoTNT\` 可视化模块，通过比较相邻帧之间的 \`linking arrows（连接箭头）\`，目视检查 \`MitoTNT\` 的追踪精度。



> 【你的数据现状】E:\\ai\\dy\\DATASET\\mito

- 20 个 ImageJ 堆栈 C1-sample_0…19.tif，全部是 2D 时间序列（axes = TYX），uint16（12-bit，max 4095）

- 像素 0.1243 µm/px（元数据 8.0453 px/µm）

- 帧数与间隔：
  sample_0–5   117~118 帧 @6.42 s
  sample_6–11  71~72 帧  @60 s
  sample_12–19 200 帧    @28/30/55 s

- 视野很大：约 1050×1040 px ≈ 131×129 µm


\`你的 2D 数据满足吗\`

- **信噪比**：基本满足。前景中位 1445 vs 背景 157，CNR≈9；骨架命中率 0.97~0.99，说明主体结构对比度够
- **分辨率**：满足。0.1243 µm/px ≈ 衍射极限（~0.2 µm）的 2 倍采样。但 2D 投影分不开 z 方向重叠的线粒体——这是原理限制，不是像素问题
- **时间分辨率**：不满足。60 s vs 建议 ≤3 s，慢了 20 倍。后果：
  - 事件判定窗口前后各 4 帧 = 4 分钟
  - gap closing 最多补 3 帧 = 3 分钟
  - 轨迹最短存活 4 帧 = 4 分钟；短命事件会被时间平均掉
  - 好在实测帧间位移不大（中位 0.29 µm、p95 0.8 µm），所以匹配还能跑（linked 0.81）






## 效果

\`原图\`

<img src="260930.assets/image-20260928171317886.png" alt="image-20260928171317886" style="zoom: 67%;" />

### MitoGraph 分割输出

整体效果

<img src="260930.assets/image-20260928200817641.png" alt="image-20260928200817641" style="zoom:50%;" />

<a href="E:\\ai\\dy\\mitochondria\\mitoTNT\\exp\\diy_all\\data\\check_mitograph.cxc">check_mitograph.cxc</a>

局部效果

<img src="260930.assets/image-20260928200023955.png" alt="image-20260928200023955" style="zoom:67%;" />



\`骨架线\`

<img src="260930.assets/image-20260927173855098.png" alt="image-20260927173855098" style="zoom: 67%;" />

\`分隔不精准\`

<img src="260930.assets/image-20260927174134186.png" alt="image-20260927174134186" style="zoom: 67%;" /><img src="260930.assets/image-20260927232719443.png" alt="image-20260927232719443" style="zoom:33%;" />

前后两帧的分隔质量不一，容易有碎片发生，进而导致跟踪不行

<img src="260930.assets/image-20260927232356108.png" alt="image-20260927232356108" style="zoom:33%;" /><img src="260930.assets/image-20260927232434865.png" alt="image-20260927232434865" style="zoom:33%;" />

> test_data

原数据为3D数据，其线粒体分隔效果好，精准度高

跟踪效果不容易受碎片影响



### MitoTNT

根据最终产物remodeling_events.csv 融合/裂变事件表，选择的几帧数据

<a href="E:\\ai\\dy\\mitochondria\\mitoTNT\\exp\\diy_all\\visualization\\visualize_tracking.cxc">visualize_tracking.cxc</a>



<img src="260930.assets/image-20260927211708309.png" alt="image-20260927211708309" style="zoom:50%;" />

<img src="260930.assets/image-20260927232545667.png" alt="image-20260927232545667" style="zoom:50%;" />

































`;export{n as default};
