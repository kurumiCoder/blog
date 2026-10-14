const n=`# exp1

## 01

\`\`\`
我现在需要你帮我设计并实际推进一个“2D线粒体时序图像追踪”的完整实验方案。

## 一、我的数据情况

我有一组自己的私有 2D 线粒体荧光显微镜时序数据，格式为 TIFF。

其中一个时间序列文件类似：

C1-sample_9.tif

目前我已经用 IrfanView 打开过该 TIFF。

这个 TIFF 是一个多帧时序图像，而不是单张图片。截图中显示的是其中某一个时间帧。

图像尺寸大约为：
1033 × 1027

截图中的线粒体并不是几个彼此独立的小目标，而是大量线粒体结构组成的复杂网络，存在：

- 相互靠近
- 交叉
- 弯曲
- 连接
- 分裂/融合可能性
- 随时间发生形态变化
- 部分区域非常密集

因此，我不是想做普通的“目标检测 + 最近邻跟踪”。

我的最终研究方向是希望使用：

MitoGraph + MitoTNT

或者其他适合线粒体网络的算法，对这组 2D time-lapse mitochondria 数据进行追踪。

---

# 二、我真正想解决的问题

我现在最大的困难不是“怎么安装 MitoTNT”，而是：

我的数据没有人工 tracking ground truth。

因此我不知道：

1. MitoGraph 分割出来的线粒体是否正确？
2. MitoTNT 得到的 tracking 是否真的正确？
3. 如果没有官方 GT，我怎么证明 MitoTNT 的结果有效？
4. MitoTNT 原论文到底是怎么验证 tracking 效果的？
5. MitoTNT 原论文主要针对 3D+time，而我的数据是 2D+time，那么应该如何适配？
6. 最终论文中应该使用什么指标证明结果可靠？

请不要只告诉我“肉眼观察结果”或者“做人工标注”。

我要一个可以真正执行的实验方案。

---

# 三、首先请你研究 MitoTNT 原论文和官方实现

请先确认 MitoTNT 原论文：

MitoTNT: Mitochondrial Network Tracking

以及官方代码/文档。

重点分析：

1. MitoTNT 的输入是什么？
2. MitoGraph 在整个 pipeline 中负责什么？
3. MitoTNT 具体负责什么？
4. tracking 的基本对象是什么？
   - mitochondria object？
   - skeleton node？
   - edge？
   - network？
5. 原论文到底使用什么数据验证？
6. 原论文有没有真实实验数据的人工 GT？
7. 原论文有没有 simulation ground truth？
8. 原论文的 tracking precision 是怎么计算的？
9. 原论文中的 manual tracking 是怎么做的？
10. 原论文有没有 baseline？
11. 原论文有没有 ablation，例如：
    distance only
    vs
    distance + topology
12. 原论文如何验证真实实验数据上的 tracking 是否可信？
13. 原论文的 3D tracking 方法如果应用到 2D 数据，会有哪些问题？

不要根据印象回答，尽可能直接阅读论文和官方代码，确认具体实现。

---

# 四、特别注意：不要把 MitoGraph 和 MitoTNT 混为一谈

请严格区分：

Raw image
    ↓
MitoGraph
    ↓
segmentation / mitochondrial mask
    ↓
skeleton
    ↓
MitoTNT
    ↓
temporal tracking

也就是说：

MitoGraph ≈ 单帧线粒体结构提取/骨架化

MitoTNT ≈ 跨时间帧进行网络节点/结构追踪

不要把两者当成互相竞争的 tracking 算法。

---

# 五、我的核心研究问题

我最终想回答：

“对于我的 2D 线粒体时序数据，MitoTNT 得到的 tracking 是否真实有效？”

请给我设计一套严谨的验证体系。

不能要求我给整个数据集所有帧制作人工 GT，因为这是不可行的。

我希望采用：

“小规模、高质量人工 GT + 自动化评价”

的方案。

---

# 六、请设计人工 GT 的制作方案

例如：

从整个时序数据中选择若干代表性 ROI / 时间段。

例如：

20 个连续时间帧。

然后人工确认相邻帧之间的正确对应关系。

例如：

Frame t：

node A
node B
node C
node D

Frame t+1：

node A'
node B'
node C'
node D'

人工确认：

A → A'
B → B'
C → C'
D → D'

这些人工确认结果作为 tracking ground truth。

请你设计：

1. 如何选择 ROI？
2. 如何选择时间段？
3. 应该选择多少帧？
4. 应该标多少个 node？
5. 如何保证样本具有代表性？
6. 是否应该专门选择：
   - 稀疏区域
   - 密集区域
   - 交叉区域
   - 形态变化区域
   - fusion/fission 区域
7. 如何避免只选择“容易追踪”的样本？

最好给出一个实际可执行的数量，例如：

- 20 帧
- 3~5 个 ROI
- 每个 ROI 100~300 个人工确认关联

或者根据我的数据规模给出更合理的数字。

---

# 七、设计 tracking evaluation

至少考虑以下指标：

## 1. Tracking accuracy / precision

正确关联数 / 人工确认关联总数

例如：

Correct associations / Total GT associations

## 2. False association

错误关联数量。

例如：

真实：
A → C

算法：
A → B

这种情况必须统计。

## 3. Missing association

真实存在：

A → A'

但是算法没有建立关联。

统计漏关联。

## 4. Identity switch

例如：

t1：A
t2：A
t3：B
t4：A

这种情况属于 ID switch。

请给出适合这个场景的定义和计算方法。

## 5. Track continuity

例如：

A A A A A A

属于连续稳定轨迹。

而：

A A ? B ? C

说明轨迹断裂/ID发生变化。

请设计合理指标。

## 6. 如果适用，请考虑标准 MOT 指标

例如：

- IDF1
- ID switches
- MOTA
- HOTA

但是不要机械套用目标检测 MOT 指标。

请判断这些指标对于“线粒体网络 skeleton node tracking”是否合理。

如果不合理，请说明原因，并设计更适合 MitoTNT 的指标。

---

# 八、一定要设计 baseline

我不希望最终只得到：

“MitoTNT accuracy = 94%”

因为没有比较对象。

至少设计：

Baseline 1：
Nearest Neighbor tracking

也就是：

当前帧 node
    ↓
寻找下一帧欧氏距离最近的 node
    ↓
建立关联

Baseline 2：
Distance-based tracking

如果 MitoTNT 原论文有更具体的 distance-only 方法，请按照原论文定义。

Baseline 3：
MitoTNT

比较：

Nearest Neighbor
vs
Distance-only
vs
MitoTNT

如果我的数据特点不适合其中某个 baseline，请解释。

---

# 九、重点验证 MitoTNT 的“拓扑优势”

这是我特别关心的。

MitoTNT 的核心思想不是单纯根据空间距离进行关联，而是利用 mitochondrial network topology。

因此请设计一个 ablation：

A：
只使用空间距离

B：
空间距离 + network topology

比较：

- tracking accuracy
- false association
- missing association
- ID switch
- track continuity

特别关注：

线粒体密集、交叉、相互靠近的区域。

因为这些地方最容易出现：

nearest neighbor：

A → B

而真实应该：

A → C

如果 MitoTNT 真正有效，理论上应该在这些困难区域明显优于简单距离匹配。

---

# 十、不要只做“人工 GT”，还要设计 biological validation

即使人工 GT 做得很好，也需要证明 tracking 结果符合生物学规律。

请设计：

1. mitochondrial velocity
2. displacement
3. mean squared displacement（MSD）
4. motility
5. track length
6. track lifetime
7. fusion/fission events（如果数据足够支持）
8. 网络拓扑变化

并说明：

哪些指标可以与已有文献比较？

哪些结果可以作为“合理性验证”，而不能称为“ground truth”？

一定要区分：

ground truth validation

和

biological plausibility validation

不要混淆。

---

# 十一、特别分析我的 2D 数据和原版 MitoTNT 的兼容性

这是非常重要的一部分。

原版 MitoTNT 主要面向：

3D + time

而我的数据是：

2D + time

请详细分析：

1. 原版 MitoTNT 是否可以直接处理 2D？
2. 如果不能，最小修改是什么？
3. 是否可以把 z dimension 设置为 1？
4. MitoGraph 是否能产生适用于这种情况的 2D skeleton？
5. MitoTNT 的 topology similarity 是否依赖 3D？
6. distance metric 是否需要修改？
7. skeleton node coordinate 是否需要修改？
8. 是否存在 2D 特有的拓扑歧义？
9. 哪些原论文结论不能直接迁移到我的 2D 数据？

不要为了让我运行起来而忽略这些问题。

如果 MitoTNT 原版实际上不适合 2D，请明确告诉我。

---

# 十二、针对我的数据给出完整 pipeline

最终请给出一个真正可以执行的流程：

Raw TIFF
↓
数据读取
↓
检查：
- frame 数量
- image size
- bit depth
- pixel size
- frame interval
- 是否漂移
↓
预处理
↓
MitoGraph / segmentation
↓
mask
↓
skeleton
↓
检查 skeleton 质量
↓
2D MitoTNT / adapted MitoTNT
↓
tracking result
↓
人工 GT
↓
evaluation
↓
baseline comparison
↓
biological validation
↓
最终统计结果

---

# 十三、我希望你直接帮我检查我的实际数据

我已经提供了一个代表性时间帧截图。

这个图像的特点是：

- 2D
- 线粒体外膜/线粒体网络
- 线粒体非常密集
- 有明显的环状/网状结构
- 存在大量相互接近的结构
- 不是简单孤立目标

请结合这个图像判断：

1. 这种数据是否适合 MitoGraph？
2. MitoGraph 应该提取什么？
3. skeleton 是否合理？
4. MitoTNT 的 node tracking 是否适合这种数据？
5. 最大的 tracking 难点是什么？
6. 是否存在严重的 2D overlap / crossing ambiguity？
7. 应该如何选择人工 GT？

不要仅凭图片下最终结论，如果必须查看完整 TIFF 才能判断，请明确告诉我需要什么数据。

---

# 十四、最终希望得到的结果

请不要只给我理论介绍。

我最终需要你输出：

## A. 原论文验证方法总结

用表格：

| 验证方式 | 数据 | 是否有 GT | 指标 | 用途 |
|---|---|---|---|---|

## B. 我的数据应该怎么做

给出详细步骤。

## C. 人工 GT 制作规范

告诉我具体标什么。

## D. evaluation.py 的设计

最好直接设计一个 Python 程序，可以读取：

ground_truth.json
prediction.json

然后自动计算：

- accuracy
- precision
- recall
- ID switch
- track continuity
- IDF1（如果适用）
- 其他推荐指标

## E. baseline 实现

至少：

Nearest Neighbor

以及：

MitoTNT

## F. 最终实验表格

例如：

| Method | Accuracy | Recall | ID Switch | Track Continuity |
|---|---:|---:|---:|---:|
| Nearest Neighbor | | | | |
| Distance only | | | | |
| MitoTNT | | | | |

## G. 最终论文应该怎么写

给出一段可以用于论文“实验验证”部分的正式表述。

---

# 十五、最重要的要求

不要假设“没有官方 GT = 无法验证”。

MitoTNT 原论文本身就是：

Simulation GT
+
Manual tracking
+
Biological validation

的组合。

请围绕这个思想，为我的私有 2D time-lapse 数据建立一个严谨的验证体系。

另外：

不要为了得到一个漂亮的结果而默认 MitoTNT 是正确的。

如果实验结果显示：

Nearest Neighbor ≈ MitoTNT

或者：

MitoTNT 在我的 2D 数据上表现不好

也必须如实指出。

我的目标是：

“证明 MitoTNT 是否真的适合我的数据”

而不是：

“想办法证明 MitoTNT 是好的”。

请优先保证实验设计的科学性、可重复性和可解释性。
\`\`\`



\`\`\`
如果当前环境可以直接访问我的 TIFF 文件，请不要只给方案。请先检查实际数据的：

- TIFF 总帧数
- 每帧尺寸
- bit depth
- 是否为真正的 time-lapse
- frame interval（如果 metadata 中存在）
- pixel size（如果 metadata 中存在）
- 图像动态范围
- 是否存在明显漂移
- 相邻帧变化情况

然后再基于实际数据修改实验方案。

如果无法读取原始 TIFF，请明确告诉我，而不要根据截图假设数据参数。
\`\`\`

**这点很重要。**你现在这张截图只能证明“这是一个典型的 2D 线粒体图像帧”，但真正决定后续 MitoGraph/MitoTNT 怎么跑的，是 **TIFF 里面到底有多少帧、帧间隔、像素尺寸、数据类型以及实际时序变化**。

如果 CLI AI 能直接操作文件，最好让它**先分析 TIFF，再决定 pipeline**，不要让它先写一大堆代码



## 02







































`;export{n as default};
