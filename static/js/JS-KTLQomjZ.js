const n=`# JS

---

## 示例

\`\`\`asp
<script>
    alert('hello world')
<\/script>
页面弹窗
\`\`\`

<img src="JS.assets/image-20220914101900362.png" alt="image-20220914101900362" style="zoom:67%;" />

![image-20220914103003500](JS.assets/image-20220914103003500.png)

---

# ECMAScript

\`\`\`apl
js的基础语法
\`\`\`

## 1.书写位置

\`\`\`apl
1. 内嵌式 head里面
<script>.......<\/script>
2. 行内式 元素
<input type="button" value="kk",onclick="alert('yy')">
点击kk的button 弹出 yy
3. 外部js
<script src="my.js"><\/script>
\`\`\`

---

## 2.输入输出语句

\`\`\`apl
alert(msg)			  浏览器弹出警示框
console.log(msg)	  浏览器控制台打印输出信息
prompt(info)           浏览器弹出输入框
\`\`\`

---

## 3.变量

\`\`\`js
var age = prompt();
\`\`\`

### 关键字

![image-20220914210842628](JS.assets/image-20220914210830199.png)

### 保留字

![image-20220914210916153](JS.assets/image-20220914210916153.png)

---

## 4.数据类型

\`\`\`js
Number,Boolean,Sring,Undefined,Null

//数字前加0,表示8进制;加0x,表示16进制

//infinity 无穷大 ;NaN 代表一个非数值
转换 var age=10; age='pink';

//获取变量数据类型
.log(typeof age);
\`\`\`

### String

\`\`\`js
var str;
str.length;

//字符串+任何类型=拼接后的新字符串;
\`\`\`

### 数据类型的转换

\`\`\`css
//转换为字符串
toString(); String();拼接字符串
//转换数字型
parseInt(String) **;
parseFloat(String) **;
Number();
算术符
//转换布尔值
Boolean();
\`\`\`

![image-20220914205412963](JS.assets/image-20220914205412963.png)

---

## 5 .转义符

\`\`\`apl
\\n	换行
\\\\	斜杠\\
\\'	单引号
\\"	双引号
\\t	tab缩进
\\b	空格
\`\`\`

## 6.流程控制

\`\`\`js
// if 同java
if(){

}
//switch
switch(){
    case value1 :
        break;
    case value2 :
        break;
    default:    ;
}
//for
for (var i = 1 ; i <= 100 ; i++ ) {

}

\`\`\`

---

## 7.数组

\`\`\`js
var arr = new Array();
var arr = [1,2,3,'4',true];
console.log(arr[0])

filter根据指定条件隐式循环过滤数组
arr.filter( item => item%2 === 0 )

//sum初始值0,更新 sum=sum+item
this.list.reduce((sum,item)-> sum+item,0)
\`\`\`

---

## 8.函数

\`\`\`js
function 函数名 （）{
    .log
}
//调用
函数名();

function hanshu (aru,name , .....) {
    .log
    return ;
}
//函数表达式
var fn =function(){
   log("")
}
fn();
//函数内部
num=20;//+全局变量
\`\`\`

### arguments

\`\`\`js
function fn() {
  arguments.log;
}
fn(1, 2, 3);
\`\`\`

---

## 9.预解析

\`\`\`css
 log(num)
var num=10;
/*显示undefined*/

fun();
var fun=function(){

}
//报错
\`\`\`

\`\`\`js
//js运行机制
1. 预解析
js引擎会把js里面所有的var 和 function 提升到当前作用域的最前面

(1)var 提升声明，不提赋值;
\`\`\`

---

## 10.对象

### <1>自定义对象

分类：自定义对象，内置对象，浏览器对象

#### 1.创建对象

\`\`\`apl
var obj={
    uname: "11" ,
    age :18 ,
    sex : 1 ,
    sayHi: function(){
        log("11");
    }
}
log(obj.age)//18
log(obj["age"])//18
log(obj.sayHi())//11
\`\`\`

![image-20220920232941252](JS.assets/image-20220920232941252.png)

\`\`\`apl
var obj=new Object();
obj.age=18;
obj.name="11";
\`\`\`

\`\`\`js
//构造器 首字母大写
function Star(uname, age, sex) {
  this.name = uname;
  this.age = age;
  this.sex = sex;
  this.sing = function (sang) {
    console.log(sang);
  };
}
var ldh = new Star("刘德华", 18, "男");
\`\`\`

#### 2.变量

\`\`\`js
for (var k in ldh) {
  console.log(k); //属性名
  console.log(ldh[k]); //属性值
}
\`\`\`

---

### <2>内置对象

Js 自带

\`\`\`js
//Math
Math.max()函数返回一组数中的最大值
//封装对象自定义
var myMath={
    PI:3.141592653,
    max:function(){
        var max=arguments[0];
        //求最大;
    }
}
myMath.max();

//<1>Math.random() [0,1)
//<2>Math.getRandomInt()
//<3>Math.getRandomIntclusive(min,max)

function getRandom(min,max){
   return Math.floor(Math.random()*(max-min+1)+min);
}
\`\`\`

![image-20220920191438683](JS.assets/image-20220920191438683.png)

\`\`\`js
//Date 构造函数
var data = new Date();
参数 2019,01,06  '2019-12-9 8:8:8'
//格式化
data.getDay
//时间戳
data.getTime();
var date= +new Date();
Date.now();
\`\`\`

![image-20220920201813830](JS.assets/image-20220920201813830.png)

---

数组对象

\`\`\`js
var arr1=new Array(10);
lenght=10;
var arr1=new Array(1,2,3);
==[1,2,3]

instanceof ;判断是否为数组
Arrays.isArray(); 判断数组

var arr=[1,2,3];
arr.push();入栈
arr.pop();出栈

arr.unshift();开头添加
arr.shift();开头删除

//翻转数组
arr.reverse();
//数组牌序
arr.sort(function(a,b){
   return  a - b;//升序
});

//查找索引 可用于数组去重
arr.indexOf('aa');
arr.lastIndexOf('aa');

//转换String
arr.toSting();
arr.join('-') 分隔符
\`\`\`

---

字符串对象

\`\`\`js
//获取索引
str.indexOf('要查找的字符',起始的位置);
str.indexOf('a',index+1)
//根据索引返回字符
str.charAt();
str.charCodeAt(index)//获取ASCII码
str[index];
//concat拼接
str.concat("1");
//截取
str.substr(start,length);
//从start开始，取length个
str.slice(start,end);
//[start,end)

//替换字符串 ,只换第一个
str.replace(被替换的字符，要替换的字符);
//转换字符串为数组
str.split(分隔符);
//toUpperCase();
//toLowerCase();
\`\`\`

---

## 11.简单类型与复杂类型

简单类型：基本数据类型，值类型

string number boolean undefined null

复杂类型：引用类型

![image-20220921183807176](JS.assets/image-20220921183807176.png)

---

# DOM

![image-20220914145306275](JS.assets/image-20220914145306275.png)

![image-20220921194826198](JS.assets/image-20220921194826198.png)

![image-20220921194957340](JS.assets/image-20220921194957340.png)

## 1.获取元素

\`\`\`js
//通过id
document.getElementsByld();
//打印元素
console.dir();

//通过标签名
document.getElementsByTagName();
var ol = getElementsByld("ol");
ol[0].getElementsdByTagName("li");

//通过类名
document.getElementsByClassName();
//通过选择器 返回第一个对象
document.querySeletor(".box");
//通过选择器 返回所有对象
document.querySeletorAll(".box");

//获取body元素
document.body;
//获取html元素
document.docuemntElement;
\`\`\`

---

## 2.事件基础

\`\`\`js
//事件 = 事件源 + 事件类型 + 事件处理程序

var btn = document.getElementById("btn");
btn.onclick = function () {
  alert("1");
};
\`\`\`

---

## 3.操作元素

\`\`\`js
//改变元素内容
var btn=document.querySelector('button');
var div=document.querySelector('div');


btn.onclick =function(){
    div.innerText=Date.now();
    div.innerHtml=Date.now();
    //html 保留空格和换行;
}

var p  =document.querySelector('p');
p.innerText="";

//改变元素属性
获取元素对象
var ldh;
var zxy;
zxy.onclick =function(){
    img.src="";
}

//改变样式属性
btn.style.background="";
.change{

}
btn.className="change";
\`\`\`

### 排他思想

\`\`\`js
button * 5;

btns[i].onclick = function () {
  log("1");
};
\`\`\`

### 自定义属性

\`\`\`js
1. element.属性
2. element.getAttribute('属性','值');
3. element.getAttribute('属性'）;
4. element.removeAttribute('属性');
自定义属性：data-xxx;
element.dataset‘(集合)’.index‘属性’
\`\`\`

## 4.节点操作

\`\`\`js
node.parentNode; //没有 Null
node.childNodes;//会把空格算进去
node.nodeType == 1 ;//是元素结点
node.children//返回子的 元素结点
parentNode.firstChild;//获取第一个子节点
parentNode.lastChild; //获取最后的子节点
---
node.nextSibling;//下一个兄弟结点
node.previousSibling;//上一个兄弟结点
\`\`\`

![image-20220923000914776](JS.assets/image-20220923000914776.png)

---

### 创建结点

\`\`\`js
//创建结点
var li = document.createElement("li");
//添加结点
node.appendChild(li);
将一个结点添加到指定父结点的子节点列表末尾;

node.insertBefore(child, 指定元素);
/*将一个结点添加到父节点的指定子节点的前面*/
\`\`\`

---

### 删除结点

\`\`\`js
node.removeChild(child); //node为父结点
\`\`\`

\`\`\`js
//阻止链接跳转
a.href = "javascript:void(0)";
\`\`\`

---

### 复制结点

\`\`\`js
node.cloneNode(); //复制标签 不包括内容 浅拷贝
node.cloneNode(true); //复制标签 包括内容 深拷贝
//之后要添加
\`\`\`

---

## 5.事件高级

### 注册事件

\`\`\`js
//给元素添加事件，称为注册事件或者绑定事件

//传统方式 onclick =function(){} 只执行一个
//方法监听注册
addEventListener(type,listener[,useCapture])
type:事件型字符串 如click,mouseover
listener:事件处理函数
useCapture:可选参数,默认false
//true表示事件捕获阶段调用事件处理程序 ，false表示在冒泡阶段捕获
\`\`\`

事件监听

\`\`\`js
var btn = selector;
btn.addListener("click", function () {
  alert("22");
});
btn.addListener("click", function () {
  alert("33");
});
\`\`\`

### 删除事件

\`\`\`js
node.onclick=null;
node.removeEventListener(type,listener[,useCapture])
//事件处理函数要放在外面，不要匿名
\`\`\`

### 事件流

事件流描述的是页面中接受事件的顺序

![image-20220924131233289](JS.assets/image-20220924131233289.png)

\`\`\`js
//事件对象
div.onclick = function (event) {};
e.stopPropagation(); //阻止冒泡 ，父类的事件不触发
\`\`\`

![image-20220924135222371](JS.assets/image-20220924135222371.png)

---

### 事件委托

\`\`\`css
ul>li*5;
原理: 不是每个结点单独设置事件监听器，而是设置在父结点上，然后利用冒泡原理影响每个子节点

ui.addEventListener('click',function(){
    alert('li');
    //点击li时也能弹出弹窗
    e.target.style.bacc-'pink';
})
\`\`\`

### 常用的鼠标事件

![image-20220921210936581](JS.assets/image-20220921210936581.png)

\`\`\`js
//禁止鼠标右键菜单
.addEventListener('contextmenu',function(e){
    e.preventDefault();
})
//禁止鼠标选中（selectstart 开始选中）
.addEventListener('selectstart' ,function(e){
     e.preventDefault();
})
//获取鼠标事件对象
.addEventListener('click',function(e){
    e.cilentX //返回鼠标相对于视口的x坐标
    e.cilentY //返回鼠标相对于视口的y坐标
    e.pageX //返回鼠标相对于页面文档的x坐标
    e.pageY //返回鼠标相对于页面文档的y坐标
    e.screenX //返回鼠标相对于电脑屏幕的X坐标
    e.screenY //返回鼠标相对于电脑屏幕的Y坐标
})
//追随鼠标移动 把x,y 给 left top ;
\`\`\`

### 常用的键盘事件

\`\`\`js
onkeyup; //某个键盘按键被松开时触发
onekeydown; //某个键盘按键被按下时触发
onekeypress; //某个键盘按键被按下时触发 不识别ctrl，shift等

//事件执行顺序 down--press--keyup

//down up 不分大小写 press 分大小写
\`\`\`

#### 键盘事件对象

\`\`\`js
.addEventListener('keyup',function(e){
    e.keyCode;
    div.focus();
})
\`\`\`

---

# BOM

![image-20220914145447836](JS.assets/image-20220914145447836.png)

![image-20220924211539601](JS.assets/image-20220924211539601.png)

## window 对象的常见事件

### 页面加载事件

\`\`\`js
//onload 当文档完全加载会触发事件
window.addEventListener('load',function(){})
//DOMContentLoaded 仅dom加载完，不包括 样式表 图片
document.addEventlistener('DOMContentLoaded',function(){});
//页面重新加载
window.addEvenetListener('pageshow',function(e){
    if(e.persister){
        function(){};
    }
})
\`\`\`

---

### 调整窗口大小事件

\`\`\`js
调整窗口尺寸时触发
/*
window.onresize=function(){};
*/
window.innerWidth 当前屏幕宽度
\`\`\`

---

## 定时器

\`\`\`js
//setTimeout()
setTimeout(调用函数，延迟时间)
回调函数
//clearTime
setTimeout(function(){},5000);
clearTimeout(定时器名字)
//setInterval()周期,会循环
setInterval(调用函数，延迟时间)
//clearInterval()
\`\`\`

---

## 同步与异步

### 同步

![image-20220924225327407](JS.assets/image-20220924225327407.png)

### 异步

![image-20220924225439191](JS.assets/image-20220924225439191.png)

### 执行顺序

![image-20220924225840307](JS.assets/image-20220924225840307.png)

\`\`\`js
1. 同步
2. 异步
\`\`\`

### 事件循环

![image-20220926222104179](JS.assets/image-20220926222104179.png)

---

## location 对象

> window 对象给我们提供了一个 location 属性来获取或设置窗体的 URL

![image-20220926222753517](JS.assets/image-20220926222753517.png)

### 案例--不同页面传参

![image-20220926231037209](JS.assets/image-20220926231037209.png)

---

### 对象方法

![image-20220926232724647](JS.assets/image-20220926232724647.png)

对 a 标签无效

---

## navigator 对象

\`\`\`js
//navigator 对象 包含有关浏览器的信息 如判断是移动端还是电脑端
if (
  navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
) {
  window.location.href = ""; //手机
} else {
  window.location.href = ""; //电脑
}
\`\`\`

---

## history 对象

\`\`\`js
//历史记录
history().back(); //后退功能
history().forward(); //前进功能
history().go(); //前进后退功能,参数1是前进1个页面，
//-1后退1个页面
\`\`\`

## this

\`\`\`html
<script>
  this; //window
  function fn() {
    this; //window
  }
  var test = {
    say: function () {
      console.log(this);
    },
  };
  setInterval(() => {
    test.say();
  }, 1000);
  //test
<\/script>
\`\`\`

---

# 网页特效

## pc

### offset

\`\`\`js
//offset可以动态的得到元素的位置(偏移)，大小等，注意定位
\`\`\`

![image-20220927095131709](JS.assets/image-20220927095131709.png)

![image-20220927100809324](JS.assets/image-20220927100809324.png)

### 小窗口

![image-20220927230215558](JS.assets/image-20220927230215558.png)

---

### 放大镜

看代码

---

### client

![image-20220927235404225](JS.assets/image-20220927235404225.png)

### 立即执行函数

\`\`\`apl
(function(){

})(window,document)
不需要调用
\`\`\`

---

### sroll 滚动条

\`\`\`js
1.scrollTop // 返回被卷上去的上测侧距离，返回数值不带单位
2.//如果是页面:window.pageYoffset;
3.scrollleft // 返回被卷上去的左测侧距离，返回数值不带单位
4.scrollWidth // 返回自身的实际的宽度，不含边框，返回数值不带单位
5.scrollHeight // 返回自身的实际的高度，不含边框，返回数值不带单位
6.scroll(x,y)//
7.overflow：auto //滚动条

8.div.addEventListener('scoll',function(){
    .log
})
\`\`\`

![image-20220928094621255](JS.assets/image-20220928094621255.png)

---

## 动画

核心原理：通过定时器 setInterval()不断移动盒子位置

1. 获取盒子当前位置
2. 让盒子在当前
3. 定时器重复操作
4. 结束条件

\`\`\`css
setInterval(function(){
    div.style.left=div.offsetLeft+1+'px';
},1000)
\`\`\`

### 缓动动画

缓动动画就是让元素运动速度有所变化，最常见的是让速度慢慢停下来

\`\`\`css
 div.style.left=div.offsetLeft+(目标值-div.offsetLeft)/100+'px';
\`\`\`

### 轮播图

![image-20220928143323069](JS.assets/image-20220928143323069.png)

### 节流阀

防止轮播图按钮连续点击导致播放过快

当上一个动画执行完毕，再去执行下一个

--- 回调函数加一个 boolean 的判断 ---

---

# 移动端网页特效

## 触屏事件

\`\`\`js
//touchstart 手指触摸一个DOM元素时触发
//touchmove  手指滑动
//touchend   手指移开
div.addEventListener("touchstart", function () {});
\`\`\`

## 触摸事件对象

\`\`\`js
div.addEventListener("touchstart", function (e) {});
touches; //正在触摸屏幕的所有手指的一个列表
targetTouches[0]; //正在触摸当前DOM元素上的手指的一个列表
changedTouches; //手指状态发生了改变的列表,从无到有,从有到无变化
\`\`\`

## click 延时 300ms

\`\`\`css
1.禁止缩放
<meta name="viewport" content="user-scalable=no">
2.看代码
\`\`\`

---

# 本地存储

## JSON

\`\`\`javascript
JSON.stringify(); //编码
JSON.parse(); //解码
\`\`\`

## sessionStorage

\`\`\`js
//生命周期为关闭浏览器
sessionStorage.setItem(key, value);
sessionStorage.getItem(key);
sessionStorage.removeItem(key);
sessionStorage.clear();
\`\`\`

## localStorage

\`\`\`js
////生命周期永久有效
localStorage.setItem(key, value);
localStorage.getItem(key);
localStorage.removeItem(key);
localStorage.clear();
\`\`\`

---

# 复选框 change 事件

---

# jQuery

\`\`\`js
$(function(){
    //页面加载完执行
})；
\`\`\`

## 基本使用

### $顶级对象

\`\`\`js
$ = jQurey;
\`\`\`

### jQuery 对象

\`\`\`js
//获取对象
$("div").hide();
//与原生js对象不能混用

//相互转换
$("div")[index];
$("div").get(index);
\`\`\`

## api

### 选择器

\`\`\`js
$(".class");
\`\`\`

![image-20221003173708740](JS.assets/image-20221003173708740.png)

### 样式

\`\`\`js
$("div").css("background", "pink");
\`\`\`

### 筛选方法

![image-20221003174141523](JS.assets/image-20221003174141523.png)

### 排他思想

\`\`\`js
$(function () {
  $("button").click(function () {
    $(this).css("background", "pink");
    $(this).siblings("button").css("background", "");
  });
});
\`\`\`

### 获取当前索引号

\`\`\`js
$("div").index();
\`\`\`

### 链式编程

\`\`\`js
$(this).css("color", "red").siblings().css("color", "");
\`\`\`

### 类操作

\`\`\`js
addClass();
removeClass();
toggleClass();
\`\`\`

---

## 效果

### 显示与隐藏

\`\`\`js
//显示
show(speed,easing,fn);
1.speed 速度
2.easing 切换效果 swing/linear
3.fn 回调函数
//隐藏
hide();
//切换
toggle();
\`\`\`

### 滑动

\`\`\`js
//下拉
slideDown(speed, easing, fn);
//上滑
slideUp();
slideToggle();
\`\`\`

### 动画排队

\`\`\`js
.stop();
\`\`\`

### 淡入淡出

\`\`\`js
//淡入
fadeIn(speed, [opacity], [easing], [fn]);
//淡出
fadeOut();
//切换
fadeToggle();
fadeTo(speed, opacity, [easing], [fn]);
\`\`\`

### 自定义动画

\`\`\`js
/*
animate(
paranms 更改的样式
speed
easing
fn
)
*/
animate({ left: 200 });
\`\`\`

---

## 属性操作

### 设置或获取固有属性

\`\`\`js
$("a").prop("href",设置属性);
<a>里面的href //固有属性
\`\`\`

### 设置或获取自定义属性

\`\`\`css
attr();
<a index="1"></a>
\`\`\`

### 数据缓存

\`\`\`js
$("a").data("uname", "lpl").data("uname");
\`\`\`

---

## 内容文本值

\`\`\`js
html(); // =innerHtml();
text();
$("input").val();
\`\`\`

---

## 元素操作

### 遍历

\`\`\`js
$("div").each(function(index,donEle){ .log(index) ; }))

$.each(object,function(index,donEle){ .log(index) ; })
\`\`\`

### 创建

\`\`\`js
var li=$("<li></li>")
1. $("ul").append(li);//放最后面
2.$("ul").prepend(li);//放最前面
3.$("ul").after/.before(li)
\`\`\`

### 删除元素

\`\`\`js
remove();
empty(); //清空子节点
\`\`\`

---

## 尺寸位置操作

### 尺寸

![image-20221007201524410](JS.assets/image-20221007201524410.png)

### 位置

\`\`\`js
offset(); //获取距离屏幕距离
position(); //获取距离带有定位父级位置(偏移)
scrollTop();
scrollLeft();
\`\`\`

---

## 事件

\`\`\`js
//注册事件
$("div").click(function () {});

$("div").on({
  mouseenter: function () {},
  click: function () {},
});

$("div").on("click mousemove");
$("div").on("click", "li", function () {});
//解绑事件
$("div").off("click");
//one()只触发一次
\`\`\`

### 自动触发

\`\`\`js
$("div").trigger("事件");
\`\`\`

### 事件对象

\`\`\`js
event;
\`\`\`

---

## 其他方法

### 对象拷贝

\`\`\`js
var obj={
    id:1,
    name:'lpl'
    msg:{//是个地址
    age:18
}
}
vat temp={};
$.extend([deep],temp,obj)
//deep(false,true)浅拷贝 深拷贝
\`\`\`

### 多库共存

\`\`\`js
//JQuery使用$作为标识符，会与其他的产生冲突

//解决
//用"jQuery"
//该$ var x = $.onConflict()
\`\`\`

### 插件

\`\`\`apl
1. jquery之家
2. www.jq22.com//懒加载
\`\`\`

---

# 数据可视化

## ECharts

[快速上手 - Handbook - Apache ECharts](https://echarts.apache.org/handbook/zh/get-started/)

![image-20230805214902080](JS.assets/image-20230805214902080.png)

https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js

\`\`\`ts
import * as echarts from "echarts";

var chartDom = document.getElementById("main");
var myChart = echarts.init(chartDom);
var option;

option = {
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: "line",
    },
  ],
};

option && myChart.setOption(option);
\`\`\`

![image-20221008003616947](JS.assets/image-20221008003616947.png)

# 无限滚动

![image-20221008024744809](JS.assets/image-20221008024744809.png)

---

# 实用

\`\`\`js
this.list.map((item) => ({ value: item.a, name: item.b }));
\`\`\`
`;export{n as default};
