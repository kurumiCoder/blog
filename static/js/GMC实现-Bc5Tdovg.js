const n=`# GMC实现



## ORB

### 流程

- \`applyFeatures()\` — 基于特征点匹配的方法 (ORB / SIFT)

  - **算法核心流程 (经典几何配准管道)**
    - **Step 1: Fast特征点检测 (detect)**
      - 在灰度图上用 ORB/SIFT 检测器找关键点
      - \`mask\`: 排除检测框区域，避免前景特征污染背景运动估计
    - **Step 2: 描述子计算 (compute)**
      - 对每个关键点计算特征向量
        - SIFT: 128维浮点
        - ORB: 32字节二进制
    - **Step 3: KNN 匹配 (\`knnMatch\`, k=2)**
      - 对 \`prevFrame\` 的每个描述子找当前帧中最近 K 次近邻居
    - **Step 4: Lowe's Ratio Test**
      - \`ratio = distance(best) / distance(2nd_best)\`
      - 若 \`ratio < 0.9\` 则保留，过滤歧义匹配
      - **物理意义**: 最近邻须显著优于次近邻，否则匹配不可靠
    - **Step 5: 空间距离过滤**
      - 相邻帧间同一点的位移不应太大（最大 \`0.25×\` 图像尺寸）
    - **Step 6: 空间一致性过滤 (std-based outlier removal)**
      - \`|spatialDist - mean| < 2.5×std\` 的匹配才保留
      - 只保留位移在 μ ± 2.5σ 范围内的匹配点
      - 使用 2.5σ (而非 3σ) 的原因是更好地剔除因前景运动导致的离群匹配
    - **Step 7: RANSAC 刚性变换估计**
      - \`cv2.estimateAffinePartial2D()\` 估计 Partial Affine
      - 即刚性变换（旋转+平移），不含缩放和错切
      - RANSAC 迭代剔除离群匹配点
    - **Step 8: 坐标尺度恢复**
      - 若使用了 \`downscale\`，平移量 \`H[0,2]\` & \`H[1,2]\` 需乘回
    
  - **参数**
    - \`raw_frame\`: 当前帧 BGR \`[H, W, 3]\`
    - \`detections\`: 当前帧检测框 \`[N_det, &gt;=4]\`，前4列为边界框坐标，用于构建 mask 屏蔽前景区域
  
  - **返回**
    - \`H\`: \`[2, 3]\` 刚性变换矩阵（在原始图像坐标系下）



> 视频画面在抖，算法要算出"相机抖动了多少"，然后把画面反向推回去，让它看起来稳定。

**核心思路（找相同 → 排假货 → 算抖动 → 反向补偿）：**

1. **找地标** — 在两帧画面里找不变的"角点/边缘"作为参照物
2. **做身份证** — 给每个地标生成唯一特征码
3. **配对** — 看上一帧的地标在当前帧跑到哪去了
4. **层层过滤** — 用4种方法排除错误配对（模棱两可的、跳太远的、不合群的、RANSAC投票）
5. **算矩阵** — 根据剩下的正确配对，算出相机的旋转+平移
6. **恢复尺寸** — 如果之前缩小了图像加速处理，把结果放大回原始尺寸

**为什么要这么多过滤步骤？**

因为特征点匹配很容易出错（光照变化、遮挡、相似纹理），不层层筛选的话，算出来的"抖动"会是错的，画面反而更晃。

**最终产物 \`H\` 是什么？**

一个 2×3 的矩阵，表示"把当前帧的每个像素怎么移动，才能抵消相机抖动"。



### 代码

\`\`\`python
   def applyFeaures(self, raw_frame, detections=None):

        # 获取原始图像尺寸
        height, width, _ = raw_frame.shape
        # frame: 灰度图 [H, W], ∈ [0, 255]
        frame = cv2.cvtColor(raw_frame, cv2.COLOR_BGR2GRAY)
        # H: 初始化为单位矩阵 [2, 3]
        H = np.eye(2, 3)

        # 可选下采样: 缩小图像加速特征提取
        # TODO: 考虑使用图像金字塔替代简单下采样
        if self.downscale > 1.0:
            # frame = cv2.GaussianBlur(frame, (3, 3), 1.5)  # 可选: 先模糊再缩小
            frame = cv2.resize(frame, (width // self.downscale, height // self.downscale))
            width = width // self.downscale
            height = height // self.downscale

        # ---- Step 1: 特征点检测 ----
        # mask: 有效区域掩码 [H_down, W_down], dtype uint8, 值为 0 或 255
        #       255白色 = 允许检测的区域, 0 = 屏蔽区域
        #       默认屏蔽图像边缘 2% 的区域 (这些区域的点可能因卷帘快门
        #       或边缘效应而不稳定)
        #       额外屏蔽检测框区域, 防止前景物体上的特征点污染背景运动估计
        mask = np.zeros_like(frame)
        # mask[int(0.05 * height): int(0.95 * height), int(0.05 * width): int(0.95 * width)] = 255
        mask[int(0.02 * height): int(0.98 * height), int(0.02 * width): int(0.98 * width)] = 255
        if detections is not None:
            for det in detections:
                # 检测框坐标也需除以 downscale 以匹配降采样后的图像坐标系
                # det[:4]: 边界框 (可能为 tlwh 或 tlbr 格式)
                # astype(np.int_): 转换为整数像素坐标
                tlbr = (det[:4] / self.downscale).astype(np.int_)
                # 将检测框区域置 0 (屏蔽前景)
                mask[tlbr[1]:tlbr[3], tlbr[0]:tlbr[2]] = 0

        # 带 mask 的特征点检测: 仅在 mask 白色区域检测
        # keypoints: list[cv2.KeyPoint], 每个元素包含 pt, size, angle, response 等
        keypoints = self.detector.detect(frame, mask)

        # ---- Step 2: 描述子计算 ----
        # descriptors: [N_kpts, D_dim]
        #   SIFT: D_dim=128 (float32), ORB: D_dim=32 (uint8 二进制)
        # keypoints 可能被 compute() 过滤 (无法计算描述子的点被丢弃)
        keypoints, descriptors = self.extractor.compute(frame, keypoints)

        # ---- 首帧处理: 存储当前帧信息, 返回单位矩阵 ----
        if not self.initializedFirstFrame:
            # 存储当前帧数据作为下一帧的"上一帧"
            self.prevFrame = frame.copy()
            self.prevKeyPoints = copy.copy(keypoints)
            self.prevDescriptors = copy.copy(descriptors)

            self.initializedFirstFrame = True

            return H

        # ---- Step 3: KNN 匹配 (k=2, 每个查询点找最近的两个候选匹配) ----
        # knnMatches: list[list[cv2.DMatch]]
        #   每个元素是一个长度为2的列表 [best_match, 2nd_best_match]
        #   DMatch 属性: queryIdx (prevFrame 中特征点索引),
        #                trainIdx (当前帧特征点索引),
        #                distance (描述子距离)
        knnMatches = self.matcher.knnMatch(self.prevDescriptors, descriptors, 2)

        # ---- Step 4 & 5: Lowe's Ratio Test + 空间距离过滤 ----
        matches = []           # 通过 ratio test 的匹配列表
        spatialDistances = []  # 对应匹配点的空间位移向量 [(dx, dy), ...]

        # 最大允许的空间位移 = 0.25 × 图像尺寸
        # 相邻帧之间同一点的位移超过图像 1/4 即为异常
        maxSpatialDistance = 0.25 * np.array([width, height])

        # 处理空匹配: 无匹配点则退回单位矩阵
        if len(knnMatches) == 0:
            self.prevFrame = frame.copy()
            self.prevKeyPoints = copy.copy(keypoints)
            self.prevDescriptors = copy.copy(descriptors)

            return H

        for m, n in knnMatches:
            # ---- Lowe's Ratio Test ----
            # m = 最近邻, n = 次近邻
            # ratio = m.distance / n.distance
            # 若 ratio < 0.9 则认为 m 是可靠匹配
            # 物理意义: 若两匹配距离接近 (ratio≈1), 则该点的描述子在当前帧
            # 中存在多个相似候选, 匹配不可靠; 只有最近邻显著优于次近邻时,
            # 该匹配才具有判别性
            if m.distance < 0.9 * n.distance:
                # 提取匹配点在两帧中的图像坐标 (x, y)
                prevKeyPointLocation = self.prevKeyPoints[m.queryIdx].pt   # (x, y) ∈ [0,W]×[0,H]
                currKeyPointLocation = keypoints[m.trainIdx].pt            # (x, y) ∈ [0,W]×[0,H]

                # 计算空间位移向量 (当前帧坐标 - 上一帧坐标)
                # 在刚性运动假设下, 正确的匹配点对位移应在合理范围内
                spatialDistance = (prevKeyPointLocation[0] - currKeyPointLocation[0],
                                   prevKeyPointLocation[1] - currKeyPointLocation[1])

                # 空间距离过滤: 位移绝对值必须小于最大允许值
                if (np.abs(spatialDistance[0]) < maxSpatialDistance[0]) and \\
                        (np.abs(spatialDistance[1]) < maxSpatialDistance[1]):
                    spatialDistances.append(spatialDistance)
                    matches.append(m)

        # ---- Step 6: 基于空间一致性的离群点过滤 ----
        # 计算所有匹配点位移的均值 μ 和标准差 σ
        # spatialDistances → [N_filtered, 2]
        # meanSpatialDistances: [2,] (μ_x, μ_y)
        # stdSpatialDistances:  [2,] (σ_x, σ_y)
        meanSpatialDistances = np.mean(spatialDistances, 0)
        stdSpatialDistances = np.std(spatialDistances, 0)

        # 只保留位移在 μ ± 2.5σ 范围内的匹配点
        # inliesrs: [N_filtered, 2] bool 数组, each row = (|dx-μx|<2.5σx, |dy-μy|<2.5σy)
        # 使用 2.5σ (而非 3σ) 的原因是更好地剔除因前景运动导致的离群匹配
        inliesrs = (spatialDistances - meanSpatialDistances) < 2.5 * stdSpatialDistances

        goodMatches = []
        prevPoints = []  # 上一帧中的匹配点坐标 [N_good, 2]
        currPoints = []  # 当前帧中的匹配点坐标 [N_good, 2]
        for i in range(len(matches)):
            # 要求 x 和 y 方向都在 2.5σ 范围内
            if inliesrs[i, 0] and inliesrs[i, 1]:
                goodMatches.append(matches[i])
                prevPoints.append(self.prevKeyPoints[matches[i].queryIdx].pt)
                currPoints.append(keypoints[matches[i].trainIdx].pt)

        # 转换为 numpy 数组
        # prevPoints: [N_good, 2], currPoints: [N_good, 2]
        prevPoints = np.array(prevPoints)
        currPoints = np.array(currPoints)

        # ---- 调试可视化 (默认关闭) ----
        # 若 0→1: 绘制匹配连线图, 用于调试和论文插图
        if 0:
            # 拼接两帧图像
            matches_img = np.hstack((self.prevFrame, frame))
            matches_img = cv2.cvtColor(matches_img, cv2.COLOR_GRAY2BGR)
            W = np.size(self.prevFrame, 1)
            for m in goodMatches:
                prev_pt = np.array(self.prevKeyPoints[m.queryIdx].pt, dtype=np.int_)
                curr_pt = np.array(keypoints[m.trainIdx].pt, dtype=np.int_)
                curr_pt[0] += W  # 当前帧的关键点 x 坐标需偏移, 因为拼接在右侧
                color = np.random.randint(0, 255, (3,))
                color = (int(color[0]), int(color[1]), int(color[2]))

                matches_img = cv2.line(matches_img, prev_pt, curr_pt, tuple(color), 1, cv2.LINE_AA)
                matches_img = cv2.circle(matches_img, prev_pt, 2, tuple(color), -1)
                matches_img = cv2.circle(matches_img, curr_pt, 2, tuple(color), -1)

            plt.figure()
            plt.imshow(matches_img)
            plt.show()

        # ---- Step 7: RANSAC 刚性变换估计 ----
        # cv2.estimateAffinePartial2D():
        #   估计 Partial Affine (4自由度: 旋转×1 + 缩放×2 + 平移×2) 或
        #   刚性变换 (严格来说 Partial Affine 允许各向异性缩放,
        #   但配置参数 constrain_affine=True 时可约束为非均匀缩放)
        #
        #   参数:
        #     from_ = prevPoints  [N_good, 2]
        #     to_   = currPoints  [N_good, 2]
        #     method = cv2.RANSAC (随机采样一致性, 鲁棒估计)
        #     默认 RANSAC 阈值 = 3.0 像素, 最大迭代 = 2000, 置信度 = 0.99
        #
        #   返回值:
        #     H:        估计的仿射矩阵 [2, 3]
        #     inliers:  内点掩码 [N_good], bool 数组 (RANSAC 认为一致的匹配)
        #
        #   条件: 至少需要 4 对匹配点 (Partial Affine 需要解 4 个参数)
        if (np.size(prevPoints, 0) > 4) and (np.size(prevPoints, 0) == np.size(prevPoints, 0)):
            H, inliesrs = cv2.estimateAffinePartial2D(prevPoints, currPoints, cv2.RANSAC)

            # ---- Step 8: 坐标尺度恢复 ----
            # H 的旋转缩放部分 H[:2, :2] 是无量纲的, 不受下采样影响。
            # 但平移分量 H[:2, 2] 是在降采样后的图像坐标系中计算的,
            # 需要乘以 downscale 才能恢复到原始图像坐标系。
            # 公式: t_orig = t_down × downscale
            if self.downscale > 1.0:
                H[0, 2] *= self.downscale  # x 方向平移恢复
                H[1, 2] *= self.downscale  # y 方向平移恢复
        else:
            print('Warning: not enough matching points')

        # 存储当前帧数据作为下一帧的"上一帧"
        self.prevFrame = frame.copy()
        self.prevKeyPoints = copy.copy(keypoints)
        self.prevDescriptors = copy.copy(descriptors)

        return H
\`\`\`

### step1：Fast角点特征提取

#### 介绍

<img src="https://i-blog.csdnimg.cn/blog_migrate/1855141eaf156f9dc76005381d8e8f61.png" alt="img" style="zoom:67%;" />

[01-fast特征提取_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1wW411M7cP/?)

![image-20260723174705037](GMC%E5%AE%9E%E7%8E%B0.assets/image-20260723174705037.png)

- I(P): 中心点的灰度值
- I(1-16): 周围点的灰度值

FAST（**Features from Accelerated Segment Test**）是一种高效的角点检测算法，由 Edward Rosten 和 Tom Drummond 提出，广泛应用于**目标识别、图像匹配、三维重建**等计算机视觉任务。它通过比较像素与邻域像素的灰度差值来快速判断角点，具有**速度快、重复性高**的特点。

**核心思想**是：在半径为3的Bresenham圆上选取16个像素点，与中心像素比较灰度值，若存在**连续n个像素**（常用n=9或12）灰度值均大于中心值+t或小于中心值−t，则该点为候选角点。

**主要步骤**

1. **分割测试（Segment Test）** 先快速检测圆上1、5、9、13位置的像素，若至少3个满足亮/暗条件，则进入完整检测。 完整检测检查16个像素，判断是否存在连续n个满足条件的像素点
2. **ID3决策树分类** 将像素分为darker、similar、brighter三类，利用信息增益选择最优像素位置构建决策树，提高检测效率
3. **非极大值抑制（NMS）** 计算角点响应值（中心与邻域差值绝对值之和），保留局部最大值，去除冗余角点。



> 为什么角点能作为特征点

**两个核心原因：**

1. **好找** — 灰度变化剧烈，算法能快速定位
2. **不认错** — 周围纹理唯一，匹配时不易混淆

**对比其他区域：**

| 区域     | 问题                         |
| -------- | ---------------------------- |
| 平坦区   | 没变化，定位不了             |
| 边缘     | 只能定一个方向，会滑动       |
| **角点** | **多个方向都变，能精确定位** |

角点 = 图像里**最容易认、最不会搞错**的位置

#### 示例代码

**OpenCV 的 FAST 特征检测器要求输入必须是灰度图**（单通道 8-bit 图像）

\`\`\`python
import cv2
import sys
import os

# ---- 读取图像 ----
# img_bgr: [H, W, 3], BGR 彩色图, 用于最终展示
# img_gray: [H, W], uint8, 灰度图, FAST 算法只处理单通道
path = os.path.join(
    r'E:\\ai\\dy\\DATASET\\mot\\MOT17\\train\\MOT17-13-FRCNN\\img1', '000400.jpg')
img_bgr = cv2.imread(path, cv2.IMREAD_COLOR)
img_gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

# ---- 创建 FAST 特征检测器 ----
# threshold: 中心像素 p 与周围 16 个像素的亮度差阈值, 值域 [0, 255]
#   判定规则: 若圆周上连续 N 个像素都比 p 亮 (差值 > threshold)
#            或比 p 暗 (差值 < -threshold), 则 p 是角点
#   阈值越大 → 要求亮度差越显著 → 检测到的角点越少 (更严格的角点)
#   阈值越小 → 对微弱亮度变化也敏感 → 角点越多 (含更多噪声)
#   FAST 通常会额外排除低对比度假响应
# nonmaxSuppression: 是否启用非极大值抑制, 消除空间上过于密集的冗余角点
fast = cv2.FastFeatureDetector_create(threshold=100, nonmaxSuppression=True)

# ---- 检测关键点 ----
# 返回 list[cv2.KeyPoint], 每个 KeyPoint 含 .pt=(x, y), .response (角点强度)
keypoints = fast.detect(img_gray, None)

# ---- 在彩色原图上绘制关键点 ----
# color=(255, 0, 0) → BGR 蓝色圆点
# 注意: FAST 算法本身只处理灰度图, 这里用彩色图展示以便清晰区分角点
output_img = cv2.drawKeypoints(img_bgr, keypoints, None, color=(255, 0, 0))

# ---- 显示结果 ----
# Print all default params
print("Threshold: ", fast.getThreshold())
print("nonmaxSuppression: ", fast.getNonmaxSuppression())
print("neighborhood: ", fast.getType())
print("Total Keypoints with nonmaxSuppression: ", len(keypoints))
print("注意: 展示的是原彩色图; FAST 算法本身只处理单通道灰度图 (img_gray)")

cv2.imshow('FAST Keypoints', output_img)
cv2.waitKey(0)
cv2.destroyAllWindows()

\`\`\`



### Step 2: ORB描述子计算

#### 原理

[【转载】ORB特征原理（浅显易懂） - 简书](https://www.jianshu.com/p/9ee6b2145eaa)

[【07】特征匹配算法：ORB算法深度解析与实现 - 知乎](https://zhuanlan.zhihu.com/p/1972439177409831202)

ORB的核心是**Oriented FAST（带方向的FAST关键点检测）**与**Rotated BRIEF（旋转的BRIEF描述符）**的组合，前者解决"在哪里找特征"的问题，后者解决"如何描述特征"的问题

> fast缺陷

\`优势：\`

**速度极快**（可跳过非候选像素）

\`但存在两大致命缺陷：\` 

- **无尺度不变性**：无法处理图像缩放导致的特征尺寸变化（比如同一物体缩小后，原关键点可能不再被检测到
-  **无旋转不变性**：对图像旋转敏感（同一特征旋转后，邻域像素的灰度关系被破坏，导致误判）。

\`改进\`

==**尺度不变性：图像金字塔**==

1. ORB通过**构建多层图像金字塔**，在不同尺度的图像上独立检测 FAST 关键点，从而覆盖不同大小的特征：
2. 对原始图像进行下采样（比如缩放因子 \`scaleFactor=1.2\`），生成 \`nlevels\` 层金字塔（层数越多，尺度覆盖越全）；
3. 在每层图像上检测 FAST 关键点，不同层的关键点对应不同尺度的特征；
4. 将各层关键点映射回原始图像尺度，实现跨尺度的特征匹配。

==**旋转不变性：灰度质心法**==

为每个关键点分配**主方向**，让描述符能适应图像旋转。计算步骤如下：

1. 在关键点周围定义一个 31×31 的邻域窗口；
2. 计算窗口内的**灰度质心**（灰度加权的几何中心）：

​		$$C_x = \\frac{\\sum x \\cdot I(x,y)}{\\sum I(x,y)}, \\quad C_y = \\frac{\\sum y \\cdot I(x,y)}{\\sum I(x,y)}$$

​		其中 $I(x,y)$ 是像素 $(x,y)$ 的灰度值；

3. 关键点中心 $(O_x, O_y)$ 到质心 $(C_x, C_y)$ 的向量方向即为**主方向**：

​		$$\\theta = \\arctan2(C_y - O_y, C_x - O_x)$$

> BRIEF

\`2.1计算特征描述子\`

得到特征点后我们需要以某种方式描述这些特征点的属性。这些属性的输出我们称之为该特征点的描述子（Feature Descritors）.ORB采用BRIEF算法来计算一个特征点的描述子。BRIEF算法的**核心思想**是在关键点P的周围以一定模式选取N个点对，把这N个点对的比较结果组合起来作为描述子。

![image-20260723200323624](GMC%E5%AE%9E%E7%8E%B0.assets/image-20260723200323624.png)

![image-20260723191148923](GMC%E5%AE%9E%E7%8E%B0.assets/image-20260723191148923.png)

\`2.2理想的特征点描述子应该具备的属性\`

在现实生活中，我们从不同的距离，不同的方向、角度，不同的光照条件下观察一个物体时，物体的大小，形状，明暗都会有所不同。但我们的大脑依然可以判断它是同一件物体。理想的特征描述子应该具备这些性质。即，在大小、方向、明暗不同的图像中，同一特征点应具有足够相似的描述子，称之为描述子的可复现性（鲁棒性）。

当以某种理想的方式分别计算上图中红色点的描述子时，应该得出同样的结果。即描述子应该对\`光照（亮度）不敏感\`，具备\`尺度一致性（大小 ）\`，\`旋转一致性（角度）\`等。



**为保证参考系一致，解决旋转一致性（角度）：**

- ORB在计算BRIEF描述子时建立的坐标系是以关键点为圆心，\`以关键点和取点区域的质心的连线为X轴\`建立二维坐标系。



> 特征点的匹配

ORB算法最大的**特点**就是计算速度快 。 这首先得益于使用FAST检测特征点，FAST的检测速度正如它的名字一样是出了名的快。再次是使用BRIEF算法计算描述子，该描述子特有的*二进制串*的表现形式不仅节约了存储空间，而且大大缩短了匹配的时间。

例如特征点A、B的描述子如下。

A：10101011

B：10101010

我们设定一个阈值，比如80%。当A和B的描述子的相似度大于90%时，我们判断A,B是相同的特征点，即这2个点匹配成功。在这个例子中A,B只有最后一位不同，相似度为87.5%，大于80%。则A和B是匹配的。

我们将A和B进行异或操作就可以轻松计算出A和B的相似度。而异或操作可以借组硬件完成，具有很高的效率，加快了匹配的速度。

![img](https:////upload-images.jianshu.io/upload_images/4324389-7f236c4b2d707ddc.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)



> 改进
>
> https://www.bilibili.com/video/BV1PW411M73t?t=540.3&p=2

![image-20260723200914590](GMC%E5%AE%9E%E7%8E%B0.assets/image-20260723200914590.png)

[ORB特征详解-CSDN博客](https://blog.csdn.net/zouzoupaopao229/article/details/52625678)

原始的BRIEF算法有5种去点对的方法，原文作者使用了方法2。为了解决\`描述子的可区分性和相关性的问题\`，ORB论文中没有使用5种方法中的任意一种，而是使用统计学习的方法来重新选择点对集合。

首先建立300k个特征点测试集。对于测试集中的每个点，考虑其31x31邻域。这里不同于原始BRIEF算法的地方是，这里在对图像进行高斯平滑之后，使用邻域中的某个点的5x5邻域灰度平均值来代替某个点对的值，进而比较点对的大小。这样特征值更加具备抗噪性。另外可以使用积分图像加快求取5x5邻域灰度平均值的速度。

从上面可知，在31x31的邻域内共有(31-5+1)x(31-5+1)=729个这样的子窗口，那么取点对的方法共有M=265356种，我们就要在这Ｍ种方法中选取256种取法，选择的原则是这256种取法之间的相关性最小。怎么选取呢？

1. 在300k特征点的每个31x31邻域内按M种方法取点对，比较点对大小，形成一个300kxM的二进制矩阵Q。矩阵的每一列代表300k个点按某种取法得到的二进制数。
2. 对Q矩阵的每一列求取平均值，按照平均值到0.5的距离大小重新对Q矩阵的列向量排序，形成矩阵T。
3. 将T的第一列向量放到R中。
4. 取T的下一列向量和R中的所有列向量计算相关性，如果相关系数小于设定的阈值，则将T中的该列向量移至R中。
5. 按照4）的方式不断进行操作，直到R中的向量数量为256。

通过这种方法就选取了这256种取点对的方法。这就是rBRIEF算法。










#### 代码

\`\`\`python
from fast import detect, load
import cv2
import os

def orb(gray):
    kps, fast, mask = detect(gray, 20)

    extractor = cv2.ORB_create()
    keypoints, descriptors = extractor.compute(gray, kps)
    # print(keypoints)
    print(descriptors) # (4147, 32)
\`\`\`





### Step 3: KNN 匹配

#### 代码

\`\`\`python
self.matcher = cv2.BFMatcher(cv2.NORM_HAMMING)


knnMatches = self.matcher.knnMatch(self.prevDescriptors, descriptors, 2)


\`\`\`

> 输出

 \`knnMatch\` 返回 **列表的列表**：

\`\`\`
list[list[cv2.DMatch]]
\`\`\`

- 外层列表长度 = \`self.prevDescriptors\` 的行数（查询特征点数量）
- 每个内层列表长度 = \`k = 2\`（最近的 2 个候选匹配）
- 每个元素是 \`cv2.DMatch\` 对象

**\`DMatch\` 三个关键属性：**

| 属性       | 含义                                                      |
| ---------- | --------------------------------------------------------- |
| \`queryIdx\` | 查询描述子索引（对应 \`prevDescriptors\` 中的第几个特征点） |
| \`trainIdx\` | 训练描述子索引（对应 \`descriptors\` 中的第几个特征点）     |
| \`distance\` | 两个描述子之间的距离（越小越相似）                        |







#### 理论

[大白话讲明白最邻近KNN算法（上集）_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1CHeozPEGp/?)

[大白话讲明白最邻近KNN算法（下集）_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1fUedzdEMU?)

> 四种距离的核心区别：

| 距离           | 公式                        | 直观理解     | 适用场景                                        |
| -------------- | --------------------------- | ------------ | ----------------------------------------------- |
| **欧氏**       | $\\sqrt{\\sum(x_i-y_i)^2}$    | 两点间直线   | 连续空间、物理距离                              |
| **曼哈顿**     | $\\sum\\|x_i-y_i\\|$           | 网格路径之和 | 城市街区、高维稀疏数据                          |
| **切比雪夫**   | $\\max\\|x_i-y_i\\|$           | 最大单维差距 | 棋盘移动、最坏情况分析                          |
| **闵可夫斯基** | $(\\sum\\|x_i-y_i\\|^p)^{1/p}$ | 统一框架     | $p=1$→曼哈顿，$p=2$→欧氏，$p\\to\\infty$→切比雪夫 |

\`\`\`python
import numpy as np

def distances(a: np.ndarray, b: np.ndarray, p: int = 2) -> dict:
    """
    计算四种距离
    
    Args:
        a, b: 输入向量，shape: (d,)
        p: 闵可夫斯基距离的阶数，默认2（即欧氏距离）
    
    Returns:
        dict: 各距离值
    """
    diff = np.abs(a - b)  # shape: (d,), 各维度绝对差值
    
    # 曼哈顿距离: L1范数，各维度差值之和
    manhattan = np.sum(diff)
    
    # 欧氏距离: L2范数，差值的平方和开根号
    euclidean = np.sqrt(np.sum(diff ** 2))
    
    # 切比雪夫距离: L∞范数，最大单维度差值
    chebyshev = np.max(diff)
    
    # 闵可夫斯基距离: 通用形式，通过p参数统一以上三种
    # p=1 → 曼哈顿, p=2 → 欧氏, p→∞ → 切比雪夫
    minkowski = np.sum(diff ** p) ** (1 / p)
    
    return {
        "manhattan": manhattan,
        "euclidean": euclidean,
        "chebyshev": chebyshev,
        "minkowski(p={})".format(p): minkowski
    }

# 示例：图中 a=(4,1), b=(1,4)
a = np.array([4.0, 1.0])
b = np.array([1.0, 4.0])

print(distances(a, b, p=3))
# 曼哈顿: 6.0  (|4-1|+|1-4| = 3+3)
# 欧氏: ~4.24  (√(9+9))
# 切比雪夫: 3.0 (max(3,3))
# 闵可夫斯基(p=3): ~3.78
\`\`\`

**一句话总结**：闵可夫斯基是"父类"，$p$ 取不同值时退化为其他三种；选择哪种距离取决于你关心的是"直线最短"、"绕路总和"还是"最大瓶颈"。

<img src="GMC%E5%AE%9E%E7%8E%B0.assets/image-20260724190702241.png" alt="image-20260724190702241" style="zoom: 67%;" />



### Step 4 & 5: Lowe's Ratio Test + 空间距离过滤

> Lowe's Ratio Test

m = 最近邻, n = 次近邻
ratio = m.distance / n.distance
若 ratio < 0.9 则认为 m 是可靠匹配

**物理意义:** 

1. 若两匹配距离接近 (ratio≈1), 则该点的描述子在当前帧，中存在多个相似候选, 匹配不可靠; 
2. 只有最近邻显著优于次近邻时,该匹配才具有判别性



>

\`\`\`python
matches = []           # 通过 ratio test 的匹配列表
spatialDistances = []  # 对应匹配点的空间位移向量 [(dx, dy), ...]

# 最大允许的空间位移 = 0.25 × 图像尺寸，相邻帧之间同一点的位移超过图像 1/4 即为异常
maxSpatialDistance = 0.25 * np.array([width, height])

# 处理空匹配: 无匹配点则退回单位矩阵
if len(knnMatches) == 0:
    self.prevFrame = frame.copy()
    self.prevKeyPoints = copy.copy(keypoints)
    self.prevDescriptors = copy.copy(descriptors)
    return H


for m, n in knnMatches:
    
    if m.distance < 0.9 * n.distance:
        # 提取匹配点在两帧中的图像坐标 (x, y)
        prevKeyPointLocation = self.prevKeyPoints[m.queryIdx].pt   # (x, y) ∈ [0,W]×[0,H]
        currKeyPointLocation = keypoints[m.trainIdx].pt            # (x, y) ∈ [0,W]×[0,H]
        # 计算空间位移向量 (当前帧坐标 - 上一帧坐标)
        # 在刚性运动假设下, 正确的匹配点对位移应在合理范围内
        spatialDistance = (prevKeyPointLocation[0] - currKeyPointLocation[0],
                           prevKeyPointLocation[1] - currKeyPointLocation[1])
        # 空间距离过滤: 位移绝对值必须小于最大允许值
        if (np.abs(spatialDistance[0]) < maxSpatialDistance[0]) and \\
                (np.abs(spatialDistance[1]) < maxSpatialDistance[1]):
            spatialDistances.append(spatialDistance)
            matches.append(m)
\`\`\`



### Step 6: 空间一致性过滤 (std-based outlier removal)







### Step 7： RANSAC 刚性变换估计

[2分钟了解RANSAC算法_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV19SW3erEy2/?)







#### 理论

> 估计方法

\`getAffineTransform\` 是**代数精确解**，\`estimateAffinePartial2D\` 是**统计鲁棒估计**

> cv2.estimateAffinePartial2D(): 估计部分二维仿射变换

\`OpenCV3.4.1\`中提供的接口为：[estimateAffinePartial2D()](https://docs.opencv.org/3.4.1/d9/d0c/group__calib3d.html#ga27865b1d26bac9ce91efaee83e94d4dd)，用于计算两个2D点集之间具有4个自由度的最优有限仿射变换。

**自由度 = 变换里能独立调节的参数个数。**

\`estimateAffinePartial2D()\` 做的是**相似变换**（旋转+等比缩放+平移），矩阵只有 4 个独立参数，所以叫"4个自由度"。

一般仿射变换有 6 个自由度（多了非等比缩放和剪切），对比如下：

\`\`\`python
import numpy as np

"""
一般 2D 仿射变换: 6 个自由度
[ a  b  tx ]   # a,b,c,d 控制旋转、缩放、剪切 (4个参数)
[ c  d  ty ]   # tx,ty 控制平移 (2个参数)
               # 总计: 6 个自由度

estimateAffinePartial2D 约束后: 4 个自由度
[ s*cosθ  -s*sinθ  tx ]   # s: 统一缩放 (1个)
[ s*sinθ   s*cosθ  ty ]   # θ: 旋转角度 (1个)
                          # tx,ty: 平移 (2个)
                          # 总计: 4 个自由度
"""
# 4自由度变换示例: 旋转30°、放大2倍、平移(10,20)
theta = np.deg2rad(30)
s = 2.0
M = np.array([
    [s*np.cos(theta), -s*np.sin(theta), 10],
    [s*np.sin(theta),  s*np.cos(theta), 20]
])
# 结果: 形状保持，只改变位置、角度、大小，不会拉扁或扭曲
\`\`\`

**一句话总结：** 自由度越少，变换的约束越强，形状保真度越高。\`estimateAffinePartial2D\` 用 4 个自由度强制"只转、只缩、只移"，不允许图像被拉斜。

**接口：**

\`\`\`cpp
cv::Mat cv::estimateAffinePartial2D(
    // 源点集: N×2 (CV_32F/CV_64F) 或 N×1×CV_32FC2
    // 内部 reshape 为 N×1 的 Point2f 向量
    InputArray from,

    // 目标点集: 必须与 from 同尺寸、同点数 N
    // from[i] 经变换后应映射到 to[i]
    InputArray to,

    // 输出内点掩码: N×1 CV_8U, 1=内点 0=外点
    // 不需要时传 noArray()
    OutputArray inliers = noArray(),

    // 鲁棒估计方法: RANSAC(默认,需阈值) 或 LMEDS(无需阈值,较慢)
    int method = RANSAC,

    // RANSAC 重投影误差阈值 (像素)
    // 变换后距离² > 阈值² 判为外点; 仅 RANSAC 生效
    double ransacReprojThreshold = 3,

    // RANSAC/LMeDS 最大迭代次数上限
    // 实际迭代数会由内点率动态缩减
    size_t maxIters = 2000,

    // 置信度 (0,1): 至少有一次抽样全为内点的概率
    // 越高则迭代越多, 默认 0.99
    double confidence = 0.99,

    // Levenberg-Marquardt 精修迭代次数
    // 基于内点子集做非线性优化; 0=跳过精修
    size_t refineIters = 10
);
\`\`\`

> 工作流程

1. **随机抽样**
   - 随机选择一小部分数据点，尝试用它们拟合一个模型 
2. **检查一致性**
   - 会检查哪些数据点符合这个模型，符合模型的被称为“内点”，不符合就是“外点”，
3. **重复迭代**
   - 接着RANSAC重复这个过程多次，每次都可能找到更好的模型，如果某次迭代找到了有大量\`内点\`的模型，update为best
4. **选择最佳模型**
   - 如果内点数量超过一个阈值，则认为找到了一个有效的模型。
   - 重复步骤1-4，直到找到满足条件的模型或达到最大迭代次数。



<img src="GMC%E5%AE%9E%E7%8E%B0.assets/image-20260728184919703.png" alt="image-20260728184919703" style="zoom:67%;" />

[LM算法探讨(附python代码) - litecdows - 博客园](https://www.cnblogs.com/litecdows/p/Levenberg_Marquardt.html)

| RANSAC 粗解                     | LM 精修              |
| ------------------------------- | -------------------- |
| 只用 **2 对随机点**             | 用 **全部内点**      |
| 抗噪声强，但对那 2 个点"过拟合" | 最小二乘，整体最优   |
| 浪费了大量内点信息              | 充分利用所有可靠数据 |

> 补充

[RANSAC、ICP算法及其变种一次性打包带走！！！_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1ri421Z7i7/?)

![image-20260728183148110](GMC%E5%AE%9E%E7%8E%B0.assets/image-20260728183148110.png)

<img src="GMC%E5%AE%9E%E7%8E%B0.assets/image-20260728183402500.png" alt="image-20260728183402500" style="zoom: 50%;" />





#### 代码

\`\`\`python
# ---- Step 7: RANSAC 刚性变换估计 ----
# cv2.estimateAffinePartial2D():
#   估计 Partial Affine (4自由度: 旋转×1 + 缩放×2 + 平移×2) 或
#   刚性变换 (严格来说 Partial Affine 允许各向异性缩放,
#   但配置参数 constrain_affine=True 时可约束为非均匀缩放)
#
#   参数:
#     from_ = prevPoints  [N_good, 2]
#     to_   = currPoints  [N_good, 2]
#     method = cv2.RANSAC (随机采样一致性, 鲁棒估计)
#     默认 RANSAC 阈值 = 3.0 像素, 最大迭代 = 2000, 置信度 = 0.99
#
#   返回值:
#     H:        估计的仿射矩阵 [2, 3]
#     inliers:  内点掩码 [N_good], bool 数组 (RANSAC 认为一致的匹配)
#
#   条件: 至少需要 4 对匹配点 (Partial Affine 需要解 4 个参数)
if (np.size(prevPoints, 0) > 4) and (np.size(prevPoints, 0) == np.size(prevPoints, 0)):
    H, inliesrs = cv2.estimateAffinePartial2D(prevPoints, currPoints, cv2.RANSAC)
    # ---- Step 8: 坐标尺度恢复 ----
    # H 的旋转缩放部分 H[:2, :2] 是无量纲的, 不受下采样影响。
    # 但平移分量 H[:2, 2] 是在降采样后的图像坐标系中计算的,
    # 需要乘以 downscale 才能恢复到原始图像坐标系。
    # 公式: t_orig = t_down × downscale
    if self.downscale > 1.0:
        H[0, 2] *= self.downscale  # x 方向平移恢复
        H[1, 2] *= self.downscale  # y 方向平移恢复
else:
    print('Warning: not enough matching points')
# 存储当前帧数据作为下一帧的"上一帧"
self.prevFrame = frame.copy()
self.prevKeyPoints = copy.copy(keypoints)
self.prevDescriptors = copy.copy(descriptors)
return H
\`\`\`









`;export{n as default};
