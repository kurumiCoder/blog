const n=`



# 目标检测

[DETR 论文精读【论文精读】_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1GB4y1X72R/?spm_id_from=333.788.recommend_more_video.0&trackid=web_related_0.router-related-2479604-fjzqj.1776670408052.283&vd_source=a97555db7a704882626ff6b3dff1617c)

[YOLOv2算法原理讲解（通俗易懂版）-秋缒-稍后再看-哔哩哔哩视频](https://www.bilibili.com/list/watchlater?oid=114426283954244&bvid=BV1cPG9zeEXN&spm_id_from=333.788.top_right_bar_window_view_later.content.click&vd_source=a97555db7a704882626ff6b3dff1617c)

[YOLOv1 to YOLOv11: A Comprehensive Survey of Real-Time Object Detection Innovations and Challenges](https://arxiv.org/pdf/2508.02067)





## 综述

[计算机视觉目标检测综述_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1FxwAe6Een/?spm_id_from=333.337.search-card.all.click&vd_source=a97555db7a704882626ff6b3dff1617c)

[[1905.05055\\] 20年中的物体探测：一项综述 --- [1905.05055] Object Detection in 20 Years: A Survey](https://ar5iv.labs.arxiv.org/html/1905.05055?_immersive_translate_auto_translate=1)

[(29 封私信 / 82 条消息) 文献阅读：目标检测模型综述 - 知乎](https://zhuanlan.zhihu.com/p/1906034788525143984)

[一文搞懂目标检测技术的发展历程: 从R-CNN到YOLO、DETR、DINO_目标检测发展历程-CSDN博客](https://blog.csdn.net/weixin_43826536/article/details/142852987)

[从YOLOv1到YOLOv13，再到YOLO26 - 实践 - ljbguanli - 博客园](https://www.cnblogs.com/ljbguanli/p/19149387)

[代码解读 1：一起读 Ultralytics 库工程化的 YOLO 代码 (rt-detr, v3, v5, v6, v8, v9, v10, v11)_rtdetrv3代码-CSDN博客](https://blog.csdn.net/weixin_41782172/article/details/144196868)

### 目标检测的定义

#### 定义

![image-20260420145246813](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420145246813.png)



 ![image-20260420161218766](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420161218766.png)

![image-20260420161407472](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420161407472.png)



#### 主要困难和挑战

1. 目标的
   1. 尺寸不同
   2. 位置各异
   3. 角度随机
2. 背景光照不足
3. 目标存在遮挡
4. 目标尺寸较小
5. 模糊目标检测

#### 计算评价指标

> 分类

![image-20260423175618481](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423175618481.png)

1.  **Accuracy (准确率)：**
    *   **用途：** 看整体猜对的比例。
    *   **局限：** 如果样本极度不平衡（比如1000个人里只有1个病人），模型只要全猜“没病”，准确率就有99.9%，但这模型其实是个废物。所以**不能只看这个**。

2.  **Recall (召回率/查全率)：**
    
    * $\\frac{TP}{TP + FN}$
    
    * **公式含义：** 所有**真正的**正例里，你找出来了多少？（分母是 A+B，即所有真实正例）。
    
    * **有什么用：** 用于**“宁可错杀，不可放过”**的场景。
    
    * **例子：** **癌症筛查**。漏掉一个病人（B，假阴性）后果很严重，所以我们要尽可能把所有病人都找出来，哪怕误报几个健康人也没关系。
    
      
    
3.  **Precision (精确率/查准率)：**
    *   **公式含义：** 你**预测为**正例的里面，有多少是真的？（分母是 A+C，即所有预测为正例）。
    *   **有什么用：** 用于**“宁可放过，不可错杀”**的场景。
    *   **例子：** **垃圾邮件拦截**。如果把重要邮件误判为垃圾邮件（C，假阳性），用户会投诉。所以我们希望只要被拦截的，大概率真的是垃圾邮件。

4.  **F (F1-Score)：**
    *   **用途：** 当 Recall 和 Precision 互相矛盾（一个高一个低）时，用这个指标来**综合评估**模型的整体平衡能力。它是两者的调和平均数。

**总结：**
*   想**找全**（怕漏），看 **Recall**。
*   想**找对**（怕误报），看 **Precision**。
*   想**看个大概**（且样本均匀），看 **Accuracy**。
*   想**综合打分**，看 **F1**。





> 定位

![image-20260420151307624](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420151307624.png)

![image-20260420151428258](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420151428258.png)

GIOU（）

DIOU

CIOU

EIOU

> 综合AP和mAP
>
> [深度学习基础 ｜目标检测 评价指标 ：AP、mAP_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1XHTwzhE1V?spm_id_from=333.788.videopod.sections&vd_source=7c80b45db24957a2b65378295c17ea23)

![image-20260423170359862](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423170359862.png)



**例如\`狗\`分类**

- **step1**：判断匹配情况，这部分计算参考代码：Ultralytics中的\`match_predictions\`方法，用于判断\`预测框\`和\`真实框\`的匹配情况

  - (1) 计算相同类别所有匹配的IoU值，以下以类别为dog进行举例

    <img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423173629476.png" alt="image-20260423173629476" style="zoom: 50%;" />

  - (2) 将IoU < IoU_threshold的匹配 删除，并将剩下的匹配按照IoU降序排列

    <img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423173812100.png" alt="image-20260423173812100" style="zoom: 67%;" />

  - (3) 按照顺序，依次先删除重复被匹配的预测框，再删除重复匹配的真实框

    <img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423173930167.png" alt="image-20260423173930167" style="zoom: 50%;" />

  - (4) 列出所有的预测框，判断他们的匹配情况，gt_num = 2

    <img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423174035973.png" alt="image-20260423174035973" style="zoom:50%;" />

  - (5) 按照同样的操作，计算其他的图片

    ![image-20260423174144493](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423174144493.png)

- **step2**：将所有图片中的该类别的所有预测框，都归纳在一起，并按照confidence降序排列

  - <img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423174610682.png" alt="image-20260423174610682" style="zoom: 67%;" />

- **step3**：依次将Confidence设置为阈值，统计TP、FP、FN，并计算\`Precision\`和\`Recall\`，参照Ultralytics中的\`ap_per_class\`方法

  ![image-20260423174734301](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423174734301.png)

  <img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423175053903.png" alt="image-20260423175053903" style="zoom: 67%;" />

- **step4**：绘制P-R曲线，[注意：为了得到单调不升的P-R曲线，需将每个precision值替换为该点及右侧所有precision的最大值]

  ![image-20260423181005352](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423181005352.png)

- ![image-20260423181310841](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423181310841.png)

  ![image-20260423181716715](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423181716715.png)

----

mAP

![image-20260423182442138](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423182442138.png)

  ![image-20260423182522424](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423182522424.png)

  

  

  





#### 常用数据集及其格式

![image-20260420154413927](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420154413927.png)

![image-20260420154511089](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420154511089.png)

![image-20260420154622140](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420154622140.png)

### 传统实现方法

![image-20260420155029654](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420155029654.png)

![image-20260420155825378](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420155825378.png)

> VOC2007

| 路径层级             | 含义                    |
| -------------------- | ----------------------- |
| \`VOCdevkit/VOC2007/\` | 数据集根目录            |
| \`ImageSets/Main/\`    | 存放数据划分索引        |
| \`trainval.txt\`       | 训练+验证集的图片ID列表 |
| Annotations/....xml  | 标注数据                |

\`\`\`xml
<annotation>                              <!-- 标注文件根节点 -->
	<folder>VOC2007</folder>              <!-- 数据集文件夹名 -->
	<filename>000001.jpg</filename>       <!-- 对应的图片文件名 -->
	<source>                              <!-- 图片来源信息 -->
		<database>The VOC2007 Database</database>  <!-- 所属数据库 -->
		<annotation>PASCAL VOC2007</annotation>    <!-- 标注规范版本 -->
		<image>flickr</image>                      <!-- 图片来源平台 -->
		<flickrid>341012865</flickrid>             <!-- Flickr 图片唯一ID -->
	</source>
	<owner>                               <!-- 图片所有者信息 -->
		<flickrid>Fried Camels</flickrid> <!-- 作者Flickr用户名 -->
		<name>Jinky the Fruit Bat</name>  <!-- 作者昵称/真名 -->
	</owner>
	<size>                                <!-- 图片尺寸 -->
		<width>353</width>                <!-- 宽度（像素） -->
		<height>500</height>              <!-- 高度（像素） -->
		<depth>3</depth>                  <!-- 通道数：3=RGB彩色，1=灰度 -->
	</size>
	<segmented>0</segmented>              <!-- 是否用于语义分割：0=否，1=是 -->
	<object>                              <!-- 第一个目标对象（狗） -->
		<name>dog</name>                  <!-- 类别名称：狗 -->
		<pose>Left</pose>                 <!-- 朝向：Left=朝左 -->
		<truncated>1</truncated>          <!-- 是否被边缘截断：0=完整，1=截断 -->
		<difficult>0</difficult>          <!-- 是否难识别：0=容易，1=困难 -->
		<bndbox>                          <!-- 边界框坐标 -->
			<xmin>48</xmin>               <!-- 左上角 x 坐标 -->
			<ymin>240</ymin>              <!-- 左上角 y 坐标 -->
			<xmax>195</xmax>              <!-- 右下角 x 坐标 -->
			<ymax>371</ymax>              <!-- 右下角 y 坐标 -->
		</bndbox>
	</object>
	<object>                              <!-- 第二个目标对象（人） -->
		<name>person</name>               <!-- 类别名称：人 -->
		<pose>Left</pose>                 <!-- 朝向：朝左 -->
		<truncated>1</truncated>          <!-- 被边缘截断 -->
		<difficult>0</difficult>          <!-- 容易识别 -->
		<bndbox>                          <!-- 边界框坐标 -->
			<xmin>8</xmin>                <!-- 左上角 x -->
			<ymin>12</ymin>               <!-- 左上角 y -->
			<xmax>352</xmax>              <!-- 右下角 x（接近图片右边缘） -->
			<ymax>498</ymax>              <!-- 右下角 y（接近图片下边缘） -->
		</bndbox>
	</object>
</annotation>
\`\`\`





### 深度学习实现方法

![image-20260420155321112](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420155321112.png)



### 与大模型结合



### 未来发展



## 双阶段-RCNN



[经典必读之R-CNN论文复现 - Heywhale.com](https://www.heywhale.com/mw/project/69e5ecb5086b816cee0a1a2d)

https://www.bilibili.com/video/BV1au411r7DE?t=119.8



![image-20260420171615027](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420171615027.png)

![image-20260420181529643](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420181529643.png)

![image-20260420172412138](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420172412138.png)







![image-20260420172514156](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420172514156.png)

![image-20260420174916816](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420174916816.png)

1. **第四步（RoI Pooling）**：把大小不一的候选框，通过池化操作变成**固定尺寸的特征向量**，供后续全连接层使用。
2. **"映射到特征图"**：就是把原图上的候选框坐标，**按CNN的下采样倍率（如16倍）等比例缩小**，定位到缩小后的特征图上。

**核心逻辑**：原图坐标 → 按比例缩小 → 特征图坐标 → 池化统一尺寸 → 输入分类器。

![image-20260420180614989](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420180614989.png)

> 

**概念**
- **多阶段（通常指两阶段）**：先通过算法（如Selective Search/RPN）生成候选框，再对候选框做分类和边界框回归。
- **单阶段**：取消候选框生成步骤，网络直接在特征图上滑动/密集采样，一步输出类别和坐标。

**核心区别**
是否包含独立的**候选区域生成**步骤。

**对比**
| 维度     | 单阶段                    | 多阶段                           |
| :------- | :------------------------ | :------------------------------- |
| **速度** | 快（端到端，适合实时）    | 慢（两步流水线）                 |
| **精度** | 略低（小目标/密集场景弱） | 高（候选框预筛选，定位准）       |
| **结构** | 简洁，直接回归            | 复杂，特征提取→区域生成→分类回归 |

**代表算法**
- 单阶段：YOLO系列、SSD、RetinaNet
- 多阶段：Fast/Faster R-CNN、Mask R-CNN

**选型**：要速度/部署简单选单阶段；要高精度/复杂场景选多阶段。



### 论文

https://www.bilibili.com/video/BV1CZ4y1a7NP?t=144.1

#### 摘要 + 引言

> 背景

当时主流的机械学习的发展处在瓶颈，流程如下

![image-20260420183335271](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420183335271.png)

从2012年CNN在图像分类任务上的成功引出本文思路

> 摘要

1. 目标检测的传统思路发展受限
2. 本文提出新方法R-CNN
   1. 具有两大特点
      1. 使用CNN替换传统的特征提取方法
      2. 由于当时该领域的数据集比较少，所以采用了微调来提升效果
   2. 两个问题需要解决
      1. 如何用cnn定位目标
      2. 标注数据太少
         - 图片分类ImageNet（大）
         - 目标检测PASCAL VOC（小）

> 问题1
>
> *但是定位目标却是其他算法实现的与CNN关系不大*

思路：

- **把\`定位坐标\`当做回归问题，直接预测这些坐标**
  - 已经有前人实验过了，效果不好（只是这个人，不代表真的不行，YOLO就用回归做的）
- **使用滑动窗口进行检测**
  - 在输入图片上使用特定大小或者特定比例的一个滑动窗口来，在图像上不断的进行滑动。然后对于每滑动到的每一个区域，我们利用一个浅层的卷积神经网络来进行预测
    - 但是这种方法呢通常只适用于待检测对象是人脸或者是行人这种具有特定比例的待检测对象，并且所使用的卷积神经网络是一个比较浅的卷积神经网络
    - 但是作者想使用的是当时在图像分类任务上效果比较好的一个比较深的。
- **基于区域Regions进行识别**
  - ![image-20260420192718412](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420192718412.png)



[^回归]:	**回归**在深度学习中就是**预测一个具体的数字**

> 问题2

思路：

1. 无监督预训练 + 有监督微调
2. ✅️**一个大型辅助数据集 (ILSVRC）**做有监督预训练 + 小数据集(PASCAL)微调



#### 模块设计

- **Region Proposals**：产生一系列的候选区域
  - 使用Selective search
  - 最终送入模型的框的大小比算法得出的要大一点，为了避免边缘信息缺失
- **Feature extraction**：使用AlexNet获取特征向量
- **Linear(4096, x)**：使用特定分类的SVM对区域进行分类 

227 * 227 * 3



[^SVM]: 一种传统机器学习算法，核心是找“最大间隔分界面”，求解时用到了凸优化（二次规划），没有“层”的概念。

> 图片缩放，本文采用D

 ![image-20260420203255342](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420203255342.png)

#### 测试流程

1. selective seach 生成候选框
2. 缩放到227*227
3. cnn
4. 二分类svm，对每一个类别情况进行判断

> 高效在哪

1. CNN的所有参数是可以跨类别共享的
2. 特征维数小为4096
   1. ![image-20260420203914532](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420203914532.png)
3. 用矩阵乘法使得分类快速判断





#### 训练流程

\`训练内容\`：

1. cnn权重
   1. 在ImageNet大数据集进行有监督的预训练得到一个图片分类模型
   2. VOC上微调，改分类头（改成20 + 1类）
      1. VOC标注了框和其代表的类别，那如何用这样的数据训练分类模型
         - 根据==框==来==截取图片==
           - IoU正负样本https://www.bilibili.com/video/BV1CZ4y1a7NP?t=1600.0
2. svm
   1. 完全对的上的框作为\`正样本\`
   2. IoU<0.3的作用\`负样本\`








#### 实验结果 & 消融实验



![image-20260420222806817](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420222806817.png)

最后选择的fc输出位置，影响结果	

![image-20260420223941465](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420223941465.png)

微调过后，几乎能提升所有类型（被遮挡等等因素）数据的最低和最高精度

且对==因素==所造成的影响更不敏感

![image-20260420223047893](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420223047893.png)

模型越深越好，vgg > alexnet



#### 误差分析

https://www.bilibili.com/video/BV1CZ4y1a7NP?t=2561.6

大部分误差是因为LoC（分类对，定位错）

<img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420223511964.png" alt="image-20260420223511964" style="zoom:67%;" />

> 所以后续提出R-CNN BB，也就是框回归

==前提==

前提条件是：**候选框与真实框的 IoU（交并比）≥ 设定阈值**（通常为 0.5），即被判定为**正样本（前景）**。

- **不是全部框都做回归**：只有正样本参与回归损失计算；负样本（背景）只参与分类损失，回归分支被忽略（或设为0）。
- **不需要“分类已对”**：分类和定位是**联合多任务训练**的。网络不依赖分类结果来决定是否回归，只要 IoU 够高，就认为它“大概率框住了目标”，直接强制它向对应的真实框回归。
- **实际规则**：每个预测框只回归到与其 IoU 最大的那个真实框；若 IoU < 阈值，直接当背景处理，不做坐标微调。



==流程==

框回归是解决这样的一个问题：已知一个不准确的位置，我们需要预测出一个准确的位置。

![image-20260420224645599](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420224645599.png)

\`\`\`properties
P: 预测
G: 真实
\`\`\`

为什么不直接用![image-20260420225913198](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420225913198.png)



![image-20260420225851770](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420225851770.png)

这是 **Bounding Box Regression（边界框回归）** 的原理演示。

**1. 为什么黄框不是绿框？（直接原因）**
*   **有误差：** 神经网络预测不准。
*   **机制：** 模型不直接预测坐标，而是预测**相对于红框（Anchor）的偏移量**。
    *   **公式：** \`黄框 = 红框 + 预测偏移量\`
    *   **左图：** 真实需要偏移 **50**，模型预测偏移 **52**。多了2个像素，所以黄框偏了。
    *   **右图：** 真实需要偏移 **25**，模型预测偏移 **26**。多了1个像素，所以黄框偏了。

**2. 这张图想说明什么？（深层含义）**
这张图展示了**为什么要对偏移量进行归一化**（这是R-CNN/Fast R-CNN的关键改进）：

*   **左图（大目标）：** 偏移量大（50），预测误差是 **2**。Loss = $(52-50)^2 = \\mathbf{4}$。
*   **右图（小目标）：** 偏移量小（25），预测误差是 **1**。Loss = $(26-25)^2 = \\mathbf{1}$。

**结论：** 如果不处理，大框的 Loss 会比小框大，导致网络只顾着修大框，忽略小框。
**改进方法：** 将预测的偏移量 **除以红框的宽高**（归一化）。这样无论框多大，同样的相对位置误差，Loss 都是一样的。



#### 总结

R-CNN流程分训练与推理两部分：

训练（三步独立进行）：
1. CNN微调：Selective Search提2000框，IoU≥0.5为正，<0.5为负，缩放至227×227输入CNN微调。
2. SVM分类：用微调后CNN提特征，IoU≥0.3为正，<0.3为负，为每类训练一个二分类SVM。
3. 框回归：仅用IoU≥0.5的正样本，计算到真实框的归一化偏移量，为每类训练线性回归器。

推理：
1. 提框：Selective Search生成约2000候选框。
2. 特征：缩放后过CNN提取特征。
3. 分类：SVM打分，筛出正类框。
4. 回归：调用对应类别的回归器微调坐标。
5. NMS：按类去重重叠框，输出结果。

核心：训练分模块独立优化；推理先分类、后回归、最后去重。



## 单阶段-YOLO

<img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260420151625344.png" alt="image-20260420151625344" style="zoom:50%;" />



- YOLOv1：由 Joseph Redmon 等人于 **2016 年** 首次提出，通过单阶段处理图像来提供良好的准确性和速度。第一个YOLO版本为实时应用奠定了基础，为后续开发树立了新标准。
- YOLOv2：或 YOLO9000 在 v1 基础上进行扩展，于 **2017 年** 发布，提高环境运行的分辨率，并能够检测超过 9000 个物体类别，从而增强了其多功能性和准确性。
- YOLOv3：YOLO 模型系列的第三次迭代，于 **2018 年** 发布，以其高效的实时目标检测能力而闻名。通过多尺度预测和更深的网络架构进一步提升了这些功能，从而能够更好地检测较小物体。
- YOLOv4：由 Alexey Bochkovskiy 于 **2020 年** 发布的 YOLOv3 的 darknet 原生更新版本。融合了 CSP 连接和 Mosaic 数据增强等功能。
- YOLOv5：Ultralytics 改进的 YOLO 架构版本，于 **2020 年** 发布，与以前的版本相比，提供了更好的性能和速度权衡。
- YOLOv6：由美团于 **2022 年** 发布，并应用于该公司的许多自动送货机器人中。
- YOLOv7：YOLOv4 的作者于 **2022 年** 发布的更新的 YOLO 模型。仅支持推理。
- YOLOv8：一种多功能模型，于 **2023 年** 发布，具有增强的功能，例如实例分割、姿势/关键点估计和分类。
- YOLOv9：在 Ultralytics YOLOv5 代码库上训练的实验模型，于 **2024 年** 发布，实现了可编程梯度信息 (PGI)。
- YOLOv10：由清华大学于 **2024 年** 开发，具有无 NMS 训练和效率驱动的架构，可提供最先进的性能和延迟。
- YOLOv11：Ultralytics 的 YOLO 系列模型，于 **2024 年** 发布，可在包括检测、分割、姿势估计、跟踪和分类在内的多个任务中提供最先进 (SOTA) 的性能。
- YOLOv12：YOLO 系列首个完全基于注意力机制的目标检测模型，于 **2025 年** 发布。通过引入区域注意力(A²)、残差高效聚合网络(R-ELAN)等创新，在COCO信息集实现58.9% mAP精度和208FPS实时性能。由纽约州立大学布法罗分校和中国科学院大学联合发布。
- YOLOv13：由清华大学等国内各大高校于 **2025 年** 联合发布，在继承 YOLO 系列实时检测优点的基础上，引入了超图增强、高阶语义建模、轻量化结构重构等一系列新机制。
- YOLOv26：Ultralytics 公司发布的 YOLO 系列实时物体检测器的最新产品，于 **2026 年** 发布，专为边缘和低功耗设备而设计。

| Version               | Release (Month–Year) | Author(s)                                                    | Key Architectural Innovations                                | 中文解释                                                     |
| --------------------- | -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| YOLOv1 [8]            | Jun 2016             | Joseph Redmon, Santosh Divvala, Ross Girshick, Ali Farhadi   | Unified one-stage detection; grid-based prediction; direct bounding-box regression | 统一的一阶段检测；基于网格的预测；直接边界框回归             |
| YOLOv2 (YOLO9000) [9] | Dec 2016             | Joseph Redmon, Ali Farhadi                                   | Anchor boxes; Batch Normalization; dimension clustering; passthrough layer | 锚框机制；批量归一化；维度聚类；透传层                       |
| YOLOv3 [10]           | Apr 2018             | Joseph Redmon, Ali Farhadi                                   | Darknet-53 backbone; residual blocks; multi-scale feature prediction | Darknet-53 骨干网络；残差块；多尺度特征预测                  |
| YOLOv4 [11]           | Apr 2020             | Alexey Bochkovskiy, Chien-Yao Wang, Hong-Yuan Mark Liao      | CSPDarknet53; PANet; SPP; bag-of-freebies & bag-of-specials integration | CSPDarknet53；PANet 结构；空间金字塔池化；免费包与特供包技术集成 |
| YOLOv5 [12]           | Jun 2020             | Glenn Jocher (Ultralytics)                                   | PyTorch implementation; CSP bottleneck variants; modular design; auto-anchor | PyTorch 实现；CSP 瓶颈变体；模块化设计；自动锚框             |
| YOLOv6 [13]           | Jun 2022             | Meituan Vision                                               | Anchor-free design; EfficientRep backbone; decoupled head design | 无锚框设计；EfficientRep 骨干网络；解耦检测头                |
| YOLOv7 [14]           | Jul 2022             | Chien-Yao Wang et al.                                        | E-ELAN; re-parameterized convolution; enhanced feature aggregation | E-ELAN 结构；重参数化卷积；增强的特征聚合                    |
| YOLOv8 [2]            | Jan 2023             | Ultralytics                                                  | Fully anchor-free head; decoupled classification/regression; Distribution Focal Loss (DFL) integration | 全无锚框检测头；解耦分类与回归；分布焦点损失集成             |
| YOLOv9 [15]           | Apr 2024             | Chien-Yao Wang et al.                                        | Programmable Gradient Information (PGI) mechanisms; GELAN backbone variants | 可编程梯度信息机制；GELAN 骨干网络变体                       |
| YOLOv10 [6]           | May 2024             | Guangxing Han et al.                                         | NMS-free training; dual label assignment (one-to-many & one-to-one) | 无需 NMS 训练；双标签分配（一对多与一对一）                  |
| YOLOv11 [16]          | Jul 2024             | Ultralytics                                                  | C3k2 blocks; kernel-optimized modules; performance scaling enhancements | C3k2 模块；核优化模块；性能缩放增强                          |
| YOLOv12 [17]          | Feb 2025             | Yunjie Tian, Qixiang Ye, David Doermann                      | Attention-centric design; Area Attention & R-ELAN; optimized attention for real-time inference | 注意力中心化设计；区域注意力与 R-ELAN；面向实时推理的优化注意力 |
| YOLOv13 [3]           | Jun 2025             | Mengqi Lei, Siqi Li, Yihong Wu, Han Hu, You Zhou, Xinhu Zheng, Guiguang Ding, Shaoyi Du, Zongze Wu, Yue Gao | Hypergraph-based Adaptive Correlation Enhancement (HyperACE); Full-Pipeline Aggregation-and-Distribution (FullPAD); depthwise separable blocks | 基于超图的自适应相关性增强；全流水聚合与分布；深度可分离卷积块 |
| YOLO26 [1]            | Jan 2026             | Ultralytics                                                  | SPPF shortcut; PSABlock in final C3k2; removes DFL; dual assignment NMS-free head; Top-K score-based inference; MuSGD Optimizer; ProgLoss + STAL | SPPF 捷径连接；末端 C3k2 中的 PSA 模块；移除 DFL；双分配无 NMS 检测头；基于 Top-K 分数的推理；MuSGD 优化器；渐进损失 + STAL |





### YOLO V1



#### 研究背景与动机

![image-20260421153504435](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260421153504435.png)

- **RCNN系列**（RCNN、Fast R-CNN）是当时目标检测的主流，但流程复杂、速度慢，无法满足实时检测需求
- **YOLOv1 的核心思想**：将整张图片输入一个神经网络，只需"看一次"就能同时预测所有目标的位置和类别，实现端到端的实时检测

R-CNN 精度高是因为"两阶段设计"：

​	第一阶段生成高质量候选框（减少搜索空间、平衡正负样本），
​	第二阶段在精确对齐的特征上做精细分类和回归。

YOLO 虽然速度快，但单阶段的粗粒度网格设计导致定位精度和小物体检测能力天然受限





#### 优缺点

| 特点           | 说明                                                     | 实验                                                         |
| -------------- | -------------------------------------------------------- | ------------------------------------------------------------ |
| **速度快**     | 基础模型每秒45帧，快速版（Fast YOLO）可达155 FPS         | ![image-20260421213131347](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260421213131347.png) |
| **全局推理**   | 基于整张图片提取特征，编码上下文信息，减少背景误检       | ![image-20260421213612939](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260421213612939.png) |
| **泛化能力强** | 在自然图像上训练后，在艺术图片等陌生领域表现远超其他算法 | ![image-20260421214443375](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260421214443375.png) |

像R-CNN它是基于区域候选框去提取特征的，只能去编码区域候选框的信息，而不能去看到更大的背景信息，所以fast r-cnn更容易把背景给误识别成目标

**不足**：精度落后于当时最优检测器，尤其在小目标定位和罕见宽高比目标上表现不佳。 

#### 输入输出

![image-20260422141323961](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260422141323961.png)

\`\`\`python
def integrated_transform(image, label):

    # 1.图片转换规格 => 图片放缩至448*448 + 转Tensor 
    image = image_rescale(image, W, H)

    # 2.标签转换类型 [batch_size, S, S, C + B *5 ]
    label = label_matrix(label, S, B, C)

    return image, label
\`\`\`

在 YOLOv1 的**输入数据（Ground Truth / Label）**制作阶段，**一个 Grid Cell 只能对应一个真实物体（Ground Truth）**。

这是 YOLOv1 的核心限制之一。具体逻辑如下：

1.  **分配原则**：根据真实物体（GT）的**中心点**落在哪个 Grid Cell，该 Cell 就负责预测这个物体。
2.  **冲突处理**：如果**多个**真实物体的中心点都落在了同一个 Grid Cell 内（比如两个挨得很近的小物体），YOLOv1 **只能保留其中一个**（通常保留面积最大的，或者按顺序第一个），**其他的真实物体在这个 Cell 中会被忽略**。
    *   *这也是 YOLOv1 难以检测密集小物体的原因。*
3.  **结论**：
    *   **输入端**：一个 Cell 对应 **1个** 真实框。
    *   **预测端**：一个 Cell 输出 **2个** 预测框。
    *   **匹配**：这 2 个预测框去竞争那 **1个** 真实框（IoU 大的胜出，负责算坐标 Loss）。

> 输出两个框，跟谁比

![image-20260422210929045](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260422210929045.png)



#### 网络结构



![image-20260421155526809](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260421155526809.png)

![image-20260421155752109](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260421155752109.png)

- **输入**：448×448×3 的图像
- **主干**：受 GoogLeNet 启发（前几个月发布），包含 **24个卷积层 + 2个全连接层**
  - 使用大量 **1×1卷积（降维）+ 3×3卷积** 替代复杂的 Inception 模块，提升效率
- **Fast YOLO**：简化为 **9个卷积层**，速度更快但精度略低



>Leaky ReLU

Leaky ReLU（带泄漏的线性整流单元）是一种改进的激活函数，旨在解决标准 ReLU 在负输入时梯度为零导致的“神经元死亡”问题。

其函数定义为：

$\\text{LeakyReLU}(x) = \\begin{cases} 
x, & \\text{if } x > 0 \\\\
\\alpha x, & \\text{if } x \\le 0 
\\end{cases}$

其中 ($\\alpha$) 是一个很小的正数（通常取 0.01 或 0.1），称为泄漏系数。当输入为负时，函数输出一个非零的斜率，从而允许梯度在反向传播中继续更新。

**特点：**

- 保留了 ReLU 在正区间的线性特性，计算简单。
- 负区间不再完全抑制信息，避免了神经元失活。
- 相比 ReLU，训练更稳定，尤其适用于深层网络或梯度稀疏的场景。

**导数：**
$\\frac{d}{dx}\\text{LeakyReLU}(x) = 
\\begin{cases} 
1, & x > 0 \\\\
\\alpha, & x \\le 0 
\\end{cases}$

常见的变体包括 **Parametric ReLU (PReLU)**， 中 ($\\alpha$) 作为可学习参数，以及 **Randomized Leaky ReLU (RReLU)**，其中 \\($\\alpha$) 在训练时随机采样。

#### 检测机制

> 网格划分与标签分配

- 将输入图像划分为 **S×S 网格**（论文中 S=7）
- 若目标中心落在某个网格单元内，该单元负责检测该目标

> 每个网格的预测输出

![image-20260421205809516](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260421205809516.png)

- 每个网格预测 **B 个边界框**（论文中 B=2）和 **C 个类别条件概率（前提是目标包含在box中）**

- 每个边界框包含 **5个值**：x, y, w, h, confidence

  - **x, y**：相对于\`网格单元\`的偏移量（0~1）

    - https://www.bilibili.com/video/BV12vfUBfEeJ?t=1937.9
    - ![image-20260422141828781](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260422141828781.png)

  - **w, h**：相对于整幅图像的归一化宽高（0~1）

    - ![image-20260422142505523](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260422142505523.png)

  - 置信度得分：![image-20260421193749379](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260421193749379.png)

    - **置信度分数反映了模型对盒子包含物体的信心程度，以及它认为盒子预测的准确性。**

      通常，我们将置信度定义为Pr（Object）*IOUe。

      如果该单元格中不存在对象，则置信度得分应为零。

      否则，我们希望置信度得分等于预测框和真实值之间的联合交集（IOU）

- 无论B是多少个，C不变，如《Class probability map》





> 输出张量 	

- 最终输出维度：**S × S × (B×5 + C)**
- VOC数据集（20类）：7×7×30 = **1470个值**



 

#### 训练过程

##### 预训练

- \`前20层卷积层\` + \`平均池化\` + \`全连接层\` 在 **ImageNet** 上预训练（分类任务，224×224输入）
- **微调**：预训练后增加4个卷积层 + 2个全连接层，输入分辨率提升至 **448×448**（检测任务）
  - 论文引用的其他paper证明了这样有效
  - 提升分辨率为了得到更加细粒度的视觉信息 



**YOLOv1 数据集使用情况：**

🔹 **预训练阶段**：
- 使用 **ImageNet 1000类分类数据集** 预训练前20个卷积层，输入尺寸 224×224

🔹 **目标检测训练阶段**：
- 使用 **PASCAL VOC 2007 + 2012** 数据集进行微调
- 输入尺寸调整为 448×448
- VOC数据集包含20个常见物体类别，约16,551张图片

🔹 **评估/测试**：
- 主要在 **PASCAL VOC 2007 test set** 上进行评估
- 泛化性测试使用了 Picasso Dataset 和 People-Art Dataset(艺术领域数据)

🔹 **预测类别**：
- 支持 **20类物体检测**（VOC标准类别：人、车、动物、家具等)
- 每个网格单元最多预测2个边界框

> 简言之：YOLOv1 = ImageNet预训练 + VOC 2007/2012检测微调 + VOC 2007测试。







##### 损失函数

> 总

![image-20260421224246674](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260421224246674.png)

![image-20260421225357562](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260421225357562.png)

![image-20260422214552732](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260422214552732.png)

采用多任务损失，包含：

1. **坐标损失**（x, y, w, h）：使用均方误差，对 w, h 开根号以**增加小目标权重**

2. **置信度损失**：区分有目标（正样本）和无目标（负样本），对无目标损失乘以 

   λ_noobj = 0.5  平衡正负样本

3. **分类损失**：条件类别概率的均方误差

**权重设置**：坐标损失前乘 λ_coord = 5  以提升定位精度



==流程==

方法输入：
\`\`\`properties
predictions = [batch_size, s, s, c + b * 5]
label 	    = [batch_size, s, s, c + b * 5]
\`\`\`

1. **拿到每个cell的两个边界框，并与label计算IoU**

  \`\`\`properties
  iou_b1 = intersection_over_union(predictions[..., 21 : 25], labels[..., 21 : 25])
  iou_b2 = intersection_over_union(predictions[..., 26 : 30], labels[..., 21 : 25])
  ↓↓
  iou_b1: [batch_size, s, s, 1(iou_value)]
  \`\`\`

2. **获取两个中的最大iou的框的下标**

   - max_iou_index = torch.max(ious, dim = 0)

   - max_iou_index: [batch_size, s, s, 1(iou_index: 0 or 1)]

3. **网格是否负责预测目标**

   - \`exist_object\` = labels[..., 20].unsqueeze(3)

4. **挑出iou最大的预测边界框**

   - \`pred_best_box_coordinates\`

5. **挑出iou最大的预测边界框 -> 真正 grid_cell 有预测任务的边界框**

   - \`pred_valid_box_coordinates\` = \`pred_best_box_coordinates\` * \`exist_object\`

6. **标签边界框坐标**

   - \`label_valid_box_coordinates\` = labels[..., 21 : 25] * \`exist_object\`

7. **获取到预测框的(x, y) 和 label的(x，y)**

   - pred_valid_box_coordinates
   - label_valid_box_coordinates

8. **MSE**

   \`\`\`python
   # 有效的预测边界框 和 有效的标签边界框 的 定位误差损失
   coordinates_loss = self.mse(
       # [batch_size * s * s, 4]#
       torch.flatten(pred_valid_box_coordinates, start_dim = 0, end_dim = -2),
       torch.flatten(label_valid_box_coordinates, start_dim = 0, end_dim = -2),
   )
   \`\`\`

   



> 定位损失

![image-20260422215444739](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260422215444739.png)

![image-20260422215811406](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260422215811406.png)

----



**为什么开根号？**



![image-20260422220411391](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260422220411391.png)

![image-20260422220651143](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260422220651143.png)

![image-20260422221317790](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260422221317790.png)

![image-20260421211313287](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260421211313287.png)

- 1xx表示的是Pr(Object)
- 对W_i 进行开根号是因为在[0,1]区间$\\sqrt{x} > x$
  - 靠近0，代表小目标，差距大
  - 靠近1，代表大目标，差距小
  - 有助于提升小目标的检测效果，让小目标起的作用 / 权重 多一些
- \`obj\`表示有目标，\`noobj\`表示没目标
  - 有的网格并不负责预测目标，即使没有目标，预测出来的置信度依旧有意义，能减少\`背景\`目标的误报



> 训练超参数

- 135轮 epoch，batch size=64，动量0.9，权重衰减0.0005
- 使用 Dropout 和数据增强防止过拟合





##### IoU计算

这是求交集，注意坐标系

![image-20260422230530946](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260422230530946.png)

没有交集直接为0

![image-20260422232127709](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260422232127709.png)

<img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260422232303120.png" alt="image-20260422232303120" style="zoom:67%;" />

![image-20260422232244391](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260422232244391.png)





#### 推理及后处理

- **单次前向传播**即可完成检测，速度极快
- **NMS（非极大值抑制）**：过滤重复预测框，提升2-3%精度

![image-20260421225259229](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260421225259229.png)

#### 局限性

1. **空间约束**：每个网格只预测2个框和1个类别，对密集小目标（如鸟群）效果差
2. **泛化性不足**：对训练集中未出现的宽高比目标预测效果差
3. **特征粒度粗**：多次下采样导致细节丢失
4. **损失函数缺陷**：对小目标和大目标使用相同误差计算，小目标定位误差影响更大
   1. **大框（比如一辆卡车）：** 你的预测框比真实框偏了 10 厘米。对于一辆 10 米长的卡车来说，这 10 厘米几乎看不出来，IOU（交并比，衡量重合度的指标）依然很高，检测依然算成功。这就是原文说的 "benign"（良性的，无害的）。
   2. **小框（比如一只鸟）：** 你的预测框比真实框也偏了 10 厘米。但这只鸟可能一共就只有 15 厘米宽。你这 10 厘米的偏差，直接导致预测框和真实框几乎没重叠了，IOU 直接掉到 0，检测彻底失败。
   3. **结论**：同样的“小误差”，在大物体身上可以忽略不计，但在小物体身上就是“巨大的定位错误”。

#### 实验结果

> 

都是基于Pascal VOC 2007上做测试的

![image-20260421213131347](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260421213131347.png)

[^Real-Time Detectors]: 实时目标检测器
[^Less Than Real-Time]: 不那么实时的检测器

![image-20260421214154178](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260421214154178.png)

- yolo 在检测小目标时，效果比R-CNN差
- yolo比而二阶段的精度差
- 将yolo 和 fast R-CNN 结合，发现 1+1 > 2





> **错误分析**

作者把预测结果分成了五类

![image-20260421213612939](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260421213612939.png)

Loc：分类准确，位置不准确

Sim：分类不准确，但预测成了相似的类别

Other：分类完全预测错误

Background：不仅分类完成错误，位置预测成了背景



### YOLO V2

[大白话讲明白YOLOV2的Darknet-19骨干网络_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV17jyqBVE1f/?spm_id_from=333.1387.collection.video_card.click&vd_source=a97555db7a704882626ff6b3dff1617c)



![image-20260423185342752](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423185342752.png)

- **YOLOv2** 是 Joseph Redmon 在 YOLOv1 基础上提出的改进版，但论文标题为 **《YOLO9000》**，因为作者进一步提出了能识别 **超过9000个目标类别** 的模型。
- 标题中的三个关键词对应论文核心章节：
  - **Better（更好）**：第二章，通过一系列优化提升检测精度。
  - **Faster（更快）**：第三章，简化网络结构以提升推理速度。
  - **Stronger（更强）**：第四章，通过联合训练扩展可识别的类别数量。



#### 摘要与引言

> 摘要

- **YOLOv2** 在 PASCAL VOC 07+12 和 COCO 数据集上达到了当时最优效果，并通过多尺度训练在速度与精度间取得良好平衡
  - 小尺寸输入帧率高，在VOC 2007上达到76.8 mAP
  - 大尺寸虽然精度降低，但是输入精度可达 **78.6% mAP**
  - 精度超过**Faster R-CNN**（backbone为ResNet）和 **SSD**，同时做到更快的检测速度
- **核心问题**：检测数据集（几万到几十万张，几百个类别）远小于分类数据集（几百万张，几万到几十万个类别），且标注检测框的成本极高。因此作者提出**联合训练方法**，同时利用检测数据集（学习定位）和分类数据集（扩展词汇量/类别数）去训练检测模型。

> 引言

作者提到通用的目标检测模型应该具备\`快速\`，\`准确\`以及\`能够识别大范围的目标（目标类别数多）\`这三个特点，

神经网络的引入检测框架 =实现了=> 快和准确，但是\`目标类别数多\`还不行。可能的原因：

- 当时目标检测数据集不足，标注检测的成本高
  - 提出\`联合训练\`方法，同时运用到检测数据集（学习定位）和分类数据集（增加词汇量和鲁棒性）=> yolo 9000




时间线：

1. yolo v1
2. yolo v2
3. 合并数据集 + 联合训练 => yolo 9000



#### 优化1：精度

> 原有问题

与Fast R-CNN相比较，yolo v1产生了大量的**定位误差**，有着相对低的**回报率（ReCall）**

思考：

​	YOLO V2想要更为准确的检测精度，同时也能够保持快速的推理速度，因此作者没有去扩大网络的规模，而是去简化了网络模型，并使得特征更容易去学习



> 改进

![image-20260424162732616](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260424162732616.png)

1. **Batch Norm**

   1. 正则化，所以同时移除了dropout
   2. 加快收敛

2. **High Resolution Classifier（高分辨率分类器）**

   - <u>YOLOv1先用224×224预训练分类网络，再直接切换到448×448进行检测，导致模型不适应。</u>
     - *YOLOv1 不在预训练阶段就用 448×448，是因为没有必要——224×224 的 ImageNet 预训练足以学到优秀的底层特征，且更省资源；检测阶段再提升分辨率，是效率与效果之间的合理折中*
   - <u>YOLOv2先用448×448图片微调分类网络10轮，再训练检测模型。</u>
   - <u>精度提升近 **4%**（65.8% → 69.5%）</u>

3. **Convolutional With Anchor Boxes（带锚框的卷积）**

   - 借鉴Faster R-CNN的Anchor机制，移除全连接层，用卷积预测Anchor的偏移量（而不是定位）和置信度。

   - 移除一个池化层，使特征图分辨率更高（从7×7变为14 ×14）；输入尺寸从448改为 **416**，使特征图尺寸为奇数（13×13），确保大目标只有一个中心网格负责预测。

     <img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260424195155012.png" alt="image-20260424195155012" style="zoom:50%;" />

   - 将类别预测与空间位置解耦，每个Anchor单独预测类别概率，之前每个\`cell\`负责两个\`框\`，共用一个cls，最多留下一个

   - 以前一张图98个框，现在1000 +，召回率从81%大幅提升至88%，mAP略有下降（69.5% → 69.2%），但整体检测效果更好。

4. **Dimension Clusters（尺寸聚类）**

   - [大白话讲明白K-means聚类算法_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1FmJyzZEBn/?spm_id_from=333.337.search-card.all.click&vd_source=a97555db7a704882626ff6b3dff1617c)
   - [大白话讲明白YOLOV2的锚框和位置偏移计算_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1vnyqBzEVd?spm_id_from=333.788.videopod.sections&vd_source=a97555db7a704882626ff6b3dff1617c)
   - 使用 **K-means聚类** 自动从训练集中学习先验框尺寸，解决要手工挑选的问题
   - 提出基于 **IOU** 的距离度量（而非欧氏距离），避免大框产生过大误差（就是大框，量纲大，容易区别，小框量纲小）
   - 取 **K=5** 时在复杂度与精度间取得平衡；5个聚类框的效果甚至优于手工挑选的9个框
   - ![image-20260423194536018](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423194536018.png)
     - anchor boxes代表手工挑框
   - 详情：见其他

5. **Direct Location Prediction（直接位置预测）**

   - 解决引入Anchor后模型训练初期不稳定的问题

     - https://www.bilibili.com/video/BV1mkmqBKEzt?t=1359.2

     - 大多数的不稳定都是出自于训练XY位置坐标的时候

     - 预测偏移量无约束导致中心点乱飞

     - ![image-20260423200404580](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423200404580.png)

       Tx和Ty表示归一化之后的距离x，y的相对偏移量，Tx、Ty初期不可控

   - 改为预测相对于**网格单元左上角**的偏移量（与YOLOv1一致），使用 **Sigmoid函数** 将偏移量限制在0~1之间

   - 宽度和高度仍通过对数空间相对Anchor预测

   - 结合尺寸聚类，精度提升近 **5%**（69.6% → 74.4%）

   - ![image-20260423201126338](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423201126338.png)

6. **Fine-Grained Features（细粒度特征）**

   - 为改善小目标检测，增加 **Pass Through层**，将浅层（26×26）的特征通过隔点采样（拆分为4个13×13）拼接到深层（13×13）特征图中

   - 精度提升 **1%**（74.4% → 75.4%）

   - ![image-20260423201807966](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423201807966.png)

     

   - 先把这个26×26特征图，以stride = 2 划分成了不同的网格，然后每一个小格子当中，同一个位置的特征被抽取了出来，例如图中把相对位置是黄色的位置抽取出来，组成13 *13 *512，最后沿通道方向拼接起来

7. **Multi-Scale Training（多尺度训练）**

   - 检测训练阶段
   - 每10个batch随机更换输入图片尺寸（320到608，步长32的倍数），迫使网络适应不同分辨率
   - 精度从75.4%提升至 **76.8%**；使用最高分辨率时可达 **78.6%**
   - ![image-20260423202340129](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423202340129.png)



#### 优化2：速度

- 大多数检测器使用VGG16作为骨干网络，对于224 * 224的输入时，计算量巨大（300亿次浮点运算）。
- YOLOv2提出新的分类网络 **Darknet-19**：
  - 包含19个卷积层和5个最大池化层。
  - 在每一个池化操作后面，都让通道数加倍
  - 主要使用 **3×3卷积** 提取特征，用 **1×1卷积** 压缩通道，最后采用全局平均池化输出向量=>检测头进行预测
  - 计算量仅 **50亿次**，低于YOLOv1，但ImageNet Top-5精度达 **91.2%**（优于VGG16的90%和YOLOv1的88%）。

![image-20260423203001946](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423203001946.png)

> 训练细节

![image-20260424194134969](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260424194134969.png)

**分类训练：** 在标准的ImageNet 1000 类分类数据集上训练网络，使用SGD训练 160 个 epoch。初始学习率为 0.1，采用幂次为 4 的多项式衰减，权重衰减为 0.0005，动量为 0.9，使用的是 Darknet 神经网络框架。训练期间，我们使用了标准的数据增强技巧，包括随机裁剪、旋转、色调、饱和度和曝光度偏移

如上所述，在 224 × 224 的图像上进行初始训练后，在更大的尺寸 448 上对网络进行微调。对于这次微调，使用上述参数，但仅训练 10 个 epoch，起始学习率为 10^−3^。在这个更高分辨率下，网络达到了 76.5% 的 Top-1 准确率和 93.3% 的 Top-5 准确率

![image-20260424213946989](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260424213946989.png)

**检测训练：** 输入为416 * 416 ，通过移除最后的卷积层，转而添加三个 3 × 3 的卷积层（每个包含 1024 个滤波器），最后接一个 1 × 1 的卷积层，其输出通道数取决于我们需要检测的输出数量。对于 VOC 数据集，我们预测 5 个框，每个框包含 5 个坐标和 20 个类别，因此每个框对应 125 个滤波器。我们还从最后的 3 × 512 层添加了一个直通层（passthrough layer）到倒数第二个卷积层，以便我们的模型能够利用细粒度特征

我们训练网络 160 个 epoch，起始学习率为 10^−3^，并在第 60 和 90 个 epoch 时将其除以 10，weight_decay = 5e^-4^，momentum = 0.9，使用与SSD相似的数据增强方法，在COCO 和 VOC上训练



#### 优化3：多目标类别

- **核心方法**：**联合训练（Joint Training）**，将检测数据集（COCO）和分类数据集（ImageNet）混合。

  - 遇到检测图片：完整反向传播YOLOv2损失（坐标、置信度、类别）
  - 遇到分类图片：仅反向传播类别损失（无边界框标注）

- **关键问题**：分类数据集类别数远多于检测， 标签具有层级关系（如“约克夏狗”属于“狗类”属于“猎犬”属于“狗”，会标注具体\`狗的品种\`），而Softmax假设类别互斥，无法直接混合，比如混合之后又\`约克夏狗\`和\`狗\`这种同一个类别的标签

  - 所以需要一种新的多标签模型去解决问题

- **解决方案**：**WordTree（词汇树）层级分类**

  - ![image-20260423211231181](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423211231181.png)

    我们想要像上面那样的层级结构，但是一个事物又属于多个类别，使得整个关系网非常复杂，需要将wordnet中的联系，简化为层级树形结构

    https://www.bilibili.com/video/BV1mkmqBKEzt?t=3012.5

  - 基于WordNet构建树形结构，根节点为“物理对象”。

  - 每个节点预测**条件概率**（在该父节点下属于某子类的概率），通过路径上各节点概率相乘得到最终类别概率。

    - ![image-20260423211841252](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423211841252.png)

  - 在每个层级内部使用Softmax，而非全局Softmax。

  - 即使无法确定具体品种，模型也能退而预测更粗粒度的类别（如“狗”），鲁棒性更强。

  - ![image-20260423211629056](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260423211629056.png)

- **YOLO9000训练细节**：

  - 混合COCO和ImageNet前9000个类别，构建包含 **9418个类别** 的WordTree
  - 对COCO进行过采样，使检测与分类数据比例约为 **4:1**
  - 使用3个Anchor框限制输出尺寸
  - 对分类图片，仅将类别标签分配给IOU>0.3且置信度最高的预测框

- **实验结果**：

  - 在ImageNet检测数据集（200类）上，整体mAP为 **19.7%**
  - 其中156个未见过的类别（仅通过联合训练学习）也达到了 **16.0%** 的mAP
  - 模型对动物品种扩展能力较强，但对衣服、装备等类别较弱（因缺乏相应检测标注）

#### 输入

1. 从VOC2007的Annotations和JPEGImages的目录获取\`标注\`和\`图片\`

2. \`标注\`

   - 经过**VOCAnnotationTransform** 对 'xmin', 'ymin', 'xmax', 'ymax'，要想对于图片原始大小做归一化，输出

     [[xmin, ymin, xmax, ymax, label_ind], ... ]

   - target转成np

3. \`图片\`

   - resize
   - normalize

4. 得到【image，target，height，width】

#### 输出

![image-20260424204054735](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260424204054735.png)

1. **输入**：当前cell内5个GT框 + 5个锚框。
2. **计算**：每个GT分别计算与5个锚框的IoU。
3. **绑定**：每个GT**独立选择**IoU最大的预测框绑定。
4. **冲突**：若多GT选中同一预测框，仅IoU最高者胜出，其余GT在该cell放弃。
5. **标签**：绑定成功的预测框置信度=1，负责回归；未匹配的预测框置信度=0。

#### 锚框

![image-20260424172609606](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260424172609606.png)

https://www.bilibili.com/video/BV1vnyqBzEVd?t=136.2

<img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260424211541501.png" alt="image-20260424211541501" style="zoom:50%;" />

在VOC 2007数据集和COCO数据集当中，观察了所有人工标记好的Ground Truth的大小和形状，然后用K-means聚类方法 ，把这些框划分出了代表 性K =5 类框

![image-20260424204612214](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260424204612214.png)

选K = 5 是因为兼具了复杂度和精确度

![image-20260424205114449](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260424205114449.png)

输出的13 * 13 的每一个cell都可以从备选的\`锚框\`当中

在这里，模型在开始训练之前就从备选的锚框中选一个和Ground Truth\`IoU\`最高的\`先验框\`拿来用，模型就拿着这个\`先验框\`去与模型预测出来的\`预测框\`去计算位置偏差 

![image-20260424205809717](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260424205809717.png)

- Tx 和 Ty 要经过sigmoid函数得出相对于\`预测框\`的中心点x' 和 y'的那个\`cell\`的左上角的偏移量

  - 中心点是模型预测出来的

  - Cx 和 Cy 是 相对于整张图片左上角的偏移量 

- B__w__ 和 B__h__ 是基于anchor box的

   

#### 损失函数

![image-20260424220547556](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260424220547556.png)

![image-20260424221053646](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260424221053646.png)

![image-20260429171536041](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260429171536041.png)

**下标与遍历参数**

| 参数                  | 含义                                                         |
| --------------------- | ------------------------------------------------------------ |
| **$i, j$**            | 特征图（网格）上的空间索引，$i$ 沿宽度方向，$j$ 沿高度方向   |
| **$k$**               | 当前网格单元中第 $k$ 个锚框（anchor / prior / 预选框）的索引 |
| **$W, H$**            | 特征图的宽度和高度，即网格划分的列数和行数                   |
| **$A$**               | 每个网格单元中包含的锚框数量                                 |
| **$t$**               | 当前训练的步数（迭代次数）                                   |
| **$c$**               | 类别索引，$c \\in \\{1, 2, ..., C\\}$                           |
| **$C$**               | 数据集的类别总数                                             |
| **$r \\in (x,y,w,h)$** | 边界框的四个回归参数：中心坐标 $x, y$ 和宽高 $w, h$          |

**网络预测输出**

| 参数            | 含义                                                         |
| --------------- | ------------------------------------------------------------ |
| **$b_{ijk}^o$** | 网络预测的在位置 $(i,j)$、第 $k$ 个锚框的**置信度**（objectness），范围通常在 0~1 之间 |
| **$b_{ijk}^r$** | 网络预测的在位置 $(i,j)$、第 $k$ 个锚框的**边界框参数**（$x, y, w, h$） |
| **$b_{ijk}^c$** | 网络预测的在位置 $(i,j)$、第 $k$ 个锚框属于**类别 $c$ 的概率** |

**Ground Truth（真实标签）与先验信息**

| 参数                       | 含义                                                         |
| -------------------------- | ------------------------------------------------------------ |
| **$\\text{truth}^r$**       | 真实边界框（ground truth box）的参数（$x, y, w, h$）         |
| **$\\text{truth}^c$**       | 真实框的类别标签（通常用 one-hot 编码表示）                  |
| **$\\text{prior}_k^r$**     | 第 $k$ 个**先验框（anchor）**的参数（$x, y, w, h$），由 K-means 聚类得到 |
| **$IOU_{\\text{truth}}^k$** | 第 $k$ 个预测框与对应真实框之间的**交并比（IoU）**           |
| **$\\text{Max IoU}$**       | 第 $k$ 个锚框与**所有真实框**计算 IoU 后的最大值             |
| **$\\text{Thresh}$**        | IoU 阈值（通常设为 0.5），用于区分前景和背景                 |

**损失权重（超参数）**

| 参数                         | 值   | 含义                                                         |
| ---------------------------- | ---- | ------------------------------------------------------------ |
| **$\\lambda_{\\text{noobj}}$** | 1    | **无目标损失权重**：惩罚背景框错误预测为有目标的置信度误差   |
| **$\\lambda_{\\text{obj}}$**   | 5    | **有目标损失权重**：惩罚包含目标的框其置信度预测误差（通常比 noobj 大，因为正样本少） |
| **$\\lambda_{\\text{prior}}$** | 0.01 | **先验框匹配损失权重**：训练初期让预测框接近先验框的权重，值较小 |
| **$\\lambda_{\\text{coord}}$** | 1    | **坐标损失权重**：边界框位置和大小回归的误差权重             |
| **$\\lambda_{\\text{class}}$** | 1    | **类别损失权重**：类别分类误差的权重                         |

**指示函数（开关条件）**

| 参数                                            | 含义                                                         |
| ----------------------------------------------- | ------------------------------------------------------------ |
| **$\\mathbf{1}_{\\text{Max IoU}<\\text{Thresh}}$** | 当该锚框与所有\`真实框\`的最大 IoU **小于阈值**时取 1，表示该锚框负责检测**背景** |
| **$\\mathbf{1}_{t<12800}$**                      | 当训练步数 **小于 12800** 时取 1，表示只在训练**初期**加入先验框匹配损失，帮助网络稳定收敛 |
| **$\\mathbf{1}_k^{\\text{truth}}$**               | 当第 $k$ 个锚框被分配去预测某个**真实目标**时取 1（即该锚框是"负责"检测该目标的正样本） |

| 框的名称               | 英文             | 来源                   | 作用                                                     | 在图中的符号                          |
| ---------------------- | ---------------- | ---------------------- | -------------------------------------------------------- | ------------------------------------- |
| **真实框**             | Ground Truth Box | 人工标注的数据标签     | 告诉你"目标实际上在哪里、是什么类别"                     | $\\text{truth}^r$、$\\text{truth}^c$    |
| **先验框**（Anchor框） | Prior / Anchor   | K-means 聚类数据集得到 | 代表数据集中目标的**典型形状和大小**，是"参考答案的模板" | $\\text{prior}_k^r$                    |
| **预测框**             | Predicted Box    | 神经网络前向传播输出   | 模型最终预测的结果                                       | $b_{ijk}^r$、$b_{ijk}^o$、$b_{ijk}^c$ |

##### 第 1 项：背景置信度损失

$$\\sum_{i,j,k} \\mathbf{1}_{\\text{Max IoU}<\\text{Thresh}} \\cdot \\lambda_{\\text{noobj}} \\cdot (-b_{ijk}^o)^2$$

> 对于**不包含目标**的锚框（背景），惩罚其预测的置信度 $b_{ijk}^o$ 偏离 0 的误差。

##### 第 2 项：先验框匹配损失

$$\\mathbf{1}_{t<12800} \\cdot \\lambda_{\\text{prior}} \\cdot \\sum_{r \\in (x,y,w,h)} (\\text{prior}_k^r - b_{ijk}^r)^2$$

> 在训练**前 12800 步**，让网络预测的框参数尽量接近预设的 anchor 先验框，帮助网络在初期更快稳定。之后该项不再计算。

##### 第 3 项：正样本检测损失（仅对负责预测真实目标的锚框计算）

包含三个子项：

| 子项             | 公式                                                         | 含义                                                         |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **坐标回归损失** | $\\lambda_{\\text{coord}} \\cdot \\sum_{r \\in (x,y,w,h)} (\\text{truth}^r - b_{ijk}^r)^2$ | 预测框与真实框在**位置、大小**上的误差                       |
| **置信度损失**   | $\\lambda_{\\text{obj}} \\cdot (IOU_{\\text{truth}}^k - b_{ijk}^o)^2$ | 预测置信度应等于预测框与真实框的**实际 IoU**                 |
| **类别分类损失** | $\\lambda_{\\text{class}} \\cdot \\sum_{c=1}^{C} (\\text{truth}^c - b_{ijk}^c)^2$ | 预测类别概率与真实类别的**分类误差**（通常用 MSE，后续版本改用交叉熵） |



##### 整体逻辑总结

1. **遍历所有网格和所有锚框**（$W \\times H \\times A$）
2. **背景框**：只计算置信度损失，希望置信度趋近于 0
3. **训练初期**：额外加入先验框匹配损失，让预测框先学会接近 anchor 形状
4. **正样本框**（与某个 GT 的 IoU 最大且超过阈值）：计算坐标、置信度、类别三项损失，希望预测框准确包围目标并正确分类

这个损失函数的设计体现了 YOLO 系列"**一个网络同时回归位置和分类**"的核心思想。

#### 代码

![image-20260425233429673](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260425233429673.png)



网络输出的 pred 定义**始终不变**，两个阶段都是：
- 中心点：相对于 **grid cell** 的偏移
- 宽高：相对于 **anchor** 的对数缩放

变的不是 pred 的含义，而是 **loss 里的 target**：
- **Warm-up**：target = anchor 自己（让你复现 anchor）
- **正常阶段**：target = GT（让你从 anchor 出发去拟合 GT）

所以正常阶段的 pred 仍然是**相对于 anchor 的偏移量**，只是教它往 GT 的方向调。

### YOLO V3

YOLOv3 通过**多尺度预测**、**独立 logistic 分类器**和**DarkNet-53 骨干网络**，在保持高速推理的同时显著提升了检测精度，尤其擅长小目标检测和 AP50 指标

#### 主要改进点

| 改进项         | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| **边界框预测** | 沿用 YOLOv2 的锚框机制，使用 k-means 聚类生成先验框；每个边界框预测 tx, ty, tw, th 四个坐标值；使用 logistic 回归预测目标置信度得分 |
| **类别预测**   | **关键改进**：不再使用 Softmax（因为默认类别互斥，不能一个框多种类别），而是采用**独立的 logistic 分类器**进行多标签分类，每个类别视为二分类问题，使用二元交叉熵损失 |
| **跨尺度预测** | **核心创新**：在三个不同尺度上进行预测，使用类似 FPN（特征金字塔网络）的结构；通过上采样和通道拼接融合粗细粒度特征；九个锚框按大中小分配到三个尺度，https://www.bilibili.com/video/BV1PvFTzkEcm?t=660.7 |
| **特征提取器** | 提出 **DarkNet-53**：混合了 YOLOv2、DarkNet-19 和 ResNet 的特点，包含 53 个卷积层，使用残差连接；在 ImageNet 上精度接近 ResNet-101/152，但速度更快 |
| **训练细节**   | 整图训练、多尺度训练、大量数据增强、BN 归一化；未使用难例挖掘 |

> 特征提取器DarkNet53https://www.bilibili.com/video/BV1tB1pBRE6s?t=144.2

![image-20260428151745191](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260428151745191.png)

![image-20260428152033989](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260428152033989.png)

![image-20260428150235213](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260428150235213.png)

> 跨尺度预测

![image-20260428160052065](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260428160052065.png)

![image-20260428152518779](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260428152518779.png)

![image-20260428152551407](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260428152551407.png)

![image-20260428152735518](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260428152735518.png)

> 其他

- anchor从yolov2的5个 => 9个
- 最后的softmax => Sigmoid 做多标签分类



#### 实验结果

- **精度**：YOLO V3 在COCO 数据集时间上mAP 与 SSD变体 相当（33.0 vs 33.2），但速度快 **3 倍**
  - yolo v3 的精度好于yolo v2和ssd
  - 但是yolo v3的精度要差与Faster R-CNN和RetinaNet
- **AP50 指标**：表现极强，几乎与 RetinaNet 相当，远超 SSD 变体
- **小目标检测**：通过多尺度预测，小目标精度（APs）显著提升，但大目标精度有所下降
- **速度**：在 320×320 图像上仅需 **22ms**，达到 28.2 mAP
- YOLO 擅长生成目标框，但是难以完美对齐标注框

![image-20260428143629090](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260428143629090.png)

![image-20260428150344610](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260428150344610.png)

####  尝试但无效的方案

- 锚框 XY 偏移量预测（降低稳定性）
- 线性激活直接预测 XY（精度轻微下降）
- **Focal Loss**（mAP 下降约 2 个点）
- 双 IoU 阈值和真值分配策略（效果不佳）

#### 作者的思考

- 质疑 COCO 评估指标：认为 0.5 IoU 已足够，人类难以区分 0.3 和 0.5 IoU 的差异



#### 正负样本分配详解

![image-20260429174548856](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260429174548856.png)







 YOLOv3 使用 **多尺度预测**（3个尺度）和 **Anchor机制**，正负样本的判定基于 **IoU（交并比）阈值** 和 **最佳匹配原则**。

\`\`\`
特征图网格 (13×13 或 26×26 或 52×52)
┌─────────────────────────┐
│  ○  ○  ○  ○  ○  ○  ○  │   ○ = 网格点
│  ○  ○  ★  ○  ○  ○  ○  │   ★ = GT中心所在网格（正样本位置）
│  ○  ○  ○  ○  ○  ○  ○  │
│  ○  ○  ○  ○  ○  ○  ○  │
└─────────────────────────┘

3 个 Anchor 模板（如大尺度：116×90, 156×198, 373×326）
   ↓
计算 GT 与每个 Anchor 的 IoU
   ↓
选最大 IoU 的 Anchor → 确定正样本
其余 Anchor：
   - IoU < 0.5 → 负样本（obj=0）
   - IoU ≥ 0.5 → 忽略（不计算损失）
\`\`\`

##### 正样本（Positive Samples）的判定

> 规则 1：最佳 Anchor 匹配

对于每个 GT（Ground Truth）框，计算它与当前尺度下所有 3 个 Anchor 模板的 IoU

选择 **IoU 最大** 的那个 Anchor 负责预测该目标。

> 规则 2：多尺度分配

同一个 GT 可能在 **不同尺度** 上都找到最佳匹配的 Anchor，因此：
- 一个 GT 可能同时成为 **多个尺度** 上的正样本
- 但每个尺度上只分配 **一个 Anchor**

> 规则 3：网格点定位

确定 Anchor 后，计算 GT 中心点落在哪个网格单元（Grid Cell）：
- 该网格单元负责预测此目标
- 输出向量：\`[tx, ty, tw, th, obj_conf, cls1, cls2, ...]\`

其中 \`obj_conf\` 的目标值为 **1**



##### 负样本（Negative Samples）的判定

> 规则：IoU 阈值过滤

对于未被选为正样本的 Anchor：

| 条件                                           | 判定结果                                             |
| ---------------------------------------------- | ---------------------------------------------------- |
| Anchor 与任意 GT 的 IoU < 阈值（默认 0.5）     | **负样本** → 只计算置信度损失（obj_conf 目标值为 0） |
| Anchor 与某个 GT 的 IoU > 阈值，但不是最佳匹配 | **忽略样本（Ignore）** → 不参与训练                  |

> 注意：YOLOv3 原始论文中，这个阈值机制实际上比较宽松，很多实现中会直接将非正样本且 IoU < 0.5 的作为负样本。





##### 损失函数中的体现

YOLOv3 的损失包含三部分：

\`\`\`
总损失 = λ_coord × 坐标损失 + λ_obj × 置信度损失 + λ_cls × 分类损失
\`\`\`

| 样本类型     | 坐标损失      | 置信度损失            | 分类损失      |
| ------------ | ------------- | --------------------- | ------------- |
| **正样本**   | ✅ 计算（MSE） | ✅ 计算（BCE，目标=1） | ✅ 计算（BCE） |
| **负样本**   | ❌ 不计算      | ✅ 计算（BCE，目标=0） | ❌ 不计算      |
| **忽略样本** | ❌ 不计算      | ❌ 不计算              | ❌ 不计算      |

![image-20260429175036811](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260429175036811.png)



### YOLO V4

![image-20260502191421906](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502191421906.png)

> 数据增强

![image-20260502193422266](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502193422266.png)

> cmBN跨小批量标准化

CmBN（Cross mini-Batch Normalization）是 YOLOv4 提出的一种改进的批量归一化方法，主要用来解决 **小 batch size 下 BN 效果不佳** 的问题。

标准 BN 的效果高度依赖 batch size：

- batch size 大时（如 32+）：统计的均值和方差有代表性，效果好
- batch size 小时（如 1~4）：均值和方差噪声大，模型效果反而变差

==CmBN 的具体做法==

假设一个 **batch 包含 4 个 mini-batch**：

\`\`\`plain
迭代 1: mini-batch 1 → 收集统计量（不更新权重）
迭代 2: mini-batch 2 → 收集统计量（不更新权重）  
迭代 3: mini-batch 3 → 收集统计量（不更新权重）
迭代 4: mini-batch 4 → 收集统计量 → 汇总 4 个 mini-batch 的统计量 → 更新权重、γ、β
\`\`\`

**关键点**：

- 前 3 个迭代只**累积统计量**（均值、方差），**不更新网络参数**
- 第 4 个迭代时，用这 4 个 mini-batch 的**汇总统计量**做一次 BN，然后才更新权重 

==差别==

1. 普通 BN：每看到一个 mini-batch 就更新一次参数（信息少，噪声大）
2. CmBN：攒够 4 个 mini-batch 的数据再更新一次（信息多，更稳定）

> Label Smoothing 类标签平滑

https://www.bilibili.com/video/BV1VXN4z8ESm?t=1153.8

![image-20260502203938704](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502203938704.png)

> DropBlock正则化

![image-20260502204252543](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502204252543.png)





#### 改进点-激活函数

只在网络的第一层将CBL模块中的\`LeakyRelu\`换成\`Mish\`

- **LeakyReLU**：在负数区域保留一个小的斜率 *α* ，解决了 ReLU "神经元死亡" 的问题，计算简单。
- **Mish**：处处平滑可导，无界（正值）、有下界（负值），在深层网络中通常表现更好，但计算开销比 LeakyReLU 大

<img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502173755070.png" alt="image-20260502173755070" style="zoom: 67%;" /><img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502173758465.png" alt="image-20260502173758465" style="zoom:67%;" />

<img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502173820503.png" alt="image-20260502173820503" style="zoom:50%;" />

#### 改进点-残差单元

CBL => CBM

![image-20260502173910275](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502173910275.png)

#### 改进点-残差模块

原本

![image-20260502174017279](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502174017279.png)

现在

![image-20260502174034353](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502174034353.png)

#### 改进点-空间金字塔池化SPP

就是用了三个不同尺寸的池化核，并做了拼接操作，把通道数增加了

- 13 * 13：显著增大了感受野
- 三种不同尺寸的池化核完成了多种尺寸的特征提取，解决大目标检测强小目标检测弱的问题，计算量还小能加快推理速度

<img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502174206667.png" alt="image-20260502174206667" style="zoom:67%;" />

\`\`\`python
self.m = nn.ModuleList([
    nn.MaxPool2d(kernel_size=x, stride=1, padding=x // 2) 
    for x in k  # k=(5, 9, 13) 或 (5, 7, 13) 等
])
\`\`\`



#### 改进点-模型结构

CSP-DarkNet53

![image-20260502174519665](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502174519665.png)

> Neck部分，大体一样

逐渐放大特征图的尺寸并与网络结构当中前面的大尺寸特征图进行拼接

![image-20260502174703585](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502174703585.png)

> 检测头部分，下面会和上面进行拼接

逐步减小特征图，并且完成最终的预测张量的输出

![image-20260502175002471](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502175002471.png)

> FPN -> PANet，双向金字塔

让深层特征在拥有强语义的同时，也能获得来自浅层的精确定位信息，提升了定位的精度 

语义信息下行 + 位置信息上行

![image-20260502175301309](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502175301309.png)

#### 改进点-giou

==IoU==

![image-20260502204712772](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502204712772.png)

==GIoU==

<img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502210113192.png" alt="image-20260502210113192" style="zoom:67%;" />

![image-20260502210423834](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502210423834.png)

![image-20260502210522458](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502210522458.png)

==DIoU==

![image-20260502210820552](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502210820552.png)

![image-20260502210844477](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502210844477.png)

==CIoU==

![image-20260502211213264](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502211213264.png)

####  Eliminate Grid Sensitivity（消除网格敏感性）

**问题**：原版 YOLO 用 \`sigmoid(t)\` 预测中心偏移，结果只能落在当前网格内（0~1）。目标一旦靠近网格边界，模型很难拟合。

![image-20260820161919813](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260820161919813.png)



![image-20260820162045998](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260820162045998.png)

**YOLOv4 改法**：把公式改成 \`2·sigmoid(t) - 0.5\`，偏移范围变成 **-0.5 ~ 1.5**，预测框可以"跨界"到相邻网格。

**效果**：消除了网格边界的硬限制，边界附近的目标更容易回归，检测更准更稳。

![image-20260502212653970](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502212653970.png)

### YOLO V5

#### 网络结构

![image-20260502223202613](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502223202613.png)

![image-20260502223346434](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502223346434.png)

#### SiLU

$$f(x) = x \\cdot \\sigma(x) = \\frac{x}{1 + e^{-x}}$$

![image-20260502223645120](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502223645120.png)

|          | Mish                    | SiLU (Swish)       |
| -------- | ----------------------- | ------------------ |
| 公式     | \`x · tanh(softplus(x))\` | \`x · sigmoid(x)\`   |
| 计算量   | 大（tanh + ln）         | 小（一个 sigmoid） |
| 精度     | 略好                    | 几乎持平           |
| 推理速度 | 慢                      | 快                 |

#### 数据增强

![image-20260502224341301](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502224341301.png)

![image-20260503173634997](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260503173634997.png)



#### 训练策略

![image-20260502224552284](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502224552284.png)

#### CIoU



#### Eliminate Grid Sensitivity（消除网格敏感性）

相比于V4，同时对x，y，w，h做了限制

![image-20260502225254120](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502225254120.png)

#### 匹配正样本

不使用IoU去筛选了https://www.bilibili.com/video/BV1xeKAzEErH?t=580.4

![image-20260502230004098](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260502230004098.png)

![image-20260503193059321](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260503193059321.png)

https://www.bilibili.com/video/BV1q1zyYtErE?t=509.4&p=17

 #### 自适应图片缩放

![image-20260503174340061](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260503174340061.png)

![image-20260503174839457](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260503174839457.png)

#### Loss

![image-20260503194902619](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260503194902619.png)

![image-20260503195353980](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260503195353980.png)

#### 宽度和深度

![image-20260503203737298](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260503203737298.png)

深度就是调整Res_Unit的repeat数量

| 参数                | 对应结构图中的                    | 控制什么                                  |
| ------------------- | --------------------------------- | ----------------------------------------- |
| **depth\\_multiple** | 每行的第二个值 \`number\`           | **C3 模块重复几次**                       |
| **width\\_multiple** | \`args\` 里的第一个值（输出通道数） | 每个卷积过程中的卷积核的数量-> 输出通道数 |

#### 结果

![image-20260503204515374](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260503204515374.png)

### YOLO V8

![image-20260504171004164](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260504171004164.png)

obb：支持斜着的框

#### 实验结果

![image-20260504171216410](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260504171216410.png)

#### 模型结构

![image-20260504173358375](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260504173358375.png)

![image-20260505153332311](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260505153332311.png)

这里有一点讲错了，哪怕是x模型，最大允许的通道数也是512，而不是1.25*512

<img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260505171048606.png" alt="image-20260505171048606" style="zoom: 150%;" />



> 区别1：c2f



> 区别2：检测头

| 特性 | YOLOv5 / YOLOv7                                              | YOLOv8                                               |
| ---- | ------------------------------------------------------------ | ---------------------------------------------------- |
| 结构 | **耦合头**：分类、回归、置信度共享同一组卷积层，最后同时输出 | **解耦头**：分类分支和回归分支完全分离，各自独立学习 |
| 优势 | 参数量少、计算快                                             | 减少分类与定位任务间的梯度干扰，收敛更稳定，精度更高 |
| 劣势 | 不同任务优化目标冲突，可能互相干扰                           | 参数量和计算量略有增加                               |

#### Anchor-Free

![image-20260504180645452](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260504180645452.png)

![image-20260505172946757](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260505172946757.png)

![image-20260505180233310](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260505180233310.png)

![image-20260505191112660](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260505191112660.png)

> 为什么是 16？（reg_max = 16）

这是 YOLOv8 采用的 **DFL（Distribution Focal Loss）** 机制决定的。

==核心思想：把"连续回归"变成"分布预测"==

传统方法直接预测一个确定的坐标值（比如 \`x=10.5\`），但 YOLOv8 换了一种思路：

1. **离散化**：把每条边（left/top/right/bottom）可能的偏移范围，切分成 \`reg_max\` 个区间（bins）。默认 \`reg_max = 16\`，就是切成 16 份。
2. **预测分布**：模型不直接输出坐标值，而是输出这 16 个区间的 **概率分布**（类似分类，用 softmax）。
3. **积分求期望**：把这 16 个概率加权求和（积分），得到最终的连续坐标值。

==为什么是 16 而不是别的数？==

- **精度与效率的平衡**：16 个 bins 足以覆盖边界框偏移的分布范围（通常是 0~15 或经过缩放的区间），同时计算量可控。
- **4 条边 × 16 个 bins**：所以上分支输出通道是 \`4 × 16 = 64\`。
- **可调整**：\`reg_max\` 是一个超参数，如果检测目标尺度变化很大，也可以调大（比如 32），但默认 16 在 COCO 等数据集上表现已经很好

>

DFL也可以理解成把不容易收敛的回归任务转换成了分类任务，训练起来更简单更容易收敛





#### 正负样本匹配

![image-20260504181122045](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260504181122045.png)

![image-20260505201416846](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260505201416846.png)

> 第一步：解析预测框坐标

- 网络输出格式为 **LTRB**（anchor point 到左、上、右、下边界距离）
- 转换为 **(x_min, y_min, x_max, y_max)** 格式：
  - \`x_min = anchor_x - L\`, \`y_min = anchor_y - T\`
  - \`x_max = anchor_x + R\`, \`y_max = anchor_y + B\`
- 目的：便于后续计算 IoU/CIOU

> 第二步：初筛正样本

- 从 8400 个预测框中粗略筛选候选正样本
- **规则**：真实框覆盖区域内的所有 anchor points 视为正样本
- **关键实现**：将三个特征图（feature map）的 anchor points 都映射回原图（640×640），在原图尺度上判断覆盖关系
- 示例：一个真实框可能覆盖 9 个 anchor points（实际场景中通常是上百至上千个）

> 第三步：精筛正样本（Top-K 筛选）

- 从初筛的大量正样本中进一步筛选，减轻计算负担
- **核心指标：Align Metric**
  - 计算公式：\`Align Metric = (Bounding Box Score)^0.5 × (CIOU)^6\`
  - Bounding Box Score：anchor point 对应真实框类别的预测分数（从 80 维分类向量中取出对应类别索引的值）
  - CIOU：预测框与真实框的 Complete IoU
- **筛选策略**：按 Align Metric 排序，保留 **Top 10** 的 anchor points 作为最终正样本
- 示例：7 个不重叠目标 → 共 70 个正样本（7×10），其余 8330 个为负样本

> 第四步：处理重叠真实框的冲突

- **问题**：若多个真实框重叠，同一个 anchor point 可能同时匹配多个 GT Box
- **解决**：比较该 anchor point 与各重叠 GT Box 的 CIOU 值，**分配给 CIOU 最大的那个 GT Box**，其余匹配丢弃

##### 数据预处理

[yolov8 | 损失函数 之 1、数据预处理 代码精读_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1Rb421n7fr?spm_id_from=333.788.player.switch&vd_source=a97555db7a704882626ff6b3dff1617c)

![image-20260505201154273](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260505201154273.png)













#### Loss



![image-20260505182620414](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260505182620414.png)

>类别损失

![image-20260505204656973](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260505204656973.png)

![image-20260505205526597](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260505205526597.png)

==为什么要除以 target_scores_sum==

1. 正则化

| 场景             | 不除 sum 的问题   | 除 sum 的效果           |
| ---------------- | ----------------- | ----------------------- |
| Batch 内正样本多 | BCE loss 绝对值大 | 归一化后损失稳定        |
| Batch 内正样本少 | BCE loss 绝对值小 | 归一化后损失稳定        |
| 不同训练阶段     | 损失波动剧烈      | 损失尺度一致，lr 更稳定 |

2. 等效于每个正样本平均损失

$$\\text{loss} = \\frac{\\sum_{i} \\text{BCE}(pred_i, target_i)}{\\sum_{i} target_i}$$

这相当于**只对有目标的 anchor 做平均**，而不是对所有 8400 个 anchor 平均（后者会被大量背景样本稀释）。

==BCEWithLogitsLoss==

|                | \`BCELoss\`                 | \`BCEWithLogitsLoss\`      |
| -------------- | ------------------------- | ------------------------ |
| **输入要求**   | 经过 Sigmoid 的概率 (0~1) | 原始 logits（任意实数）  |
| **内部操作**   | 无                        | 先 \`sigmoid()\`，再算 BCE |
| **数值稳定性** | 差（易溢出/下溢）         | **好**（融合计算）       |
| **典型用法**   | 很少直接用                | **推荐**                 |

等价的分段形式：

$$
\\mathcal{L}_{\\text{BCEWithLogits}}(x, y) = 
\\begin{cases}
\\log(1 + e^{-x}) & \\text{if } y = 1 \\\\[8pt]
\\log(1 + e^{x}) & \\text{if } y = 0
\\end{cases}
$$

其中：
- $x_i$：模型输出的原始 logits（未经 sigmoid）
- $y_i \\in \\{0, 1\\}$：二元目标标签
- 该公式等价于 $\\text{BCE}(\\sigma(x), y)$，但数值稳定性更优

- **BCEWithLogitsLoss**：用于**二分类**或**多标签分类**问题。它内部结合了 Sigmoid 层和二进制交叉熵损失（BCELoss）。
- **交叉熵损失 （CrossEntropyLoss）**：用于**单标签多分类**问题。它内部结合了 Softmax 层和对数损失（NLLLoss）。

> 定位损失

**为什么用DFL**

解决模型对模糊边界的定位问题

https://www.bilibili.com/video/BV1Zy411i75C?t=237.8

![image-20260505214140568](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260505214140568.png)

对于预测框的每一个这个LTRB，我们都让网络输出一个长度为16的向量，所以网络的输出大概是长这个样子，其中16表示的是batch size

对于LTRB中的每一个长度，我们都会预测出这样的一个16个值的分布。

那这每一个值的意义是什么呢，就比如说对left中的这个\`下标10\`，它表示的是left的长度等于十的概率。那它们所有的这个概率之和加起来是等于一的，也就是说这16个值在被预测出来之后，我们要对它们做一个softmax，让它们的每一个值表示一个概率，然后我们让这每一个长度乘以它对应的概率，然后进行累加得到的就是最终的\`长度预测值\`。

作者将预测结果设计成是一个任意分布的形，是因为他发现对于那些非常清晰明确的边界，它们的分布都像这种很尖锐很集中，而像这种模糊不定的边界，那么它们的分布就很平，而且有时候还会出现双峰的情况，所以呢他就想要模型来学习，这种集中的尖锐的分布

![image-20260505215145879](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260505215145879.png)

在设计损失函数的时候，就希望增加这个真实值的左右两边的这两个值的概率，使得网络快速的聚焦于这个标签值附近的值，尽量把分布给学习成那种集中的尖锐的样子，就比如说left的真实长度等于9.3，那么我们就让模型啊聚焦于九和十这两个值，希望它在九和十这两个值上的概率最大

![image-20260505220157713](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260505220157713.png)

### YOLO V11

![image-20260506154038479](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506154038479.png)

#### 实验结果

![image-20260506154133621](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506154133621.png)

#### 网络结构

![image-20260506154437962](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506154437962.png)

<img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506154502964.png" alt="image-20260506154502964" style="zoom:50%;" />

<img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506160622621.png" alt="image-20260506160622621" style="zoom:50%;" />

![image-20260506162001981](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506162001981.png)

##### C3K2

![image-20260506162121917](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506162121917.png)

<img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506162930347.png" alt="image-20260506162930347" style="zoom: 150%;" />

> 配置文件说明

举例： \`[-1, 2, C3k2, [256, False, 0.25]]\`

*   **-1** ：该模块的输入来自哪一个模块的输出。-1 表示 当前 C3k2模块的输入 来自上一个模块的输出
*   **2** ：模块内需要包含几个 C3k模块，实际个数需要乘以该网络版本(n、s、m、l、x) 对应的 depth
*   **C3k2** ：模块名称，等于搭建该模块的类的名称，用于找到该类去搭建模块
*   **[256, False, 0.25]**
    *   **256** ：该模块的输出 channel 数。实际输出 channel 数需要乘以该网络版本(n、s、m、l、x) 对应的 width
    *   **False** ：True 表示内部使用 C3k 模块；False 表示内部使用 Bottleneck，C3k2 模块退化为 C2f 模块。
        一般使用场景是，将值指定为 False，然后代码中判断 该模型是否为 较大的 M/L/X 版本
        *   如果是 较大的 M/L/X 版本，则将值置为 True，使用 C3k2 模块
        *   如果是 较小的 N/S 版本，则值保持为 False，使用 C2f 模块

        \`\`\`python
        if m is C3k2 and scale in "mlx":  # for M/L/X sizes
            args[3] = True  # args = [32, 64, 1, False, 0.25]
        \`\`\`

    *   **0.25** ：用于控制 C3k2 模块内部的 channel 数 （模块中的 channel 数一般需要先减少再增加，其用于控制减小的倍数）

> 模块代码

![image-20260506163532361](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506163532361.png)

<img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506164147918.png" alt="image-20260506164147918"  />

> 



##### C2PSA

![image-20260506162231053](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506162231053.png)

在yolov10的PSA上包了一个CSP

> 配置

![image-20260506164655465](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506164655465.png)

> 代码

![image-20260506164843010](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506164843010.png)

![image-20260506165335118](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506165335118.png)

Attention这里是\`多头自注意力机制\`

![image-20260506165530936](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506165530936.png)

![image-20260506165827196](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506165827196.png)

\`FFN\`

![image-20260506165659315](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506165659315.png)

##### Detect

![image-20260506172721237](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506172721237.png)

![image-20260506172807772](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506172807772.png)

\`g\` 代表卷积的 **分组数 (groups)**。

在图中，它的具体作用是定义 **深度卷积 (Depth-wise Convolution)**：
*   当 \`g\` 等于通道数 \`c\` 时（例如图中的 \`c=64, g=64\` 或 \`c=80, g=80\`），表示每个输入通道独立使用一个卷积核进行卷积，通道之间不进行信息交互。这是深度可分离卷积（Depth-wise Separable Convolution）的第一步。

![image-20260506172949375](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506172949375.png)



#### 代码

\`\`\`python
1. CLI 入口 (ultralytics/cfg/__init__.py:850)
		pyproject.toml 定义: yolo = "ultralytics.cfg:entrypoint"
     	    ↓
   		entrypoint() 函数解析参数
        	↓
   		task=detect, mode=train,model=yolov11s.pt
    
    
2. 参数解析与分发 (__init__.py:899-1011)
	# 900-932: 解析 task, model, data, batch, epochs 等参数
	# 959-993: 提取 model (yolov11s.pt) 并创建 YOLO 实例
	# 1011:   getattr(model, mode)(**overrides)  → model.train()

3. YOLO 模型类 (ultralytics/models/yolo/model.py:26)
	class YOLO(Model):
    	# task_map 定义了任务到对应类的映射
    	"detect": {
        	"model": DetectionModel,           # 模板模型
        	"trainer": yolo.detect.DetectionTrainer,   # 训练器
        	"validator": yolo.detect.DetectionValidator,
        	"predictor": yolo.detect.DetectionPredictor,
    	}

        
4. 权重加载 (ultralytics/nn/tasks.py:1502)
	def load_checkpoint(model, weights, ...):
    	# 1. 远程下载 yolov11s.pt (如果需要)
   		# 2. torch.load() 加载权重
    	# 3. 提取 ckpt["model"] 或 ckpt["ema"]
    	# 4. model.pt_path = weights, model.task = guess_model_task()
        
        
5. 训练器初始化 (ultralytics/engine/model.py:715)
		# 783: trainer = DetectionTrainer(overrides=args)
		# 789: trainer.get_model(weights=model) 加载权重到训练器
		# 792: trainer.train() 开始训练
        
6. DetectionTrainer (ultralytics/models/yolo/detect/train.py:24)
		class DetectionTrainer(BaseTrainer):
    		def build_dataset()      # line 65:  创建数据集
    		def get_dataloader()    # line 79: 创建 DataLoader
    		def preprocess_batch()  # line 107: 预处理 (缩放/归一化)
    		def get_model()         # line 170: 返回 DetectionModel
            
            
7. 基础训练器与训练循环 (ultralytics/engine/trainer.py:67)
		class BaseTrainer:
    		def __init__(...):          # line 117-204
        		# 选择设备: device=0 (GPU 0)
        		# 创建保存目录
        		# 获取数据集
    
    	def _do_train(...):        # line 365-573 核心训练循环
        	# _setup_train()        # line 294-363: 初始化优化器/AMP/EMA
        	while
\`\`\`

\`\`\`react
CLI: yolo task=detect mode=train model=yolov11s.pt data=coco.yaml batch=32 epochs=100 imgsz=640 workers=0 device=0
1. entrypoint()                          [cfg/__init__.py:850]
   ├── merge_equals_args(argv)           → 合并被拆分的参数
   ├── parse_key_value_pair() + smart_value() → 解析 key=value → overrides dict
   ├── check_dict_alignment(overrides)   → 验证参数合法性
   ├── YOLO("yolov11s.pt", task="detect")
   │     └── Model._load() → load_checkpoint() → 加载权重 + 推断 task=detect
   └── model.train(**overrides)
2. Model.train()                         [engine/model.py:715]
   ├── _smart_load("trainer") → DetectionTrainer(overrides)
   └── self.trainer.train()
3. BaseTrainer.train()                   [engine/trainer.py:219]
   └── _do_train()
4. _do_train()                           [engine/trainer.py:365]
   ├── _setup_train()
   │     ├── setup_model() → DetectionModel(cfg, nc=80) [nn/tasks.py:370]
   │     ├── model.to(cuda:0)
   │     ├── check_amp() → GradScaler
   │     ├── check_imgsz(640)
   │     ├── _build_train_pipeline()
   │     │     ├── build_dataset() → YOLODataset + v8_transforms [Mosaic+RandomPerspective+HSV+Flip]
   │     │     ├── build_dataloader() → InfiniteDataLoader(batch=32)
   │     │     ├── build_optimizer() → MuSGD
   │     │     └── _setup_scheduler() → LambdaLR (线性衰减)
   │     ├── DetectionValidator(test_loader)
   │     ├── ModelEMA(model)
   │     └── set_class_weights()
   │
   └── [EPOCH LOOP: epoch=0→99]
         ├── scheduler.step()
         ├── epoch==90 → _close_dataloader_mosaic()  # 关闭 Mosaic
         ├── [BATCH LOOP: for batch in train_loader]
         │     ├── warmup (前3个epoch: LR+动量+累积 插值)
         │     ├── preprocess_batch() → GPU, /255, multi_scale
         │     ├── model(batch) → forward + v8DetectionLoss
         │     │     ├── DetectionModel.forward() → 3尺度特征图
         │     │     └── TaskAlignedAssigner + CIoU + BCE + DFL
         │     ├── scaler.scale(loss).backward()
         │     ├── optimizer_step() [每2步: unscale+clip_grad+step+ema]
         │     └── logging (tqdm, plot_samples)
         ├── validate() → DetectionValidator → mAP50, mAP50-95, fitness
         ├── save_model() → last.pt, best.pt
         └── [if stop: break]
   
   └── final_eval() + plot_metrics()
\`\`\`







##### 训练

\`\`\`bash
yolo task=detect mode=train model=yolov11s.pt data=ultralytics/cfg/datasets/coco.yaml batch=32 epochs=100 imgsz=640 workers=0 device=0
\`\`\`

> 一、CLI入口（shell -> entrypoint）

1. 控制台脚本注册

   \`流程\`：shell 执行 yolo 时，pip/setuptools会调用模块ultralytics.cfg中的entrypoint函数

   \`文件\`: pyproject.toml:138-140

   \`\`\`toml
   [project.scripts]
   yolo = "ultralytics.cfg:entrypoint"
   \`\`\`

2. 入口函数 entrypoint

   \`文件\`: ultralytics/cfg/__init__.py:850-1018

   \`\`\`python
   def entrypoint(debug="") -> None:
       args = (debug.split(" ") if debug else ARGV)[1:]
   \`\`\`

> 二、参数解析（entrypoint）内部

处理参数生成\`oveerides\`字典

\`\`\`python
overrides = {
    "task": "detect",
    "mode": "train",
    "model": "yolov11s.pt",
    "data": "ultralytics/cfg/datasets/coco.yaml",
    "batch": 32,
    "epochs": 100,
    "imgsz": 640,
    "workers": 0,
    "device": 0,
}
\`\`\`

> 三、模式与任务解析

![image-20260507161856148](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260507161856148.png)

获取\`mode\`、\`task\`参数

> 四、模型加载

从\`overrides\`中读取\`model名\`，创建YOLO实例

1. YOLO 类初始化

   \`文件\`：ultralytics/cfg/__init__.py:978-981 -> ultralytics/models/yolo/model.py:53 → super().__init__(model="yolov11s.pt", task="detect")

   \`\`\`python
   from ultralytics import YOLO
   model = YOLO(model, task=task)
   
   class YOLO(Model):
           def __init__(self, model: str | Path = "yolo26n.pt", task: str | None = None, verbose: bool = False):
   		super().__init__(model=model, task=task, verbose=verbose)
   \`\`\`

2. Model 基类初始化

   \`文件\`：ultralytics/engine/model.py:81-148 

   - 发现不是model的结尾不是[ .yaml, .yml ]，加载现有模型实例，调用self.**_load**(model, task=task)

   - self.**_load**(model, task=task)，检测到 .pt 后缀，调用load_checkpoint()：

     \`\`\`python
     文件: ultralytics/engine/model.py:259-293 → 调用 load_checkpoint()：
     文件: ultralytics/nn/tasks.py:1502-1538
     
     def load_checkpoint(weight, ...):
         ckpt, weight = torch_safe_load(weight)  # 用 torch.load + safetensors 加载
         args = {**DEFAULT_CFG_DICT, **(ckpt.get("train_args", {}))}  # 恢复训练参数
         model = (ckpt.get("ema") or ckpt["model"]).float()  # EMA权重优先
         model.args = args
         model.task = "detect"  # 从 checkpoint 推断
         return model, ckpt
     \`\`\`

3. 任务一致性检查
   \`文件\`: ultralytics/cfg/__init__.py:986-989

   \`\`\`python
   if task != model.task:
       LOGGER.warning(...)
       task = model.task  # 以模型 checkpoint 中的 task 为准
   \`\`\`

> 五、最终执行

\`文件\`: ultralytics/cfg/__init__.py:1011

\`\`\`python
getattr(model, mode)(overrides)
\`\`\`

展开为 model.train(overrides)，进入训练流程。

> 六、Model.train() - 训练调度

\`文件\`: ultralytics/engine/model.py:715-799

\`\`\`python
getattr(model, mode)(**overrides) -> 
def train(
    self,
    trainer=None,
    **kwargs: Any,
):
    # 从ROOT / "cfg/default.yaml"加载训练配置信息
    overrides = YAML.load(checks.check_yaml(kwargs["cfg"])) if kwargs.get("cfg") else self.overrides
    # 获取数据来源、model、task类型
    custom = {
        # NOTE: handle the case when 'cfg' includes 'data'.
        "data": (overrides.get("data") if kwargs.get("cfg") else None)
        or DEFAULT_CFG_DICT["data"]
        or TASK2DATA[self.task],
        "model": self.overrides["model"],
        "task": self.task,
    } 
    # 参数合并
    args = {**overrides, **custom, **kwargs, "mode": "train", "session": self.session}
    # 是否预训练
    pretrained = kwargs.get("pretrained", overrides.get("pretrained", True) if kwargs.get("cfg") else True)
    # 断点处理
    if args.get("resume"):
        pass
    # 加载训练器，从Class YOLO(Model)中
    self.trainer = (trainer or self._smart_load("trainer"))(overrides=args, _callbacks=self.callbacks)
    # 如果不是恢复训练，则从model结构的yaml，加载model和权重
    if not args.get("resume") and self.ckpt:
        pass
    # 开始训练
    self.trainer.train()
\`\`\`



![image-20260507171529957](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260507171529957.png)

> 七、DetectionTrainer 初始化

使用基类BaseTrainer的初始化

\`文件\`: ultralytics/engine/trainer.py:117-204

| 步骤 | 行号    | 操作                                                         |
| :--- | :------ | :----------------------------------------------------------- |
| 1    | 126     | \`self.args = get_cfg(cfg, overrides)\` — 将 overrides 与 DEFAULT_CFG 合并，生成 IterableSimpleNamespace |
| 2    | 127     | \`check_resume(overrides)\` — 检查是否从 last.pt 恢复训练，设置 self.resume |
| 3    | 128     | \`select_device("0")\` → \`self.device = cuda:0\`                |
| 4    | 134     | \`init_seeds(...)\` — 固定 Python/Numpy/PyTorch 随机种子       |
| 5    | 137     | \`get_save_dir(args)\` → \`self.save_dir = runs/detect/train/\` (自动递增) |
| 6    | 139     | \`self.wdir = save_dir / "weights"\`                           |
| 7    | 142     | 将配置保存为 \`self.save_dir/args.yaml\`                       |
| 8    | 149     | \`self.last = wdir/"last.pt"\`, \`self.best = wdir/"best.pt"\`   |
| 9    | 152-153 | \`self.batch_size = 32\`, \`self.epochs = 100\`                  |
| 10   | 163     | \`self.callbacks = _callbacks or callbacks.get_default_callbacks()\` |
| 11   | 184     | \`self.model = check_model_file_from_stem("yolov11s.pt")\` (字符串占位) |
| 12   | 185     | \`self.data = self.get_dataset()\` — 加载数据集配置，不加载数据 |

get_dataset() — 数据集配置加载
\`文件\`: ultralytics/engine/trainer.py:678-705

\`\`\`python
data = check_det_dataset("ultralytics/cfg/datasets/coco.yaml")
返回字典：
{
    "train": "path/to/coco/images/train2017",
    "val": "path/to/coco/images/val2017",
    "names": {0: "person", 1: "bicycle", 2: "car", ..., 79: "toothbrush"},
    "nc": 80,
    "channels": 3,
}
\`\`\`

> 八、BaseTrainer.train() — 训练入口

\`文件\`: ultralytics/engine/trainer.py:219-246

\`\`\`python
def train(self):
    if self.ddp:           # 多卡: 生成 torchrun 命令, subprocess.run()
        ...
    else:                  # 单卡 (device=0): 直接训练
        self._do_train()
\`\`\`

> 九、_do_train() — 训练主循环

\`文件\`: ultralytics/engine/trainer.py:365-573

1. **训练前准备 self._setup_train()** —— Configure model, optimizer, dataloaders, and training utilities before the training loop.

   1. 调用setup_model

      1. 加载checkpoint获取模型YAML权重
      2. 构建模型结构和权重加载

   2. 迁移model to device

   3. Compile model

   4. Freeze layers

   5. AMP 设置与图像尺寸验证 ？

      1. 检查 GPU 是否支持混合精度
      2. 验证并四舍五入到 stride 倍数

   6. 构建训练数据管道 — _build_train_pipeline()

      \`文件\`: ultralytics/engine/trainer.py:268-292

      \`\`\`python
      def _build_train_pipeline(self):
          # (a) 训练数据加载器
          self.train_loader = self.get_dataloader(data["train"], batch=32, mode="train")
          # (b) 验证数据加载器
          self.test_loader = self.get_dataloader(data["val"], batch=32, mode="val")
          # (c) 梯度累积步数
          self.accumulate = max(round(nbs / batch_size), 1)  # nbs=64, batch=32 → 2
          # (d) 优化器
          self.optimizer = self.build_optimizer(model, name="auto", lr=0.01, ...)
          # (e) 学习率调度器
          self._setup_scheduler()
      \`\`\`

      \`文件\`: ultralytics/models/yolo/detect/train.py:79-105

      \`\`\`python
      def get_dataloader(self, dataset_path, batch_size=32, rank=-1, mode="train"):
          with torch_distributed_zero_first(rank):  # 确保 *.cache 只初始化一次
              dataset = self.build_dataset(dataset_path, mode, batch_size)
          shuffle = (mode == "train")
          return build_dataloader(dataset, batch=batch_size, workers=0,
                                  shuffle=shuffle, rank=rank)
      \`\`\`

      DetectionTrainer.build_dataset()

      \`文件\`: ultralytics/models/yolo/detect/train.py:65-77

      \`\`\`python
      def build_dataset(self, img_path, mode="train", batch=None):
          gs = max(int(unwrap_model(self.model).stride.max()), 32)  # 32
          return build_yolo_dataset(self.args, img_path, batch, self.data,
                                    mode=mode, rect=(mode=="val"), stride=gs)
      \`\`\`

      最终创建：
      - 训练集: YOLODataset(img_path, augment=True, ...) — 含 Mosaic/MixUp/RandomPerspective 等增强
        - \`文件\`: ultralytics/data/augment.py:2384-2455
      - 验证集: YOLODataset(img_path, augment=False, rect=True, ...) — 仅 LetterBox 缩放

      ![image-20260507182241822](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260507182241822.png)

2. **训练 Epoch 循环，\`文件\`: ultralytics/engine/trainer.py:390-561**

   \`\`\`python
   epoch = 0  # 或 self.start_epoch (resume 场景)
   while True:
       self.epoch = epoch
       self.run_callbacks("on_train_epoch_start")
       self.scheduler.step()             # 更新 LR
       self._model_train()               # model.train(), 冻结层 BN→eval
       pbar = enumerate(self.train_loader)
       # Mosaic关闭机制
       pbar = enumerate(self.train_loader)  # InfiniteDataLoader
       for i, batch in pbar:
       	ni = epoch * nb + i  # 全局迭代步数
           # warmup阶段
           # 前向传播
           # 损失计算 — v8DetectionLoss
           # 反向传播
           # 梯度累积 + 优化器step
           # 日志记录
           
   #Validation        
           
           
           
       
   def _model_train(self):
           """Set model in training mode."""
           self.model.train()
           # Freeze BN stat
           for n, m in self.model.named_modules():
               if any(filter(lambda f: f in n, self.freeze_layer_names)) and isinstance(m, nn.BatchNorm2d):
                   m.eval()
   \`\`\`

   1. ![image-20260507183153561](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260507183153561.png)

   2. ![image-20260507183628697](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260507183628697.png)

   3. ![image-20260507184008195](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260507184008195.png)

   4. ![image-20260507184017573](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260507184017573.png)

   5. \`\`\`python
      a) 验证
      # 条件: args.val=True 或 最后 epoch 或 EarlyStopping 可能触发
      self.metrics, self.fitness = self.validate()
      self.validate() (engine/trainer.py:742) → 调用 DetectionValidator(self)：
      文件: ultralytics/models/yolo/detect/val.py:21-531
      - 遍历验证集，postprocess() 使用 NMS 后处理
      - 计算 per-image TP（对 10 个 IoU 阈值 0.5, 0.55, ..., 0.95）
      - 累积 DetMetrics：精度、召回、mAP@50、mAP@50-95
      - fitness = 0.9 * mAP50-95 + 0.1 * mAP50
      
      b) 保存 Checkpoint
      self.save_model()  # → last.pt, best.pt (if fitness improves)
      Checkpoint 包含：epoch, best_fitness, model (EMA), optimizer state_dict, scaler state_dict, train_args, metrics, results.csv, git info
      
      c) 指标记录与早停
      self.save_metrics(...)  # 追加到 results.csv
      self.stop |= self.stopper(epoch+1, self.fitness)  # 早停检查
      
      d) 循环终止
      if self.stop:
          break
      epoch += 1  # 进入下一个 epoch
      ---
      \`\`\`

3. **训练结束处理**

   \`文件\`: ultralytics/engine/trainer.py:563-573

   \`\`\`python
   self.final_eval()  # 剥离 optimizer 的 last.pt, 用 best.pt 做最终验证
   self.plot_metrics()  # 绘制训练曲线
   self.run_callbacks("on_train_end")
   self.run_callbacks("teardown")
   \`\`\`

   











##### 推理

\`\`\`bash
yolo task=detect mode=predict model=yolo11s.pt source=data/images device=0 line_width=1
\`\`\`



### YOLO 13

[YOLOv13一文弄懂 | YOLOv13网络结构解读 、yolov13.yaml配置文件详细解读与说明、YOLO虚拟环境安装、模型训练、验证、推理参数详细解析 | 通俗易懂！入门必看系列！-CSDN博客](https://blog.csdn.net/qq_45972324/article/details/150219592)





### YOLO 26

[2602.14582](https://arxiv.org/pdf/2602.14582)



> 主要功能

- **DFL 移除**
  分布式焦点损失（DFL）模块虽然有效，但常常使导出复杂化并限制了硬件兼容性。YOLO26 完全移除了 DFL，简化了推理过程，并拓宽了对**边缘和低功耗设备**的支持。
- **端到端无NMS推理**
  与依赖NMS作为独立后处理步骤的传统检测器不同，YOLO26是**原生端到端**的。预测结果直接生成，减少了延迟，并使集成到生产系统更快、更轻量、更可靠。
- **ProgLoss + STAL**
  改进的损失函数提高了检测精度，在**小目标识别**方面有显著改进，这是物联网、机器人、航空影像和其他边缘应用的关键要求。
- **MuSGD Optimizer**
  一种新型混合优化器，结合了[SGD](https://docs.pytorch.org/docs/stable/generated/torch.optim.SGD.html)和[Muon](https://arxiv.org/abs/2502.16982)。灵感来自 Moonshot AI 的[Kimi K2](https://www.kimi.com/)，MuSGD 将 LLM 训练中的先进优化方法引入计算机视觉，从而实现更稳定的训练和更快的收敛。
- **CPU推理速度提升高达43%**
  YOLO26专为边缘计算优化，提供显著更快的CPU推理，确保在没有GPU的设备上实现实时性能。
- **实例分割增强**
  引入语义分割损失以改善模型收敛，以及升级的原型模块，该模块利用多尺度信息以获得卓越的掩膜质量。
- **精确姿势估计**
  集成[残差对数似然估计](https://arxiv.org/abs/2107.11291) (RLE)，以实现更精确的关键点定位，并优化解码过程以提高推理速度。
- **优化旋转框检测解码**
  引入专门的角度损失以提高方形物体的检测精度，并优化旋转框检测解码以解决边界不连续性问题。





#### 实验结果

![image-20260508155749080](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508155749080.png)

![image-20260508155806061](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508155806061.png)





#### 网络结构与改动

"""Spatial Pyramid Pooling - Fast (SPPF) layer for YOLOv5 by Glenn Jocher."""

https://github.com/ultralytics/ultralytics/commit/f2d3aed634a5b0e4828024718d4a61ab2f83fb19#diff-70b1aad8c0068184a0e145431a251d90d480aed0226918c90cSa8ccd5a84f0f8.

![image-20260508160035757](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508160035757.png)

![image-20260508160112151](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508160112151.png)

![image-20260508160152227](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508160152227.png)

> SPPF

![image-20260508161007079](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508161007079.png)

n：池化层的数量

shortcut：残差

![image-20260508165235057](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508165235057.png)





> C3K2

![image-20260508165335641](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508165335641.png)

![image-20260508161532632](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508161532632.png)

\`\`\`properties
c1: 输入通道数
c2: 输出通道数
n:  Number of blocks.
c3k (bool): Whether to use C3k blocks.
+ attn (bool): Whether to use attention blocks.
g (int): Groups for convolutions.
shortcut (bool): Whether to use shortcut connections.
\`\`\`

![image-20260508162409276](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508162409276.png)

\`\`\`python
# 等价于

blocks = []
for _ in range(n):
    if attn:
        block = nn.Sequential(Bottleneck(...), PSABlock(...))
    elif c3k:
        block = C3k(...)
    else:
        block = Bottleneck(...)
    blocks.append(block)
self.m = nn.ModuleList(blocks)
\`\`\`



> head-Detect

![image-20260508165911918](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508165911918.png)

\`\`\`properties
# yolo v10 提出的，
one2many: 在后面的正样本匹配阶段，对于一个真实框，能匹配多个正样本
one2one: 对于一个真实框，能匹配一个正样本，梯度信息稀疏，做反向传播时不走完全程
\`\`\`

![image-20260508170255877](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508170255877.png)

![image-20260508170551054](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508170551054.png)

![image-20260508170654313](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508170654313.png)

![image-20260508171528133](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508171528133.png)

![image-20260508171638232](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508171638232.png)





#### 正样本匹配 & 损失函数

[YOLO26 ｜ 整体训练流程，以及 STAL 与 ProgLoss 处理节点_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1o2FzzsENp?spm_id_from=333.788.player.switch&vd_source=a97555db7a704882626ff6b3dff1617c)

![image-20260508183930029](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508183930029.png)

一对多指的是，针对于每一个GT框，会匹配10个正样本预测框

一对一指的是，针对于每一个GT框，会匹配1个正样本预测框，先筛选7，再留下一个

![image-20260508184325622](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508184325622.png)

![image-20260508184845692](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508184845692.png)

![image-20260508185132940](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508185132940.png)

> 代码

![image-20260508185528635](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508185528635.png)

> 疑问

1. 为什么one2one要分2次筛选

   ![image-20260508193838404](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508193838404.png)



#### 改进一：移除DFL

![image-20260508201858492](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508201858492.png)

![image-20260508210616735](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508210616735.png)

![image-20260508210633623](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508210633623.png)

![image-20260508210654209](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508210654209.png)

reg_max就是DFL的划分数量，在\`yolo26.yaml\`中指定





#### 改进二：NMS-free

End-to-End NMS-Free Inference；在推理阶段，如果我们设置了使用\`end2end=true\`的方式，则后处理是NMS-Free的

\`\`\`python
# 推理脚本
from Ultralytics import YOLO

model = YOLO("yolo26n.pt")
# Use one-to-one head (default, no NMS required)
results = model.predict("ultralytics/assets/bus.jpg") # interence
# metrics = model.val(data="coco.yaml") # validation

# Use one-to-many head (requires NMS)
# results = model.predict("image.jpg", end2end=False) # interence
# metrics = model.val(data="coco.yaml", end2end=False) # validation
\`\`\`

![image-20260508212113520](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508212113520.png)

不一定是640*640，这里指的是转成原图尺寸下的坐标

\`\`\`python
{
    "one2one":{
        'boxes': (1, 4, 8400)
        'scores': (1, 80, 8400)
    }
}
# 经过self._inference之后
Tensor(1, 4+80, 8400)

"""
经过 self.postprocess(y.permute(0,2,1))
# 6 = 4(坐标位置) + 1(类别置信度) + 1(类别索引)
基于Detect Head one2one 部分的输出数据，根据类别置信度，筛选出来的300个预测框
"""
Tensor(1, 300, 6) 

\`\`\`

<img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508213101409.png" alt="image-20260508213101409"  />

<img src="%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508213142783.png" alt="image-20260508213142783" style="zoom:67%;" />

\`筛选2代码\`: ultraltics > utils > nms.py > def non_max_suppression(...)

![image-20260508213418015](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508213418015.png)





#### 改进点三：ProgLoss 与 STAL

> ProgLoss

![image-20260508220111288](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508220111288.png)

\`代码\`：E2ELoss > call

![image-20260508220549029](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508220549029.png)

红色曲线表示one2many的权重的曲线

蓝色曲线表示one2one的权重的曲线

在每次更新权重的时候调用def update

> STAL

![image-20260508220849081](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508220849081.png)

![image-20260508221335037](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508221335037.png)

![image-20260508221505923](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260508221505923.png)

只在初筛时使用到，后面做loss时还是用的原GT框的size









#### 改进点四：MuSGD















### 网络模块

#### PRN

没完全搞懂

![image-20260506180719129](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506180719129.png)

![image-20260506180814315](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506180814315.png)

![image-20260506181829285](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506181829285.png)





#### CSP

![image-20260506182511794](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506182511794.png)

![image-20260506182828840](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506182828840.png)





#### 逐深度卷积

[演示分组，深度，深度可分离卷积｜3D卷积神经网络_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV12h4y1s7RY/?spm_id_from=333.337.search-card.all.click&vd_source=a97555db7a704882626ff6b3dff1617c)

[Animated AI](https://animatedai.github.io/)

![A depthwise convolution layer followed by a pointwise convolution layer making the combined process a depthwise-separable convolution](https://animatedai.github.io/media/depthwise-separable-convolution-animation-3x3-kernel.gif)





通过1 * 1 卷积去掌握完整信息，deep-wise卷积能降低计算量

### Ultralytics

#### 文件路径及代表的功能模块

\`\`\`css
├── docker                                  # 官方的 docker 版本（不用 docker 的话不用管）
├── docs                                  	# 官方文档
├── examples                                # 官方实例
├── test                                    # 测试文件
└── ultralytics                             # 核心的模型代码文件和其他工具组件
     ├── assets                             # 感觉好像没啥用的
     ├── cfg                                # --- 参数 ---
     │    ├── datasets                      	# 数据集的参数
     │    ├── models                        	# 各类模型的网络结构参数 rt-detr,v3,v5,v6,v8,v9,v10,v11
     │    ├── trackers                      	# ？ 部分参数文件
     │    └── default.yaml                  	# ！ 训练器默认会加载的参数
     ├── data                               # --- 数据处理 ---
     │    ├── explorer                      	# 可视化
     │    ├── scripts                       	# 获取数据的脚本文件
     │    ├── augment.py                    	# ！所有的数据增强类和实现
     │    └── ***.py                        	# 各类数据读取器、数据处理等相关代码
     ├── engine                             # --- 最底层的类定义 ---
     │    ├── model.py                      	# 模型基类
     │    ├── trainer.py                    	# 训练器基类
     │    └── ***.py                        	# 其他各种基类
     ├── hub                                # ？
     ├── models                             # --- 外层的类定义 ---
     │    ├── fastsam                       	# fast SAM 模型
     │    ├── nas                           	# NAS 模型
     │    ├── rtdetr                        	# RT-DETR 模型
     │    ├── sam                           	# SAM 模型
     │    │    └── modules                  		# SAM中用到的网络结构的实现，encoder、decoder等
     │    ├── utils                        		# 各网络中公用的基础组件
     │    └── yolo                          	# YOLO 模型
     │         ├── classify                			# 分类任务
     │         ├── detect                   		# 检测任务
     │         ├── obb                      		# Oriented Bounding Box 3D包围盒
     │         ├── pose                     		# 姿态估计
     │         └── segment                  		# 分割任务
     ├── nn                                 # --- 公用的神经网络组件 ---
     │    └── modules                       	# 公用的基础网络结构的实现
     ├── solutions                          # --- 一些偏专用的解决方法 ---
     ├── trackers                           # ？
     │    └── utils                         	# 该任务中公用的基础组件
     └── utils                              # --- 在架构各阶段用到的公用的基础组件 ---
          └── callbacks                     	# ？ 回调函数、可视化等基础组件

\`\`\`

#### 参数设置相关

> 默认参数

![image-20260507154408038](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260507154408038.png)

1. task & mode
2. [x]-settings
   1. train 
   2. val / test
   3. predict
   4. visualize
   5. export
   6. 超参数



# TODO

- 插值
- CSP
- ![image-20260506173215343](%E7%9B%AE%E6%A0%87%E6%A3%80%E6%B5%8B.assets/image-20260506173215343.png)



`;export{n as default};
