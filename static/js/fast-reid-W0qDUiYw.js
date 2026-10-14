const n=`# Fast-ReID

## 快速开始

使用conda p38的虚拟环境

> 测试环境是否准备好

\`\`\`shell
python -c "import sys,torch; sys.path.append('.'); from fastreid.config import get_cfg; from fastreid.modeling.backbones import build_resnet_backbone; cfg = get_cfg(); cfg.MODEL.BACKBONE.NAME='build_resnet_backbone'; cfg.MODEL.BACKBONE.DEPTH='50x'; cfg.MODEL.BACKBONE.PRETRAIN=True; net=build_resnet_backbone(cfg); y=net(torch.randn(2,3,256,128)); print(f'✅ 前向传播成功, 输出shape: {y.shape}')"
\`\`\`

> 下载模型-MODEL_ZOO.md

<img src="fast-reid.assets/image-20260729182222252.png" alt="image-20260729182222252" style="zoom:67%;" />

\`\`\`shell
① 下载一个预训练模型（选一个就行，文件约 200MB）：
mkdir pretrained

curl -L -o pretrained/market_sbs_S50.pth https://github.com/JDAI-CV/fast-reid/releases/download/v0.1.1/market_sbs_S50.pth

② 准备好数据集（eval 模式需要数据集来跑评估）
把 Market1501 数据集放到 datasets/ 目录下。


③ 执行命令
set PYTHONPATH=E:\\ai\\dy\\tracker\\fast-reid;%PYTHONPATH%


python tools\\train_net.py --config-file configs/Market1501/sbs_S50.yml --eval-only MODEL.WEIGHTS pretrained/market_sbs_S50.pth MODEL.DEVICE "cuda:0"

python tools\\train_net.py --config-file configs/MOT17/sbs_S50.yml --eval-only MODEL.WEIGHTS E:\\ai\\dy\\tracker\\BoT-SORT\\pretrained\\mot17_sbs_S50.pth MODEL.DEVICE "cuda:0"

python tools\\train_net.py --config-file configs/MOT17/sbs_S50.yml --eval-only MODEL.WEIGHTS mot17_sbs_S50.pth MODEL.DEVICE "cuda:0"
\`\`\`



## 论文



### 0. 摘要

> 翻译

通用实例重识别是计算机视觉中一项非常重要的任务，

可广泛应用于

- 行人/车辆重识别
- 人脸识别
- 野生动物保护
- 商品溯源
- 抓拍等多种实际场景。

我们已实现了行人重识别、局部重识别、跨域重识别和车辆重识别等前沿项目，并计划在多个基准数据集上发布预训练模型。



> **要点总结：**

| 维度         | 内容                                   |
| ------------ | -------------------------------------- |
| **是什么**   | 一个通用实例重识别（ReID）开源工具箱   |
| **谁做的**   | 京东AI研究院（JDAI-CV）                |
| **核心优势** | 模块化、可扩展、易部署、支持单/多GPU   |
| **支持任务** | 行人ReID、局部ReID、跨域ReID、车辆ReID |
| **开源地址** | https://github.com/JDAI-CV/fast-reid   |

### 1. 引言

> 作用

**通用实例重识别（re-id）**是一种以实例为中心的人工智能技术，旨在从大量视频中找到特定的人/车辆/人脸/感兴趣物体。它有助于实现多种需要耗费大量人力、枯燥乏味的视频观看类应用，

例如：从电视剧中寻找与某位演员相关的镜头、从商场监控视频中寻找走失儿童、从城市监控系统中锁定嫌疑车辆等。

此外，通用实例重识别技术还被用于电商平台的抓拍、商品安全溯源以及野生动物保护等领域。

> **要点总结：**

| 维度           | 内容                                                         |
| -------------- | ------------------------------------------------------------ |
| **问题背景**   | 现有开源代码可扩展性差、难复现；学术研究与工业落地之间存在鸿沟 |
| **解决方案**   | 推出 FastReID：统一、模块化、可扩展的实例重识别库            |
| **核心设计**   | 即插即用的模块设计；可管理的系统配置；无需反复重写代码       |
| **已支持任务** | 行人ReID、跨域行人ReID、局部行人ReID、车辆ReID               |
| **未来计划**   | 发布人脸识别、物体检索模型                                   |
| **额外价值**   | 为不同方法提供公平对比基准                                   |



### 2. FastReID 的亮点

\`FastReID 的六大核心优势：\`

- **一站式工具链**：

  覆盖训练、评估、微调、部署全流程，且自带 SOTA 基线。

- **即插即用的模块化架构**：

  用户可将自定义模块插入系统任意环节，无需重写大量代码，大幅降低研究门槛。

- **YAML 驱动的配置管理**：

  模型定义、训练、测试流程全部通过 YAML 配置，支持灵活更换 backbone、head、损失函数和训练策略，且原生支持多 GPU 训练。

- **更贴近工业落地的评估体系**：

  除传统 CMC 外，额外提供 ROC、mINP 等指标，更全面地衡量模型在实际部署中的性能。

- **工程化部署** ：

  内置知识蒸馏模块压缩模型，并提供 PyTorch→Caffe / TensorRT 转换工具，解决深度模型在边缘设备上的部署难题。

- **开箱即用的 SOTA 预训练模型**：

  已覆盖行人、局部、跨域、车辆 ReID，未来还将扩展到人脸识别和通用物体检索。



### 3. FastReID 的架构

在本节中，我们详细阐述 FastReID 的流水线，如图 1 所示。整个流水线由四个模块组成：图像预处理、骨干网络、特征聚合和头部网络，我们将逐一详细介绍。

![image-20260731162417363](fast-reid.assets/image-20260731162417363.png)

FastReID 的流水线分为**训练**和**推理**两大阶段，\`训练核心\`由四个模块串联而成（见图 1）：

**1. 图像预处理**

- \`背景：\`采集到的图像尺寸各异，我们首先将图像缩放到固定尺寸。图像可以被打包成批次，然后输入网络。
- \`数据增强：\`
  - ==翻转、随机擦除、Random patch、Cutout==
    - 它们随机选择图像中的一个矩形区域，并分别用随机值、另一张图像块和零值来擦除该区域的像素

  - ==Auto-augment==
    - 使用自动搜索算法来寻找多种图像处理函数（如平移、旋转和剪切）的融合策略

- \`目的：\`增加多样性、降低过拟合、提升对遮挡的鲁棒性

**2. 骨干网络**

- \`概念：\`骨干网络是将图像推理为特征图的网络，例如去掉最后一个平均池化层的 ResNet
- \`可选架构：\`ResNet、ResNeXt、ResNeSt
- \`增强模块：\`
  - 类注意力非局部（attention-like non-local）模块
  - 实例批归一化（instance batch normalization, IBN）模块 

- \`作用：\`提取图像特征图

**3. 特征聚合（Aggregation）**
- \`输入输出：\`池化层以 $\\mathbf{X} \\in \\mathbb{R}^{W \\times H \\times C}$ 为输入，输出一个向量 $\\mathbf{f} \\in \\mathbb{R}^{1 \\times 1 \\times C}$
- \`方法：\` 全局向量 $\\mathbf{f} = [f_1, ..., f_c, ..., f_C]$ 分别由下式给出
  - ![image-20260731164759216](fast-reid.assets/image-20260731164759216.png)

  - **最大池化：**
    - 取每个通道所有空间位置的最大值
    - 保留最强响应，计算简单，但会丢失空间分布信息

  - **平均池化：**
    - 取每个通道所有空间位置的平均值
    - 保留整体信息，对显著区域不敏感。

  - **GeM 池化：**
    - 广义均值池化，$\\alpha$ 为控制系数。
    - 通过超参 $\\alpha$ 在 Max 和 Avg 之间平滑插值——$\\alpha \\to \\infty$ 时退化为 Max，$\\alpha = 1$ 时退化为 Avg，兼顾两者优势。

  - **注意力池化：**
    - 其中 $\\mathbf{W}_c$ 为 softmax 注意力权重，对空间位置进行加权聚合。
    - 引入可学习的 softmax 空间注意力权重，对重要区域加权，灵活性最强，通常性能也最好。

- \`选择：\`实际使用时可根据任务特点选择或组合，GeM 和 Attention Pooling 在 ReID 任务中往往优于传统 Max/Avg。
- \`作用：\`将特征图压缩为紧凑的特征向量

**4. 头部网络（Head）**

- \`目的：\`负责处理聚合模块生成的全局向量
- \`方法：\`批归一化（BN）head、Linear head 和 Reduction head 三种类型

  <img src="fast-reid.assets/image-20260731165451281.png" alt="image-20260731165451281" style="zoom:67%;" />

  - **Linear head** 仅包含一个决策层
  - **BN head** 包含一个 BN 层和一个决策层

    - $$
      \\begin{cases}
      \\mu = \\dfrac{1}{m} \\displaystyle\\sum_{i=1}^{m} \\mathbf{f}_i, \\\\[12pt]
      \\sigma^2 = \\dfrac{1}{m} \\displaystyle\\sum_{i=1}^{m} (\\mathbf{f}_i - \\mu)^2, \\\\[12pt]
      \\mathbf{f}_{bn} = \\gamma \\cdot \\dfrac{\\mathbf{f} - \\mu}{\\sqrt{\\sigma^2 + \\epsilon}} + \\beta
      \\end{cases} \\tag{5}
      $$

    - 其中 $\\gamma$ 和 $\\beta$ 为可学习的缩放与偏移参数

    - $\\epsilon$ 是加到 mini-batch 方差上的常数，用于保证数值稳定性
  - **Reduction head** 则包含 Conv+BN+ReLU+Dropout 操作、一个 Reduction 层和一个决策层
  - **Reduction 层** 旨在将高维特征降维为低维特征，例如 $2048\\text{-dim} \\to 512\\text{-dim}$
  - **Decision 层** 输出不同类别的概率，以区分不同类别，用于后续的模型训练
- \`作用：\`输出最终特征，供损失计算和距离度量使用



**训练侧额外组件：**

- 训练策略：学习率 warm-up、Backbone freeze 等
- 损失函数：Cross-entropy、Triplet loss、ArcFace loss、Circle loss

**推理侧额外组件：**
- 距离度量：欧氏距离、余弦距离、DSR
- 后处理：K-reciprocal、Query Expansion
- 评估指标：CMC、ROC、mINP，支持可视化





### 4. 训练

#### 4.1. 损失函数

FastReID 实现了四种不同的损失函数。

> **交叉熵损失（Cross-entropy loss）**

通常用于多分类任务，定义为：
$$
\\mathcal{L}_{ce} = \\sum_{i=1}^{C} y_i \\log \\hat{y}_i + (1 - y_i) \\log(1 - \\hat{y}_i) \\tag{6}
$$

其中

$$
\\hat{y}_i = \\frac{e^{\\mathbf{W}_i^T \\mathbf{f}}}{\\sum_{i=1}^{C} e^{\\mathbf{W}_i^T \\mathbf{f}}}
$$

交叉熵损失使预测的 logit 值逼近真实值。它鼓励最大 logit 与其他 logit 之间的差距变大，而这种特性结合有界梯度，会降低模型的适应能力，导致模型对其预测过于自信，进而可能引发过拟合。

为了构建泛化能力更强的鲁棒模型，Google Brain 提出了 **Label Smoothing** 来缓解该问题。

它鼓励倒数第二层的激活值接近正确类别的模板，并与所有错误类别的模板保持等距。因此，交叉熵损失中的真实标签 $\\mathbf{y}$ 可重新定义为：
$$
y_i(j = c) = 1 - \\delta, \\quad y_i(j \\neq c) = \\frac{\\delta}{C - 1}
$$

> **ArcFace loss** [9] 

将笛卡尔坐标映射到球面坐标。它将 logit 转换为：
$$
\\mathbf{W}_i^T \\mathbf{f} = \\|\\mathbf{W}_i\\| \\|\\mathbf{f}\\| \\cos\\theta_i
$$

其中 $\\theta_i$ 是权重 $\\mathbf{W}_i$ 与特征 $\\mathbf{f}$ 之间的夹角。它通过 $l_2$ 归一化将权重模长 $\\|\\mathbf{W}_i\\|$ 固定为 1，同时对嵌入特征 $\\mathbf{f}$ 做 $l_2$ 归一化并重新缩放到 $s$，于是：

$$
\\hat{y}_i = \\frac{e^{s \\cos\\theta_i}}{\\sum_{i=1}^{C} e^{s \\cos\\theta_i}}
$$

为了同时增强类内紧凑性和类间差异性，ArcFace 在类内度量中引入了加性角度间隔惩罚 $m$，于是 $\\hat{y}_i$ 可重写为：

$$
\\hat{y}_i = \\frac{e^{s \\cos(\\theta_i + m)}}{e^{s \\cos(\\theta_i + m)} + \\sum_{i=1,\\, i \\neq c}^{C-1} e^{s \\cos\\theta_i}}
$$

> **Circle loss** 

推导过程在此不详细描述，可参考文献 [10]。

> **Triplet loss** 

确保特定人物的图像在嵌入空间中，比任何其他人物的图像更接近同一人物的所有其他图像。即希望锚点图像 $x_i^a$ 到正样本 $x_i^p$ 的距离小于到负样本 $x_i^n$ 的距离：
$$
D(x_i^a, x_i^p) + m < D(x_i^a, x_i^n)
$$

其中 $D(\\cdot, \\cdot)$ 为距离度量，$m$ 为强制间隔。包含 $N$ 个样本的 Triplet Loss 定义为：

$$
\\sum_{i=1}^{N} \\big[ m + D(g_i^a, g_i^p) - D(g_i^a, g_i^n) \\big]
$$



> **要点提炼：**

FastReID 提供四种损失函数，覆盖\`分类\`和\`度量学习\`两大范式：

- **Cross-entropy + Label Smoothing**：最基础的多分类损失。Label Smoothing 通过将硬标签 $(0, 1)$ 软化为 $(\\frac{\\delta}{C-1}, 1-\\delta)$，防止模型过度自信，缓解过拟合。
- **ArcFace**：在 softmax 基础上引入角度间隔 $m$，直接在角度空间（而非余弦空间）施加类内惩罚，使同类特征更紧凑、异类特征更分散，是人脸/行人识别中的经典改进。
- **Circle loss**：一种更灵活的度量学习损失（细节见文献 [10]）。
- **Triplet loss**：经典的度量学习损失，通过三元组 $(a, p, n)$ 和间隔 $m$ 约束，使正样本对距离远小于负样本对距离。

实际训练中，通常将分类损失（如 Cross-entropy / ArcFace）与度量损失（如 Triplet / Circle）\`联合使用\`，兼顾身份判别和特征嵌入质量。

> 补充

 **Batch Hard Triplet Loss** 是 Triplet Loss 的一种高效实现方式，核心就一句话：**在一个 batch 内部，自动挑选"最难"的正样本对和负样本对进行训练**，无需离线挖掘三元组。



**拆解理解：**

1. \`Triplet Loss 基础\`
   需要三个样本：锚点（anchor $a$）、正样本（positive $p$，同一人）、负样本（negative $n$，不同人）。目标让 $a$ 与 $p$ 的距离小于 $a$ 与 $n$ 的距离，间隔为 $m$：

   $$D(a, p) + m < D(a, n)$$

2. \`"Batch Hard" 的含义\`
   传统做法需要预先离线挖掘困难三元组，计算量大。Batch Hard 则直接在**每个 training batch 内动态完成**：

   - 对某个 anchor，在 batch 内找**距离最远**的正样本（最难正样本）

   - 在 batch 内找**距离最近**的负样本（最难负样本）

   - 用这对 hardest positive / hardest negative 计算损失
   - 这样每个 batch 只需前向传播一次，自动完成 hardest mining，训练效率高。

3. \`论文中的具体设置\`
   - "one batch consists of 4 subjects, and each subject has 16 different images"
   - 即 batch size = 4 × 16 = 64 张图，来自 4 个不同身份。对每个 anchor，在 batch 内从同身份的 15 张图中选最难正样本，从其余 3 个身份的 48 张图中选最难负样本。



**一句话总结：** Batch Hard Triplet Loss = 在 mini-batch 内自动挖掘最难正负样本的 Triplet Loss，省去离线挖掘步骤，训练更快、更聚焦困难样本。



#### 4.2. 训练策略

图 4 展示了训练策略，包含多种技巧，如不同迭代次数的学习率调整、网络 warm-up 和冻结

<img src="fast-reid.assets/image-20260731171515999.png" alt="image-20260731171515999" style="zoom:67%;" />

训练策略分三阶段，共 18k 迭代：

1. **0–2k：Warm-up + Backbone Freeze**
   - \`学习率：\`从 $3.5 \\times 10^{-5}$ 线性升至 $3.5 \\times 10^{-4}$
   - \`内容：\`仅训练新加的分类器，冻结预训练骨干网络
   - \`目的：\`稳定深层特征、防止初期mini-batch过早过拟合、让分类器参数充分初始化
2. **2k–9k：恒定高学习率**
   - \`学习率：\`固定为 $3.5 \\times 10^{-4}$
   - \`内容：\`开始解冻骨干网络，端到端联合训练
3. **9k–18k：Cosine Decay**
   - \`学习率：\`按余弦曲线衰减至 $7.7 \\times 10^{-7}$
   - \`目的：\`精细收敛，避免震荡





### 5. 测试

#### 5.1. 距离度量

> DSR

- 假设有一对行人图像 $x$ 和 $y$
  - 用 $\\mathbf{x}$ 表示图像 $x$ 经骨干网络得到的空间特征图，维度为 $w_x \\times h_x \\times d$
  - 用 $\\mathbf{y}$ 表示图像 $y$ 经骨干网络得到的空间特征图，维度为 $w_y \\times h_y \\times d$
  - 来自 $N$ 个位置的全部\`空间特征聚合成矩阵\` $\\mathbf{X} = [\\mathbf{x}_n]_{n=1}^N \\in \\mathbb{R}^{d \\times N}$，其中 $N = w_x \\times h_x$
  - 构建图库特征矩阵 $\\mathbf{Y} = \\{\\mathbf{y}_m\\}_{m=1}^M \\in \\mathbb{R}^{d \\times M}$，$M = w_y \\times h_y$
  - 然后，$\\mathbf{x}_n$ 可以在 $\\mathbf{Y}$ 中找到最相似的空间特征进行匹配，得到匹配分数 $s_n$
  - 因此，我们尝试获取 $\\mathbf{X}$ 中所有空间特征相对于 $\\mathbf{Y}$ 的相似分数，最终匹配分数定义为：

$$
s = \\sum_{n=1}^{N} s_n
$$



> FastReID 测试阶段提供三种距离度量：

- **欧氏距离**：直接计算特征向量间的 $l_2$ 距离。
- **余弦距离**：计算特征向量夹角余弦，对特征模长不敏感。
- **DSR（Deep Spatial Reconstruction）**：局部匹配方法，保留空间特征图而非压缩为全局向量，对查询图每个空间位置在图库中寻找最相似特征并累加匹配分，对空间错位和局部遮挡更具鲁棒性。
  - DSR 核心：将空间特征图展平为 $d \\times N$ 和 $d \\times M$ 矩阵，逐位置匹配后求和得到最终相似度。






#### 5.2. 后处理

FastReID 测试阶段提供两种重排序（re-rank）后处理：

- **K-reciprocal coding** [11]：

  经典 ReID 重排序方法（文中未展开，需参考文献 [11]）。
- **Query Expansion (QE)** [12]：

  首轮检索后，将查询特征 $\\mathbf{f}_q$ 与其 Top-$m$ 相似图库特征取平均，得到增强后的新查询特征 $\\mathbf{f}_{q_{new}}$，再进行二次检索。

  - \`QE 的核心价值：\`利用高置信度检索结果丰富查询表示，对查询图像质量不佳（遮挡、模糊、视角变化）时尤为有效，且实现简单，易于落地。

  - \`原理：\` 给定一张查询图像，用它找到 $m$ 张相似的图库图像。查询特征定义为 $\\mathbf{f}_q$，$m$ 张相似图库特征定义为 $\\mathbf{f}_g$。然后通过将验证后的图库特征与查询特征取平均，构建新的查询特征。于是新查询特征 $\\mathbf{f}_{q_{new}}$ 可定义为：
    $$
    \\mathbf{f}_{q_{new}} = \\frac{\\mathbf{f}_q + \\displaystyle\\sum_{i=1}^{m} \\mathbf{f}_g^{(i)}}{m + 1} \\tag{7}
    $$

    此后，新查询特征 $\\mathbf{f}_{q_{new}}$ 用于后续的图像检索。QE 在实际场景中易于使用。



#### 5.3. 评估

性能评估采用行人重识别领域的主流标准指标，即\`累计匹配曲线（CMC）\`和\`平均精度均值（mAP）\`

此外，我们还增加了两个指标：\`接收者操作特征曲线（ROC）\`和\`平均逆负惩罚（mINP）\`13]

更全面地刻画模型在真实场景下的检索性能（尤其是负样本排序能力）

#### 5.4. 可视化

提供检索结果的 rank list，方便直观地定位算法缺陷（如错排、漏检），加速调试和迭代



### 6. 部署

> **要点提炼：**

FastReID 的部署方案围绕**知识蒸馏**展开，目标是让轻量学生模型继承大教师模型的能力：

- \`原有问题：\`过深的模型难以部署在边缘计算硬件和 AI 芯片上
  - 推理耗时
  - 许多层难以在 AI 芯片上实现。

- \`教师模型：\`深层网络，集成 non-local、IBN 等增强模块，性能强但推理重。
- \`学生模型：\`简单浅层网络，适合边缘部署
- \`训练策略：\`双流并行，冻结教师骨干，只训练学生
- \`蒸馏损失三合一：\`
  1. **Logit 对齐** $\\mathcal{L}_{logit}$：L1 损失约束学生与教师的分类 logits 一致
  2. **概率知识迁移** $\\mathcal{L}_{PKT}$：基于 KL 散度，用余弦相似度对齐特征空间分布
  3. **任务损失** $\\mathcal{L}_{reid}$：学生模型自身的 ReID 监督损失
- \`推理：\`仅使用学生模型的特征 $\\mathbf{f}_s$



> 使用知识图谱的原理

<img src="fast-reid.assets/image-20260731174804575.png" alt="image-20260731174804575" style="zoom:80%;" />

如图 5 所示，我们采用双流方式训练学生模型，同时冻结教师骨干网络。

学生和教师模型分别输出分类器 logits $\\mathbf{l}_s$、$\\mathbf{l}_t$ 和特征 $\\mathbf{f}_s$、$\\mathbf{f}_t$。

我们希望学生模型尽可能学习教师模型的分类能力，logit 学习定义为：
$$
\\mathcal{L}_{logit} = \\|\\mathbf{l}_s - \\mathbf{l}_t\\|_1 \\tag{8}
$$

为确保学生模型与教师模型在特征空间分布上的一致性，采用基于 Kullback-Leibler 散度的概率知识迁移模型来优化学生模型：

$$
\\begin{cases}
\\mathcal{L}_{PKT} = \\displaystyle\\sum_{i=1}^{N} \\sum_{j=1,\\, i \\neq j}^{N} p_{j|i} \\log\\!\\left(\\frac{p_{j|i}}{p_{i|j}}\\right) \\\\[12pt]
p_{i|j} = \\dfrac{K(\\mathbf{f}_s^i, \\mathbf{f}_s^j)}{\\sum_{j=1,\\, i \\neq j}^{N} K(\\mathbf{f}_s^i, \\mathbf{f}_s^j)} \\\\[12pt]
p_{j|i} = \\dfrac{K(\\mathbf{f}_t^i, \\mathbf{f}_t^j)}{\\sum_{j=1,\\, i \\neq j}^{N} K(\\mathbf{f}_t^i, \\mathbf{f}_t^j)}
\\end{cases} \\tag{9}
$$

其中 $K(\\cdot, \\cdot)$ 为余弦相似度度量。

同时，学生模型需要 ReID 损失 $\\mathcal{L}_{reid}$ 来优化整个网络。因此，总损失为：

$$
\\mathcal{L}_{kd} = \\mathcal{L}_{logit} + \\alpha \\mathcal{L}_{PKT} + \\mathcal{L}_{reid} \\tag{10}
$$

训练完成后，$\\mathbf{f}_s$ 用于推理。





### 7. 项目

#### 7.1. 行人重识别

> 原文

1. \`数据集\`

   使用三个行人重识别基准数据集评估 FastReID：Market1501 [27]、DukeMTMC [28]、MSMT17 [29]

2. \`FastReID 设置\`
   1. 使用翻转、随机擦除和自动增强处理训练图像
   2. 以带有 Non-local 模块的 IBN-ResNet101 作为骨干网络
   3. 使用 GeM pooling 和 BNNeck 分别作为聚合层和头部网络
   4. 对于 batch hard triplet 损失函数，一个 batch 包含 4 个身份（subjects），每个身份有 16 张不同图像
      1. **Batch Hard Triplet Loss** 是 Triplet Loss 的一种高效实现方式，核心就一句话：**在一个 batch 内部，自动挑选"最难"的正样本对和负样本对进行训练**，无需离线挖掘三元组
   5. 使用 Circle loss 和 Triplet loss 训练整个网络。

3. \`结果\`
   1. 2018–2020 年发表于 CVPR、ICCV、ECCV 的 SOTA 算法列于表 1
   2. FastReID 在 Market1501、DukeMTMC 和 MSMT17 上分别取得了 **96.3% / 90.3%**、**92.4% / 83.2%** 和 **85.1% / 65.4%** 的 rank-1 / mAP 精度
   3. 图 6 展示了三个基准数据集上的 ROC 曲线

<img src="fast-reid.assets/image-20260801152530420.png" alt="image-20260801152530420" style="zoom:67%;" />

*表 1. Market1501、DukeMTMC 和 MSMT17 上的性能对比*

![image-20260801152853039](fast-reid.assets/image-20260801152853039.png)

| 列                  | 是什么                                                       |
| ------------------- | ------------------------------------------------------------ |
| **Bag-of-Tricks**   | 基础配置（warmup + label smoothing + random erasing 等常用技巧），所有行都勾了，作为 baseline |
| **IBN**             | Instance Batch Normalization，增强跨域/跨场景鲁棒性          |
| **Auto-Augment**    | AutoML 自动搜索的数据增强策略                                |
| **Soft Margin**     | Soft Margin 技巧（通常指 triplet loss 的 soft margin 变体）  |
| **Non-Local**       | Non-local 注意力模块，捕获长距离依赖                         |
| **GeM Pooling**     | 广义均值池化，替代平均/最大池化                              |
| **Circle Loss**     | 度量学习损失函数                                             |
| **Backbone Freeze** | 前 2k 迭代冻结骨干网络，只训练分类器                         |
| **Cosine LR**       | 余弦学习率衰减策略                                           |
| **R1 / mAP / mINP** | 三个评估指标，越高越好                                       |



![image-20260801153036086](fast-reid.assets/image-20260801153036086.png)



**图 6.** FastReID（ResNet101-ibn） 这张图分左右两部分，每组对应一个数据集（Market1501 / DukeMTMC / MSMT17）：

\`左边：ROC 曲线\`

- 横轴：假阳性率（FPR），对数刻度
- 纵轴：真阳性率（TPR）
- 红色虚线 = 随机猜测，黄色/绿色/紫色实线 = FastReID 的表现
- **曲线越靠左上角越好**。三张图都远超随机线，说明模型区分能力强。

\`右边：距离分布直方图\`

- 左边深色峰 = **同一人**的图像对距离（应该小）
- 右边浅色峰 = **不同人**的图像对距离（应该大）
- **两个峰分得越开，重叠越少，模型效果越好**

\`三个数据集对比：\`

| 数据集         | 分离程度       | 难度   |
| :------------- | :------------- | :----- |
| **Market1501** | 两峰几乎不重叠 | 最简单 |
| **DukeMTMC**   | 中间有少量重叠 | 中等   |
| **MSMT17**     | 两峰重叠最多   | 最难   |

这和表 1 的性能数据一致——MSMT17 上 mAP 最低（65.4%），因为类内类间距离最难分开。在三个基准数据集上的 ROC 曲线，以及类内/类间样本距离分布曲线





> **要点提炼：**

**性能层面：** FastReID (ResNet101-ibn) 在三个主流数据集上全面超越 2018–2020 年的 SOTA 方法。其中 MSMT17 是大规模困难数据集，FastReID 将 mAP 从 60.8% 提升到 65.4%（MGN 配置），优势显著。

**后处理威力：** QE（查询扩展）对 mAP 提升极大——Market1501 从 90.3% 跃升至 94.4%，DukeMTMC 从 83.2% 跃升至 90.1%，MSMT17 从 63.3% 跃升至 76.9%。这说明首轮检索的 Top 结果质量很高，QE 能有效增强查询表示。再加上 Rerank，Market1501 和 DukeMTMC 的 mAP 分别达到 95.3% 和 92.2%。

**消融实验洞察（DukeMTMC, ResNet50）：**
- **IBN** 是单 trick 增益最大的组件（R1 +3.7, mAP +3.9），显著提升跨域鲁棒性。
- **Circle Loss**（R1 +3.2, mAP +3.1）和 **Cosine LR Scheduler**（R1 +3.3, mAP +2.6）也是核心增益点。
- **Auto-Augment** 和 **Backbone Freeze** 单独使用时效果不佳甚至下降，说明它们需要与其他 trick 配合才能发挥作用。
- 所有 trick 叠加后，ResNet50 基线从 85.5/75.2 提升到 91.3/81.6，涨幅接近 6 个百分点。





#### 7.2. 跨域行人重识别

- **问题定义** 
  - 跨域行人重识别旨在将模型从有标注的源域数据集迁移到另一个无标注的目标域数据集。

- **设置** 
  - 我们提出了一种跨域方法 **FastReID-MLT**，采用混合标签迁移（mixture label transport）和多粒度策略来学习伪标签。
  - 具体流程：
    - 首先在源域数据集上训练模型
    - 然后在预训练模型基础上，利用目标域数据集的伪标签进行微调。
    - FastReID-MLT 使用 ResNet50 骨干网络、GeM pooling 和 BNNeck head。batch hard triplet loss 的设置与之前相同（4 个身份 × 16 张图像），使用 Circle loss 和 Triplet loss 训练整个网络。详细配置见 GitHub。框架如图 7 所示。

![image-20260801154450412](fast-reid.assets/image-20260801154450412.png)

**图 7. FastReID-MLT 框架**

- **源域分支**：源域图像 → 预处理（翻转、随机擦除、Auto-augment）→ 预训练骨干网络
- **目标域分支**：目标域图像 → 预处理（翻转、Auto-augment）→ 聚类（K-means）生成伪标签
- **标签精炼**：通过最优传输（Optimal Transport）对聚类伪标签进行提纯
- **训练**：将精炼后的伪标签送入与源域共享的 Backbone → GeM Pooling → BNNeck → Triplet loss / Circle loss 进行联合训练



<img src="fast-reid.assets/image-20260801154711891.png" alt="image-20260801154711891" style="zoom: 67%;" />

表3. 在三个基准数据集上与无监督跨域重识别最先进方法的性能比较。“BOT”指的是技巧包方法，这是重识别任务中的一个强基线。M: Market1501, D: DukeMTMC, MS: MSMT17。

> **要点提炼：**

**跨域 ReID（FastReID-MLT）：**

- **核心思路**：源域预训练 → 目标域 K-means 聚类生成伪标签 → 最优传输精炼伪标签 → 目标域微调。全程无需目标域人工标注。
- **性能碾压同期 SOTA**：在 D→M 上 mAP 80.5%，比前 SOTA（MMT 71.2%）高出近 10 个点；R1 92.7% 已非常接近监督学习（94.1%）。
- **MSMT17 跨域仍困难**：M→MS 和 D→MS 上 mAP 仅 26–28%，说明大规模复杂场景的跨域迁移仍是硬骨头，但与监督差距（48.3%）相比仍有提升空间。
- **关键洞察：** FastReID-MLT 的跨域结果接近监督学习，说明"聚类 + 最优传输精炼"的伪标签策略非常有效





#### 7.3. 局部行人重识别

- **问题定义** 
  - 局部行人重识别是一个具有挑战性的问题，匹配时仅能获得行人的部分观测（图像）。

- **设置** 具体设置如图 8 所示

  - <img src="fast-reid.assets/image-20260801155429345.png" alt="image-20260801155429345" style="zoom:67%;" />

  - **输入图像** → 预处理（翻转、Auto-augment）

  - **骨干网络**：ResNet50 + IBN + Non-local

  - **聚合层**：Avg Pooling（注意这里用了平均池化，而非 GeM）

  - **头部网络**：BNNeck

  - **损失**：Triplet loss + Circle loss（batch：4 身份 × 16 图像）

  - **距离度量**：Cosine distance + **DSR**（深度空间重构）


- **结果** 
  - <img src="fast-reid.assets/image-20260801155527266.png" alt="image-20260801155527266" style="zoom:67%;" />
  - 表 4 展示了在 PartialREID、OccludedREID 和 PartialiLIDS 数据集上的结果。FastReID-DSR 在三个数据集上分别取得 **82.7% / 76.8%**、**81.6% / 70.9%** 和 **73.1% / 79.8%** 的 rank-1 / mAP。



> **要点提炼：**

**为什么局部 ReID 难？** 查询图和图库图都只有行人的一部分（遮挡、截断），传统全局特征会丢失关键信息。

**FastReID-DSR 的解法：**
- 训练阶段和常规 ReID 基本一致（Avg Pooling + BNNeck + Circle/Triplet loss）
- **关键在推理阶段**：距离度量不用单纯的余弦距离，而是 **Cosine + DSR 联合打分**。DSR 保留空间特征图逐位置匹配，对"只有半身可见"的情况天然鲁棒。



 

#### 7.4. 车辆重识别

- **数据集** 
  - 使用三个车辆重识别基准数据集评估 FastReID：
    - VeRi
    - VehicleID
    - VERI-Wild

- **设置** 
  - <img src="fast-reid.assets/image-20260801160240902.png" alt="image-20260801160240902" style="zoom:50%;" />

- **结果**
  - 2015–2019 年间发表的 SOTA 算法列于表 5、表 6 和表 7。FastReID 在 VeRi、VehicleID 和 VERI-Wild 上均取得了最佳性能。
  - <img src="fast-reid.assets/image-20260801160406942.png" alt="image-20260801160406942" style="zoom:50%;" />
  - <img src="fast-reid.assets/image-20260801160424645.png" alt="image-20260801160424645" style="zoom:50%;" />
  - <img src="fast-reid.assets/image-20260801160445802.png" alt="image-20260801160445802" style="zoom:50%;" />



> **要点提炼：**

FastReID 在车辆 ReID 上呈现**碾压级优势**，三个数据集全面刷新 SOTA：

- **VeRi**：mAP 从 74.3%（PRN）提升到 **81.9%**，涨幅 **7.6 个百分点**；R-1 达到 **97.0%**，接近饱和
- **VehicleID**：在 Small/Medium/Large 三个规模上 R-1 分别达到 **86.6% / 82.9% / 80.6%**，比前 SOTA（PRN）高出 **6–8 个百分点**，且规模越大优势越稳定
- **VERI-Wild**：这是最震撼的——前 SOTA（MLSL）mAP 仅 46.3%，FastReID 直接干到 **87.7%**，**几乎翻倍**；R-1 也从 86.0% 提升到 **96.4%**。说明在复杂野外场景下，FastReID 的通用设计（IBN + Non-local + GeM + Circle Loss）对车辆 ReID 同样极其有效





 

### 8. 结论



- **FastReID 的定位**：通用实例重识别开源库，不限于单一任务。
- **实验验证**：在行人 ReID、车辆 ReID 等多任务上证明了通用性和有效性。
- **开源意义**：强调开源平台对学术界和工业界协同推进 AI 的关键作用。
- **未来愿景**：持续加速通用实例重识别领域发展，促进社区合作。



## 训练

要使用 \`train_net.py\` 训练模型，首先按照 [datasets/README.md](https://github.com/JDAI-CV/fast-reid/tree/master/datasets) 设置相应的数据集，然后运行：

\`\`\`bash
set PYTHONPATH=E:\\ai\\dy\\tracker\\fast-reid;%PYTHONPATH%

python tools/train_net.py --config-file ./configs/Market1501/sbs_S50.yml MODEL.DEVICE "cuda:0" DATALOADER.NUM_WORKERS 0
\`\`\`

要评估模型性能，请使用：

\`\`\`bash
python tools/train_net.py --config-file ./configs/Market1501/sbs_S50.yml --eval-only MODEL.WEIGHTS ./logs/market1501/sbs_S50/model_best.pth MODEL.DEVICE "cuda:0"
\`\`\`

### 数据集

#### 案例

Fastreid 内置支持若干数据集。这些数据集应存放在环境变量 \`FASTREID_DATASETS\` 指定的目录下。在该目录下，fastreid 期望数据集按以下结构组织。

你可以通过 \`export FASTREID_DATASETS=/path/to/datasets/\` 设置内置数据集的存放路径。如果未设置，默认为当前工作目录下的 \`datasets/\`。

\`\`\`yaml
datasets/
    Market-1501-v15.09.15/
        bounding_box_test/
        bounding_box_train/
\`\`\`







### 配置文件

位于\`config\`目录

\`\`\`css
E:\\AI\\DY\\TRACKER\\FAST-REID\\CONFIGS
│  Base-AGW.yml
│  Base-MGN.yml
│  Base-SBS.yml
│  Base-bagtricks.yml # 核心基础配置
│
├─DukeMTMC
│      AGW_R101-ibn.yml
│
├─MSMT17
│      AGW_R101-ibn.yml
│
├─Market1501
│      AGW_R101-ibn.yml
│      AGW_R50-ibn.yml
│      AGW_R50.yml
│      AGW_S50.yml
│      bagtricks_R101-ibn.yml
│      bagtricks_R50-ibn.yml
│      bagtricks_R50.yml
│      bagtricks_S50.yml
│      bagtricks_vit.yml
│      mgn_R50-ibn.yml
│      sbs_R101-ibn.yml
│      sbs_R50-ibn.yml
│      sbs_R50.yml
│      sbs_S50.yml
\`\`\`





## autodl

https://github.com/JDAI-CV/fast-reid.git

AutoDL 安装环境
租一台 RTX 2080Ti / RTX 3080 / A4000（够跑 SBS-50），镜像选 *PyTorch 1.8+ / CUDA 11.1+*，然后：
cd fast-reid

> 基础依赖

pip install -r docs/requirements.txt

> rich 进度条（新增）

pip install rich

> 安装 fastreid 本身（开发模式）

pip install -e .

> 编译 Cython 评估加速

cd fastreid/evaluation/rank_cylib
python setup.py build_ext --inplace
cd ../../..

> 下载 Market1501 数据集

mkdir -p datasets
cd datasets
gdown --id 1U5IzB2sW2Q1T_7Fb5Wcp_L9ynFm1_udl  # 或你之前的方式
cd ..
训练命令（和本地一致）
python tools/train_net.py --config-file ./configs/Market1501/sbs_S50.yml MODEL.DEVICE "cuda:0"

> 注意

- AutoDL 部分机型的系统盘只有 30G，datasets/ 和 logs/ 放数据盘（/root/autodl-tmp/）
- 原始 requirements.txt 缺 rich，记得额外装
- 粗的 2080Ti 卡跑 SBS-50 大约 1.5~2 小时/60 epoch





## 数据集

### Market

\`Market-1501-v15.09.15\` 是行人重识别（Person Re-ID）领域最常用的基准数据集。解压后的原始结构如下：

\`\`\`
Market-1501-v15.09.15/
├── bounding_box_test/      # 测试 gallery 图像
├── bounding_box_train/     # 训练图像
├── gt_bbox/                # 手工标注的 ground truth 检测框
├── gt_query/               # query 的 ground truth 评估标注 (.mat)
├── query/                  # 测试 query 图像
└── readme.txt
\`\`\`



#### 各目录/文件作用

| 目录/文件             | 图像数  | 作用说明                                                     |
| --------------------- | ------- | ------------------------------------------------------------ |
| \`bounding_box_train/\` | ~12,936 | **训练集**。751 个身份，由 DPM 检测器自动裁剪的 bounding box。 |
| \`bounding_box_test/\`  | ~19,732 | **测试 Gallery**。750 个身份，DPM 自动检测裁剪，作为检索数据库。 |
| \`query/\`              | ~3,368  | **测试 Query**。750 个身份，手工标注裁剪，作为查询 probe。   |
| \`gt_bbox/\`            | ~25,259 | **手工标注真值**。人工画框的 ground truth，用于评估检测器质量。 |
| \`gt_query/\`           | ~6,736  | **Query 评估标注**。\`.mat\` 文件，标记每个 query 对应的 good/junk 匹配。 |
| \`readme.txt\`          | —       | 官方说明文档。                                               |

|            | \`query/\`                             | \`gt_query/\`                                           |
| ---------- | ------------------------------------ | ----------------------------------------------------- |
| **是什么** | 手工裁剪的 query 图像（~3,368 张）   | \`.mat\` 标注文件                                       |
| **给谁用** | 模型输入                             | 评估代码                                              |
| **干什么** | 作为 probe 去 gallery 里检索相似图像 | 标记哪些 gallery 结果算"有效匹配"，哪些算"垃圾"该忽略 |

**核心区别**：\`query\` 是给模型看的图，\`gt_query\` 是给评估代码看的标签





#### 文件名编码规则

每张图命名格式为：\`0001_c1s1_001051_00.jpg\`

| 字段     | 含义                                        |
| -------- | ------------------------------------------- |
| \`0001\`   | **Person ID**（身份编号，0000 为背景/干扰） |
| \`c1\`     | **Camera ID**（摄像头编号，共 6 个）        |
| \`s1\`     | **Sequence ID**（视频序列编号）             |
| \`001051\` | **Frame ID**（视频帧号）                    |
| \`00\`     | **BBox ID**（同一帧内的检测框序号）         |



#### 补充：框架处理后的结构

多数 Re-ID 代码（如 torchreid、fast-reid）会额外生成 \`pytorch/\` 目录，将图像按身份归类，便于 \`ImageFolder\` 读取：

\`\`\`
pytorch/
├── train/        # 训练集（按 ID 分文件夹）
├── val/          # 验证集（每个 ID 取 1 张）
├── train_all/    # 全部训练图像
├── gallery/      # 测试 gallery
├── query/        # 测试 query
└── multi-query/  # 多 query 扩展
\`\`\`



`;export{n as default};
