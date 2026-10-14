const n=`## 高斯模糊

[一文理解什么是高斯模糊-CSDN博客](https://blog.csdn.net/DDDDWJDDDD/article/details/146770214)

\`\`\`python
import cv2
 
# 读取图像
img = cv2.imread("example.jpg")
 
# 应用高斯模糊
blurred = cv2.GaussianBlur(img, (5,5), 0)  # 核大小 (5,5)，sigmaX=0 自动计算
 
# 显示结果
cv2.imshow("Original", img)
cv2.imshow("Gaussian Blur", blurred)
cv2.waitKey(0)
cv2.destroyAllWindows()
\`\`\`

\`\`\`python
cv2.GaussianBlur(src, ksize, sigmaX[, dst[, sigmaY[, borderType]]]) -> dst
\`\`\`

**参数说明**

- src：输入图像（可以是灰度图或彩色图）
- ksize：高斯核的大小（通常是奇数，如 (3,3)、(5,5)）
- sigmaX：X 方向的标准差（控制模糊程度，值越大模糊越强）
- sigmaY（可选）：Y 方向的标准差，默认情况下 sigmaY=sigmaX
- borderType（可选）：边界填充方式，默认 cv2.BORDER_DEFAULT

**常用于图像处理**：

- 降噪（如人脸识别前的预处理）
- 生成模糊效果
- 作为 Canny 边缘检测的预处理步骤







## SIFT（暂停）

[视觉 AI 必学算法！图像匹配经典算法 SIFT 详解_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1gP2xBzE9j/?)

https://blog.csdn.net/weixin_43114209/article/details/145097784



### 1. 引言

- **SIFT**（Scale-Invariant Feature Transform，尺度不变特征变换）：提取局部关键点并生成具有**尺度、旋转不变性**的描述子，用于图像特征匹配。
- **历史**：David G. Lowe 1999 年首次提出，2004 年论文《Distinctive Image Features from Scale-Invariant Keypoints》完善。美国专利 2020 年过期后完全开源（已集成进 OpenCV）。
- **启发后续算法**：SURF、ORB。
- **应用场景**：图像拼接（全景图）、目标检测与识别、三维重建、机器人导航、视频跟踪与检索。

### 2. SIFT 基本原理（四大步骤）

#### 2.1 高斯尺度空间构建

- 高斯平滑：$G(x,y,\\sigma) = \\dfrac{1}{2\\pi\\sigma^2} e^{-\\frac{x^2+y^2}{2\\sigma^2}}$，$\\sigma$ 为尺度参数。
- 高斯差分 DoG：相邻尺度模糊图像相减，近似拉普拉斯算子
  $D(x,y,\\sigma) = G(x,y,k\\sigma) - G(x,y,\\sigma)$，$k$ 通常取 $\\sqrt{2}$。
- 结果：DoG 金字塔，作为关键点检测基础。

#### 2.2 关键点检测与定位

- **局部极值检测**：每个像素与当前层 + 上下相邻层共 **26 个邻域像素**（3D 空间）比较，取极大/极小值。
- **精确定位**：泰勒展开拟合精确位置；剔除低对比度点（阈值 ~0.03）；分析 Hessian 矩阵特征值，剔除边缘响应点（主曲率比 > 10:1）。

#### 2.3 主方向分配（旋转不变性）

- 邻域内逐像素计算梯度幅值与方向：

  $$m(x,y) = \\sqrt{[L(x+1,y)-L(x-1,y)]^2 + [L(x,y+1)-L(x,y-1)]^2}$$

  $$\\theta(x,y) = \\arctan\\frac{L(x,y+1)-L(x,y-1)}{L(x+1,y)-L(x-1,y)}$$
- 构造方向直方图（**36 个方向**，每 10° 一桶），主峰即主方向。
- 副峰接近主峰时可分配多个方向，增强匹配鲁棒性。

#### 2.4 特征描述子生成

- 以主方向为基准旋转对齐邻域（旋转不变）。
- 邻域 16×16 像素 → 划分 4×4 网格，每格统计 8 方向直方图。
- 描述子维度：$4 \\times 4 \\times 8 = \\mathbf{128}$ 维。
- 归一化 → 截断 >0.2 的值 → 再次归一化（抗光照、抑制异常）。

#### 2.5 特征匹配

- 欧氏距离 + **最近邻/次近邻比值**筛选（阈值 0.75）。
- **RANSAC** 剔除误匹配。

### 3. 实现细节补充

- **高斯金字塔**：图像逐层降采样（octave），每层的 $\\sigma$ 递增生成多个模糊层，每层多算 2~3 层用于差分。
- **匹配加速**：k-d 树、FLANN（Fast Library for Approximate Nearest Neighbors）。
- 复杂度：时间 $O(N \\log N)$（$N$ = 像素数），空间占用高（金字塔 + DoG + 描述子）。

### 4. 优缺点

| 特性      | 优点                           | 缺点                                |
| --------- | ------------------------------ | ----------------------------------- |
| 尺度/旋转 | 完全不变                       | 对仿射变换不鲁棒（可用 ASIFT 改进） |
| 鲁棒性    | 抗部分遮挡、噪声、小幅光照变化 | 强光照/非线性光照下较差             |
| 描述能力  | 128 维高区分度                 | 计算复杂度高、占内存                |
| 专利      | 2020 年已过期，可自由使用      | —                                   |

### 5. 改进与优化

| 方法           | 思路                          | 特点                                |
| -------------- | ----------------------------- | ----------------------------------- |
| **GPU 加速**   | CUDA/OpenCL 并行（如 VLFeat） | 大规模任务提速 10 倍以上            |
| **PCA-SIFT**   | PCA 降维 128→20~36 维         | 更快更省存储，略损鲁棒性            |
| **Dense-SIFT** | 每像素均匀采样描述子          | 适合图像分类/纹理分析，计算量大     |
| **RootSIFT**   | 描述子开平方根归一化          | 匹配性能优于标准 SIFT，词袋模型友好 |

#### 与其他算法对比

| 算法   | 尺度/旋转不变 | 光照鲁棒 | 描述能力 | 复杂度 | 适用场景         |
| ------ | ------------- | -------- | -------- | ------ | ---------------- |
| SIFT   | 很强          | 较强     | 很高     | 较高   | 匹配、拼接、识别 |
| SURF   | 较强          | 较强     | 较高     | 较低   | 实时任务         |
| ORB    | 较弱          | 较弱     | 较低     | 很低   | 嵌入式、实时视频 |
| Harris | 无            | 很弱     | 低       | 低     | 基础角点检测     |

### 6. 典型应用流程

1. **图像拼接**：SIFT 提特征 → 匹配 → RANSAC 求单应矩阵 → 投影对齐 → 融合裁剪。
2. **目标检测/跟踪**：目标模板 SIFT 特征 ↔ 实时帧匹配 → 定位跟踪 → 动态更新模板。
3. **机器人导航**：环境特征地图 + 实时匹配 → 位姿估计 → 路径规划（支持视觉里程计）。
4. **三维重建**：多视图特征匹配 → 相机参数估计 → 三维点云 → 稀疏/密集重建 + 纹理映射。
5. **视频检索**：逐帧建特征数据库 → 查询图像匹配 → 相关帧检索。

### 7. 代码实现（OpenCV）

\`\`\`python
import cv2

# 特征提取
sift = cv2.SIFT_create()
keypoints, descriptors = sift.detectAndCompute(gray, None)  # descriptors: (N, 128)

# 特征匹配（BF + 比值筛选）
bf = cv2.BFMatcher()
matches = bf.knnMatch(desc1, desc2, k=2)
good = [m for m, n in matches if m.distance < 0.75 * n.distance]

# 图像拼接：RANSAC 求单应矩阵
src = np.float32([kp1[m.queryIdx].pt for m in good]).reshape(-1, 1, 2)
dst = np.float32([kp2[m.trainIdx].pt for m in good]).reshape(-1, 1, 2)
H, mask = cv2.findHomography(src, dst, cv2.RANSAC, 5.0)
result = cv2.warpPerspective(img1, H, (w1 + w2, h1))
\`\`\`

### 附录要点

- **经典论文**：Lowe 2004（完整 SIFT 框架）、Lowe 1999（早期版本）；延伸阅读 SURF (Bay 2006)、ORB (Rublee 2011)。
- **FAQ 速览**：
  - 旋转/尺度不变性来源 → 尺度空间 + 主方向对齐。
  - 速度慢 → GPU、PCA-SIFT/SURF、OpenCV 优化实现。
  - 匹配慢 → k-d 树 / FLANN + 比值筛选。
  - 遮挡 → 局部特征；光照 → 梯度差分 + 归一化。
  - 实时场景 → 换 SURF/ORB 或深度学习方法。





## LAP

### 简介



**\`lap\` 是一个 Python 库，全称 Linear Assignment Problem（线性分配问题），实现了 Jonker–Volgenant 算法**——它和匈牙利算法解决的是同一个问题（在 cost 矩阵上做全局最优的一一匹配），但速度更快，且提供稀疏矩阵版本 \`lapmod\`。

结合上一个问题，三者的关系是：

- **匈牙利算法** = 求解最优匹配的算法（教科书经典版）
- **Jonker–Volgenant (JV) 算法** = 求解同一问题的更快算法
- **\`lap\`** = JV 算法的 Python 封装（\`pip install lap\`），MitoTNT 用的就是它

**MitoTNT 中的具体作用**：MitoTNT 需要把相邻两帧的线粒体骨架节点互相配对。它用空间距离 + 网络拓扑（图比对）构建 cost 矩阵，然后调用 \`lap.lapmod\` 在这个稀疏代价矩阵上求最优分配；帧间链接（frame-to-frame linking）和跨帧断裂重连（gap closing）两步都用它求解 。这正是论文说的"用空间邻近性和网络拓扑计算最优跟踪分配"。

此时 cost 矩阵的含义（呼应你的上一个问题）：

\`\`\`python
import lap
import numpy as np

# cost[i][j]: 把 t 时刻的节点 i 配给 t+1 时刻的节点 j 的代价
# 形状 (n_nodes_t, n_nodes_t+1)，由欧氏距离 + 拓扑图差异加权构成
cost = np.array([
    [0.3, 1.2, 4.0],
    [1.5, 0.1, 2.2],
    [3.0, 2.0, 0.5],
])

# lapjv: 稠密矩阵版本，返回 (总代价, 行匹配, 列匹配)
# x[i] = j 表示节点 i 匹配到节点 j，-1 表示该节点在本帧无匹配（出现/消失）
min_cost, x, y = lap.lapjv(cost)
# 结果: x = [0, 1, 2]，总代价 0.3+0.1+0.5 = 0.9（全局最小）

# MitoTNT 实际用的是 lapmod: 稀疏/大型矩阵版本，
# 通过'增广代价矩阵'处理节点数不等（有的节点断裂/融合）的情况
\`\`\`

为什么不用 \`scipy.optimize.linear_sum_assignment\`？因为 MitoTNT 处理的是大规模 4D 数据（单帧可达十几万节点），\`lapmod\` 在稀疏矩阵上求解，内存和速度都远优于稠密的匈牙利实现。

### coo_matrix

这行代码是在**用坐标列表构造一个稀疏矩阵**，然后转换成 CSR 格式。我们拆开看。

\`\`\`python
cost = coo_matrix((vals, (rows, cols)), shape=(dim, dim)).tocsr()
\`\`\`

**一句话总结**

根据 \`rows\`、\`cols\` 和 \`vals\` 这三个列表，在 \`dim × dim\` 的矩阵里，把 \`vals[k]\` 放到第 \`rows[k]\` 行、第 \`cols[k]\` 列的位置上，没提到的地方都是 0。最后把矩阵转成 CSR 格式，方便后续计算



> 逐步拆解

1. **\`coo_matrix\` 是什么？**

\`coo_matrix\` 是 SciPy 里的一种**稀疏矩阵**格式，全称 Coordinate format（坐标格式）。

它不存储整个矩阵，只存储**非零元素**的位置和值。因为很多矩阵大部分是 0，存全部太浪费内存。

构造方式：

\`\`\`python
coo_matrix((数据, (行索引, 列索引)), shape=(行数, 列数))
\`\`\`

其中：

- \`数据\`：每个非零元素的值；
- \`行索引\`：每个非零元素所在的行；
- \`列索引\`：每个非零元素所在的列；
- 三个列表长度必须一样。

2. **这里的参数**

\`\`\`python
vals   # 每个位置的值
rows   # 每个位置的行号
cols   # 每个位置的列号
shape=(dim, dim)  # 矩阵是 dim 行 dim 列
\`\`\`

比如：

\`\`\`python
vals = [1.5, 2.0, 3.0]
rows = [0, 1, 1]
cols = [2, 0, 1]
\`\`\`

表示：

- 第 0 行第 2 列 = 1.5
- 第 1 行第 0 列 = 2.0
- 第 1 行第 1 列 = 3.0

其他位置都是 0。

3. \`.tocsr()\` 是什么？

把 COO 格式转成 **CSR 格式**（Compressed Sparse Row，压缩稀疏行）。

CSR 更适合：

- 按行访问元素；
- 矩阵和向量相乘；
- 后续做图算法、最短路等。

转换后，\`cost\` 就是一个 CSR 格式的稀疏矩阵。

---

> 完整例子

\`\`\`python
import numpy as np
from scipy.sparse import coo_matrix

dim = 4
vals = np.array([1.0, 2.0, 3.0])
rows = np.array([0, 1, 1])
cols = np.array([2, 0, 1])

cost = coo_matrix((vals, (rows, cols)), shape=(dim, dim)).tocsr()

print(cost)
\`\`\`

输出类似：

\`\`\`text
  (0, 2)	1.0
  (1, 0)	2.0
  (1, 1)	3.0
\`\`\`

表示矩阵：

\`\`\`text
[[0. 0. 1. 0.]
 [2. 3. 0. 0.]
 [0. 0. 0. 0.]
 [0. 0. 0. 0.]]
\`\`\`

---

> 重要注意点

如果 \`rows\` 和 \`cols\` 中有**重复的坐标**，COO 在转成 CSR 时会自动把它们的值**相加**。

比如：

\`\`\`python
vals = [1.0, 2.0]
rows = [0, 0]
cols = [1, 1]
\`\`\`

最终 (0,1) 位置的值是 \`1.0 + 2.0 = 3.0\`。

这是 SciPy 的默认行为，写代码时要注意。



> 常见用途

- 构建图的邻接矩阵或代价矩阵；
- 表示稀疏的权重；
- 后续用 CSR 做矩阵乘法、最短路松弛等。

















`;export{n as default};
