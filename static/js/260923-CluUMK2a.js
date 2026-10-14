const n=`# MitoTNT

只讲test_data的流程

## 1. 准备数据

### 示例

MitoTNT 要求原始延时影像为一系列 3D 图像栈（TIFF）。
每个时间帧应放在各自的文件夹中，其中包含单个 \`.tif\` 文件：

\`\`\`text
frame_000/frame_000.tif
frame_001/frame_001.tif
frame_002/frame_002.tif
...
\`\`\`

这种格式便于 MitoGraph 将输出写回每个帧的文件夹。



### 分析

<a href="E:\\ai\\dy\\mitochondria\\mitoTNT\\test_data\\mitograph\\frame_000\\frame_000.tif">示例图 </a>



<img src="260923.assets/image-20260917180649794.png" alt="image-20260917180649794" style="zoom:80%;" />

xx.tif原始荧光显微镜图像——每帧一个 z 堆栈（3D），MitoGraph 的输入。

frame_000.tif 实测：

- 多页 TIFF：49 层 z（49 张切片），每层 171×332 像素
- 16-bit 灰度，未压缩
- 文件信息 {"shape": [49, 171, 332]}，大小 ≈ 49×171×332×2 B ≈ 5.6 MB
作用链：
frame_xxx.tif（原始图像）
   └─ MitoGraph 读取 → 分割 → 写出 .coo/.gnet/.txt/.vtk（同目录）
        └─ MitoTNT 读取这些 → 追踪
所以 test_data/mitograph/ 里每个 frame_xxx/ 都是「1 个 tif + MitoGraph 输出」；
- 按示例像素尺寸 0.145 μm/pixel 算，视野约 48×25 μm，z 深度约 7 μm。

> 自有数据

E:\\ai\\dy\\DATASET\\mito\\ 下 20 个样本 C1-sample_0.tif … _19.tif，都是\`ImageJ 2D \`时序图：

| 样本         | 帧数    | 帧间隔   |
| ------------ | ------- | -------- |
| sample_0–5   | 117–118 | 6.42 秒  |
| sample_6–11  | 71–72   | 60 秒    |
| sample_12–19 | 200     | 28–55 秒 |

关键：元数据里只有 frames、没有 slices → 每帧是一张平面 2D 图，整个文件是「2D + 时间」，没有 z 层（不是 3D），同时一帧图片当中存在多个线粒体网络。



==和 MitoTNT 的矛盾==
MitoTNT 整条流程（MitoGraph 分割 → 骨架图 → 追踪）是为 3D z 堆栈设计的，要求结构是：
样本目录/frame_000/frame_000.tif   ← 每个 tif = 该时间点的 3D 堆栈
样本目录/frame_001/frame_001.tif

==可选方案==

- A（推荐）：先问数据提供者「有没有 z-stack 原始数据/是不是 3D 采集」。如果有，直接用原始 3D 数据。
- B：把这份 2D 数据当「z=1 的 3D」用——写个转换脚本，把每个样本拆成 frame_XXX/frame_XXX.tif 结构，可选 z=1 或复制成 2~3 层。先拿一帧试跑 MitoGraph，确认它能处理单层；另外 2D 时扩散系数公式应为 MSD=4Dt（现在是按 3D 的 6Dt），分析时要注意。
- C：如果只是想练手，继续用仓库自带的 test_data



==需要确认三件事：==

1. 提供者说这是 3D 数据吗？还有别的文件吗（比如 z-stack 或原始格式）？
2. 像素尺寸是多少？TIFF 头里是 8.045 px/单位、unit=micron → 约 0.124 μm/像素，对吗？
3. 确认走方案 B 的话：我先写 scripts/prepare_time_lapse.py（样本 tif → frame_XXX/frame_XXX.tif，16-bit 保留，z 层可选），先处理 sample_0 的前 10 帧试跑验证，再全量跑？

## 2. 使用 MitoGraph 分割线粒体

### 生成物

MitoGraph 接收每个 3D 图像栈并生成：

- 用于可视化的表面网格 \`.vtk\`。
- 描述网络结构的配套 \`.gnet\`、\`.coo\` 和 \`.txt\` 文件。

\`\`\`
frame_000/
├── frame_000.tif                 # 原始图像（输入；完整版脚本里是硬链接）
├── frame_000.png                 # 分割结果快照，供人工检查
├── frame_000.coo                 # 网络节点坐标表
├── frame_000.gnet                # 简单图边表
├── frame_000.txt                 # 逐段节点表
├── frame_000_mitosurface.vtk     # 分割出的 3D 线粒体表面网格
├── frame_000_skeleton.vtk        # 骨架中心线
├── frame_000_nodes.vtk           # 网络节点球
├── frame_000.mitograph           # 该帧分割统计
└── mitograph.config              # 本帧运行参数 + 路径 + 时间
\`\`\`

| 文件                | 内容                                                         | 使用方                                           |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------ |
| \`*.tif\`             | 原始显微镜图像                                               | MitoGraph 输入                                   |
| \`*.coo\`             | 网络节点坐标 \`(x, y, z)\`，单位 μm                            | **MitoTNT 核心输入**                             |
| \`*.gnet\`            | 简单图边表：\`node_a, node_b, distance(μm)\`，首行为表头       | **MitoTNT 核心输入**                             |
| \`*.txt\`             | 逐段节点表（制表符分隔）：\`line_id / x / y / z / pixel_intensity / width_(um)\`；每个 \`line_id\` 是一条段，行序即沿骨架的体素顺序 | **MitoTNT 核心输入**                             |
| \`*_mitosurface.vtk\` | 分割出的线粒体表面网格                                       | \`visualize_segmented_data()\` → ChimeraX 检查分割 |
| \`*_skeleton.vtk\`    | 骨架中心线                                                   | 可视化（可选）                                   |
| \`*_nodes.vtk\`       | 网络节点球                                                   | 可视化                                           |
| \`*.png\`             | 分割结果快照                                                 | 人工检查                                         |
| \`*.mitograph\`       | 该帧统计：平均宽度、标准差、总长度、体积                     | 参考                                             |
| \`mitograph.config\`  | 本帧运行参数、数据路径、运行时间                             | 记录与复现                                       |







==MitoTNT 实际读取哪些==

- **提取骨架图**（\`SkeletonizedMito.extract_graphs\`）：\`.coo\` + \`.gnet\` + \`.txt\`
- **可视化**：\`*_mitosurface.vtk\`（分割检查）、\`*_skeleton.vtk\`（可选）
- 其余文件（png/vtk/nodes/mitograph/config）仅供人工查看与记录，不影响追踪结果

> .coco —— 节点坐标

\`\`\`
17.5450	19.8650	6.2350
23.0550	10.8750	6.2350
16.5300	19.5750	6.0900
\`\`\`

- **每一行 = 一个网络节点**（骨架的端点或分支点）
- 3 列：\`x  y  z\`，单位 μm，保留 3~4 位小数
- **行号（0 开始）就是节点 id**；\`.gnet\` 里的节点编号、\`.txt\` 段两端的坐标都对应这里

> .gnet —— 节点间的线段长度

\`\`\`
389
388	387	0.43500
386	378	0.32427
383	382	0.6151
\`\`\`

- **第 1 行**：网络节点总数
- **之后每一行 = 一条边（一段骨架）**：\`节点a  节点b  边长\`
  - \`节点a/节点b\`：\`.coo\` 中的节点 id
  - 第 3 列：该边长度，单位 μm
- 边数（265）= \`.txt\` 中的段数；每个节点只出现在它所属的边上

>.txt ——  段内节点

<img src="260923.assets/image-20260922225309369.png" alt="image-20260922225309369" style="zoom: 80%;" />

\`\`\`
line_id  point_id  x        y        z       width_(um)  pixel_intensity
0        0         20.01000 12.47000 0.58000 0.11681     678.66667
0        1         20.01000 12.61500 0.58000 0.28485     974.83333
0        2         20.01000 12.76000 0.58000 0.24537     1012.16667
1        0         19.57500 4.35000  0.72500 0.32891     1284.66667
\`\`\`

- **之后每一行 = 段上的一个采样点**（体素级，比 \`.coo\` 细得多）：
  - \`line_id\`：段编号（0 起）；同一 \`line_id\` 的若干行按 \`point_id\` 顺序串成一条段
  - \`point_id\`：该点在段内的顺序（0 起；0 和最后一个点就是段两端的网络节点，坐标与 \`.coo\` 对应）
  - \`x, y, z\`：坐标，单位 μm
  - \`width_(um)\`：该点处线粒体管径，单位 μm（MitoTNT 的 width 特征来源）
  - \`pixel_intensity\`：该点在原始图里的灰度值（16-bit 原始值）
- 例外：只有孤立节点没有段，不会出现在 \`.txt\` 中；程序按坐标匹配回 \`.coo\`

> 三者如何组成 MitoTNT 的三种图

| 图                               | 由什么构成                                                   |
| -------------------------------- | ------------------------------------------------------------ |
| **full graph**（全节点图）       | 网络节点来自 \`.coo\`；段内中间点来自 \`.txt\` 逐行；相邻点连边，边长 = 两点欧氏距离 |
| **simple graph**（简单图）       | 节点 = \`.coo\` 的 389 个网络节点；边 = \`.gnet\` 的 265 条边及其长度 |
| **local simple graph**（局部图） | 对 full graph 按节点邻域做边收缩得到，用于追踪时的拓扑代价   |

> *.vtk

\`*_mitosurface.vtk\`

<img src="260923.assets/image-20260922202843944.png" alt="image-20260922202843944" style="zoom:67%;" />

\`*_skeleton.vtk\`

![image-20260922202947267](260923.assets/image-20260922202947267.png)

\`*_nodes.vtk\`

![image-20260922203154773](260923.assets/image-20260922203154773.png)





### 运行

通过 MitoTNT 运行它：

\`\`\`python
import mitotnt

seg = mitotnt.MitoSegmenter('D:/GitHub/MitoTNT/test_data/mitograph', 
                            xy_pxl_size=0.145, z_pxl_size=0.145,  # add image pixel sizes in microns/pixel
                            mitograph_path=r'E:\\ai\\dy\\mitochondria\\MitoGraph_Win10')  
seg.run_mitograph_cpu(max_workers=10) # specify the number of threads
\`\`\`

- \`xy_pxl_size\` 和 \`z_pxl_size\` 是**每像素的微米数**，对缩放很重要。

\`\`\`python
seg.visualize_segmented_data()
\`\`\`

这会生成一个 \`.cxc\` 脚本，用于将原始 TIFF 与分割后的表面一起进行可视化质量检查。可以在 **ChimeraX** 中预览分割结果：





## 3. 提取骨架图

为追踪做准备，你需要从 MitoGraph 的输出构建图：

\`\`\`python
skel = rtd.extract_graphs(seg, num_workers=args.nw, overwrite=args.overwrite, save_path=str(run_dir))

def extract_graphs(seg, num_workers: int, overwrite: bool = False, save_path: str = None):
    """读取每帧 MitoGraph 输出，构建 full / simple / local 三种骨架图。
    save_path 传给 SkeletonizedMito：指定结果目录（默认 None = 原默认位置）。
    下游的轨迹、扩散、可视化与特征表都会跟随该目录。
    """
    import mitotnt

    skel = mitotnt.SkeletonizedMito(seg, save_path=save_path)
    # 已存在 extracted_graphs.npz 且 overwrite=False 时直接加载缓存
    skel.extract_graphs(overwrite=overwrite, num_workers=num_workers)
    print(f"骨架图已就绪，缓存文件: {Path(skel.save_path) / 'extracted_graphs.npz'}")
    return skel
\`\`\`

\`\`\`python
def extract_graphs(self, overwrite: bool = False, node_gap_size: int = 0, num_workers: int = 20):
        if os.path.exists(self.save_path+'extracted_graphs.npz') and not overwrite:
            self._load_graphs()
            log("Graphs have already been extracted. Reload previous data.\\n")
        else:
            self.extract_full_graphs_and_segment_nodes(node_gap_size=node_gap_size,
                                                       num_workers=num_workers)
            self.extract_simple_graphs(num_workers=num_workers)
            self.extract_local_simple_graphs(num_workers=num_workers)
            self._save_graphs()
\`\`\`

这些图捕获线粒体的位置和连通性，是追踪的输入

> 流程

1. **extract_full_graphs_and_segment_nodes —— full graph + 逐段节点表;**

   把 .coo 的网络节点 + .txt 的逐段采样点拼成一张完整的 igraph 图（full graph），并输出每段的节点序列。
   .coo（389 个网络节点，坐标 μm）─┐
                                  										 ├─► full graph（顶点 + 带距离的边）+ frame_segment_nodes
   .txt（265 条段、1945 个采样点）─┘
   ==按代码顺序的 6 步==

   1. \`校验与读取\`：读 .coo → [N,3] 坐标；读 .txt → 表格。

   2. \`坐标舍入 + 建 KD 树\`：.txt 端点坐标四舍五入 3 位，才能和 .coo 精确对上；建 cKDTree 用于"坐标→网络节点 id"的最近邻查找。

   3. \`初始化\`：

      - 389 个基础顶点，coords 直接用 .coo，intensity/width 先填 NaN。

      - \`\`\`python
        line_groups = {k: v.reset_index() for k, v in segment_node_data.groupby('line_id')}
        \`\`\`

   4. \`逐段处理（对每个 line_id）\`：

      <img src="260923.assets/image-20260918160824325.png" alt="image-20260918160824325" style="zoom:67%;" />

      - 段首/段尾坐标在 KD 树里找最近网络节点 → index_end_a / index_end_b；
      - 用 .txt 的未舍入坐标、强度、管径覆盖这两个端点的属性；
      - 沿段采样点行走，新增"体素级中间节点"（id 从 389 起递增）并连边，边长 = 两点欧氏距离（μm）；
      - 走到最后一个采样点时，把当前节点连到 index_end_b，该段结束，记入 frame_segment_nodes。
        - 源码默认会漏掉最后一个段内节点
   5. \`批量提交\`：一次 add_vertices + 一次属性赋值 + 一次 add_edges（避免 python-igraph 逐节点增量的 O(N²)）。
   6. \`返回 (full_graph, frame_segment_nodes)\`
   7. 两个容易忽略的规则

     - 跳点规则（node_gap_size=0 时）：每段索引 0 和最后一步不新增节点，只有中间点成为节点。所以每段新增 len−3 个节点，每段最后一个段内点不会成为节点，它直接被"当前节点→末端网络节点"一条边跨过。

     - 节点编号：0 ~ 388 是 .coo 的网络节点，389 起是段内节点；顶点属性 index 恒等于顶点 id。
       frame_000 的结果就是：1539 个顶点（389 + Σ(len−3)）、265 段边，frame_segment_nodes 里 265 条节点序列（每条首尾是网络节点 id）。

2. **extract_simple_graphs                  —— simple graph;**

   流程大致一样，不带bulk结点的图

3. **extract_local_simple_graphs            —— 每节点局部 simple graph;**

   1. 取其所在连通分量 (components() 得到 membership) 的诱导子图 induced_subgraph（副本，修改不到共享的 full graph）;

   2. 在子图中定位该节点（root = frag.vs['index'].index(node_index)）;

   3. 调 _contract_edges 收缩度=2 链，得到只含该节点邻域的简单图

      \`\`\`python
      frame_full_graphs = _WORKER_FULL_GRAPHS[frame_idx]
      
      # 读取该帧图的节点数
      total_num_nodes = len(frame_full_graphs.vs)
      
      # 连通分量 (fragment) 划分
      all_frags = frame_full_graphs.components()
      
      # 逐节点：收缩边，得到以该节点为根的简单图
      frame_simple_graphs_per_node = []
      
      for node_index in range(total_num_nodes):
          # 用 full graph 的节点 id 取所在连通分量的诱导子图
          frag = frame_full_graphs.induced_subgraph(all_frags[all_frags.membership[node_index]])
      
          # 找到该节点在 fragment 局部图中的 id
          root = frag.vs['index'].index(node_index)
      
          # 收缩边，提取该节点邻域内的 simple graph
          simple_graph = _contract_edges(frag, root)
          frame_simple_graphs_per_node.append(simple_graph)
      
      return frame_simple_graphs_per_node
      \`\`\`

      <a href="E:\\ai\\dy\\mitochondria\\mitoTNT\\exp\\run_20260922_203321\\local_graph\\000_full.png">提取过程</a>

4.  **_save_graphs                           —— 压缩为 npz 缓存。**

## 4. 追踪线粒体网络

<a href="E:\\ai\\dy\\mitochondria\\mitoTNT\\tmp\\mitotnt.drawio">流程图</a>



### 运行

追踪利用空间和网络信息将网络片段跨时间点连接起来：

\`\`\`python
tracker = mitotnt.NetworkTracker(skel, frame_interval=3.3)  # frame interval in seconds per frame
tracked = tracker.run()
\`\`\`

* 该算法跨帧映射节点，为每个线粒体片段构建轨迹。
* 结果写入 \`save_path\` 目录（此处为 \`exp/quick_start/\`；默认为 \`<数据父目录>/mitotnt/\`）：\`mito_node_tracks.csv\`（所有节点轨迹）。

如果你已经运行过一次，可以重新加载结果而无需重新计算，以便继续后续章节：

\`\`\`python
tracked = tracker.reload_results()
\`\`\`

你还可以将追踪限制在帧的子集内，或跳过某些帧（适用于较慢的过程或更快的处理）。

\`\`\`python
tracker = mitotnt.NetworkTracker(skel, frame_interval=3.3,
                                 start_frame=10, end_frame=30,
                                 tracking_interval=2)
\`\`\`

### 原理

对每一个相邻帧对循环：

    1. 数据加载: 取前后两帧 (m=frame, n=frame+Δ) 的骨架图、段、局部收缩图;
    2. 候选链接: 用 KD-tree 找每个 m 节点的最近邻 n 节点, 施加近邻数与位移阈值;
    3. 拓扑代价: 对每个候选对比较局部收缩图结构;
    4. 稀疏 LAP: 在增广二部图上求解最优关联 (含终止/出生/辅助块);
    5. 过滤与箭头修正: 剔除段级离群链接, 修正交叉箭头;
    6. 轨迹更新: 延续/终止已有轨迹, 为新节点开启轨迹;
    7. 轨迹收尾与间隙闭合 (gap closing): 丢弃过短轨迹, 跨缺失帧合并轨迹;
    8. 保存: 写出逐帧轨迹表与逐帧节点关联数组。







#### 0. 前置数据准备

\`取出所有分隔数据\`

\`\`\`python
# 预先取出所有帧的数据引用, 便于循环内快速访问 (均为 object 数组/列表)
full_graphs_all_frames = self.segmented_mito.full_graphs
segment_node_all_frames = self.segmented_mito.segment_nodes
local_simple_graphs_all_frames= self.segmented_mito.local_simple_graphs
\`\`\`

\`声明数据容器\`

\`\`\`python
# linked/terminated/initiated_nodes: 每个相邻帧对一个数组, 记录该帧对的关联/终止/新生结果
linked_nodes, terminated_nodes, initiated_nodes = [], [], []

# 轨迹列表: 每条轨迹是 7 个等长列表组成的结构 (见下方 ### Update tracks ###)
terminated_tracks, ongoing_tracks = [], []
\`\`\`

\`其他\`

\`\`\`python
num_frames = len(full_graphs_all_frames)
\`\`\`

#### 1. 数据加载

数据加载: 取前后两帧 (m=frame, n=frame+Δ) 的骨架图、段、局部收缩图;

\`\`\`python
# 读取前后两帧的完整骨架图
full_graph_m = full_graphs_all_frames[frame]
full_graph_n = full_graphs_all_frames[frame + self.tracking_interval]
\`\`\`

\`连通分量\`

| 写法                  | 含义                                                | frame_000 实测                  |
| --------------------- | --------------------------------------------------- | ------------------------------- |
| \`cc = g.components()\` | 对图 \`g\` 做连通分量划分                             | 共 129 个分量                   |
| \`len(cc)\`             | 分量个数                                            | 129                             |
| \`cc.membership\`       | 长度 = 节点数；\`membership[i]\` = 节点 i 所属分量 id | \`[0,1,2,3,3,4,4,5,2,6,…]\`       |
| \`cc.sizes()\`          | 下标 = 分量 id，值 = 该分量节点数                   | 前 5 大 \`[234, 89, 80, 62, 58]\` |
| \`cc[i]\`               | 分量 i 包含的节点 id 列表                           | \`cc[0] = [0, 17, 1253]\`         |
| \`cc.giant()\`          | 最大的连通分量（子图 Graph，不是 id）               | 234 节点 / 235 边               |

\`\`\`python
# 连通分量
cc_m, cc_n = full_graph_m.components(), full_graph_n.components()

# 节点数量
number_m, number_n = len(full_graph_m.vs), len(full_graph_n.vs)
# 坐标 (coords_*: 长度 num_nodes 的列表, 每项 shape [3,] = (x, y, z), 单位 μm)
coords_m, coords_n = full_graph_m.vs['coordinate'], full_graph_n.vs['coordinate']

fluctuation_percent = abs(number_n - number_m) / number_m * 100  # 帧间节点数变化百分比, 单位 %
if fluctuation_percent > 30% :
    # 节点数突变通常意味着成像/分割异常, 会破坏拓扑代价的可比性
    
# 读取节点属性: intensity 为像素灰度, width 为管状宽度 (μm)
intensity_m, intensity_n = full_graph_m.vs['intensity'], full_graph_n.vs['intensity']
width_m, width_n = full_graph_m.vs['width'], full_graph_n.vs['width']


# 读取局部收缩图 (每帧、每个节点一个 igraph.Graph)
simple_graphs_m, simple_graphs_n = local_simple_graphs_all_frames[frame], \\
    local_simple_graphs_all_frames[frame + self.tracking_interval]

# 读取每帧的段列表: 每个段是若干节点索引组成的列表
all_segment_nodes_m, all_segment_nodes_n = segment_node_all_frames[frame], segment_node_all_frames[
\`\`\`

> 结构解释

\`\`\`css
segment_node_all_frames 就是 SkeletonizedMito.segment_nodes（每帧一项的 numpy object 数组），结构是三层：
segment_node_all_frames          # 长度 = 帧数
└─ [frame]                       # 该帧的段列表（frame_000：265 段）
   └─ [seg_id]                   # 一条段 = 节点 id 列表（沿骨架顺序）
       ├─ 首元素   网络节点 id（.coo 里的行号，0…388）
       ├─ 中间元素 段内体素级节点 id（≥389）
       └─ 末元素   网络节点 id（.coo）


frame_000 实测：
段数     : 265
前 3 段  : [388, 389, 387]   # 两端是网络节点，中间 389 是段内节点
           [386, 378]        # 一条边直连，没有段内节点
           [385, 390, 384]
每段长度 : 2 ~ 54，平均 6.3
\`\`\`

> 变量

| 变量                                                         | 来源                                          | 结构 / 含义                                                  |
| ------------------------------------------------------------ | --------------------------------------------- | ------------------------------------------------------------ |
| \`full_graph_m\` / \`full_graph_n\`                              | \`full_graphs_all_frames[frame]\` / \`[frame+Δ]\` | igraph.Graph（含全部体素级节点）；顶点属性 \`coordinate/intensity/width\`，边属性 \`distance\` |
| \`cc_m\` / \`cc_n\`                                              | \`.components()\`                               | VertexClustering；\`membership[node]\` = 节点所属连通分量（fragment）id |
| \`number_m\` / \`number_n\`                                      | \`len(.vs)\`                                    | int，两帧节点数                                              |
| \`coords_m\` / \`coords_n\`                                      | \`.vs['coordinate']\`                           | list，长度=节点数，每项 \`[x, y, z]\`（μm）                    |
| \`intensity_m\` / \`intensity_n\`                                | \`.vs['intensity']\`                            | list，像素灰度                                               |
| \`width_m\` / \`width_n\`                                        | \`.vs['width']\`                                | list，管径（μm）                                             |
| \`simple_graphs_m\` / \`simple_graphs_n\`                        | \`local_simple_graphs_all_frames[...]\`         | list，长度=节点数；每个节点的**局部收缩图**（拓扑代价用）    |
| \`all_segment_nodes_m\` / \`all_segment_nodes_n\`                | \`segment_node_all_frames[...]\`                | 段列表：\`[[节点id,...], ...]\`，每段首尾是 \`.coo\` 网络节点    |
| \`branching_nodes_m\` / \`branching_nodes_n\`                    | 遍历度数 > 2                                  | list，分支节点 id                                            |
| \`node_to_segment_m\` / \`node_to_segment_n\`                    | 由段列表建立                                  | dict：节点 id → 段 id；**分支节点记为 NaN**                  |
| \`max_number\`、\`fluctuation_percent_max\`、\`fluctuation_percent\` | 告警用                                        | 节点数 > 50000 或帧间变化 > 30% 时发 \`warnings.warn\`         |



#### 2. 候选链接

用 KD-tree 找每个 m 节点的最近邻 n 节点, 施加近邻数与位移阈值;

1. **构建后帧节点的 KD-tree, 用于近邻查询**

   \`\`\`bash
   tree_n = cKDTree(coords_n_mat)  # 后帧节点的 KD-tree, 用于近邻查询
   \`\`\`

2.  **每个 m 节点到最近 n 节点的距离 -> 自适应位移阈值**

   \`\`\`python
   nn_dist, _ = tree_n.query(coords_m_mat, k=1, workers=self.num_workers)
   
   nn_dist = np.atleast_1d(np.asarray(nn_dist, dtype=float))  # shape [number_m], 单位 μm
   \`\`\`

   nn_dist[i] = 第 i 个 m 节点 到 后一帧最近节点 的距离（μm）

3. **计算dist相关阈值** => disp_cutoff

   1. **计算cutoff_speed**：*frame_interval  = disp_cutoff
      - 线粒体允许的最大速度（μm/s），作为dist阈值
      - 阈值 = 速度×帧间隔；None 时自适应 mean+3σ。
        - 全局统计: 位移阈值 = mean(nn_dist) + 3σ (σ 为最近邻距离的标准差, 单位 μm)
   2. **计算cutoff_num_neighbor**
      - 每个 m 节点最多只考虑后一帧里最近的几个节点（默认 10 个）
   3. 最终候选 = 最近的 K+1 个 且 距离 ≤ disp_cutoff（两个条件同时满足）

4. 

![image-20260920173245544](260923.assets/image-20260920173245544.png)



#### 3. 拓扑代价

<a href="E:/ai/dy/mitochondria/mitoTNT/tmp/topology_flow.html#step=0">3D演示</a>

仅对候选对比较局部收缩图结构

\`\`\`python
cand_topo = self._compute_topology_costs(
    cand_i,
    cand_j,
    simple_graphs_m,
    simple_graphs_n
)
# cand_topo [ncand], 值为两节点局部收缩图邻接矩阵之差的平方和 (单位 μm²), >= 0
\`\`\`


cand_topo[k] = 候选对 (cand_i[k], cand_j[k]) 的拓扑代价
类型 : numpy.ndarray
形状 : [ncand]        ← 和 cand_i / cand_j / cand_d 等长
dtype: float64
单位 : μm²
含义 : 两个节点局部收缩图的结构差异（加权邻接矩阵差值的平方和）
       越小越像，0 = 结构完全一致



from scipy.optimize import linear_sum_assignment as lap_solver

> 流程

1. 获取cand_i 和 cand_j 对应的局部图

   ![image-20260921180132133](260923.assets/image-20260921180132133.png)

\`第0层：\`

1. 获取根节点（20和22）的邻居

   \`\`\`python
   neighbots_m = [55]
   neighbots_n = [68]
   \`\`\`

2. 计算代价

   \`\`\`python
   # 1. 构建代价矩阵 这里是1 * 1 的
   num_node = max(len(neighbors_m), len(neighbors_n))
   cost_mat = np.zeros((num_node, num_node))
   
   # 2. n^2 遍历邻居，计算各个节点的相似度得分
   # 用不相似度分数填充代价矩阵 (邻居对 -> 边长度分布的差异)
   for i in range(num_node):
       for j in range(num_node):
           # 获取55的三条边
           sel_edge_len_m = frag_m.es[frag_m.incident(index_mapping_m[i])]['distance']
           # 获取68的三条边
           sel_edge_len_n = frag_n.es[frag_n.incident(index_mapping_n[j])]['distance']
           # 三条边 vs 三条边 做LAP ，cost = |len_m - len_n| / max(len_m, len_n) ∈ [0, 1]
           # 也就是说，m的三条边和n的三条边根据cost做lap，得到三组对应，那cost_mat[i,j] = sum(cost)
           cost_mat[i, j] = _dissimilarity_score(sel_edge_len_m, sel_edge_len_n) 
           
   # 3. 计算完 55-68之间的cost_mat之后，再做一次节点层面的lap，获取节点之间的对应关系
   \`\`\`

\`第1层 n_level = 1：\`

1. 记录 visted_node_x：上一步已经访问过的结点 【20,55】 【22,68】

   <img src="260923.assets/image-20260921181758071.png" alt="image-20260921181758071" style="zoom:67%;" />

2. 记录上一层节点集合 (用于识别"向上/回头"的边)：

   xx_m  = 【20】 xx_n = 【22】

   \`\`\`python
   last_level_m = frag_m.neighborhood(vertices=root_m, order=n_level - 1, mindist=n_level - 1)
   last_level_n = frag_n.neighborhood(vertices=root_n, order=n_level - 1, mindist=n_level - 1)
   \`\`\`

3.  获取相较于root的n_level的结点，并非BFS的stack

   xx_m = 【55】

   \`\`\`python
   current_level_m = frag_m.neighborhood(vertices=root_m, order=n_level, mindist=n_level)
   \`\`\`

4. 遍历n_level = 1的结点 for_ in [55]

   1. 获取上一次lap得到的匹配节点node_n = 68

   2. 获取node_m 和 node_n 的邻居节点

      neighbors_m = [20, 71, 139]

      neighbors_n = [22, 69, 152]
   3. 遍历这些邻居节点
   
     \`\`\`python
     for neigh in neighbors_m:
         # 如20 这个是root之前访问过
         # if(节点已匹配 and 不是上一次匹配的)
         if neigh in visited_nodes_m and neigh not in last_level_m:
             # 检查该边是否仍然存在
             eid = frag_m.get_eid(node_m, neigh, error=False)
             if eid != -1:
                 dist = frag_m.es[eid]['distance']
                 frag_m.delete_edges(eid)
                 frag_m.add_vertices(2)
                 frag_m.add_edges([[node_m, frag_m.vs[-2].index]], {'distance': dist})
                 frag_m.add_edges([[neigh, frag_m.vs[-1].index]], {'distance': dist})
     \`\`\`
   4. 解决邻居节点数量不同的问题（这里未出现），加入dist = 0 的伪结点
   5. 刷新邻居列表 (包含刚加入的伪节点) 并排除上一层的结点
   6. 构建代价矩阵 cost_mat = np.zeros((num_node, num_node))
   7. 等同第0层，先根据边，然后再是节点
   
     比较
   
     - 【71】与【69】此时边的数量相同
     - 【71】与【152】此时边的数量不同
     - 【139】与【69】此时边的数量不同
     - 【139】与【152】此时边的数量相同
   
     **不同时：**
   
     - 用 0 长度伪边把较短的一方补齐 (缺失的邻居视为长度为 0 的伪边)，直接list.push
     - <img src="260923.assets/image-20260921190606173.png" alt="image-20260921190606173" style="zoom:50%;" />
   8. 最终匹配
   
     - 【20】-【22】
     - 【55】-【68】
     - 【71】-【69】
     - 【139】-【152】

\`第2层 n_level = 2：\`没有了



**如今已得到m->n的映射node_mapping，接下来：**

1. 创建n->m的反向映射reverse_node_mapping

2. 根据包含的结点数量，创建对应的邻接矩阵，并计算

   \`\`\`python
   # 以节点对应关系为顺序, 用节点间距离填充邻接矩阵
   total_nodes = len(node_mapping.keys())
   weighted_adj_mat_m = np.zeros([total_nodes, total_nodes])
   weighted_adj_mat_n = np.zeros([total_nodes, total_nodes])
   \`\`\`

   |      | 20     | 55     | 71     | 139    |
   | ---- | ------ | ------ | ------ | ------ |
   | 20   | 0      | 0.6416 | 0      | 0      |
   | 55   | 0.6416 | 0      | 1.6878 | 1.8811 |
   | 71   | 0      | 1.6878 | 0      | 0      |
   | 139  | 0      | 1.8811 | 0      | 0      |

   |      | 22   | 68   | 69   | 152  |
   | ---- | ---- | ---- | ---- | ---- |
   | 22   | 0    | 0.64 | 0    | 0    |
   | 68   | 0.64 | 0    | 1.03 | 1.96 |
   | 69   | 0    | 1.03 | 0    | 0    |
   | 152  | 0    | 1.96 | 0    | 0    |

3. 计算两个加权邻接矩阵之间差异的平方和 (Frobenius 范数平方) 作为拓扑cost
   - 逐元素相减再平方求和：这一对连接关系在两帧里差多少，全加一起就是得分。
     - W_m - W_n：每格 = 同一条连接（比 55–71）在 m/n 两帧的长度差（μm），没差异是 0
     - .ravel()：把 N×N 拉平成一维
     - ** 2 再 sum：平方避免正负抵消，也放大差异大的连接
     - 单位 μm²，0 = 两片网络完全一样；本例 0.85 → 很像
     return score 就是 _local_graph_comparison_score 的最终输出（页面 diff / final 步显示的就是它）。





还需要看伪边的情况：

<img src="260923.assets/image-20260921195207311.png" alt="image-20260921195207311" style="zoom:67%;" />

#### 4. 稀疏 LAP

在增广二部图上求解最优关联 (含终止/出生/辅助块);

1. **给cand_d距离cost和cand_topo拓扑cost的零代价add小量**

   \`\`\`java
   += 0.01 * nanmax
   \`\`\`

2. **计算每个候选对的关联代价**

   \`\`\`java
   link_cost = pdist ** self.dist_exponent * ptopo ** self.top_exponent
   \`\`\`

3. **计算稠密 (伪计数) 距离矩阵的稀疏替代品, 供下游段级过滤/箭头修正** —— 这里用不上

   - dist_cost_mat = _SparseDist(cand_i, cand_j, pdist, number_m, number_n)
   - _SparseDist = 装成矩阵的字典，为了不分配那个巨大的稠密矩阵：
     - 稠密 m×n 矩阵要存 number_m × number_n 个数（本例 ≈ 1539×1531 ≈ 236万个 float），但真正的候选对只有 ~1 万个，99% 的格子是空的
     - 它只存候选对：self._d[(i, j)] = pdist 值，另外记下 shape = (m, n)
     - 下游写 dist_cost_mat[i, j] 时查字典，查不到就返回 NaN（和稠密版"非候选对 = NaN"完全一样的语义，所以下游代码不用改）

4. **执行帧间匹配**

   - **作用**：给每个 m 节点在 n 帧里找唯一对应点（或判"消失"），n 节点也能"新出现"。以前要建 (m+n)×(m+n) 的大矩阵，现在只把候选边塞进稀疏图。

     | 边                   | 含义                   | 代价                          |
     | -------------------- | ---------------------- | ----------------------------- |
     | \`m_i -> n_j\`         | 第 i 个点连到第 j 个点 | \`link_cost\`（距离 × 拓扑）    |
     | \`m_i -> death_i\`     | i 消失                 | 3 × 该行最小链接代价          |
     | \`birth_j -> n_j\`     | j 新出现               | 3 × 该列最小链接代价          |
     | \`birth_j -> death_i\` | 填充用（保证能解出来） | 常数 C = 全局最小 \`link_cost\` |

     - 两条对角边让"消失/新生"始终可选，**保证存在完美匹配**（\`lapmod\` 求解器的硬要求），否则无解
     - 结果 \`assignment\`：前 m 个 = 每个 m 点连到哪个 n（≥n 就是消失），后 n 个 = 每个 n 点是否新生
     - 所谓"与稠密等价"：原稠密写法在填充块填常数 nanmin；这里只保留候选上的填充边，
       再给每条链接配一条对称边，任何配对方案的可行性和总代价都一样
     - \`+1e-12\`：scipy 稀疏矩阵会把显式 0 当成"没有这条边"，所以整体平移一丁点；
       每个完美匹配都加同样多，不改变最优解

> 本项目做法：同样的 (m+n)×(m+n) 语义，但不真建那个大矩阵

只用 scipy 稀疏矩阵存"有意义的边"，非零项从 (m+n)² 降到 O(候选数 + m + n)：

| 边组               | 行 → 列                               | 代价                          | 作用                              |
| ------------------ | ------------------------------------- | ----------------------------- | --------------------------------- |
| 链接边             | m_i → n_j（仅候选对）                 | \`link_cost\`                   | 正常配对                          |
| 辅助边             | birth_j → death_i（候选模式的对称边） | 常数 C = 全局最小 \`link_cost\` | 替代稠密版"整块填 nanmin"的填充块 |
| 终止对角线（恒有） | m_i → death_i                         | 3 × 第 i 行最小 link_cost     | m_i 消失                          |
| 出生对角线（恒有） | birth_j → n_j                         | 3 × 第 j 列最小 link_cost     | n_j 新生                          |

- 和稠密版**数学等价**：任何方案用到的辅助边数 = 链接数且每条都是 C；
  加上每条链接都配一条对称的 birth_j → death_i，可行性与总代价完全一致
- 两条对角线保证一定存在完美匹配（\`lapmod\` 的硬要求，不然解不出来）
- 所有值再 \`+1e-12\`：稀疏矩阵里显式 0 会被当成"没有这条边"；整体平移不改变最优解
- 求解器从稠密 \`linear_sum_assignment\` 换成 \`lap.lapmod\`（稀疏 Jonker-Volgenant）

一句话：**方案和语义不变，只是把"稠密大矩阵"换成了"候选边 + 两条对角线"的稀疏矩阵。**





**二分图匹配 → 增广路 → 匈牙利算法 → 带权线性分配问题 LAP → 稀疏 Jonker-Volgenant = LAPMOD / LAPJVsp**





![image-20260922192225361](260923.assets/image-20260922192225361.png)

**链接 8 条：**M1-N1、M2-N2、M3-N4、M4-N3、M5-N5、M6-N6、M7-N8、M9-N10 

**终止（M 消失）：**M8、M10 

**出生（N 新生）：**N7、N9、N11、N12、N13、N14、N15



LAP 是怎么算出这几对的

总原则：25 行（10 个 M 点 + 15 个出生行）每行选一个列，全局总价最小；
终止价 = 3 × 该行自己最便宜的候选；出生价 = 3 × 该列最便宜的候选。

① 没人抢的（链接必然比终止便宜）
M1→N1 (0.162) ｜ M2→N2 (0.152) ｜ M5→N5 (0.318) ｜ M6→N6 (0.441)
（各自的终止价 0.486 / 0.457 / 0.954 / 1.324，都比链接贵）

② M3、M4 抢 N3、N4（2×2 对换）
| 方案                                                         | 总价         |
| ------------------------------------------------------------ | ------------ |
| M3→N3 (0.378) + M4→N4 (2.042)                                | 2.420        |
| M3→N4 (0.685) + M4→N3 (0.837)                                | 1.522 ← 选它 |
| 结果：M3→N4、M4→N3（不是“各挑自己最小”，而是拆开换总价更低） |              |

③ M8、M9 抢 N10（都只有这一个候选）
| 方案                                                         | 总价         |
| ------------------------------------------------------------ | ------------ |
| M8→N10 (0.362) + M9 终止 (3×0.867=2.600)                     | 2.961        |
| M9→N10 (0.867) + M8 终止 (3×0.362=1.085)                     | 1.951 ← 选它 |
| 结果：M9→N10，M8 终止（终止价按各自候选价的 3 倍算，牺牲便宜的那行更划算） |              |

④ M7 有 N7、N8 两个候选（一对二）
| 方案                                           | 总价         |
| ---------------------------------------------- | ------------ |
| M7→N7 (0.332) + N8 出生 (3×0.775=2.325)        | 2.657        |
| M7→N8 (0.775) + N7 出生 (3×0.332=0.997)        | 1.772 ← 选它 |
| 结果：M7→N8、N7 出生（链接贵的、让便宜的出生） |              |

⑤ 完全没候选的（价格 = 0，免费）
M10：无候选 → row_min = ∞ → 终止价 0 → 消失
N9、N11~N15：无候选 → col_min = ∞ → 出生价 0 → 新生

每条被选中的链接还会配一条对称“辅助边”（值 C=0.152，用满 8 条），
它只负责让问题可解，对所有方案一视同仁，不影响上面的比较。

一句话：先看谁有竞争（②③④），在这些地方比全局总价；没竞争的按链接 / 免费消失 / 免费新生处理





![image-20260927152347374](260923.assets/image-20260927152347374.png)

#### 5. 过滤与箭头修正

剔除段级离群链接, 修正交叉箭头;

1. **预处理**

   1. 获取m侧的lap结果\`assigned_m\`

   2. 收集已建立连接的节点对\`linked_m\` & \`linked_n\`

   3. 遍历\`all_segment_nodes_m\`

      1. 找到仅保留该段内既已链接、又非分支节点的节点，from\`segment_nodes_m\` to \`current_seg_nodes_m\`

      2. 得到\`seg_n_to_node_m\`: 找到n段id与\`current_seg_nodes_m\` 之间的对应关系

      3. 找到人数最多的 n 段作为"多数派", 代表该段的整体运动方向

         \`\`\`python
          max_segment_id = max(node_count_per_seg, key=node_count_per_seg.get)
         \`\`\`

2. **5a 段级长箭头过滤**

   1. 计算多数派的平均距离 (μm)
   2. 假如少数派节点的距离 > 3 * 多数派平均距离，则剔除 (3σ 式离群阈值)

3. **5b 交叉箭头方向修正 (cosine)**

   1. 

#### 6. 轨迹更新

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

- 首帧对（frame == start_frame，:747）：直接给每条 linked 建一条新轨迹，每条正好 2 帧。
- 之后的帧对（:763）：遍历所有"进行中"的轨迹，看它的末点。
  - 末点在 terminated 里 → 轨迹到此结束，归档（:766-768）。
  - 否则 → 从 linked 的映射里查到它会连到哪个 n 点，把这个点的 7 个字段各追加到轨迹尾部（:770-781）。

归档的轨迹随后从"进行中"列表移除（:783-786）。

再处理新生：每个 initiated 点开一条只有 1 帧的新轨迹（:788-797）。

最后把"归档 + 进行中"拼成一个 (N, 7) 的对象数组，交给后续步骤（丢短轨迹、间隙闭合、排序保存）（:813-816）。





#### 7. 轨迹收尾与间隙闭合 (gap closing)

\`触发时间\`：处理完所有帧的帧间对，offline



> 丢弃过短轨迹

把所有轨迹按"跨过几帧"筛一遍，短于 min_track_size（默认 4）的直接丢掉——多半是噪声或瞬时误检。



> 跨缺失帧合并轨迹;

\`背景\`

每次帧对处理时，如果某条轨迹的末端节点出现在 terminated 里，这条轨迹就归档结束了（network_tracker.py:766-768）。没有再尝试“跳跃匹配”，所以断得很干脆：断的那一帧之后如果对象又出现，它会被判成 initiated



逐帧匹配是“一对一”的，只要某一帧没接上，轨迹就断成两条。
比如某个线粒体第 6 帧没被分割出来（或匹配失败），第 7 帧又出现了，于是得到两条轨迹：

- A：第 0~5 帧
- B：第 7~9 帧
它们其实是同一个东西。间隙闭合就是把这类断口接回去



\`目的\`：把“断了 1~3 个被追踪帧”的两段轨迹拼回一条。跑在整个帧对循环结束之后。

\`处理\`

**1. 先算每条轨迹的逐帧位移**（:842-846）——供后面的距离阈值使用。

 	把每条轨迹里相邻两帧的坐标差都算出来（欧氏距离，μm），存成一串。
这串数字是后面判断“两个端点离得远不远”的参考

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
- 没参与任何链的轨迹原样保留
- 注意：不会补第 6 帧的数据，只是把两段列表接上

**5. 排序**（:941-946）：先按长度降序、再按起始帧升序；最后打印闭合前后轨迹数和平均长度（:953-956）。

几个要点：

- 只能补“整段缺失 1~3 个被追踪帧”的情况，而且缺口必须刚好对齐
- 拼好后帧号列表自然连续，不需要改时间
- 顺序问题：这一步在“丢短轨迹”之后，所以两小段各自不足 4 帧的话会先被丢掉，根本轮不到拼
- 分块模式下相邻块有 20% 重叠，重叠区的指派以较后块为准



## 5. 分析重塑事件 + 扩散系数

### 简要

追踪完成后，MitoTNT 可以量化关键的线粒体行为：

\`\`\`python
# Detect network remodeling (fusion & fission events)
tracked.detect_fusion_fission()

# Compute motility at three levels:
# node (voxel), segment (linear branch), fragment (connected component)
tracked.compute_mitochondria_diffusivity() 
\`\`\`

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









### 流程

**总体思路**

事件不是“比较两个碎片”，而是比较**当前帧里相邻的两个点**：它们过去是不是一直在一起、未来是不是一直不在一起。只查相邻对，是因为分家/合并一定发生在还连着的那个接触点上。

**第 0 步：准备数据**

\`node_tracks\` 表每行 = 某条轨迹在某一帧的一个节点，带帧号、节点号、碎片号、相邻节点列。

先预计算三样东西，避免后面反复查表：

- \`all_fragments\`：每帧的碎片划分，\`membership[节点]\` 给出该节点属于哪个碎片
- \`track_frame_map\`：轨迹号 → 帧号 →（帧内节点号，碎片号）
- \`frame_connected\`：轨迹号 → 当前帧相邻节点的字符串（来自 CSV 的 \`connected_unique_node_id\` 列）

窗口边距 \`win_margin = half_win_size × tracking_interval\`（默认 4×1=4）。中心帧默认从 \`start + 4Δ\` 扫到 \`end − 4Δ\`，太靠边的帧放不下完整窗口。

**第 1 步：逐个中心帧，按碎片把节点分组**

取当前帧的被追踪节点，按碎片号分桶。没有追踪节点的碎片直接跳过。

**第 2 步：每个碎片里建小图**

点 = 碎片内被追踪的节点，边 = 当前帧骨架图上相邻。下面只检查这些边。

**第 3 步：给边两端各取一段“碎片序列”**

对边的两个点 u、v，各取：

- 前向 4 个被追踪帧：\`current+Δ\` 到 \`current+4Δ\`
- 后向 4 个被追踪帧：\`current−Δ\` 到 \`current−4Δ\`

每帧去 \`track_frame_map\` 查这个点：有记录就填（节点号，碎片号），没记录就填 \`NaN\`。

**第 4 步：算两个分数**

先对齐：把“任一侧缺记录”的帧成对剔除，剩下两边都有记录的帧，两串等长。

再打分，就是 \`_overlap_score\`：

\`\`\`
分数 = 1 − 两串里碎片号相同的帧数 / 总帧数
0.0 = 窗口内一直同碎片
1.0 = 窗口内一直不同碎片
中间值 = 期间有过分家/合并的反复
有效帧数 < min_tracked_frames(2) → NaN，不算事件
\`\`\`

注意：碎片号每帧重新编号，所以比较的是**同一帧里两个点是否同碎片**，不是跨帧比较编号数值。

**第 5 步：判事件**

\`\`\`
前向 = 1.0 且 后向 = 0.0  →  fission（现在分家）
前向 = 0.0 且 后向 = 1.0  →  fusion（现在合并）
其它（含 NaN、0.5）        →  不算事件
\`\`\`

判据要求“恰好 0 或 1”，窗口里只要波动过一次就不算。

**第 6 步：聚簇成位点**

一条事件边 (u, v)，把 u、v 各向外扩 5 条骨架边，两个邻域并集里的所有事件边算同一个**反应位点**；用过的边标记掉，防止一次事件记成多条。

**第 7 步：补前/后帧细节**

- 裂变：对位点里每个节点，去它自己的轨迹里找 \`current_frame\` 的**下一个记录帧**——不是简单的 \`current+Δ\`，因为轨迹可能跳过缺失帧；取那一帧的节点号和碎片号。没有下一帧就跳过这个节点
- 融合：同理找**上一个记录帧**

这就是 CSV 里 before/after 帧号是“一串空格分隔数字”的原因：每个参与节点的相邻帧可能不同。

**第 8 步：写表**

事件表固定 9 列。两个特殊点：

- 融合的 \`frame_id\` 记的是 \`current_frame − 1\`（合并发生前一帧）
- 裂变的 \`frag_id_before\` 全 = 当前碎片号；融合的 \`frag_id_before\` 是各节点上一帧各自所在的碎片号

每个参与节点再单独记一行（供可视化/特征提取），最后写 \`remodeling_events.csv\`；没检测到事件就写一个带列名的空表。

**完整例子（裂变）**

\`\`\`
帧:      10      11      12      13      14
节点 A: 碎片5 → 碎片5 → 碎片5 → 碎片5 → 碎片5
节点 B: 碎片5 → 碎片7 → 碎片7 → 碎片7 → 碎片7
\`\`\`

中心帧 10，A、B 相邻：

- 前向（11~14）：5 vs 7，每帧都不同 → 分数 1.0
- 后向（6~9）：两串都是 5 → 分数 0.0
- 判定：裂变，事件帧 = 10
- 下一帧明细：A → 帧 11 节点 33 碎片 5；B → 帧 11 节点 90 碎片 7

**容易误解的 4 点**

- 判的是“逐帧两个点是否同碎片”，不是两个碎片编号相不相等
- 分数必须恰好 0/1，中间值一律不算
- \`min_tracked_frames=2\` 数的是“两侧都有记录的帧数”，不要求连续
- 只在能放下完整窗口的帧上检测，数据集首尾各 4Δ 帧是盲区



### 简化



**背景**：科学家给活细胞里的线粒体拍了一段视频，很多帧连起来的。线粒体是会动的"小条子"，有时候一根断成两根（叫**分裂**），有时候两根合成一根（叫**融合**）。这个函数的任务就是：**看视频，告诉我们哪一刻发生了断裂或合并。**

**为什么不能一帧一帧对比？**
视频有噪点，某一根可能只是"看起来断了一下"，下一帧又连上了。这种假断裂会骗人。

**它的办法（核心，就三步）**：

1. 随便挑视频里的某一帧，找两个**此刻还挨在一起**的点，想象成两个人手拉手站着。
2. **倒回去看几帧**：这两人是不是一直在一起？**往后看几帧**：他们是不是一直分开了？
3. 判断：
   - 以前一直在一起 + 以后一直分开 → 这里发生了一次**断裂**
   - 以前一直分开 + 以后一直在一起 → 这里发生了一次**合并**
   - 其他情况（比如有时分有时合）→ 不算，当噪声扔掉

就这样，它把视频从头到尾滑一遍，把所有"真断裂、真合并"的时刻列成一张表给你。

**那几个参数**，用人话讲：
- \`half_win_size=4\`：回头、往前各看 4 帧（看得越多越不容易被骗，但也越迟钝）
- \`min_tracked_frames=2\`：这两个人至少得在 2 帧里都被摄像头盯住，只露脸一次的不算数

就这么多。上面那个可以拖的图，演示的就是这三步。

还有哪一步觉得绕，指出来，我单独掰开讲。











`;export{n as default};
