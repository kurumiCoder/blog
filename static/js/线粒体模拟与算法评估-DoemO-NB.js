const n=`# 线粒体模拟与算法评估



先做一个像 0-JJY 原图的模拟系统，再用同一批图比较算法。模拟程序保存已知答案，后续可以直接量出漏分、粘连和追踪错误。



## EXP-07 用真实 C2 局部校准模拟



![同尺度对照：真实 C2、半模拟图和生成标签](./assets/mito-benchmark/exp07-calibrated-preview.png)

左列为第 1、30、60 帧的真实图，中列保留弯管、环和分支的形态及局部亮暗变化，右列是生成图里预设的对象。每行两张灰度图使用相同的显示范围和尺度。模板从原图提取，只在生成图中有已知标签。真实图里的弱连接仍可能无法判定。

- **数据来源**：0-JJY / Control / CTRL_0001.tif 的 C2，60 帧，1024 × 1024，0.1243 µm/像素，60 秒/帧。低信号背景约 155 灰度单位，高频残差噪声估计为 3.22–3.28。
- **两类输入**：可控细管用于拆开测间距、信噪比、长度和强弱反差。真实形状模板用于测复杂轮廓。背景从同帧暗区取样。当前只校准了这个样本的三处局部。
- **当前结果**：共 93 张，Mitometer 阈值 10 已跑完并生成热图。MitoSegNet 待用同批图预测。两种方法完成后再比较分数。

[参数记录](D:/ai/dy/mitochondria/experiments/0-JJY/EXP-07-JJY-Calibrated-Benchmark/design.json) · [Mitometer 热图](D:/ai/dy/mitochondria/experiments/0-JJY/EXP-07-JJY-Calibrated-Benchmark/mitometer_heatmaps.png)



## EXP-06 两条细线的分割结果



![两条弯曲细线的生成真值和模拟图](./assets/mito-benchmark/simulation-example.png)

两条宽约 5 像素的弯曲细线，间隙为 1、3 或 6 像素。每档信噪比有 6 张图。Dice 衡量预测与真值的重合程度，越接近 1 越好。若同一个预测对象覆盖了两条真值细线各至少 10% 的面积，计为粘连。

| 信噪比 | Mitometer 阈值 10：平均 Dice／粘连 | MitoSegNet γ=0.55、最小 16 像素：平均 Dice／粘连 |
| --- | --- | --- |
| 3 | 0.42／0 张 | 0.53／4 张 |
| 6 | 0.83／2 张 | 0.58／3 张 |
| 12 | 0.86／2 张 | 0.71／1 张 |

**弱信号时，MitoSegNet 的重合度更高，但 6 张里有 4 张粘连。** Mitometer 这档没有粘连，Dice 却更低。结合逐图召回率看，暗线漏分是它的主要问题。中、强两档，Mitometer 的 Dice 更高。这说明评估暗线时要同时看漏分和粘连，两项可能指向不同的选择。结果只适用于这批模拟图。

[逐图评分](D:/ai/dy/mitochondria/experiments/0-JJY/EXP-06-Segmentation-Robustness/segmentation_scores.csv)



## 分割先做三张热图



每格用至少 3 个独立噪声种子。所有算法用同一批模拟图，保留各自固定的输入流程。

![Mitometer 图 3a：间距与信噪比](./assets/mito-benchmark/mitometer-fig3a-separation-zh.png)

**间距 × 信噪比**。看两条能否分别检出。除了检出个数，还记录漏掉一条和两条粘成一块的比例。

![Mitometer 图 3b：长度与信噪比](./assets/mito-benchmark/mitometer-fig3b-size-snr-zh.png)

**长度 × 信噪比**。看短管、长管何时漏掉或断成几段。加报检出率、断裂率和中心线长度误差。

![Mitometer 图 3c：长度与强弱反差](./assets/mito-benchmark/mitometer-fig3c-intensity-zh.png)

**长度 × 强弱反差**。看亮目标附近的暗目标还能否检出。加报暗目标召回率和背景误分。三张示意图源自 [Mitometer 论文图 3](https://www.nature.com/articles/s41592-021-01234-z/figures/3)。

补测粗细、密度、分支和纹理背景。报告像素 Dice、精确率、召回率、对象面积和长度误差，同时记录一对多断裂、多对一粘连。形态指标可参考 [MitoSegNet 论文图 3](https://pmc.ncbi.nlm.nih.gov/articles/PMC7554024/#fig3)。真实图无参考分割时，可测覆盖和扰动稳定性。



## 分割模拟通过后，再测跟踪



![Mitometer 图 3i–j：分裂融合的模拟评估](./assets/mito-benchmark/mitometer-fig3ij-zh.png)

- **已知运动**。生成带编号的时间序列，改变密度、位移和短时信号减弱。报告匹配率、身份切换、轨迹中断、速度和寿命误差。
- **已知事件**。同时放入真实分裂／融合，以及擦肩、变暗、出现和消失。检查算法会不会把后几种误报成事件，报告事件精确率、召回率和误报率。

实施顺序：校准 0-JJY → 生成少量样图并验收 → 跑完整分割热图 → 再做动态序列。动态序列单独校准后再运行。
`;export{n as default};
