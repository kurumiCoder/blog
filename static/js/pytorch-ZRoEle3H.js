const n=`# PyTorch

## 1. tensor

### 1-1. Tensor的属性

* Tensor是一个**类**，其数据放在 \`data\` 属性中。
* **基本属性**：\`data\`，\`dtype\`，\`shape\`，\`device\`，梯度相关的属性…

> 属性详解

* **dtype**: 张量的数据形状，包括 \`float32\`，\`float16\` 等
* **shape**: 张量的形状，如 \`(62, 2, 38, 38)\`
* **device**: 张量所在的设备，\`cpu\` 或者 \`gpu\`。

> 属性结构图

**torch.Tensor**
* \`data\`
* \`dtype\`
* \`shape\`
* \`device\`
* **[梯度相关属性]** 
  * \`requires_grad\`
  * \`grad\`
  * \`grad_fn\`
  * \`is_leaf\`



### 1-2. 操作

#### 总览图

![image-20260930135511893](pytorch.assets/image-20260930135511893.png)

![image-20260930135603176](pytorch.assets/image-20260930135603176.png)

#### in-place



![image-20260930135731343](pytorch.assets/image-20260930135731343.png)

####  各种创建tensor的操作



\`\`\`python
# 创建一个没有初始化的5*3矩阵
a1 = torch.empty(5, 3)
print(a1)

# 创建一个随机初始化的5*3矩阵
a2 = torch.rand(5, 3)
print(a2)

# 返回的tensor默认具有相同的torch.dtype和torch.device.
# 系列函数new_
a2_1 = a2.new_ones(5, 3, dtype=torch.float64)
print(a2_1)

# 大小一样，指定新的数据类型. 系列函数*_like
a2_2 = torch.randn_like(a2_1, dtype=torch.float)
print(a2_2)

# 构造一个填满0且数据类型为long的矩阵
a3 = torch.zeros(5, 3, dtype=torch.long)
print(a3)

# 直接从一个张量构造
a4 = torch.tensor([5.5, 3])
print(a4)
\`\`\`

#### 广播机制

![image-20260930135904443](pytorch.assets/image-20260930135904443.png)

## 2. autograd 和 计算图

![image-20260930135940952](pytorch.assets/image-20260930135940952.png)

### 2-1. 计算图与梯度求导

![image-20260930140025050](pytorch.assets/image-20260930140025050.png)

### 2-2. Tensor中关于梯度的主要属性 / 方法



![image-20260930140058389](pytorch.assets/image-20260930140058389.png)



### 2-4. backward

![image-20260930140352960](pytorch.assets/image-20260930140352960.png)









`;export{n as default};
