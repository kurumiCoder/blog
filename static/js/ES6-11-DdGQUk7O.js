const n=`# ES6-11

## ES6

### let

\`\`\`js
let f=4,g="",h=[];

1.let
2.变量不能重复声明
3.块级作用域
4.不存在变量提升
\`\`\`

### const

\`\`\`js
const 定义常量
const shool="1";
1. 一定要赋初始值
2. 一般用大写
3. 不能修改
4. 块级作用域
5. 对于数组和对象的元素修改,不算对常量的修改
const TEAM=["1","2","3"];
team.push("Mekoi");
\`\`\`

### 解构赋值

\`\`\`js
const F4 = ["1", "2", "3", "4"];
let [xiao, liu, zhao, li] = F4;

const zhao = {
  name: "1",
  age: 18,
  xiaoping: function () {
    log();
  },
};
let { name, age, xiaoping } = zhao;
let { xiaoping } = zhao;
\`\`\`

### 模板字符串

\`\`\`js
let str=\`qqq\`;

1. 内容中可以直接出现换行符
let str=
\`<ul>
<li> 11 </li>
</ul>\`

2.变量拼接
let lla="a";
let out=\`\${lla}is polpopopdopsadsa\`;
\`\`\`

![image-20221014151146341](ES6-11.assets/image-20221014151146341.png)

### 对象简化

\`\`\`js
let name = "shang";
let change = function () {
  log(11);
};
const school = {
  name,
  change,
  improve() {
    log("q");
  },
};
\`\`\`

### 箭头函数

\`\`\`js
//原
let fn=function(){

}
//现
let  fn=(a,b)=>{
    return a+b;
}

fn(1,2);
-------------------------------------
1. this 是静态的 this始终指向函数声明时所在作用域下的this
let getName=()=>{
    this.name;
}
window.name="11";
const school={
    name:"ATM"
}
//原生是ATM
getName.call(school)//11
---------------------------------------
2.不能作为构造函数实例化对象
let person=(name,age)=>{
    this.name=name;
    this.age=age;
}
let me=person("1",11);
log(me)//报错
---------------------------------------
3. 不能使用arguments
4. (1)当形参是由一个时候 let add=n=>{n+n}
   (2)当代码体只有一条语句 let add=n=>n+n;
\`\`\`

![image-20221014153735607](ES6-11.assets/image-20221014153735607.png)

### 函数参数的默认值设置

\`\`\`js
1. 形参初始值
function add(a,b,c=10){
    return a+b+c//13
}
add(1,2)
2. 与解构赋值结合
function connect({host,username,password,port}{
    let host=host;
}
connect(
    {
        host；"localhost",
        username:"root"
        passward:"123456"
        port:"3306"
    }
)
\`\`\`

### rest

\`\`\`js
rest 代替 arguments
function data(){
    log(arguments)//是对象
}
data("1","2","3")
function data(...args){
    //args是数组
    log(args)
}
\`\`\`

### 拓展运算符

\`\`\`js
...数组转成参数序列
const ass=["1","2","3"];//
function cw(){
    log(arguments)
}
cw(ass)//arguments.lengh=1 args=ass
cw(...ass)//arguments.lengh=3 args=[1,2,3]

//应用
const a=[1,2];
const b=[3,4];
const c=[..a,..b];//1,2,3,4
\`\`\`

### symbol

![image-20221014162046650](ES6-11.assets/image-20221014162046650.png)

![image-20221014163603766](ES6-11.assets/image-20221014163603766.png)

### 迭代器

\`\`\`js
const xiyou=[1,2,3,4,5];
for (let v of xiyou){

}
of//值
in//名 常用与遍历属性

const banji={
    name:"1",
    sa:["1","2","3"]
}
for (let v of banji.sa){
    log(v)//1,2,3,4
}

///
const banji={
    name:"1班",
    stus:[1,2,3,4],

    [symbol.iterator](){
    let index=0;
    return {
        next:()=>{
            if(index<this.stus.lengh){
                index++;
                return {value：this.stus[index],done:false}
            }else{value:undefined,done:true}
        }
    }
}
}

for(let v of banji){
    log(v);
}
\`\`\`

### 生成器函数声明与调用

\`\`\`js
function* gen() {
  yield "hello";
  yield "world";
  return "ending";
}
let hw = gen();
//该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是上一章介绍的遍历器对象（Iterator Object）

hw.next();
// { value: 'hello', done: false }

hw.next();
// { value: 'world', done: false }

hw.next();
// { value: 'ending', done: true }

hw.next();
// { value: undefined, done: true }

//参数传递
function* gen(arg) {
  log(arg);
  let one = yield 111;
  log(one);
  yield 222;
  yield 333;
}
let g = gen("AAA"); //AAA
log(g.next()); //{value:111,done:false}
log(g.next(BBB));
//BBB \\n {value:111,done:false}
\`\`\`

![image-20221014230438317](ES6-11.assets/image-20221014230438317.png)

![image-20221014231317628](ES6-11.assets/image-20221014231317628.png)

---

### promise

#### 核心概念

**Promise 是 ES6 引入的异步编程解决方案，它是一个构造函数，用来封装一个异步操作并返回其最终完成（或失败）的结果。**

Promise 对象代表一个**尚未完成但预期将来会完成**的异步操作。它有三个状态：

| 状态          | 含义   | 说明                       |
| ------------- | ------ | -------------------------- |
| **Pending**   | 进行中 | 初始状态，既未完成也未拒绝 |
| **Fulfilled** | 已成功 | 操作成功完成               |
| **Rejected**  | 已失败 | 操作失败                   |

**状态转换规则：**

- \`Pending → Fulfilled\`：调用 \`resolve()\`
- \`Pending → Rejected\`：调用 \`reject()\`
- **状态一旦改变，就不可再次变更**（这是 Promise 最核心的特性）



#### 为什么需要？

> 回调地狱（Callback Hell）

在 Promise 之前，异步操作依赖回调函数，多层嵌套时代码难以维护：

\`\`\`javascript
getData(function(a) {
    getMoreData(a, function(b) {
        getMoreData(b, function(c) {
            getMoreData(c, function(d) {
                // 代码不断向右缩进，难以阅读和维护
            });
        });
    });
});
\`\`\`

> Promise 的解决方案

Promise 通过**链式调用**和**状态管理**将异步代码扁平化：

\`\`\`javascript
// .then() 的数据源（即回调函数的入参）都来自于前一个 Promise 成功（resolved）后的返回值：
getData()
    .then(a => getMoreData(a))
    .then(b => getMoreData(b))
    .then(c => getMoreData(c))
    .then(d => console.log(d))
    .catch(err => console.error(err));
\`\`\`



#### 基本用法

> 创建 Promise

\`\`\`javascript
const promise = new Promise((resolve, reject) => {
    // 执行异步操作
    setTimeout(() => {
        const success = true;
        if (success) {
            resolve('操作成功');  // 状态变为 Fulfilled
        } else {
            reject('操作失败');   // 状态变为 Rejected
        }
    }, 1000);
});
\`\`\`

> 使用 Promise

\`\`\`javascript
promise
    .then(value => {
        console.log(value);  // 操作成功
    })
    .catch(error => {
        console.error(error); // 操作失败
    })
    .finally(() => {
        console.log('无论成败都会执行');
    });
\`\`\`



> .then(onFulfilled, onRejected)

- 返回一个新的 Promise，支持**链式调用**
- 可以只处理成功，或同时处理成功和失败
- 如果 \`onFulfilled\` 返回一个值，会被下一个 \`then\` 接收

\`\`\`javascript
fetch('/api/user')
    .then(response => response.json())  // 返回解析后的 JSON
    .then(data => console.log(data))    // 接收 JSON 数据
    .catch(error => console.error(error));
\`\`\`

> .catch(onRejected)

- 专门处理 Rejected 状态，相当于 \`.then(null, onRejected)\`
- 可以捕获链式调用中**任何位置**抛出的错误

> .finally(onFinally)

- 无论 Promise 最终状态如何都会执行
- 不接收任何参数，常用于清理资源（如关闭 loading）



#### 静态方法

> Promise.resolve(value)

快速创建一个状态为 Fulfilled 的 Promise：

\`\`\`javascript
Promise.resolve(42).then(value => console.log(value)); // 42
\`\`\`

> Promise.reject(reason)

快速创建一个状态为 Rejected 的 Promise：

\`\`\`javascript
Promise.reject('error').catch(err => console.log(err));
\`\`\`

> Promise.all(iterable)

等待**所有** Promise 都成功，返回结果数组；**任一失败则整体失败**：

\`\`\`javascript
const p1 = fetch('/api/a');
const p2 = fetch('/api/b');
const p3 = fetch('/api/c');

Promise.all([p1, p2, p3])
    .then(([res1, res2, res3]) => {
        // 三个请求都成功
    })
    .catch(err => {
        // 任意一个失败都会进入这里
    });
\`\`\`

> Promise.race(iterable)

返回**最快完成**的那个 Promise 的结果（无论成功或失败）：

\`\`\`javascript
Promise.race([
    fetch('/api/fast'),
    new Promise((_, reject) => setTimeout(reject, 5000, 'timeout'))
])
.then(data => console.log(data))
.catch(err => console.log('请求超时或失败'));
\`\`\`

> Promise.allSettled(iterable)（ES2020）

等待所有 Promise 完成，**无论成功或失败**，返回状态描述数组：

\`\`\`javascript
Promise.allSettled([
    Promise.resolve('success'),
    Promise.reject('error')
])
.then(results => {
    // [{status: 'fulfilled', value: 'success'}, 
    //  {status: 'rejected', reason: 'error'}]
});
\`\`\`

> Promise.any(iterable)（ES2021）

返回**第一个成功**的 Promise；如果全部失败，返回 \`AggregateError\`：

\`\`\`javascript
Promise.any([
    Promise.reject('err1'),
    Promise.resolve('success'),
    Promise.resolve('success2')
])
.then(value => console.log(value)); // 'success'
\`\`\`

#### 关键特性

1. **如果返回普通值**：会被包装成 \`Promise.resolve(value)\`
2. **如果返回 Promise**：会等待该 Promise 完成
3. **如果抛出错误**：会被转换为 \`Promise.reject(error)\`
4. **如果返回 thenable 对象**（有 then 方法的对象）：会被当作 Promise 处理



#### async / await（Promise 的语法糖）

ES2017 引入的 \`async/await\` 让异步代码看起来像同步代码：

\`\`\`javascript
async function getUserData() {
    try {
        const response = await fetch('/api/user');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取失败:', error);
        throw error;
    }
}
\`\`\`

> 与 Promise 的关系

- \`async\` 函数**总是返回一个 Promise**
- \`await\` 后面可以跟 Promise 或普通值（普通值会包装为 resolved Promise）
- \`await\` 只能在 \`async\` 函数内部使用（顶层 await 在 ES2022 中已支持）

#### 并行执行

\`\`\`javascript
async function fetchParallel() {
    // 错误写法：串行执行
    // const a = await fetchA();
    // const b = await fetchB();
    
    // 正确写法：并行执行
    const [a, b] = await Promise.all([fetchA(), fetchB()]);
    return { a, b };
}
\`\`\`



#### 最佳实践总结

| 场景       | 推荐做法                         |
| ---------- | -------------------------------- |
| 串行异步   | \`await\` 逐个执行                 |
| 并行异步   | \`Promise.all()\`                  |
| 容错并行   | \`Promise.allSettled()\`           |
| 竞速/超时  | \`Promise.race()\`                 |
| 错误处理   | 统一用 \`.catch()\` 或 \`try/catch\` |
| 清理资源   | 使用 \`.finally()\`                |
| 代码可读性 | 优先使用 \`async/await\`           |

### SET

\`\`\`js
let s = new Set();
const arr = [1, 2, 3, 4];
let s2 = new Set(arr);
//自动去重
s2.size;
s2.add(5);
s2.delect(1);
s2.has(2);
for (let v of s2) {
  log(v);
}
\`\`\`

### Map

\`\`\`js
let m=new Map();
m.set(键名，键值);

m.delect();
m.get();

for (let v of m){
    log(v)
}
\`\`\`

### class

\`\`\`js
class Person(
    //构造器
	constructor(name,age){
    this.name=name;
    this.age=age;
    }
	//方法
	call(){
        log()
    }
//原生 call：functio(){}
)

//静态
function Phone(){

}
Phone.prototype.size=19px

class Phone{
    static name:li;
    static change(){
        log("11");
    }
    constructor(name,age){
    this.name=name;
    this.age=age;
    }
}

let n1=new Phone();
let n2=new Phone();

class HuaiWei extends Phoen{
     constructor(name,age,size){
         super(name,age);
         this.size=size;
    }
    ph(){
        log('22');
    }
}


\`\`\`

### 拓展

\`\`\`js
1 Number.EPSILON //是js的最小数
2 Number.isFinite() //检测有限数
3 Number.isNaN()
4 Number.parseInt()
5 Numeber.isInterger() //判断整数
6 Number.trunc()//除小数
7 Math.sign()//判断正负数 0
\`\`\`

\`\`\`js
1 Object.is(120,121) //判断两个值是否完全相等
2 Object.assign({age:"1"},{age:"2"})//对象合并 会覆盖
3 Object.setPrototypeOf //设置原型对象
const s1={
    name:1
}
const s2={
    name:2
}
s1的父级会是s2
\`\`\`

### 模块化

> 介绍

模块化是指将一个大的程序文件，拆分成许多小的文件后，然后将小文件组合起来

> 好处

1. 防止命名冲突
2. 代码复用
3. 高维护性

> 语法

export 对外

import 导入

> 例子

\`\`\`js
export let school='11';//m1.js

<script type="module">
    import * as m1 from "m1.js" //m1.js所有东西存在m1这个变量
    import {school}from "m1.js" //引入m1.js中export出的school
    import {school as gg}from"m1.js" //同上，重命名

    import m1 from "m1.js" //针对默认暴露
    import default as m3 from ""//默认暴露
<>

//分别暴露
export let a;
export let b;

//统一暴露
let a ="1";
function b(){}
export{a,b}
//默认暴露
export default {
    school:"1",
    change:function(){
        console.log();
    }
}
<>
    m1.default.change()
<>
\`\`\`

> babel 浏览器兼容

\`\`\`shell
npm init --yes
npm i babel-cli bable-preset-env browserify -D
npx babel src/js -d dist/js --presets=bable-preset-env
npx browserify dist/js/app.js -o dist/bund
\`\`\`

## ES7

### includes

\`\`\`js
//检测数组里有否包含某个元素，返回布尔值

const arr = [1, 2, 3];
arr.includes(2); //true
\`\`\`

### \\*\\*

\`\`\`js
2 ** 10; //1024
\`\`\`

---

## ES8

### async

\`\`\`js
//返回结果是promise对象
async function(){
    return "aa";
}
\`\`\`

### await

\`\`\`js
await=yield;
await 右侧是promise对象
await 返回的是promise成功的对象
await 的promise失败了，会抛出异常，需要通过try..catch 处理
\`\`\`
`;export{n as default};
