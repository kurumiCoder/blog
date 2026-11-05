const n=`# mitometer

## 分割调参





## 跟踪效果可视化改造





# ReaDDy原理 & 复现



# 不同算法的效果对比

## 跟踪前



## 跟踪



# 新算法 —— Nellie



# new私有数据集在不同算法下的效果



## 跟踪前

<img src="261104.assets/image-20261103160602199.png" alt="image-20261103160602199" style="zoom: 33%;" />

| 设置                       | 全图像素覆盖率 | 原图最亮 1% 像素的覆盖率 |
| -------------------------- | -------------- | ------------------------ |
| Mitometer 阈值 42          | 3.65%          | 87.32%                   |
| Mitometer 阈值 10          | 6.09%          | 92.17%                   |
| MitoSegNet γ=0.55／16 像素 | 4.96%          | 99.55%                   |

MitoSegNet 在最暗一档的 Dice 更高，但也更容易粘连

| 信噪比 | Mitometer 阈值 10：平均 Dice／粘连 | MitoSegNet γ=0.55、最小 16 像素：平均 Dice／粘连 |
| ------ | ---------------------------------- | ------------------------------------------------ |
| 3      | 0.42／0 张                         | 0.53／4 张                                       |
| 6      | 0.83／2 张                         | 0.58／3 张                                       |
| 12     | 0.86／2 张                         | 0.71／1 张                                       |





### mitometer



> 默认自动化参数

\`强光与弱光\`

![image-20261103121649778](261104.assets/image-20261103121649778.png)

<img src="261104.assets/image-20261103121753927.png" alt="image-20261103121753927" style="zoom: 33%;" />

![image-20261103122856144](261104.assets/image-20261103122856144.png)



### mitosegnet

> 默认参数

<img src="261104.assets/image-20261103142908829.png" alt="image-20261103142908829" style="zoom: 80%;" /><img src="261104.assets/image-20261103142914830.png" alt="image-20261103142914830" style="zoom:70%;" />

> 提亮

<img src="261104.assets/image-20261103150211218.png" alt="image-20261103150211218" style="zoom:150%;" /><img src="261104.assets/image-20261103150223691.png" alt="image-20261103150223691" style="zoom:67%;" />



### Nellie

#### default

/D:/ai/dy/gpt/mito-review/open_review.cxc

> 原图

<img src="261104.assets/image-20261103173639958.png" alt="image-20261103173639958" style="zoom:33%;" />

> 预处理

<img src="261104.assets/image-20261103173757162.png" alt="image-20261103173757162" style="zoom: 33%;" /><img src="261104.assets/image-20261103174159796.png" alt="image-20261103174159796" style="zoom:33%;" />

> 分割

<img src="261104.assets/image-20261103174221126.png" alt="image-20261103174221126" style="zoom:33%;" />

#### 调参









## 跟踪

### mitometer

> 弱光区域

**第一帧**

![image-20261103121924144](261104.assets/image-20261103121924144.png)![image-20261103121912083](261104.assets/image-20261103121912083.png)

**第二帧**

![image-20261103122424440](261104.assets/image-20261103122424440.png)![image-20261103122436038](261104.assets/image-20261103122436038.png)

**第二帧 -> 第三帧**

![image-20261103122535210](261104.assets/image-20261103122535210.png)

> 强光

![image-20261103124558277](261104.assets/image-20261103124558277.png)![image-20261103124559817](261104.assets/image-20261103124559817.png)





# TODO

1. **exp**
   - 没跑完的
2. **预处理**
   - 继续调参
     - Nellie
       - 看一下大致的原理
   - SRRF（低分辨 -> 高分辨）
     - 学原理
     - 跑exp
     - 用BioXXX的数据集和相关方法试一下
3. **模拟系统**
   1. 2D
      1. 直接
      2. 映射
   2. 其他方法
4. **其他方法**
   - 深度学习(track)
   - 其他领域有没有解决办法
     - 2D自身的数据问题
     - 帧间变化大
     - 补帧
     - 借鉴一下\`评价指标\`
     - 2D -> 3D
       - 深度估计





















`;export{n as default};
