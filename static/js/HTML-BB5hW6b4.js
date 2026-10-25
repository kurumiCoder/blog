const n=`  

# HTML

## 概念

![image-20230801193348227](HTML.assets/image-20230801193348227.png)

---

## 常用标签

---

### 标题  h1 -h6

\`\`\` html
<h1></h1>
\`\`\`

### 段落 p

\`\`\` html
<p></p>  
用段落标签才能分上下两段

会根据浏览器大小自动换行
\`\`\`

### 换行 br /

\`\`\` html
<br/>
\`\`\`

### 水平线 hr /

\`\`\` html
<hr/>
\`\`\`

### 内联框架  iframe

说明：可以向一个页面中引入其他的外部页面

[HTML 标签：内联框架 (biancheng.net)](http://m.biancheng.net/view/9394.html)

\`\`\` html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>HTML &lt;iframe&gt; 标签演示</title>
    <style type="text/css">
      #myframe {
        border: 1px solid #ddd;
        background-color: #f6f6f6;
      }
    </style>
  </head>
  <body>
    <p>
      <a href="http://c.biancheng.net/" target="myframe"
        >猛击这里查看C语言中文网在手机端的显示效果</a
      >
    </p>
    <iframe id="myframe" name="myframe" width="330" height="580"></iframe>
  </body>
</html>

\`\`\`

---

###  ==超链接       a   href  实现下载==

\`\`\` html
<a href="url"  target="opentype">链接文本</a>
<href> </href> 和a 不同的是 可以指向 任意的东西

<target> 
    
<a href="http://c.biancheng.net/html/" target="_blank">HTML教程（新窗口打开）</a>
<a href="http://c.biancheng.net/css3/">CSS教程（当前窗口打开）</a>

    
<a href="fasfaf.zip">实现下载</a>
<!--self-->
<!--blank--> 
\`\`\`



![image-20220804181807000](HTML.assets/image-20220804181807000.png)

#### 返回顶部

\`\`\` html
<a href="#kk"></a>
<h1 id="kk"></h1>


<a href="#top"></a> 返回顶部
\`\`\`

---

### 注释 <!-- -->

## label

![image-20230801202832566](HTML.assets/image-20230801202832566.png)



---

## 文本格式化

![image-20220804183035792](HTML.assets/image-20220804183035792.png)

### 加粗 strong  或 b

### 倾斜 em 或 i

### 删除线 del

### 下划线 ins

### 程序代码 code

---

## 盒子

### div  占一行    大盒子

### span  占一小块   小盒子  

---

## 图片标签 img/

###  ==格式==

\`\`\` html
<img src="url" 
     alt="text" 
     title = ""  
     weigth="" 
     height=""
     border="" / >
\`\`\`

### HTML5 中的图片属性

\`\`\` html
<picture>
    <source media="(min-width: 1000px)" srcset="logo-large.png">
    <source media="(max-width: 500px)" srcset="logo-small.png">
    <img src="logo-default.png" alt="C语言中文网默认Logo">
</picture>
\`\`\`

[HTML插入图片：标签 (biancheng.net)](http://m.biancheng.net/view/7528.html)

### 可点击区域 map

\`\`\` html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>HTML图片映射</title>
</head>
<body>
    <img src="logo.png" usemap="#objects" alt="C语言中文网Logo">
    <map name="objects">
        <area shape="rect" coords="0,0,82,126" href="http://c.biancheng.net/html/" alt="HTML教程">
        <area shape="circle" coords="90,58,3" href="http://www.biancheng.net/css3/" alt="CSS教程">
        <area shape="circle" coords="124,58,8" href="http://www.biancheng.net/js/" alt="JavaScript教程">
    </map>
</body>
</html>
\`\`\`

### 可点击区域的形状 shape coords

\`\`\` html
<area shape="circle" coords="x, y, radius" href="" alt="">
\`\`\`

---

## 列表 ol ul dl  

###  有序列表 ol +li 

\`\`\` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HTML有序列表</title>
</head>
<body>
    <p>煮米饭的步骤：</p>
    <ol>
        <li>将水煮沸</li>
        <li>加入一勺米</li>
        <li>搅拌均匀</li>
        <li>继续煮10分钟</li>
    </ol>
</body>
</html>
\`\`\`

![image-20220804190736086](HTML.assets/image-20220804190736086.png)

---

### 无序列表 ul + li

\`\`\` html
 <ul>
        <li>鸡蛋</li>
        <li>牛奶</li>
        <li>面包</li>
        <li>生菜</li>
    </ul>
\`\`\`

![image-20220804191018590](HTML.assets/image-20220804191018590.png)

---

### 定义列表

\`\`\` html
 <dl>
        <dt>HTML</dt>
        <dd>HTML 是一种专门用来开发网页的标记语言，您可以转到《<a href="http://c.biancheng.net/html/" target="_blank">HTML教程</a>》了解更多。</dd>
        <dt>CSS</dt>
        <dd>CSS 层叠样式表可以控制 HTML 文档的显示样式，用来美化网页，您可以转到《<a href="http://c.biancheng.net/css3/" target="_blank">CSS教程</a>》了解更多。</dd>
        <dt>JavaScript</dt>
        <dd>JavaScript 简称 JS，是一种用来开发网站（包括前端和后台）的脚本编程语言，您可以转到《<a href="http://c.biancheng.net/js/" target="_blank">JS教程</a>》了解更多。</dd>
    </dl>
\`\`\`

![image-20220804191218762](HTML.assets/image-20220804191218762.png)

--------

## 表格  table

[HTML 标签（表格） (biancheng.net)](http://m.biancheng.net/view/7540.html)

\`\`\` html
<table border="1" style="border-collapse: collapse;">
  <caption>这是表格的标题</caption>
  <tr>
     <th>名称</th>
     <th>官网</th>
     <th>性质</th>
  </tr>
   <tr>
     <td>C语言中文网</td>
     <td>http://c.biancheng.net/</td>
     <td>教育</td>
  </tr>
  <tr>
     <td></td>
     <td>http://www.baidu.com/</td>
     <td>搜索</td>
  </tr>
  <tr>
      <td>当当</td>
     <td>http://www.dangdang.com/</td>
      <td>图书</td>
  </tr>
</table>
\`\`\`

![image-20220804213419840](HTML.assets/image-20220804213419840.png)

\`\`\` html
<table border="1" style="border-collapse: collapse;">
    <tr>
       <th>名称</th>
     <th>官网</th>
     <th>性质</th>
    </tr>
    <tr>
      <td>C语言中文网</td>
     <td>http://c.biancheng.net/</td>
     <td>教育</td>
    </tr>
    <tr>
      <td rowspan="2">百度</td>
      <td>http://www.baidu.com/</td>
      <td>搜索</td>
    </tr>
    <tr>
      <td colspan="2">http://www.dangdang.com/</td>
    </tr>
</table>
\`\`\`

![image-20220804213610257](HTML.assets/image-20220804213610257.png)

![image-20220804222717722](HTML.assets/image-20220804222717722.png)

---

\`\`\`html
 <div>
        <input placeholder="请输入名称" v-model="keyWord" type="text">
        <table style="margin-top:10px;" width="500" cellspacing="0" cellpadding="0" border>
            <thead>
                <tr>
                    <th>物品</th>
                    <th>单价</th>
                    <th>数量</th>
                    <th>总价</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in searchData">
                    <td align="center">{{ item.name }}</td>
                    <td align="center">{{ item.price }}</td>
                    <td align="center">
                        <button @click="item.num > 1 ? item.num-- : null">-</button>
                        <input v-model="item.num" type="number">
                        <button @click="item.num < 99 ? item.num++ : null">+</button>
                    </td>
                    <td align="center">{{ item.price * item.num }}</td>
                    <td align="center">
                        <button @click="del(index)">删除</button>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="5" align="right">
                        <span>总价：{{ total }}</span>
                    </td>
                </tr>
            </tfoot>
 
        </table>
    </div>
\`\`\`











## 表单 form

### 结构 

[HTML表单：标签 (biancheng.net)](http://m.biancheng.net/view/7564.html)

\`\`\` html
<form action="URL" method="GET|POST">
    表单中的其它标签
</form>
\`\`\`

属性：name,value,checked,maxlength

### 表单控件

![image-20220804192823411](HTML.assets/image-20220804192823411.png)

hidden 隐藏 label for="1" <!--input id="1">

\`\`\`html
 <form action="./userinfo.php" method="POST">
        <!-- 文本输入框控件 -->
        <label>用户名： </label><input name="username" type="text"><br>
        <!-- 密码框控件 -->
        <label>密&emsp;码： </label><input name="password" type="password"><br>
        <!-- 下拉菜单控件 -->
        <label>性&emsp;别：</label>
        <select name="sex">
            <option value="1">男</option>
            <option value="2">女</option>
            <option value="3">未知</option>
        </select>
        <br>
        <!-- 复选框控件 -->
        <label>爱&emsp;好：</label>
        <input type="checkbox" name="hobby" value="1">听音乐
        <input type="checkbox" name="hobby" value="2">看电影
        <input type="checkbox" name="hobby" value="3">打游戏
        <br>
        <!-- 单选按钮控件 -->
        <label>学&emsp;历：</label>
        <input type="radio" name="education" value="1">小学
        <input type="radio" name="education" value="2">中学
        <input type="radio" name="education" value="3">本科
        <input type="radio" name="education" value="4">硕士
        <input type="radio" name="education" value="5">博士
        <br>
        <!-- 按钮 -->
        <input type="submit" value="提 交">&emsp;&emsp;
        <input type="reset" value="重 置">
    </form>
\`\`\`

![image-20220804192858780](HTML.assets/image-20220804192858780.png)

![image-20230801202641723](HTML.assets/image-20230801202641723.png)

---

## 特殊字符

1. &emsp 空格  &nbsp
2. &it 小于 &gt大于

## head

它的作用是保存页面的一些[元数据](https://developer.mozilla.org/zh-CN/docs/Glossary/Metadata)。

### title

可以为文档添加标题

### 元数据 meta

元数据就是描述数据的数据，而 HTML 有一个“官方的”方式来为一个文档添加元数据——[\`<meta>\`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta) 元素。

- \`charset\`
- \`name\` 指定了 meta 元素的类型；说明该元素包含了什么类型的信息。
- \`content\` 指定了实际的元数据内容。

这两个 meta 元素对于定义你的页面的作者和提供页面的简要描述是很有用的。让我们看一个例子：

<meta name="author" content="Chris Mills" />
<meta
  name="description"
  content="The MDN Web Docs Learning Area aims to provide
complete beginners to the Web with all they need to know to get
started with developing web sites and applications." />

### icon 

\`\`\`html
<link rel="icon" 
      href="favicon.ico" 
      type="image/x-icon" 
 />
\`\`\`









# CSS

## 书写循序

![image-20220810222749031](HTML.assets/image-20220810222749031.png)

## 样式表

\`\`\`css
1.内部样式表 
<style type="text/css"></style>
2.外部样式表
<link rel="stylesheet" type="text/css" href="index.css">
\`\`\`

## 属性

### 字体

1. font-family 定义文本的字体系列

2. font-style  设置字体的样式，例如斜体、倾斜等

   ![image-20220805184650445](HTML.assets/image-20220805184650445.png)

3. font-weight 设置字体的粗细![image-20220805184856365](HTML.assets/image-20220805184856365.png)

4. font-size![image-20220805185017079](HTML.assets/image-20220805185017079.png)

---

### 文本

- ==text-align：设置文本的水平对齐方式==

- ![image-20220805191809567](HTML.assets/image-20220805191809567.png)

- ==text-decoration：设置文本的装饰；==

- ![image-20220805191912576](HTML.assets/image-20220805191912576.png)

- ==text-transform：设置文本中英文的大小写转换方式；==

- ![image-20220805191933189](HTML.assets/image-20220805191933189.png)

- ==text-indent：设置文本的缩进方式；==

- ![image-20220805192000996](HTML.assets/image-20220805192000996.png)

- ==line-height：设置行高；==

- ![image-20220805192020481](HTML.assets/image-20220805192020481.png)

- letter-spacing：设置字符间距；

- ![image-20220805192040096](HTML.assets/image-20220805192040096.png)

- word-spacing：设置单词与单词之间的间距（对中文无效）；

- 同上

- text-shadow：设置文本阴影；

- ![image-20220805192132704](HTML.assets/image-20220805192132704.png)

- vertical-align：设置文本的垂直对齐方式；

- ![image-20220805192220721](HTML.assets/image-20220805192220721.png)

- white-space：设置文本中空白的处理方式；

- ![image-20220805192332551](HTML.assets/image-20220805192332551.png)

- direction：设置文本方向。

- ![image-20220805192349416](HTML.assets/image-20220805192349416.png)
---

### Emmet语法

[02-emmet语法生成html标签_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV14J4114768?p=94&spm_id_from=pageDriver&vd_source=a97555db7a704882626ff6b3dff1617c)

---

### 选择器

---

#### 元素选择器

==根据标签名，选中页面中的指定元素==

\`\`\` css
标签名{
    
}
\`\`\`

---

#### id选择器

![image-20220805175442982](HTML.assets/image-20220805175442982.png)

---

#### 类选择器

![image-20220805180442699](HTML.assets/image-20220805180442699.png)

---

#### 通配选择器

\`\`\`css
*{
    选中页面中的所有元素
}
\`\`\`

---

#### 复合选择器

1. 后代选择器

   \`\`\` css
   ol li{color : pink}
   \`\`\`

2. 子元素选择器

   \`\`\`css
   div > p{}
   \`\`\`

3. 并集选择器

   \`\`\`css
   div,p,#box,.hello{}
   \`\`\`

4. 交集选择器

   \`\`\`css
   p.hello{}
   \`\`\`

   ---

### 链接样式

1. :link 

   表示一个普通的链接（未访问过的链接）

2. :visited

   表示访问过的链接

3. :hover

   鼠标移入的链接，也可以为其他元素设置hover

4. :active

   正在被点击的链接，也可以为其他元素设置active

   按下没松开

5. 另外

   ![image-20220806183211189](HTML.assets/image-20220806183211189.png)

### 元素显示模式

#### 块元素

![image-20230801205931087](HTML.assets/image-20230801205931087.png)

1. h1,
2. p,
3. div,
4. ul
5. ol,
6. li

#### 行元素

![image-20230801210158386](HTML.assets/image-20230801210158386.png)

1. a
2. strong
3. em
4. del
5. ins
6. span

#### 行内块元素

![image-20230801210413761](HTML.assets/image-20230801210413761.png)

1. img
2. input
3. td

#### 显示模式的转换(display)

行转块

\`\`\`html
<a href="#"></a>
<style>
    a{
        display: block/inline
    }
</style>
\`\`\`

[CSS display（元素显示类型） (biancheng.net)](http://m.biancheng.net/css3/display.html)



---

### 背景

#### backgroud-color
\`\`\`
背景颜色
\`\`\`

#### background-image

\`\`\`
background-image:url
\`\`\`

#### background-repeat

\`\`\`
设置背景图片重复方式
可选值：
{
repeat     沿x轴和y轴双方向重复
no-repeat  背景图片不重复
repeat-x   背景图片沿水平方向重复
repeat-y   背景图片沿垂直方向重复
}
\`\`\`

#### background-position

\`\`\`java
//设置方式一 关键字
/**
top  left right bottom center 可以组合
**/
\`\`\`

\`\`\`java
//设置方式二 偏移量
/**
background-position : x轴偏移量  y轴偏移量;
**/
\`\`\`

#### background-attachment

\`\`\`java
//用来设置背景是否随页面滚动
/**
scroll 默认值，背景图片会随页面一起滚动
fixed  背景图片不随页面滚动，会固定在页面的指定位置
       一般这种背景都会设置给body
**/
\`\`\`

#### opacity

\`\`\`java
//用来设置背景的不透明度
/**
可选值 0~1
**/
\`\`\`

---

### css三大特性

#### 层叠性

#### 继承性

#### 优先级

![image-20220808194046890](HTML.assets/image-20220808194046890.png)

---

## 盒子模型

![image-20220808201751251](HTML.assets/image-20220808201751251.png)

### 内容区（content）

==属性==  

 1. width

 2. height 

 3. ==overflow:==
    hidden：表示隐藏溢出的部分；
    visible：表示显示溢出的部分（溢出的部分将显示在盒子外部）；
    scroll：表示为内容区添加一个滚动条，您可以通过滑动这个滚动条来查看内容区的全部内容；
    auto：表示由浏览器决定如何处理溢出部分。

---

### 内边距（padding）

内边距是内容区和边框之间的空间，您可以通过
==padding-top、==
==padding-right、==
==padding-bottom、==
==padding-left==
==以及它们的简写属性 padding==
来设置内容区各个方向上与边框之间的距离。在为盒子模型设置背景属性时，背景属性可以覆盖到内边距区域。

\`如果盒子没有指定width/height属性，则padding不会撑开盒子大小\`

---

### 边框（border）

边框是环绕内容区和内边距的边界，您可以使用 
==border-style、==
==border-width== 
==和 border-color== 
==以及它们的简写属性 border 来设置边框的样式。==

其中 border-style 属性为边框中最主要的属性，如果没有设置该属性的话，其它的边框属性也会被忽略。

会影响盒子大小

---

### 外边距（margin）

外边距位于盒子模型的最外围，是边框之外的空间，通过外边距可以使盒子与盒子之间不会紧凑的连接在一起，是 CSS 布局中的一种重要手段。

您可以使用 
	==margin-top、==
	==margin-bottom、==
	==margin-left、==
    ==margin-right== 
	以及它们的简写属性 margin 
        来设置各个方向上外边距的宽度。



overflow: hidden防止高度塌陷，常用*记

清除内外边距 

*{
margin:0;
padding:0;
}

> 水平居中

条件：

1. 指定了width
2. magin:0 auto

> 兄弟元素,外边距合并

![image-20230802184430918](HTML.assets/image-20230802184430918.png)

> 嵌套元素，外边距会塌陷

![image-20230802184908018](HTML.assets/image-20230802184908018.png)

解决方案(在父元素上)：

1. 设置边框
2. 内边距
3. overflow:hidden





---

## 相关应用

### 边框

\`\`\`css
border-radius: 50px;//高度的一半
border-collapse: collapse;//合并相邻的边框
\`\`\`

---

### 盒子阴影

\`\`\`css
box-shadow: 0 4px orange inset;
h-shadow v-shadow blur spread color Inset/outset
水平阴影的位置/垂直阴影的位置/模糊距离/阴影的尺寸/阴影的颜色/将外部阴影 (outset) 改为内部阴影
\`\`\`

---

### 文字阴影

\`\`\`css
test-shadow: ;  
\`\`\`

---

## 布局方式

### float 浮动

可以改变元素默认的排列方式

![image-20230802192444414](HTML.assets/image-20230802192444414.png)

1. 不在保留原先位置
2. 会一行显示并且元素顶部对齐
3. 具有行内块特性

\`\`\`css
float:none\\left\\right
\`\`\`

### 清除浮动

![image-20230802193858087](HTML.assets/image-20230802193858087.png)

不设置父元素高度，子元素float:left 高度会是0



\`\`\`css
额外便签法 <div class="clear">  </div>
.clear{
    clear: both;
}
/* 父元素法*/
overflow:hidden;

/* after 伪元素 */
::after{
    content:""；
    display:block;
    height:0;
    clear:both;
    visibility:hidden;
    
}
\`\`\`

[27-清除浮动总结_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV14J4114768?p=188&spm_id_from=pageDriver&vd_source=a97555db7a704882626ff6b3dff1617c)

---

## css代码循序

\`\`\`css
1 #确认版心  
.w{
    width: 1200px;
    margin:auto;
}
2 通用代码
-----------------
* {
  margin: 0;
  padding: 0;
}
------------------
li {
  list-style: none;
}
------------------
a {
  text-decoration: none;
  color: #050505;
}
------------------
.clearfix:before,
.clearfix:after {
  content: "";
  display: table;
}
.clearfix:after {
  clear: both;
}
.clearfix {
  *zoom: 1;
}
\`\`\`
---
## 定位

### 用处

\`\`\`apl
1. 某个元素可以自由的在一个盒子内移动位置，并且压住其他盒子。
2.盒子固定在屏幕的某位置，在滚动时
\`\`\`

### 使用

\`\`\`apl
定位=定位模式 + 边偏移
--------------------------------------------------------------
position：static(静态)/relative(相对)/absolute(绝对)/fixed(固定)
---------
边偏移top/buttom/left/right ==margin
\`\`\`

### static 静态定位

\`\`\`apl
默认标准流
\`\`\`

### relative相对定位

\`\`\`css
position : relative
1. 相对偏移
2. 保留原位置，不会被后面的盒子占位置
3.可以限制绝对定位
4.相对是 相当于自己
\`\`\`

### absolute绝对

\`\`\`apl
相对 <祖先元素> 移动位置

特点：

1.如果 <没有祖先元素> 或者 <祖先元素没有定位> ， 
  则以浏览器为准
--------------  
2. 如果 祖先元素有定位> ，则以最近一级的有定位的父元素为准
--------------
3. 绝对定位脱标的不占有原来位置
\`\`\`

### 使用场景

\`\`\`css
子绝对 父相对
\`\`\`

### 固定定位 fixed

\`\`\`css
根据可视窗口 定位

div{
position : fixed;
    top:        ;
    left:       ;
    right:      ;
    buttom:     ; 
}

/*固定在版心右侧*/
.fixed{
    position :fixed;
    left:50%;
    margin:版心一半;
}
\`\`\`

### 粘性定位 sticky

页面翻滚到某一距离时 开始固定

---

### 定义叠放次序 z-index

数值越大 ，盒子越靠上

---

### 拓展

浮动能压住标准流盒子，并且把里边的内容（文字、图片）往右边挤出来

---

## 元素的显示与隐藏
\`\`\`css
1. display：
   none隐藏 block 显示
   隐藏元素后不占位置
----------------------------------
2. visibility：
   hidden隐藏 visible 显示
   隐藏元素后占位置
----------------------------------
3. overflow溢出显示隐藏：
   hidden  隐藏 
   visible 显示 
   scroll  溢出的部分显示滚动条 
   auto    自动
\`\`\`

---

## ==CSS高级==

### 精灵图

把所有图拼成一张图

==复杂的图用这个==

position设置时数值反方向

---

### 字体图标

用于显示网页中通用的一些小图标

展示是图标本质是文本

\`\`\`html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      @font-face {
        font-family: "icomoon";
        src: url("fonts/icomoon.eot?usmogu");
        src: url("fonts/icomoon.eot?usmogu#iefix") format("embedded-opentype"),
          url("fonts/icomoon.ttf?usmogu") format("truetype"),
          url("fonts/icomoon.woff?usmogu") format("woff"),
          url("fonts/icomoon.svg?usmogu#icomoon") format("svg");
        font-weight: normal;
        font-style: normal;
        font-display: block;
      }

      span {
        font-family: "icomoon";
        font-size: 40px;
        color: aqua;
      }
    </style>
  </head>
  <body>
    <span></span>
    <span></span>
  </body>
</html>

\`\`\`

==简单的图用这个==

> 使用流程

下载 

http://icommon.io

http://www.iconfont.cn

![image-20230802201506627](HTML.assets/image-20230802201506627.png)

字体图标引入

​	引入css文件

![image-20230802202200231](HTML.assets/image-20230802202200231.png)

声明字体

\`\`\`css
font-family:'icommon'
\`\`\`

> [Use Font Awesome on the Web | Font Awesome Docs](https://fontawesome.com/docs/web/)







---

### CSS三角

\`\`\`css
 .box {
        width: 0;
        height: 0;
        border-top: 100px solid pink;
        border-right: 100px solid red;
        border-bottom: 100px solid green;
        border-left: 100px solid blue;
      }
\`\`\`

---

### CSS常用户界面样式

更改用户操作，提供用户体验
如鼠标等

\`\`\`apl
1. 鼠标
{cuersor:
		default(小白 默认)
		pointer(小手)
		move(移动)
		text(文本)
		not-allowed(禁止)
		}
-------------------------------------------------------------------------------------------------------------------
\`\`\`

\`\`\`css
2.取消表单轮廓 和 防止拖拽文本域
textarea {
        /* 取消轮廓线 */
        outline: none;
      }
 textarea {
        /* 不可拉大文本域 */
        resize: none;
      }
\`\`\`

---

### vertical-align 属性应用

用于设置图片 或 表单（行内块元素） 和文字 垂直对齐

![image-20220811214931404](HTML.assets/image-20220811214931404.png)

==图片底侧空白缝隙解决方案==

vertical-align：middle

---

### 溢出 省略号表示

\`\`\`css
   /* 这个单词的意思是如果文字显示不开自动换行 */
            /* white-space: normal; */
            /* 1.这个单词的意思是如果文字显示不开也必须强制一行内显示 */
            white-space: nowrap;
            /* 2.溢出的部分隐藏起来 */
            overflow: hidden;
            /* 3. 文字溢出的时候用省略号来显示 */
            text-overflow: ellipsis;
\`\`\`

---

### 布局技巧

#### margin负值

1. margin-left 解决边框重叠问题
2.  hover 边框显示不全 （ z-index: 1；）

#### 文字围绕浮动元素的妙用

.pic img {

​    width: 100%;

   }

#### 行内块的巧妙运用

可以做跳转页面

用行内块 自带间距 然后去找父类 添加 text-alin：center 实现居中

----

## CSS初始化

\`\`\`css
/* 把我们所有标签的内外边距清零 */
* {
    margin: 0;
    padding: 0
}
/* em 和 i 斜体的文字不倾斜 */
em,
i {
    font-style: normal
}
/* 去掉li 的小圆点 */
li {
    list-style: none
}

img {
    /* border 0 照顾低版本浏览器 如果 图片外面包含了链接会有边框的问题 */
    border: 0;
    /* 取消图片底侧有空白缝隙的问题 */
    vertical-align: middle
}

button {
    /* 当我们鼠标经过button 按钮的时候，鼠标变成小手 */
    cursor: pointer
}

a {
    color: #666;
    text-decoration: none
}

a:hover {
    color: #c81623
}

button,
input {
    /* "\\5B8B\\4F53" 就是宋体的意思 这样浏览器兼容性比较好 */
    font-family: Microsoft YaHei, Heiti SC, tahoma, arial, Hiragino Sans GB, "\\5B8B\\4F53", sans-serif
}

body {
    /* CSS3 抗锯齿形 让文字显示的更加清晰 */
    -webkit-font-smoothing: antialiased;
    background-color: #fff;
    font: 12px/1.5 Microsoft YaHei, Heiti SC, tahoma, arial, Hiragino Sans GB, "\\5B8B\\4F53", sans-serif;
    color: #666
}

.hide,
.none {
    display: none
}
/* 清除浮动 */
.clearfix:after {
    visibility: hidden;
    clear: both;
    display: block;
    content: ".";
    height: 0
}

.clearfix {
    *zoom: 1
}
\`\`\`
# HTML 5

## 语义化标签

\`\`\`apl
1. <header>    头部标签
2. <nav>       导航标签
3. <article>   内容标签
4. <section>   定义文档某个区域
5. <aside>     侧边栏标签
6. <footer>    尾部标签
\`\`\`

![image-20220812190651252](HTML.assets/image-20220812190651252.png)

---

## 视频标签 

video 属性

\`\`\`css
1. autoplay="autoplay"	 视频在就绪后马上播放。
2. controls="controls"  向用户显示控件，比如播放按钮。
3. height  =" "	     设置视频播放器的高度。
4. loop    ="loop"	     当媒介文件完成播放后再次开始播放。
5. preload="preload"	视频在页面加载时进行加载，并预备播放。
如果使用 "autoplay"，则忽略该属性。

6. src	url	            要播放的视频的 URL。
7. width	pixels	    设置视频播放器的宽度。
8. muted                 静音
\`\`\`

==source 标签==

\`\`\`css
<video width="320" height="240" controls>
  <source src="movie.mp4" type="video/mp4">
  <source src="movie.ogg" type="video/ogg">
  Your browser does not support the video tag.
</video>
\`\`\`

![image-20220812195146508](HTML.assets/image-20220812195146508.png)

| track 属性 | 定义在媒体播放器文本轨迹 |  (https://www.runoob.com/tags/tag-track.html)    |
| ------------------------------------------------------ | :----------------------- | ---- |

---

## 音频标签 audio
![image-20220812205630002](HTML.assets/image-20220812205630002.png)

---

## input表单

\`\`\`apl
1. email
2. url
3. date
4. time
5. number
6. tel 手机号码
7. search 
8. color
9. submit 提交
\`\`\`

## 新增表单属性

![image-20220812223012383](HTML.assets/image-20220812223012383.png)

---

# CSS 3 

## 属性选择器 [ ]

\`\`\`apl
1. 利用属性选择器就可以不用借助于类或者id选择器

2. 属性选择器还可以选择属性=值的某些元素 重点务必掌握的

3. 属性选择器可以选择属性值开头的某些元素 

4. 属性选择器可以选择属性值结尾的某些元素 
\`\`\`

![image-20220812231154626](HTML.assets/image-20220812231154626.png)

---

## 结构伪类选择器  nth-child

\`\`\`apl
nth-child  与  nth-of-type 
\`\`\`

![image-20220812233123988](HTML.assets/image-20220812233123988.png)

---

## 伪元素选择器

\`\`\`apl
::before	和	::after
必须有content元素
\`\`\`

---

## 盒子模型border-box

![image-20220813005304514](HTML.assets/image-20220813005304514.png)

---

## CSS3图片模糊处理

==filter==

\`\`\`css
filter: blur(5px) 模糊    
\`\`\`

---

## 计算盒子宽度calc函数

\`\`\`css
width: calc(100% - 10px);
\`\`\`

---

## 过渡 动画效果

\`\`\`css
transition: 变化的属性 花费时间 运动曲线 何时开始;
transition: width .5s ease 0s, 
            height .5s ease 1s; 
/*如果想要写多个属性，利用逗号进行分割 */
transition: width .5s, height .5s; */
/* 如果想要多个属性都变化，属性写all就可以了 */
transition: height .5s ease 1s; 
/* 谁做过渡，给谁加 */
\`\`\`

![image-20220813011625437](HTML.assets/image-20220813011625437.png)

---
## CSS3	 2D转换

转换 transform 可以实现元素的位移 旋转 缩放

\`\`\`apl
1. 移动 translate
2. 旋转 rotate
3. 缩放 scale（x ，y）
transform-origin ： left buttom 
以左下为中心
\`\`\`





---
## 动画

\`\`\`css
@keyframes 动画名称{
    0%{
       width:100px;
    }
    100%{
        width:200px
    }
}

animation-name :动画名称;
animation-duration : 持续时间;
animation-timing-function:速度曲线
animation-delay:规定动画何时开始
animation-direction:规定动画是否在下一周期逆序播放
animation-iteration-count：播放次数
animation-play-state：规定动画运行或暂停(paused)
animation-fill-mode：
规定动画结束后状态，保持forwards回到起始backwards

animation:move 15s liner infinite
\`\`\`

---

## 3D 转换

\`\`\`apl
1. 3D位移：translate3d(x,y,z)
2. 3D旋转：rotate3d   (x,y,z)
3. 透视  ：perspective 父元素
4. 3D呈现：transfrom-style
\`\`\`



## 背景颜色渐变

\`\`\`css
1. background: liner-gradient(to left,red,blue)
2. -webkit-linear-gradient
\`\`\`

## 边框图片

![image-20221008020008968](HTML.assets/image-20221008020008968.png)





## 新特性

### text

\`\`\`css
h2{
    font-size: 12px;
    text-fit: grow; 
}
\`\`\`





# 常用命名

![image-20220813171300107](HTML.assets/image-20220813171300107.png)

---

# 移动端
## 基础
### 视口（理想视口）

定义：浏览器显示页面内容的屏幕区域

viewport

\`\`\`css
1. 布局视口layout viewport
   /*跟PC端显示一样 分辨率设为980px*/
2. 视觉视口 
3. 理想视口 ideal viewport
/*meta视口标签*/

\`\`\`

### meta

\`\`\`css
 <meta
   name="viewport"
content="width=device-width, (宽度与设备一样)              user-scalable=no(缩放),                          initial-scale=1.0,                              maximum-scale=1.0,                              minmum-scale=1.0"
    />
/*scale 缩放*/
\`\`\`

### 像素

\`\`\`apl
物理像素 -- 分辨率1980个像素点
电脑端 1px=1像素
手机端 1px=n像素 物理像素比
\`\`\`

### 二倍图

\`\`\`css
100px*100px 的图片 先缩放50% 再在手机端放大
\`\`\`

---

## 布局

\`\`\`css
1. 流失布局 (百分比布局)
2. flex布局
3. less+rem+媒体查询布局
4. 混合布局
\`\`\`

### 流式布局

%

### flex布局

\`\`\`css
flex父项
1. flex-direction 设置主轴方向 
/* row 默认 
   row-reverse 右到左
   column 上到下
   column-reverse 下到上
*/
2. justify-content 设置主轴上的子元素排列方式
/*flex-start 默认
  flex-end
  center
  space-around
  space-between 先两边贴边 再平分剩余空间
*/
3. flex-wrap 设置子元素是否换行
/* no-wrap
   wrap
*/
4. align-content 设置侧轴上的子元素的排列方式（多行） /* 同2*/
5. align-items 设置侧轴上的子元素排列方式（单行）
/* flex-start 上到下
   flex-end
   center
   stretch 拉伸 默认
*/
6. flex-flow 复合属性 （flex-direction 和 flex-wrap）
-------------------------------------------------------------------------------------------
flex 子项
1. flex  子项目占的份数
2. align-self 控制子项自己在侧轴的排列方式
3. order 定义子项的排列顺序 /*数字越小越靠前*/
\`\`\`

### rem布局

\`\`\`css
1. rem单位 /*页面文字随屏幕缩放，html{font-size}*/
2. @media 媒体查询/*针对不同的屏幕尺寸设置不同的样式*/
    @media 媒体类型（screen/all/print）(and|or|not) (max-width:800px){
           
}
3. less /*css 扩展语言*/
@color：pink
------------------------------------------------flexible.js 适配方案
 
\`\`\`

![image-20230802215401714](HTML.assets/image-20230802215401714.png)

![image-20230802215451474](HTML.assets/image-20230802215451474.png)

![image-20230802220739959](HTML.assets/image-20230802220739959.png)

---

## 常用初始化样式

![image-20220818220856777](HTML.assets/image-20220818220856777.png)

## Swiper（轮播图）

---

## 响应式布局

使用媒体查询针对不同宽度的设备进行布局和样式的设置，从而适配不同设备的目的。

\`\`\`css
1. 超小屏幕（手机） <768px    设置宽度100%
2. 小屏设备（平板） <992px           750px
3. 中等屏幕（桌面显示器）<1200px	  970px  
4. 宽屏                             1170px
/*开发顺序*/
1. 布局容器 
@media screen and (max-width: 767px) {
            .container {
                width: 100%;
            }
        }
@media screen and (min-width: 768px) {
            .container {
                width: 750px;
            }
        }
@media screen and (min-width: 992px) {
            .container {
                width: 970px;
            }
        }
@media screen and (min-width: 1200px) {
            .container {
                width: 1170px;
            }
        }
2。

\`\`\`

响应式需要一个父级做为布局容器，来配合子集元素来实现变化效果。

原理就是在不同屏幕下，通过媒体查询来改变这个布局容器的大小，从而实现不同屏幕下，看到不同的页面布局和样式

> 案例

![image-20230804192125458](HTML.assets/image-20230804192125458.png)

### bootstrap框架

> 准备

\`\`\`html
 <link href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.2.3/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
    <script src="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.2.3/js/bootstrap.bundle.min.js"
        integrity="sha384-/mhDoLbDldZc3qpsJHpLogda//BVZbgYuw6kof4u2FrCedxOtgRZDTHgHUhOCVim"
        crossorigin="anonymous"><\/script>
\`\`\`

> 容器

![image-20230804201631063](HTML.assets/image-20230804201631063.png)

> 栅格系统

![image-20230804202042332](HTML.assets/image-20230804202042332.png)

\`\`\`css
3.xx 版本
/*栅格系统*/
通过一系列的行row与列column的组合来布局

要实现列的平均均分 要加列前缀 
.col-xs- .col-sm- .col-md- .col-lg- 
列总共12份
例子： 四个盒子均分 则 每个占3份 .col-lg-3
\`\`\`

![image-20230804203358366](HTML.assets/image-20230804203358366.png)

\`\`\`css
.col-md-offset- 类 实现向左右偏移
.col-md-push- 与 .col-md-pull- 改变顺序
\`\`\`

![image-20220821193858556](C:\\Users\\lpl\\Desktop\\HTML\\image-20220821193858556.png)

### 教程



# gruid

[13分钟彻底弄懂CSS Grid基础布局 / CSS Grid 入门教程_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1w84y1r7X8/?p=1&spm_id_from=pageDriver)
`;export{n as default};
