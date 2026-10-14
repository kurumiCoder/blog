const n=`# python常用库

## 数据处理

### NumPy

NumPy 的核心就一句话：**用 C 语言的速度做 Python 的数组运算**。

\`\`\`bash
pip install numpy
\`\`\`



#### 1. 核心概念

| 概念      | 含义                           | 类比                                             |
| --------- | ------------------------------ | ------------------------------------------------ |
| \`ndarray\` | NumPy 的核心数据结构，N 维数组 | Excel 表格（2D）、一列数字（1D）                 |
| \`shape\`   | 数组的"形状"，即每个维度的大小 | \`(32, 3)\` 表示 32 行 3 列                        |
| \`dtype\`   | 数组元素的数据类型             | \`float64\`、\`int32\`、\`bool\`                       |
| \`axis\`    | 轴，即数组的维度方向           | \`axis=0\` 是跨行（纵向），\`axis=1\` 是跨列（横向） |



#### 2. 创建数组

\`\`\`python
import numpy as np

a = np.array([1, 2, 3])           # 从 Python 列表创建
b = np.zeros((3, 4))              # 3 行 4 列，全填 0
c = np.ones((2, 2))               # 2 行 2 列，全填 1
d = np.arange(0, 10, 2)           # 从 0 到 10（不含），步长 2 → [0, 2, 4, 6, 8]
e = np.linspace(0, 1, 5)          # 从 0 到 1，均匀取 5 个数 → [0, 0.25, 0.5, 0.75, 1]

# 随机数
f = np.random.rand(32, 3)         # 32×3，[0,1) 均匀分布
g = np.random.randn(1000)         # 1000 个标准正态分布（均值为0，方差为1）
h = np.random.randint(0, 10, 5)   # 5 个 [0, 10) 区间的随机整数
\`\`\`

#### 3. 数组运算

\`\`\`python
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

a + b          # → [5, 7, 9]      对应元素相加
a * 2          # → [2, 4, 6]      每个元素乘 2
a > 2          # → [False, False, True]  逐元素比较
a.sum()        # → 6              所有元素求和
a.mean()       # → 2.0            平均值
a.max()        # → 3              最大值
\`\`\`

#### 4. 索引与切片

\`\`\`python
arr = np.array([[1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]])

arr[0, 1]      # → 2              第 0 行第 1 列
arr[0, :]      # → [1, 2, 3]      第 0 行（整行）
arr[:, 1]      # → [2, 5, 8]      第 1 列（整列）
arr[0:2, 1:3]  # → [[2, 3],       切片：前 2 行，后 2 列
               #    [5, 6]]
\`\`\`

#### 5. 形状操作

\`\`\`python
arr = np.arange(12)        # [0, 1, 2, ..., 11]
arr.reshape(3, 4)          # 改成 3 行 4 列
arr.reshape(2, 2, 3)       # 改成三维：2 层、2 行、3 列

arr.shape                  # 查看当前形状
arr.ndim                   # 查看维度数（1D/2D/3D）
arr.size                   # 查看总元素个数
\`\`\`

#### 6. 加载数据

> loadtxt

\`\`\`python
np.loadtxt(
    fname,           # 文件名或文件对象
    dtype=float,     # 数据类型（默认浮点数）
    delimiter=' ',   # 分隔符（默认空格）
    skiprows=0,      # 跳过前 N 行（常用于跳过表头）
    usecols=None,    # 指定读取哪些列（如 usecols=(0,1,2)）
    unpack=False     # 是否转置输出（True 时可用多变量接收）
)
\`\`\`

> np.genfromtxt — 处理缺失值/混合类型

\`\`\`python
data = np.genfromtxt(
    'data.csv', 
    delimiter=',', 
    dtype=None,           # 自动推断类型
    names=True,           # 第一行作为列名
    missing_values='NA',  # 指定缺失值标记
    filling_values=0      # 缺失值填充为 0
)
\`\`\`

**适用**：数据不干净，有空值或混合类型（字符串+数字）。

> \`np.fromstring\` / \`np.fromiter\` — 内存/流式处理

\`\`\`python
# 从字符串直接解析（无需临时文件）
raw = "1,2,3\\n4,5,6"
data = np.fromstring(raw, sep=',').reshape(-1, 3)

# 从生成器逐行读取（省内存）
def line_generator(filename):
    with open(filename) as f:
        for line in f:
            yield float(line.strip())

data = np.fromiter(line_generator('data.txt'), dtype=float)
\`\`\`

**适用**：数据在内存中，或文件极大无法一次性载入。

> \`np.fromfile\` — 二进制极速读取

\`\`\`python
# 读取二进制文件（非文本！）
data = np.fromfile('data.bin', dtype=np.float32)
\`\`\`

**适用**：自己保存的 \`.npy\`/\`.bin\` 二进制格式，速度比文本快 10-100 倍。











## 数据可视化

### matplotlib

matplotlib 的基本语法可以概括为 **"准备数据 → 调用绘图函数 → 设置样式 → 显示/保存"**。



#### 1. 最简流程（pyplot 快速风格）

\`\`\`python
import matplotlib.pyplot as plt

# 1. 准备数据
x = [1, 2, 3, 4]
y = [1, 4, 9, 16]

# 2. 绘图
plt.plot(x, y)

# 3. 设置样式
plt.title("平方数")
plt.xlabel("x")
plt.ylabel("y")

# 4. 显示
plt.show()
\`\`\`



#### 2. 核心概念

| 概念             | 含义                 | 类比               |
| ---------------- | -------------------- | ------------------ |
| \`Figure\`         | 整张画布/窗口        | 一张纸             |
| \`Axes\`           | 画布上的一个子图区域 | 纸上的一个坐标系   |
| \`pyplot\` (\`plt\`) | 快速绘图接口         | 傻瓜相机，一键操作 |



#### 3. 常用绘图函数

\`\`\`python
plt.plot(x, y)        # 折线图
plt.scatter(x, y)     # 散点图
plt.bar(x, y)         # 柱状图
plt.hist(data)        # 直方图
plt.pie(sizes)        # 饼图
plt.imshow(image)     # 显示图像/热图
\`\`\`



#### 4. 样式设置常用语句

\`\`\`python
plt.title("标题")           # 标题
plt.xlabel("横轴")          # X轴标签
plt.ylabel("纵轴")          # Y轴标签
plt.legend()                # 显示图例（plot 时加 label="xxx"）
plt.grid(True)              # 显示网格
plt.xlim(0, 10)             # X轴范围
plt.ylim(0, 20)             # Y轴范围
plt.figure(figsize=(8, 6))  # 设置画布大小（宽8高6英寸）
\`\`\`



#### 5. 保存图片

\`\`\`python
plt.savefig("output.png", dpi=300, bbox_inches="tight")
# dpi: 分辨率  bbox_inches="tight": 去除多余白边
\`\`\`



#### 6. 多子图（面向对象风格，更灵活）

\`\`\`python
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(10, 8))  # 2行2列，4个子图

axes[0, 0].plot(x, y)
axes[0, 0].set_title("子图1")

axes[0, 1].scatter(x, y)
axes[0, 1].set_title("子图2")

plt.tight_layout()  # 自动调整子图间距
plt.show()
\`\`\`

#### 7. 交互模式

| 模式                 | 代码         | 效果                                                         |
| -------------------- | ------------ | ------------------------------------------------------------ |
| **交互模式**         | \`plt.ion()\`  | 画图后**不阻塞**，程序继续往下跑，图表窗口实时更新。适合做**动画、实时数据监控**。 |
| **阻塞模式**（默认） | \`plt.ioff()\` | 调用 \`plt.show()\` 后**程序暂停**，关掉窗口才继续。适合一次性看图。 |







#### 总结：两种编程风格

| 风格                    | 特点     | 适用场景                       |
| ----------------------- | -------- | ------------------------------ |
| **pyplot** (\`plt.xxx\`)  | 简洁快速 | 简单图表、交互式探索           |
| **面向对象** (\`ax.xxx\`) | 灵活可控 | 多子图、复杂布局、出版物级图表 |

新手建议先掌握 \`plt.plot()\` 快速出图，需要精细控制时再转面向对象风格。



#### 中文配置

\`\`\`python
plt.rcParams['font.sans-serif'] = ['Microsoft YaHei',
                                   'WenQuanYi Zen Hei',
                                   'Noto Sans CJK JP']
plt.rcParams['axes.unicode_minus'] = False
\`\`\`

## 输入输出

### argparse命令行参数解析

> example

\`\`\`python
import argparse

# 创建 ArgumentParser 对象
parser = argparse.ArgumentParser(
    description="This is a sample program to demonstrate the use of the 'description' parameter."
)

# 添加参数
parser.add_argument("--name", type=str, help="Please enter your name",default='lpl')
parser.add_argument("--age", type=int, help="Please enter your age")
parser.add_argument("-gf","--girlfriend",choices=['Lily','Eva'])


# 解析命令行参数
args = parser.parse_args()
print(f"Hello {args.name}, you are {args.age} years old.")
print(args.girlfriend)


\`\`\`

>位置参数

\`\`\`bash
python main.py apple rede --size small
\`\`\`

\`\`\`python
import argparse

parser = argparse.ArugumentParser()

parser.add_argument('food') # 不能通过--指定，必填项
parser.add_argument('color')
parser.add_argument('--size','-s',default='medium') # 不会干预排序，非必填
\`\`\`

> 必填参数

require = True

- 带\`--\`(或短名\`-f\`)，本来是可选参数，设置\`require=True\`后，变成必填
- 该参数必须通过参数名称指定参数值

> 开关action

\`\`\`python
import argparse

# 创建 ArgumentParser 对象
parser = argparse.ArgumentParser(description="description")

# 添加参数
parser.add_argument('--amp', action='store_true', help="Use Automatic Mixed Precision")

# 解析命令行参数
args = parser.parse_args()
print(args.amp)
\`\`\`

**相关说明：**

- \`action\`：用于定义当命令行中出现该参数时要执行的动作
  - \`action='store_true'\`：若在命令行中未指定该参数，默认状态下其值为 \`False\`；若指定该参数，该参数将置为 \`True\`
  - \`action='store_false'\`：若在命令行中未指定该参数，默认状态下其值为 \`True\`；若指定该参数，该参数将置为 \`False\`
- **特殊情况：若同时指定了 \`action\` 和 \`default\`：**
  - 在未指定该参数的情况下，以 \`default\` 值为准
  - 在指定该参数的情况下，以 \`action\` 的值为准

> 重命名

\`\`\`python
import argparse

# 创建 ArgumentParser 对象
parser = argparse.ArgumentParser(description="description")

# 添加参数
parser.add_argument('--no_warmup', dest='warmup', action='store_false')

# 解析命令行参数
args = parser.parse_args()

# 使用参数
print(args.warmup)
# print(args.no_warmup)  # 会报错
\`\`\`

**终端运行结果：**

\`\`\`bash
% python main.py
True

% python main.py --no_warmup
False
\`\`\`

**说明：**

- \`dest\` 用于给参数**重起一个变量名**
  - 在命令行中通过 \`--no_warmup\` 传参
  - 在代码中获取参数值时，使用 \`args.warmup\`，使用 \`args.no_warmup\` 会报错









`;export{n as default};
