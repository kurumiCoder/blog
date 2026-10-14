const n=`# TypeScript 笔记（小满zs 专栏合集）

> 来源：<https://blog.csdn.net/qq1195566313/category_11559497.html>
> 共33篇文章，按知识点归类整理



## 简介

![img](ts.assets/a7d401cd-db77-411e-aea1-daaad18a770c.webp)

TypeScript 是 JavaScript 的超集，类型信息在编译后抹除。

| 局限           | 说明                                               | 应对思路                                           |
| -------------- | -------------------------------------------------- | -------------------------------------------------- |
| 运行时无类型   | 类型信息在编译后全部抹除，运行时无法依赖类型做判断 | 需要运行时校验时使用 \`zod\`、\`io-ts\` 等库           |
| 编译步骤       | 相比纯 JS 多了一个编译环节                         | 现代构建工具（Vite、esbuild）对此已有良好优化      |
| any 类型逃生舱 | 滥用 \`any\` 会让类型检查形同虚设                    | 开启 \`noImplicitAny\` 和 \`strict\` 模式，配合 ESLint |
| 类型体操门槛   | 复杂的条件类型和映射类型对初学者不友好             | 大多数业务代码不需要高级类型，循序渐进即可         |
| 第三方库支持   | 少数老旧库缺少声明，需自行编写 \`.d.ts\`             | 先查 \`@types/*\`，确实没有再手写声明文件            |

## 快速开始

\`\`\`shell
# ts-node 也是直接运行 .ts 的工具，但比 tsx 慢、配置更繁琐。
# tsc = 编译成 JS 文件到磁盘，可以发布/部署
npm install -g typescript@latest
npm i ts-node -g
npm i @types/node --save-dev  # node环境依赖

# 一个 TypeScript 执行器，让你直接运行 .ts 文件，无需先编译成 .js
npm add -D tsx

tsc --version
touch app.ts
tsc app.ts
\`\`\`

|            | ts-node          | tsx                  |
| ---------- | ---------------- | -------------------- |
| 启动速度   | 慢（底层用 tsc） | 快（底层用 esbuild） |
| ESM 支持   | 需额外配置       | 开箱即用             |
| 类型检查   | 默认开启（可关） | 默认跳过             |
| 维护活跃度 | 一般             | 活跃                 |

> VS Code Code Runner 配置（\`.vscode/settings.json\`）：

\`\`\`json
{
  "code-runner.executorMap": {
    "typescript": "tsc $fileName"
  },
  "code-runner.runInTerminal": false
}
\`\`\`

## tsc 编译参数

| 序号 | 编译参数说明                                                 |
| :--: | ------------------------------------------------------------ |
|  1.  | **--help** 显示帮助信息                                      |
|  2.  | **--module** 载入扩展模块                                    |
|  3.  | **--target** 设置 ECMA 版本                                  |
|  4.  | **--declaration** 额外生成 \`.d.ts\` 声明文件。例：\`tsc app.ts --declaration\` 会生成 \`app.d.ts\` 和 \`app.js\` |
|  5.  | **--removeComments** 删除文件中的注释                        |
|  6.  | **--out** 编译多个文件并合并到一个输出的文件                 |
|  7.  | **--sourcemap** 生成 sourcemap (.map) 文件，存储源代码与编译代码的对应位置映射 |
|  8.  | **--noImplicitAny** 在表达式和声明上有隐含的 any 类型时报错  |
|  9.  | **--watch** 监视模式，文件改变时重新编译                     |

### tsconfig

\`\`\`shell
tsc --init  # 生成 tsconfig.json
\`\`\`



## 一、基础类型

### 1. 基础类型

基础类型：\`Boolean\`、\`Number\`、\`String\`、\`null\`、\`undefined\` 以及 ES6 的 \`Symbol\` 和 ES10 的 \`BigInt\`。

> 字符串

\`\`\`typescript
let a: string = '123'
//普通声明

//也可以使用es6的字符串模板
let str: string = \`dddd\${a}\`
\`\`\`

> 数字类型

\`\`\`typescript
let notANumber: number = NaN;           //NaN
let num: number = 123;                  //普通数字
let infinityNumber: number = Infinity;  //无穷大
let decimal: number = 6;                //十进制
let hex: number = 0xf00d;               //十六进制
let binary: number = 0b1010;            //二进制
let octal: number = 0o744;              //八进制
\`\`\`

> 布尔

注意：使用构造函数 \`Boolean\` 创造的对象**不是**布尔值：

\`\`\`typescript
// let createdBoolean: boolean = new Boolean(1)  // 报错！new Boolean() 返回的是 Boolean 对象
let createdBoolean: Boolean = new Boolean(1)     // 正确

let booleand: boolean = true              // 直接使用布尔值
let booleand2: boolean = Boolean(1)        // 通过函数返回布尔值
\`\`\`

> 空值

JavaScript 没有空值（Void）的概念，在 TypeScript 中，可以用 \`void\` 表示没有任何返回值的函数：

\`\`\`typescript
function voidFn(): void {
    console.log('test void')
}

// void也可以定义undefined 和 null类型
let u: void = undefined
let n: void = null;
\`\`\`

> null 和 undefined

\`\`\`typescript
let u: undefined = undefined;//定义undefined
let n: null = null;//定义null
\`\`\`

与 \`void\` 的区别：\`undefined\` 和 \`null\` 是所有类型的子类型（非严格模式下可赋值给其他类型），\`void\` 不可以：

\`\`\`typescript
// 这样写会报错——void类型不可以分给其他类型
let test: void = undefined
let num2: string = "1"
// num2 = test  // 报错！
\`\`\`

\`\`\`typescript
// null 和 undefined 可以（非严格模式下）
let test: null = null
let num2: string = "1"
num2 = test

// 或者
let test2: undefined = undefined
let num3: string = "1"
num3 = test2
\`\`\`



### 2. Any 和 Unknown

> top type 类型顺序

1. any、unknown
2. Object
3. Number、String、Boolean
4. number、string、boolean
5. 1、‘xx’、false
6. never



> any

没有强制限定哪种类型，随时切换类型都可以。声明变量时未指定任意类型默认为 \`any\`：

\`\`\`typescript
let anys: any = 123
anys = '123'
anys = true
\`\`\`

> unknown

TypeScript 3.0 中引入的 \`unknown\` 类型也是 top type，但比 \`any\` 更安全。所有类型都可以分配给 \`unknown\`：

\`\`\`typescript
// unknown 可以定义任何类型的值
let value: unknown;
value = true;             // OK
value = 42;               // OK
value = "Hello World";    // OK
value = [];               // OK
value = {};               // OK
value = null;             // OK
value = undefined;        // OK
value = Symbol("type");   // OK
\`\`\`

\`unknown\` 和 \`any\` 的核心区别：\`unknown\` 类型不能赋值给其他类型，\`any\` 可以：

\`\`\`typescript
// unknown 不能赋值给其他类型
let names: unknown = '123'
// let names2: string = names   // 报错

// any 可以
let names3: any = '123'
let names4: string = names3    // 正确

// unknown 可赋值对象只有 unknown 和 any
let bbb: unknown = '123'
let aaa: any = '456'
aaa = bbb // 错误
\`\`\`

区别2：属性调用

\`\`\`typescript
// any 类型在对象没有某个属性时访问不会报错
let obj: any = { b: 1 }
obj.a  // 不报错

// unknown 不能调用属性和方法
let obj2: unknown = { b: 1, ccc: () => 213 }
// obj2.b      // 报错
// obj2.ccc()  // 报错
\`\`\`



### 3. 接口和对象类型

用 \`interface\` 定义对象约束，属性不能多也不能少。

\`\`\`typescript
interface Person {
    b: string
    a: string
}
const person: Person = { a: "213", b: "hello" }
\`\`\`

**重名 interface 会合并**，**interface 支持 extends 继承**。

\`\`\`typescript
interface A { name: string }
interface A { age: number }
let x: A = { name: 'xx', age: 20 }

interface B extends A { gender: number }
\`\`\`

**可选属性 \`?\`**

\`\`\`typescript
interface Person {
    b?: string
    a: string
}
const p: Person = { a: "213" } // b 可选，不写也可以
\`\`\`

**任意属性 \`[propName: string]\`**：一旦定义了任意属性，确定属性和可选属性的类型必须是它的子集。

\`\`\`typescript
interface Person {
    a: string
    [propName: string]: any
}
const p: Person = { a: "213", c: "123", d: 456 }
\`\`\`

**只读属性 \`readonly\`**

\`\`\`typescript
interface Person {
    readonly a: string
}
// person.a = 123 // 报错，只读不可修改
\`\`\`

**接口中定义函数**

\`\`\`typescript
interface Person {
    cb: () => void
}
const p: Person = { cb: () => console.log(123) }
\`\`\`

**Array<number>\` 索引返回 \`number \\| undefined**

\`\`\`typescript
const arr: number[] = [1, 2, 3]
const x = arr[0]        // 类型：number | undefined ❓
const y = arr[0]!       // 类型：number ✅ 显式断言
// 原因：TS 无法静态证明索引不越界，保守地加 undefined
\`\`\`





### 4. 数组类型

**类型 \`[]\`**：

\`\`\`typescript
let arr: number[] = [1, 2, 3]
let arr2: string[] = ["1", "2"]
let arr3: any[] = [1, "2", true]
\`\`\`

**数组泛型 \`Array<类型>\`**：

\`\`\`typescript
let arr: Array<number> = [1, 2, 3, 4, 5] // 完全等价于number[]
\`\`\`

**接口表示数组**：

\`\`\`typescript
interface NumberArray {
    [index: number]: number
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5]
\`\`\`

\`为什么要用接口写法？\`

\`\`\`typescript
// 普通 number[] 做不到同时描述方法和额外属性

interface MyArray {
    [index: number]: string   // 数组元素是 string
    length: number             // 但还可以有 length 属性
    push(item: string): void   // 以及 push 方法
}
\`\`\`

**多维数组**：

\`\`\`typescript
let data: number[][] = [[1, 2], [3, 4]]
\`\`\`

**arguments 类数组**：

在函数内部，\`arguments\` 是一个**类数组对象**，它：

- 有数字索引 \`arguments[0]\`, \`arguments[1]\`...
- 有 \`length\` 属性
- 有 \`callee\` 属性（指向当前函数）

但它不是真正的数组 —— 没有 \`push\`、\`map\`、\`filter\` 等方法。

\`\`\`typescript
function Arr(...args: any): void {
    let a: IArguments = arguments // 使用内置类型
}

// IArguments 等同于：
interface IArguments {
    [index: number]: any
    length: number
    callee: Function
}
\`\`\`



### 5. 函数扩展

**函数的类型**

\`\`\`typescript
//注意，参数不能多传，也不能少传 必须按照约定的类型来
const fn = (name: string, age:number): string => {
    return name + age
}
fn('张三',18)
\`\`\`

**函数的可选参数**

\`\`\`typescript
//通过?表示该参数为可选参数
const fn = (name: string, age?:number): string => {
    return name + age
}
fn('张三')
\`\`\`

**函数参数的默认值**

\`\`\`typescript
const fn = (name: string = "我是默认值"): string => {
    return name
}
fn()
\`\`\`

**接口定义函数**

\`\`\`typescript
//定义参数 num 和 num2  ：后面定义返回值的类型
interface Add {
    (num:  number, num2: number): number
}

const fn: Add = (num: number, num2: number): number => {
    return num + num2
}
fn(5, 5)


interface User{
    name: string;
    age: number;
}
function getUserInfo(user: User): User {
  return user
}
\`\`\`

**定义剩余参数**

\`\`\`typescript
const fn = (array:number[],...items:any[]):any[] => {
       console.log(array,items)
       return items
}

let a:number[] = [1,2,3]

fn(a,'4','5','6')
\`\`\`

**函数重载**

重载是方法名字相同，而参数不同，返回类型可以相同也可以不同。

如果参数类型不同，则参数类型应设置为 **any**。

参数数量不同你可以将不同的参数设置为可选。

\`\`\`typescript
function fn(params: number): void

function fn(params: string, params2: number): void

function fn(params: any, params2?: any): void {

    console.log(params)

    console.log(params2)

}



fn(123)

fn('123',456)
\`\`\`




### 6. 类型断言 | 联合类型 | 交叉类型

> **联合类型**

\`\`\`typescript
//例如我们的手机号通常是13XXXXXXX 为数字类型 这时候产品说需要支持座机
//所以我们就可以使用联合类型支持座机字符串
let myPhone: number | string  = '010-820'


//这样写是会报错的应为我们的联合类型只有数字和字符串并没有布尔值
let myPhone: number | string  = true
\`\`\`

函数使用联合类型：

\`\`\`typescript
const fn = (something:number | boolean):boolean => {
     return !!something
}
\`\`\`

> **交叉类型**

多种类型的集合，联合对象将具有所联合类型的所有成员

\`\`\`typescript
interface People {
  age: number,
  height: number
}
interface Man{
  sex: string
}
const xiaoman = (man: People & Man) => {
  console.log(man.age)
  console.log(man.height)
  console.log(man.sex)
}
xiaoman({age: 18,height: 180,sex: 'male'});
\`\`\`

> **类型断言**

语法：值 as 类型 或 <类型>值，即 \value as string 或 <string>value

\`\`\`typescript
interface A {
       run: string
}

interface B {
       build: string
}

const fn = (type: A | B): string => {
       return type.run
}
//这样写是有警告的应为B的接口上面是没有定义run这个属性的
\`\`\`

\`\`\`typescript
interface A {
       run: string
}

interface B {
       build: string
}

const fn = (type: A | B): string => {
       return (type as A).run
}
//可以使用类型断言来推断他传入的是A接口的值
\`\`\`

需要注意的是，类型断言只能够「欺骗」TypeScript 编译器，无法避免运行时的错误，反而滥用类型断言可能会导致运行时错误。

**使用any临时断言**

\`\`\`typescript
window.abc = 123
//这样写会报错因为window没有abc这个东西
\`\`\`

\`\`\`typescript
(window as any).abc = 123
//可以使用any临时断言在 any 类型的变量上，访问任何属性都是允许的。
\`\`\`

**as const**

是对字面值的**断言**，与const直接定义常量是有区别的

如果是普通类型跟直接const 声明是一样的

\`\`\`typescript
const names = '小满'
names = 'aa' //无法修改

let names2 = '小满' as const
names2 = 'aa' //无法修改
\`\`\`

\`\`\`typescript
// 数组
let a1 = [10, 20] as const;
const a2 = [10, 20];

a1.unshift(30); // 错误，此时已经断言字面量为[10, 20],数据无法做任何修改
a2.unshift(30); // 通过，没有修改指针
\`\`\`

**类型断言是不具影响力的**

在下面的例子中，将 something 断言为 boolean 虽然可以通过编译，但是并没有什么用 并不会影响结果, 因为编译过程中会删除类型断言

\`\`\`typescript
function toBoolean(something: any): boolean {
    return something as boolean;
}

toBoolean(1);
// 返回值为 1
\`\`\`




### 7. 内置对象

JavaScript 中有很多内置对象，它们可以直接在 TypeScript 中当做定义好了的类型。

**ECMAScript 的内置对象**

Boolean、Number、String、RegExp、Date、Error

\`\`\`typescript
let b: Boolean = new Boolean(1)

let n: Number = new Number(true)

let s: String = new String('哔哩哔哩关注小满zs')

let d: Date = new Date()

let r: RegExp = /^1/

let e: Error = new Error("error!")

\`\`\`

**DOM 和 BOM 的内置对象**

Document、HTMLElement、Event、NodeList 等

\`\`\`typescript
let body: HTMLElement = document.body;

let allDiv: NodeList = document.querySelectorAll('div');

//读取div 这种需要类型断言 或者加个判断应为读不到返回null
let div:HTMLElement = document.querySelector('div') as HTMLDivElement

document.addEventListener('click', function (e: MouseEvent) {
    
});

\`\`\`

DOM 元素的类型映射表 (HTMLElementTagNameMap)，例如 "div": HTMLDivElement、"a": HTMLAnchorElement、"input": HTMLInputElement、"canvas": HTMLCanvasElement 等。

**定义Promise**

如果我们不指定返回的类型TS是推断不出来返回的是什么类型。

函数定义返回promise 语法规则：Promise<T> 类型

\`\`\`typescript
function promise():Promise<number>{
   return new Promise<number>((resolve,reject)=>{
       resolve(1)
   })
}

promise().then(res=>{
    console.log(res)
})
\`\`\`

当你在使用一些常用的方法的时候，TypeScript 实际上已经帮你做了很多类型判断的工作了。而它们的定义文件，则在 TypeScript 核心库的定义文件中。

**代码雨案例**

\`\`\`typescript
let canvas = document.querySelector('#canvas') as HTMLCanvasElement
let ctx = canvas.getContext('2d') as CanvasRenderingContext2D
canvas.height = screen.availHeight; //可视区域的高度
canvas.width = screen.availWidth; //可视区域的宽度
let str: string[] = 'XMZSWSSBXMZSWSSBXMZSWSSBXMZSWSSBXMZSWSSB'.split('')
let Arr = Array(Math.ceil(canvas.width / 10)).fill(0) //获取宽度例如1920 / 10 192
console.log(Arr);

const rain = () => {
    ctx.fillStyle = 'rgba(0,0,0,0.05)'//填充背景颜色
    ctx.fillRect(0, 0, canvas.width, canvas.height)//背景
    ctx.fillStyle = "#0f0"; //文字颜色
    Arr.forEach((item, index) => {
        ctx.fillText(str[ Math.floor(Math.random() * str.length) ], index * 10, item + 10)
        Arr[index] = item >= canvas.height || item > 10000 *  Math.random() ? 0 : item + 10; //添加随机数让字符随机出现不至于那么平整
    })
    console.log(Arr);
    
}
setInterval(rain, 40)
\`\`\`




### 32. Set/Map/WeakMap/WeakSet

**Set**

集合是由一组无序且唯一(即不能重复)的项组成的，可以想象成集合是一个既没有重复元素，也没有顺序概念的数组。

- 属性：size - 返回字典所包含的元素个数
- 操作方法：add(value)、delete(value)、has(value)、clear()

\`\`\`typescript
let set:Set<number> = new Set([1,2,3,4])

set.add(5)
set.has(5)
set.delete(5)
set.size //4
\`\`\`

去重：

\`\`\`typescript
let arr = [...new Set([1,1,1,2,2,3,4,5,5,5,5])]

console.log(arr); //[ 1, 2, 3, 4, 5 ]
\`\`\`

**Map**

它类似于对象，也是键值对的集合，但是"键"的范围不限于字符串，各种类型的值（包括对象）都可以当作键。

\`\`\`typescript
let obj = { name: '小满' }
let map: Map<object, Function> = new Map()

map.set(obj, () => 123)
map.get(obj)
map.has(obj)
map.delete(obj)
map.size
\`\`\`

**WeakSet 和 WeakMap**

WeakSet和WeakMap的键都是弱引用，不会被计入垃圾回收。当引用对象被清除后，weakMap也会随着消失。V8的GC回收需要一定时间（最少200ms），为了避免这个问题不允许读取键值，也不允许遍历。

\`\`\`typescript
let obj:any = {name:'小满zs'} //1
let aahph:any = obj //2
let wmap:WeakMap<object,string> = new WeakMap()

wmap.set(obj,'爱安徽潘慧') //弱引用不会计数

obj = null // -1
aahph = null //-1

setTimeout(()=>{
    console.log(wmap)
},500)
\`\`\`

### 9. 元组类型

如果需要一个固定大小的不同类型值的集合，我们需要使用元组。

元组就是数组的变种。元组（Tuple）是固定数量的不同类型的元素的组合。

元组与集合的不同之处在于，元组中的元素类型可以是不同的，而且数量固定。元组的好处在于可以把多个元素作为一个单元传递。如果一个方法需要返回多个值，可以把这多个值作为元组返回，而不需要创建额外的类来表示。

\`\`\`typescript
let arr:[number,string] = [1,'string']


let arr2: readonly [number,boolean,string,undefined] = [1,true,'sring',undefined]
\`\`\`

当赋值或访问一个已知索引的元素时，会得到正确的类型：

\`\`\`typescript
let arr:[number,string] = [1,'string']
arr[0].length //error  数字是没有length的
arr[1].length //success
\`\`\`

元组类型还可以支持自定义名称和变为可选的：

\`\`\`typescript
let a:[x:number,y?:boolean] = [1]
\`\`\`

**越界元素**

\`\`\`typescript
let arr:[number,string] = [1,'string']

arr.push(true)//error
\`\`\`

对于越界的元素他的类型被限制为联合类型（就是你在元组中定义的类型）。

**应用场景：例如定义excel返回的数据**

\`\`\`typescript
let excel: [string, string, number, string][] = [
    ['title', 'name', 1, '123'],
    ['title', 'name', 1, '123'],
    ['title', 'name', 1, '123'],
    ['title', 'name', 1, '123'],
    ['title', 'name', 1, '123'],
]
\`\`\`




### 10. 枚举类型

在JavaScript中是没有枚举的概念的，TS帮我们定义了枚举这个类型。使用枚举通过enum关键字定义。

**1. 数字枚举**

例如红绿蓝 Red = 0 Green = 1 Blue = 2 分别代表红色0 绿色为1 蓝色为2

\`\`\`typescript
enum Types{
   Red,
   Green,
   BLue
}
\`\`\`

这样写就可以实现，因为ts定义的枚举中的每一个成员默认都是从0开始的：

\`\`\`typescript
enum Types{
   Red = 0,
   Green = 1,
   BLue = 2
}
//默认就是从0开始的 可以不写值
\`\`\`

增长枚举：

\`\`\`typescript
enum Types{
   Red = 1,
   Green,
   BLue
}
\`\`\`

如上，我们定义了一个数字枚举，Red使用初始化为 1。其余的成员会从 1开始自动增长。换句话说，Types.Red的值为 1，Green为 2，Blue为 3。

**2. 字符串枚举**

在一个字符串枚举里，每个成员都必须用字符串字面量，或另外一个字符串枚举成员进行初始化。

\`\`\`typescript
enum Types{
   Red = 'red',
   Green = 'green',
   BLue = 'blue'
}
\`\`\`

由于字符串枚举没有自增长的行为，字符串枚举可以很好的序列化。换句话说，如果你正在调试并且必须要读一个数字枚举的运行时的值，这个值通常是很难读的——它并不能表达有用的信息，字符串枚举允许你提供一个运行时有意义的并且可读的值，独立于枚举成员的名字。

**3. 异构枚举**

枚举可以混合字符串和数字成员

\`\`\`typescript
enum Types{
   No = "No",
   Yes = 1,
}
\`\`\`

**4. 接口枚举**

定义一个枚举Types，定义一个接口A，他有一个属性red值为Types.yyds。声明对象的时候要遵循这个规则：

\`\`\`typescript
enum Types {
    yyds,
    dddd
}

interface A {
    red:Types.yyds
}

let obj:A = {
    red:Types.yyds
}
\`\`\`

**5. const枚举**

let和var都是不允许的声明只能使用const。大多数情况下，枚举是十分有效的方案。然而在某些情况下需求很严格。为了避免在额外生成的代码上的开销和额外的非直接的对枚举成员的访问，我们可以使用 const枚举。常量枚举通过在枚举上使用 const修饰符来定义。

const声明的枚举会被编译成常量，普通声明的枚举编译完后是个对象。

\`\`\`typescript
// const 枚举（编译为常量，不生成对象）
const enum Types{
   No = "No",
   Yes = 1,
}
\`\`\`

**6. 反向映射**

它包含了正向映射（name -> value）和反向映射（value -> name）

要注意的是不会为字符串枚举成员生成反向映射。

\`\`\`typescript
enum Enum {
   fall
}
let a = Enum.fall;
console.log(a); //0
let nameOfA = Enum[a]; 
console.log(nameOfA); //fall
\`\`\`




### 13. symbol类型

自ECMAScript 2015起，symbol成为了一种新的原生类型，就像
number和string一样。

symbol类型的值是通过Symbol构造函数创建的。可以传递参数作为唯一标识，只支持string和number类型的参数。

\`\`\`typescript
let sym1 = Symbol();
let sym2 = Symbol("key"); // 可选的字符串key
\`\`\`

**Symbol的值是唯一的**

\`\`\`typescript
const s1 = Symbol()
const s2 = Symbol()
// s1 === s2 =>false
\`\`\`

**用作对象属性的键**

\`\`\`typescript
let sym = Symbol();

let obj = {
    [sym]: "value"
};

console.log(obj[sym]); // "value"
\`\`\`

**使用symbol定义的属性，是不能通过以下方式遍历拿到的**

\`\`\`typescript
const symbol1 = Symbol('666')
const symbol2 = Symbol('777')
const obj1= {
   [symbol1]: '小满',
   [symbol2]: '二蛋',
   age: 19,
   sex: '女'
}
// 1 for in 遍历（注意在console看key,是不是没有遍历到symbol）
// 2 Object.keys 遍历
// 3 getOwnPropertyNames
// 4 JSON.stringify
\`\`\`

如何拿到symbol属性：

\`\`\`typescript
// 1 拿到具体的symbol属性,对象中有几个就会拿到几个
Object.getOwnPropertySymbols(obj1)
// 2 es6的Reflect拿到对象的所有属性
Reflect.ownKeys(obj1)
\`\`\`

**Symbol.iterator 迭代器和生成器 for of**

支持遍历大部分类型迭代器：arr、nodeList、arguments、set、map等

\`\`\`typescript
var arr = [1,2,3,4];
let iterator = arr[Symbol.iterator]();
 
console.log(iterator.next());  //{ value: 1, done: false }
console.log(iterator.next());  //{ value: 2, done: false }
console.log(iterator.next());  //{ value: 3, done: false }
console.log(iterator.next());  //{ value: 4, done: false }
console.log(iterator.next());  //{ value: undefined, done: true }


function* gen() {
    yield Promise.resolve('小满')  // 同步异步
    yield '太满'
    yield '超大满'
    yield '塞满了'
}

const man = gen()
console.log(man.next());
\`\`\`

我们平时开发中不会手动调用iterator，因为它有语法糖就是for of。记住for of是不能循环对象的，因为对象没有iterator。

数组解构的原理其实也是调用迭代器的。

**自己实现一个迭代器让对象支持for of**

\`\`\`typescript
const obj = {
    max: 5,
    current: 0,
    [Symbol.iterator]() {
        return {
            max: this.max,
            current: this.current,
            next() {
                if (this.current == this.max) {
                    return {
                        value: undefined,
                        done: true
                    }
                } else {
                    return {
                        value: this.current++,
                        done: false
                    }
                }
            }
        }
    }
}
console.log([...obj])

for (let val of obj) {
   console.log(val);
   
}
\`\`\`

**内置Symbols列表**：Symbol.hasInstance、Symbol.isConcatSpreadable、Symbol.iterator、Symbol.match、Symbol.replace、Symbol.search、Symbol.species、Symbol.split、Symbol.toPrimitive、Symbol.toStringTag、Symbol.unscopables




### 29. 加餐环节

object、Object以及{}这三个类型的区别：

**1. Object** - 是所有Object类的实例的类型，跟原型链有关，原型链顶层就是Object，所以值类型和引用类型最终都指向Object，包含所有类型。

**2. object** - 代表所有非值类型的类型，例如数组、对象、函数等这些引用类型，常用于泛型约束：

\`\`\`typescript
let o:object = {}//正确
let o1:object = []//正确
let o2:object = ()=>123 //正确
let b:object = '123' //错误
let c:object = 123 //错误
\`\`\`

**3. {}** - 可以理解成new Object，和Object基本一样，包含所有类型（字面量模式不能修改值）：

\`\`\`typescript
let a1: {} = {name:1} //正确
let a2: {} = () => 123//正确
let a3: {} = 123//正确
\`\`\`





## 二、类型进阶

### 11. 类型推论 | 类型别名

**类型推论**

声明了一个变量但是没有定义类型，TypeScript会在没有明确的指定类型的时候推测出一个类型，这就是类型推论。

\`\`\`typescript
let str = "小满zs"
// TS推断出来这是一个string类型，不能够再赋值给别的类型
\`\`\`

如果你声明变量没有定义类型也没有赋值这时候TS会推断成any类型可以进行任何操作。

**类型别名**

\`\`\`typescript
type 
// 关键字（可以给一个类型定义一个名字），多用于复合类型。
\`\`\`

定义类型别名：

\`\`\`typescript
type str = string

let s:str = "我是小满"

console.log(s);
\`\`\`

定义函数别名：

\`\`\`typescript
type str = () => string

let s: str = () => "我是小满"

console.log(s);
\`\`\`

定义联合类型别名：

\`\`\`typescript
type str = string | number

let s: str = 123

let s2: str = '123'

console.log(s,s2);
\`\`\`

定义值的别名：

\`\`\`typescript
type value = boolean | 0 | '213'

let s:value = true
//变量s的值只能是上面value定义的值
\`\`\`

**type 和 interface 的区别（虽然都可以定义类型）**

1. interface可以继承，type只能通过 & 交叉类型合并
2. type可以定义联合类型和可以使用一些操作符，interface不行
3. interface遇到重名的会合并，type不行

**type高级用法**

左边的值会作为右边值的子类型遵循图中上下的包含关系：

\`\`\`typescript
type a = 1 extends number ? 1 : 0 //1

type a = 1 extends Number ? 1 : 0 //1

type a = 1 extends Object ? 1 : 0 //1

type a = 1 extends any ? 1 : 0 //1

type a = 1 extends unknow ? 1 : 0 //1

type a = 1 extends never ? 1 : 0 //0
\`\`\`




### 12. never类型

TypeScript 将使用 never 类型来表示不应该存在的状态。

\`\`\`typescript
// 返回never的函数必须存在无法达到的终点

// 因为必定抛出异常，所以 error 将不会有返回值
function error(message: string): never {
    throw new Error(message);
}

// 因为存在死循环，所以 loop 将不会有返回值
function loop(): never {
    while (true) {
    }
}
\`\`\`

**never 与 void 的差异**

\`\`\`typescript
    //void类型只是没有返回值 但本身不会出错
    function Void():void {
        console.log();
    }

    //只会抛出异常没有返回值
    function Never():never {
    throw new Error('aaa')
    }
\`\`\`

差异2：当我们鼠标移上去的时候会发现只有void和number，never在联合类型中会被直接移除

\`\`\`typescript
type A = void | number | never
\`\`\`

**never 类型的应用场景**

举一个我们可能会见到的例子——switch穷举检查：

\`\`\`typescript
type A = '小满' | '大满' | '超大满' 

function isXiaoMan(value:A) {
   switch (value) {
       case "小满":
           break 
       case "大满":
          break 
       case "超大满":
          break 
       default:
          //是用于场景兜底逻辑
          const error:never = value;
          return error
   }
}
\`\`\`

比如新来了一个同事他新增了一个成员，我们必须手动找到所有switch代码并处理，否则将有可能引入BUG。而且这将是一个"隐蔽型"的BUG，如果回归面不够广，很难发现此类BUG。

TS有没有办法帮助我们在类型检查阶段发现这个问题呢？

\`\`\`typescript
type A = '小满' | '大满' | '超大满' | "小小满"

function isXiaoMan(value:A) {
   switch (value) {
       case "小满":
           break 
       case "大满":
          break 
       case "超大满":
          break 
       default:
          //是用于场景兜底逻辑，帮助后续人员发现问题	
          const error:never = value; // 不能将类型“"小小满"”分配给类型“never”。
          return error
   }
}
\`\`\`

由于任何类型都不能赋值给 
never 类型的变量，所以当存在进入 default 分支的可能性时，TS的类型检查会及时帮我们发现这个问题。




### 31. 进阶类型兼容

类型兼容性用于确定一个类型是否能赋值给其他的类型。TypeScript中的类型兼容性是基于**结构类型**的（也就是形状），如果A要兼容B那么A至少具有B相同的属性。

**1. 协变（鸭子类型）**

一只鸟走路像鸭子，游泳也像，做什么都像，那么这只鸟就可以称为鸭子类型。

\`\`\`typescript
interface A {
    name:string
    age:number
}

interface B {
    name:string
    age:number
    sex:string
}

let a:A = {
    name:"老墨我想吃鱼了",
    age:33,
}

let b:B = {
    name:"老墨我不想吃鱼",
    age:33,
    sex:"女"
}

a = b // B类型充当A类型的子类型，属性可以多但不能少
\`\`\`

**2. 逆变**

逆变一般发生于函数的参数上面：

\`\`\`typescript
let fna = (params:A) => {}
let fnb = (params:B) => {}

fna = fnb //错误
fnb = fna //正确
\`\`\`

fnb的类型能够完全覆盖fna所以安全，相反fna的类型不能完全覆盖fnb（少一个sex）所以不安全。

**3. 双向协变**

tsconfig中strictFunctionTypes设置为false时支持双向协变，fna和fnb可以随便来回赋值。




### 33. 类型守卫

类型守卫（Type Guards）是一种用于在运行时检查类型的机制。它们允许你在代码中执行特定的检查，以确定变量的类型。

**1. typeof 类型收缩**

\`\`\`typescript
const isString = (str:any) => {
   return typeof str === 'string';
}
\`\`\`

typeof只能返回有限的字符串类型，包括"string"、"number"、"boolean"、"symbol"、"undefined"和"object"。对于函数、数组、null等类型也会返回"object"。

**2. instanceof**

\`\`\`typescript
const isArr = (value:unknown) => {
    if(value instanceof Array){
        value.length
    }
}
\`\`\`

instanceof操作符用于检查一个对象是否是某个类的实例，通过检查对象的原型链来确定。它无法检查基本类型。

**自定义守卫**

类型谓词的语法形式 str is string，当函数返回true时，类型被细化为指定类型：

\`\`\`typescript
const isString = (str:any): str is string => typeof str === 'string'
const isNumber = (num:any): num is number => typeof num === 'number'

const fn = (data:any) => {
    let value;
    if(isObj(data)){
        Object.keys(data).forEach(key=>{
            value = data[key]
            if(isString(value)){
                data[key] = value.trim()
            }
            if(isNumber(value)){
                data[key] = value.toFixed(2)
            }
            if(isFn(value)){
                data[key]() // 注意this指向问题
            }
        })
    }
}
\`\`\`





## 三、泛型与类型体操

### 14. 泛型

泛型在TypeScript是很重要的东西，例如vue3是用ts编写的，里面用到了非常多的泛型。

**函数泛型**

两个函数类型不同但实现功能相同，可以使用泛型优化：

\`\`\`typescript
function num (a:number,b:number) : Array<number> {
    return [a ,b];
}
num(1,2)
function str (a:string,b:string) : Array<string> {
    return [a ,b];
}
str('独孤','求败')
\`\`\`

泛型优化，语法为函数名字后面跟一个<参数名>，参数名可以随便写：

\`\`\`typescript
function Add<T>(a: T, b: T): Array<T>  {
    return [a,b]
}

Add<number>(1,2)
Add<string>('1','2')
\`\`\`

使用不同的泛型参数名：

\`\`\`typescript
function Sub<T,U>(a:T,b:U):Array<T|U> {
    const params:Array<T|U> = [a,b]
    return params
}

Sub<Boolean,number>(false,1)
\`\`\`

**定义泛型接口**

\`\`\`typescript
interface MyInter<T> {
   (arg: T): T
}

function fn<T>(arg: T): T {
   return arg
}

let result: MyInter<number> = fn

result(123)
\`\`\`

**对象字面量泛型**

\`\`\`typescript
let foo: { <T>(arg: T): T }

foo = function <T>(arg:T):T {
   return arg
}

foo(123)
\`\`\`

**泛型约束**

我们期望在一个泛型的变量上面，获取其length参数，但是有的数据类型是没有length属性的。使用泛型约束：

\`\`\`typescript
interface Len {
   length:number
}

function getLegnth<T extends Len>(arg:T) {
  return arg.length
}

getLegnth<string>('123')
\`\`\`

**使用keyof约束对象**

\`\`\`typescript
function prop<T, K extends keyof T>(obj: T, key: K) {
   return obj[key]
}

let o = { a: 1, b: 2, c: 3 }

prop(o, 'a') 
prop(o, 'd') //此时就会报错发现找不到
\`\`\`

**泛型类**

\`\`\`typescript
class Sub<T>{
   attr: T[] = [];
   add (a:T):T[] {
      return [a]
   }
}

let s = new Sub<number>()
s.attr = [1,2,3]
s.add(123)

let str = new Sub<string>()
str.attr = ['1','2','3']
str.add('123')
\`\`\`




### 24. 泛型工具

泛型工具是一组预定义的泛型类型和操作符，用于操作和转换类型。

**Partial** - 将一个类型的所有属性变为可选：

\`\`\`typescript
interface User {
    name: string;
    age: number;
}

type test = Partial<User>
// 结果: { name?: string | undefined; age?: number | undefined; }

// 原理
type Partial<T> = { [P in keyof T]?: T[P] }
\`\`\`

**Required** - 将一个类型的所有属性变为必选：

\`\`\`typescript
// 原理
type Required<T> = { [P in keyof T]-?: T[P] }
\`\`\`

**Pick** - 从一个类型中选取指定的属性：

\`\`\`typescript
// 原理 (never在联合类型中会被忽略)
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
\`\`\`

**Exclude** - 从联合类型中排除指定的类型：

\`\`\`typescript
// 原理
type Exclude<T, U> = T extends U ? never : T

type test = Exclude<'a' | 'b' | 'c', 'a' | 'b'> // 结果: "c"
\`\`\`

**Omit** - 创建一个新类型，从原始类型中排除指定的属性：

\`\`\`typescript
// 原理: Pick<T, Exclude<keyof T, K>>
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
\`\`\`




### 25. 泛型工具2

**Record**

泛型工具Record接受两个泛型K,T。K表示创建的新对象需要具有哪些属性，T表示对象属性的类型。

\`\`\`typescript
type Key = "c" | "x" | "k";
type Value = '唱' | '跳' | 'rap' | '篮球'

let obj:Record<Key,Value> = {
    'c':'唱',
    "x":'跳',
    "k":'rap'
}
\`\`\`

Record源码：

\`\`\`typescript
type Record<K extends keyof any, T> = {
    [P in K]: T
}
// 对象的key只能是symbol string number，keyof any正好获取这三个类型
\`\`\`

支持嵌套约束。

**ReturnType<Fn>**

主要适用于函数，能够提取函数所返回的类型。

\`\`\`typescript
const fn = () => [1,2,3,'sad'];
type num = ReturnType<typeof fn>; // (string | number)[]
\`\`\`

原理：

\`\`\`typescript
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : never
\`\`\`




### 26. infer

infer就是**推导泛型参数**，infer声明只能出现在extends子语句中。

**获取Promise的返回值**

\`\`\`typescript
interface User {
    name:string
    age:number
}

type Result = Promise<User>

type PromiseRes<T> = T extends Promise<infer R> ? R : never

type r = PromiseRes<Result> // User
\`\`\`

**多层递归**

\`\`\`typescript
type Result = Promise<Promise<Promise<User>>>

type PromiseRes<T> = T extends Promise<infer R> ? PromiseRes<R> : T

type r = PromiseRes<Result> // User
\`\`\`

**infer的协变**

获取对象属性的类型并且返回元组类型。如果同一个对象使用一个变量就会产生协变，返回值就是联合类型：

\`\`\`typescript
let obj = { name:'小满', age:123 }

type protyKey<T> = T extends {name:infer U, age:infer U} ? U : T

type res = protyKey<typeof obj> // string | number
\`\`\`

**infer的逆变**

函数会产生逆变，此时返回的值是一个交叉类型。string & number 不可能存在，所以是never：

\`\`\`typescript
type FnType<T> = T extends {
    a:(args:infer U)=>void,
    b:(args:infer U)=>void
} ? U : never

// never 一个类型不能 number & string
type T = FnType<{a:(args:number)=>void, b:(args:string)=>void}> 
\`\`\`

**总结**：在协变位置上同一个类型变量的多个候选类型会被推断为联合类型；在逆变位置上，同一个类型变量的多个候选类型则会被推断为交叉类型。




### 27. infer类型提取

用infer实现四个简单的例子：

**1. 提取头部元素**

\`\`\`typescript
type Arr = ['a','b','c']

type First<T extends any[]> = T extends [infer First, ...any[]] ? First : []

type a = First<Arr> // 'a'
\`\`\`

**2. 提取尾部元素**

\`\`\`typescript
type Arr = ['a', 'b', 'c']

type Last<T extends any[]> = T extends [...any[], infer Last] ? Last : []

type c = Last<Arr> // 'c'
\`\`\`

**3. 剔除第一个元素 Shift**

\`\`\`typescript
type Arr = ['a','b','c']

type Shift<T extends any[]> = T extends [unknown, ...infer Rest] ? Rest : []

type a = Shift<Arr> // ['b','c']
\`\`\`

**4. 剔除尾部元素 pop**

\`\`\`typescript
type Arr = ['a','b','c']

type Pop<T extends any[]> = T extends [...infer Rest, unknown] ? Rest : []

type a = Pop<Arr> // ['a','b']
\`\`\`




### 28. infer递归

使用infer递归实现数组反转：

\`\`\`typescript
type Arr = [1, 2, 3, 4]

type ReveArr<T extends any[]> = T extends [infer First, ...infer rest] ? [...ReveArr<rest>, First] : T

type Res = ReveArr<Arr> // [4, 3, 2, 1]
\`\`\`

思路：首先使用泛型约束只能传入数组类型，然后从数组中提取第一个，放入新数组的末尾，反复此操作，形成递归，满足结束条件返回该类型。





## 四、面向对象编程

### 8. Class类

ES6提供了更接近传统语言的写法，引入了Class（类）这个概念，作为对象的模板。通过class关键字，可以定义类。基本上，ES6的class可以看作只是一个语法糖，它的绝大部分功能，ES5都可以做到，新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。

\`\`\`typescript
//定义类
class Person {
    constructor () {

    }
    run () {
        
    }
}
\`\`\`

**在TS中定义类**

在TypeScript是不允许直接在constructor定义变量的，需要在constructor上面先声明。如果定义了变量不用也会报错，通常是给个默认值或者进行赋值。

**类的修饰符**

总共有三个：public、private、protected

- public：定义的变量内部访问也可以外部访问，如果不写默认就是public
- private：代表定义的变量私有的只能在内部访问，不能在外部访问
- protected：代表定义的变量私有的只能在内部和继承的子类中访问，不能在外部访问

\`\`\`typescript
class Person {
    public name:string
    private age:number 
    protected some:any
    constructor (name:string,ages:number,some:any) {
       this.name = name
       this.age = ages
       this.some = some
    }
    run () {

    }
}

class Man extends Person{
    constructor () {
        super("张三",18,1)
        console.log(this.some)
    }
    create () {
       console.log(this.some)
    }
}
let xiaoman = new Person('小满',18,1)
let man = new Man()
man.some
\`\`\`

**static 静态属性和静态方法**

用static定义的属性不可以通过this去访问，只能通过类名去调用。static静态函数同样也是不能通过this去调用，也是通过类名去调用。需注意：如果两个函数都是static静态的是可以通过this互相调用。

**interface 定义类**

ts interface定义类使用关键字 implements，后面跟interface的名字多个用逗号隔开，继承还是用 extends

\`\`\`typescript
interface PersonClass {
    get(type: boolean): boolean
}

interface PersonClass2{
    set():void,
    asd:string
}

class A {
    name: string
    constructor() {
        this.name = "123"
    }
}

class Person extends A implements PersonClass,PersonClass2 {
    asd: string
    constructor() {
        super()
        this.asd = '123'
    }
    get(type:boolean) {
        return type
    }
    set () {

    }
}
\`\`\`

**抽象类**

应用场景：如果你写的类实例化之后毫无用处，此时可以把他定义为抽象类。或者你也可以把他作为一个基类——通过继承一个派生类去实现基类的一些方法。

抽象类无法被实例化：

\`\`\`typescript
abstract class A {
   public name:string
   
}

new A() // 报错，抽象类无法被实例化
\`\`\`

在A类定义了getName抽象方法但未实现，B类实现了A定义的抽象方法，如不实现就会报错。我们定义的抽象方法必须在派生类实现：

\`\`\`typescript
abstract class A {
   name: string
   constructor(name: string) {
      this.name = name;
   }
   print(): string {
      return this.name
   }

   abstract getName(): string
}

class B extends A {
   constructor() {
      super('小满')
   }
   getName(): string {
      return this.name
   }
}

let b = new B();

console.log(b.getName());
\`\`\`




### 19. Mixins混入

TypeScript混入Mixins，其实vue也有mixins这个东西，你可以把他看作为合并。

**1. 对象混入**

可以使用ES6的Object.assign合并多个对象，此时people会被推断成一个交叉类型 Name & Age & Sex：

\`\`\`typescript
interface Name {
    name: string
}
interface Age {
    age: number
}
interface Sex {
    sex: number
}

let people1: Name = { name: "小满" }
let people2: Age = { age: 20 }
let people3: Sex = { sex: 1 }

const people = Object.assign(people1,people2,people3)
\`\`\`

**2. 类的混入**

首先声明两个mixins类（严格模式要关闭不然编译不过）：

\`\`\`typescript
class A {
    type: boolean = false;
    changeType() {
        this.type = !this.type
    }
}

class B {
    name: string = '张三';
    getName(): string {
        return this.name;
    }
}
\`\`\`

下面创建一个类结合了这两个mixins。没使用extends而是使用implements，把类当成了接口。为将要mixin进来的属性方法创建出占位属性：

\`\`\`typescript
class C implements A,B{
    type:boolean
    changeType:()=>void;
    name: string;
    getName:()=> string
}
\`\`\`

最后创建帮助函数帮我们做混入操作：

\`\`\`typescript
Mixins(C, [A, B])
function Mixins(curCls: any, itemCls: any[]) {
    itemCls.forEach(item => {
        Object.getOwnPropertyNames(item.prototype).forEach(name => {
            curCls.prototype[name] = item.prototype[name]
        })
    })
}
\`\`\`




### 20. 装饰器Decorator

Decorator装饰器是一项实验性特性，在未来的版本中可能会发生改变。若要启用实验性的装饰器特性，必须在命令行或	sconfig.json里启用编译器选项"experimentalDecorators": true。

装饰器是一种特殊类型的声明，它能够被附加到类声明、方法、访问符、属性或参数上。

**类装饰器**

定义一个类装饰器函数，会把类的构造函数传入函数当做第一个参数：

\`\`\`typescript
const watcher: ClassDecorator = (target: Function) => {
    target.prototype.getParams = <T>(params: T):T => {
        return params
    }
}

@watcher
class A {
    constructor() {}
}

const a = new A();
console.log((a as any).getParams('123'));
\`\`\`

**装饰器工厂**

也就是一个高阶函数，外层的函数接受值，里层的函数最终接受类的构造函数：

\`\`\`typescript
const watcher = (name: string): ClassDecorator => {
    return (target: Function) => {
        target.prototype.getParams = <T>(params: T): T => {
            return params
        }
        target.prototype.getOptions = (): string => {
            return name
        }
    }
}

@watcher('name')
class A {
    constructor() {}
}

const a = new A();
console.log((a as any).getParams('123'));
\`\`\`

**装饰器组合**

可以使用多个装饰器：

\`\`\`typescript
@watcher2('name2')
@watcher('name')
class A {
    constructor() {}
}
\`\`\`

**方法装饰器**

返回三个参数：1.对于静态成员来说是类的构造函数，对于实例成员是类的原型对象；2.成员的名字；3.成员的属性描述符。

**属性装饰器**

返回两个参数：1.对于静态成员来说是类的构造函数，对于实例成员是类的原型对象；2.属性的名字。

**参数装饰器**

返回三个参数：1.对于静态成员来说是类的构造函数，对于实例成员是类的原型对象；2.成员的名字；3.参数在函数参数列表中的索引。

**元数据存储**

使用 
eflect-metadata 可以快速存储元数据然后取出来使用：

\`\`\`typescript
import 'reflect-metadata'
// defineMetadata / getMetadata
\`\`\`





> example

\`\`\`typescript
const Base = (name: string) => {
  const fn: ClassDecorator = (target) => {
    console.log("类装饰器执行，target:", target.name);
    target.prototype.xiaoman = "小满";
    target.prototype.fn = () => {
      console.log("我是憨憨");
    };
  };
  return fn;
};

const Get = (url: string) => {
  const fn: MethodDecorator = (
    target: any, // 类本身
    propertyKey: string | symbol, // 方法名
    descriptor: PropertyDescriptor, // 方法原型
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      console.log(\`[Get] 请求地址: \${url}\`);

      const response = await fetch(url);
      const text = await response.text(); // 先拿原始文本，方便调试

      // 将数据注入给原方法
      return originalMethod.apply(this, [JSON.parse(text), ...args]);
    };
  };
  return fn;
};

@Base("xiao yu")
class Http {
  // 建议换一个稳定的测试 API
  @Get("https://jsonplaceholder.typicode.com/posts/1")
  getList(data: any) {
    console.log("getList 接收到的数据:", data);
    return data;
  }
}
\`\`\`





## 五、工程化配置

### 15. tsconfig.json配置文件


这个文件是通过tsc --init 命令生成的。

**配置详解**

\`\`\`json
{
  "compilerOptions": {
    "incremental": true,                    // 增量编译，只重新编译改动的文件，加速构建
    "target": "ES5",                        // 编译目标为 ES5，确保兼容性
    "module": "CommonJS",                   // 模块系统使用 CommonJS（Node 标准）
    "outFile": "./app.js",                  // 将所有输出合并为单个文件（仅在 AMD/System 模块下生效）
    "lib": ["DOM", "ES2015", "ScriptHost", "ES2019.Array"], // 引入的类型定义库
    "allowJS": true,                        // 允许编译 .js 文件
    "checkJs": true,                        // 对 .js 文件进行类型检查
    "outDir": "./dist",                     // 编译后的 .js 文件输出目录
    "rootDir": "./",                        // 指定源码根目录，控制输出目录结构
    "declaration": true,                  // 生成 .d.ts 类型声明文件
    "declarationDir": "./file",             // 声明文件输出目录
    "sourceMap": true,                      // 生成 .map 映射文件，便于调试
    "removeComments": true,                 // 编译时移除注释，减小体积
    "noEmit": true,                         // 只做类型检查，不输出文件（优先级高于 declaration/outDir）
    "noEmitOnError": true,                  // 编译报错时不生成输出文件
    "strict": true,                         // 开启所有严格类型检查选项的总开关
    "alwaysStrict": true,                   // 在输出文件中加入 "use strict"
    "noImplicitAny": true,                  // 禁止隐式 any，必须显式声明类型
    "strictNullChecks": true,               // 严格检查 null 和 undefined
    "strictFunctionTypes": true,            // 函数参数和返回值严格协变/逆变检查
    "strictPropertyInitialization": true,   // 类属性必须在构造函数中初始化
    "strictBindCallApply": true,            // 严格检查 bind/call/apply 的参数类型
    "noImplicitThis": true,                 // 禁止 this 隐式为 any
    "noUnusedLocals": true,                 // 报错未使用的局部变量
    "noUnusedParameters": true,             // 报错未使用的函数参数
    "noFallthroughCasesInSwitch": true,     // 禁止 switch 的 case 贯穿（必须有 break/return）
    "noImplicitReturns": true,              // 函数所有分支必须显式 return
    "esModuleInterop": true,                // 兼容 CommonJS 模块的默认导入（如 import fs from 'fs'）
    "moduleResolution": "node",             // 模块解析策略采用 Node.js 方式
    "baseUrl": "./",                        // 非相对路径模块解析的基准目录
    "paths": {                              // 路径映射，类似 webpack alias
      "jquery": ["node_modules/jquery/dist/jquery.min.js"]
    },
    "rootDirs": ["src", "out"]              // 将多个目录视为一个虚拟根目录
  },
  "include": ["src/**/*"],                  // 包含 src 目录下所有文件参与编译
  "exclude": ["demo.ts"],                   // 排除 demo.ts（但会被下面的 files 覆盖）
  "files": ["demo.ts"]                      // 仅编译 demo.ts（优先级最高，会覆盖 include）
}
\`\`\`

**注意项：**
- \`noEmit: true\` 开启后，\`outDir\`/\`declaration\` 等输出配置实际上不会生效
- \`files\` 与 \`include\` 同时存在时，\`files\` 优先级更高，当前实际只编译 \`demo.ts\`
- \`outFile\` 在 \`module: "CommonJS"\` 下无效，仅在 AMD/System 模块时合并输出



**常用配置项：**

1. **include** - 指定编译文件，默认是编译当前目录下所有的ts文件
2. **exclude** - 指定排除的文件
3. **target** - 指定编译js的版本，例如es5、es6
4. **allowJS** - 是否允许编译js文件
5. **removeComments** - 是否在编译过程中删除文件中的注释
6. **rootDir** - 编译文件的目录
7. **outDir** - 输出的目录
8. **sourceMap** - 代码源文件映射
9. **strict** - 严格模式
10. **module** - 默认common.js，可选es6模式amd、umd等
11. **diagnostics**：true // 打印诊断信息
12. 

> 推荐配置

\`\`\`json
// ========== 1. 前端项目（Vite / Webpack / esbuild）==========
{
  "compilerOptions": {
    "target": "ES2022",                      // 编译目标：现代浏览器原生支持 ES2022，无需降级
    "lib": ["ES2022", "DOM", "DOM.Iterable"], // 类型声明库：ES2022 语法 + DOM API + DOM 可迭代类型
    "module": "ESNext",                      // 模块格式：输出 ES 模块，交给打包器处理（Vite/Webpack 原生支持）
    "moduleResolution": "bundler",            // 模块解析策略：适配打包器，支持 import 不带扩展名等特性
    "jsx": "react-jsx",                      // JSX 转换：使用 React 17+ 新的 JSX 转换，无需手动 import React

    "strict": true,                          // 严格模式总开关：开启所有严格类型检查（必开）
    "noUncheckedIndexedAccess": true,        // 索引访问返回 T | undefined：arr[i] 不会隐式为 T，防 undefined 报错
    "noImplicitOverride": true,              // 子类重写父类方法必须用 override 关键字，防拼写错误
    "noFallthroughCasesInSwitch": true,      // 禁止 switch case 贯穿：漏写 break 直接报错

    "verbatimModuleSyntax": true,            // 强制区分 type-only import：import type 会被完全擦除，运行时 import 保留
    "isolatedModules": true,                 // 确保每个文件可独立编译：防跨文件类型推断，适配 Babel/esbuild 等单文件编译器
    "skipLibCheck": true,                    // 跳过 node_modules 中 .d.ts 的类型检查：大幅提升编译速度，减少第三方库类型冲突
    "incremental": true,                     // 增量编译：只重新编译改动文件，加速二次构建

    "baseUrl": ".",                          // 路径别名基准目录（官方已标记废弃，但尚未移除，仍可用）
    "paths": {                               // 路径映射：与 vite.config.ts / webpack alias 配合使用
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"], // 只编译 src 目录下的 ts/tsx 文件
  "exclude": ["node_modules", "dist"]         // 排除依赖目录和构建产物
}
\`\`\`

\`\`\`json
// ========== 2. Node.js 项目 ==========
{
  "compilerOptions": {
    "target": "ES2022",                      // Node 18+ 原生支持
    "lib": ["ES2022"],                       // Node 环境不需要 DOM
    "module": "NodeNext",                    // 适配 Node.js ESM/CJS 混合场景，支持 .mts/.cts
    "moduleResolution": "NodeNext",          // 与 module: NodeNext 配套，遵循 Node ESM 解析规则

    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,

    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "incremental": true,

    "outDir": "./dist",                      // 编译输出目录
    "rootDir": "./src",                      // 源码根目录，控制输出结构

    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
\`\`\`

\`\`\`json
// ========== 3. 库开发（发布到 npm） ==========
{
  "compilerOptions": {
    "target": "ES2022",                      // Node 18+ 原生支持
    "lib": ["ES2022"],                       // Node 环境不需要 DOM
    "module": "NodeNext",                    // 适配 Node.js ESM/CJS 混合场景，支持 .mts/.cts
    "moduleResolution": "NodeNext",          // 与 module: NodeNext 配套，遵循 Node ESM 解析规则

    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,

    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "incremental": true,

    "outDir": "./dist",                      // 编译输出目录
    "rootDir": "./src",                      // 源码根目录，控制输出结构

    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
\`\`\`

\`\`\`json
// React 项目（Vite / Webpack）
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    
    "jsx": "react-jsx",                    // React 17+ 新 JSX 转换，无需手动 import React
    
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "incremental": true,
    
    "resolveJsonModule": true,             // 支持 import xxx from './xxx.json'
    "sourceMap": true,                     // 生成 .map，调试必备
    "forceConsistentCasingInFileNames": true, // 跨平台（Win/Mac/Linux）文件名大小写严格检查
    
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
\`\`\`



\`\`\`json
// Vue 项目（Vite）
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    
    // Vue 不需要 jsx 配置（除非用 TSX）
    
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "incremental": true,
    
    "resolveJsonModule": true,
    "sourceMap": true,
    "forceConsistentCasingInFileNames": true,
    
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.vue"],  // .vue 文件必须包含
  "exclude": ["node_modules", "dist"]
}
\`\`\`



> 已废弃 / 无需再写的配置（TS 6.0+）

| 旧配置                    | 现状说明                                                     |
| ------------------------- | ------------------------------------------------------------ |
| \`"esModuleInterop": true\` | TS 6.0+ 已强制为 \`true\`，无需显式配置                        |
| \`"alwaysStrict": true\`    | 已废弃，所有输出默认严格模式                                 |
| \`"target": "ES5"\`         | 已废弃，现代环境直接用 \`ES2022\`                              |
| \`"outFile": "..."\`        | 已废弃，合并文件交给打包器处理                               |
| \`"baseUrl": "."\`          | 官方已标记废弃（但尚未移除），新项目建议用 Node.js subpath imports 或打包器 alias 替代 |
| \`"module": "CommonJS"\`    | 新项目推荐 \`ESNext\` / \`NodeNext\`，CJS 由打包器或 Node 自动处理 |











### 16. namespace命名空间

我们在工作中无法避免全局变量造成的污染，TypeScript提供了namespace避免这个问题出现。

- 内部模块，主要用于组织代码，避免命名冲突
- 命名空间内的类默认私有
- 通过 export 暴露
- 通过 
amespace 关键字定义

TypeScript与ECMAScript 2015一样，任何包含顶级import或者export的文件都被当成一个模块。相反地，如果一个文件不带有顶级的import或者export声明，那么它的内容被视为全局可见的。

\`\`\`typescript
namespace a {
    export const Time: number = 1000
    export const fn = <T>(arg: T): T => {
        return arg
    }
    fn(Time)
}

namespace b {
     export const Time: number = 1000
     export const fn = <T>(arg: T): T => {
        return arg
    }
    fn(Time)
}

a.Time
b.Time
\`\`\`

**嵌套命名空间**

\`\`\`typescript
namespace a {
    export namespace b {
        export class Vue {
            parameters: string
            constructor(parameters: string) {
                this.parameters = parameters
            }
        }
    }
}

let v = a.b.Vue

new v('1')
\`\`\`

**抽离命名空间**：通过文件导入导出

**简化命名空间**

\`\`\`typescript
namespace A  {
    export namespace B {
        export const C = 1
    }
}

import X = A.B.C

console.log(X);
\`\`\`

**合并命名空间**：重名的命名空间会合并



### 18. 声明文件d.ts

**声明文件 declare**

当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能。

\`\`\`typescript
declare var 声明全局变量
declare function 声明全局方法
declare class 声明全局类
declare enum 声明全局枚举类型
declare namespace 声明（含有子属性的）全局对象
interface 和 type 声明全局类型
/// <reference /> 三斜线指令
\`\`\`

例如使用express时需要下载声明文件：
pm install @types/node -D

而axios的package.json中已经指定了声明文件，所以没有报错可以直接用。通过语法declare暴露我们声明的axios对象：declare const axios: AxiosStatic;

如果有一些第三方包确实没有声明文件我们可以自己去定义，创建一个 名称.d.ts 文件去声明。

**案例手写声明文件**

typings/express.d.ts：

\`\`\`typescript
declare module 'express' {
    interface Router {
        get(path: string, cb: (req: any, res: any) => void): void
    }
    interface App {
        use(path: string, router: any): void
        listen(port: number, cb?: () => void): void
    }
    interface Express {
        (): App
        Router(): Router
    }
    const express: Express
    export default express
}
\`\`\`

关于这些第三方声明文件包都收录到了 npm。




### 17. 模块解析

前端模块化规范有多种，在ES6模块化规范之前有：CommonJS（Nodejs）、AMD（requireJs）、CMD（seaJs）、UMD（AMD和CommonJS的糅合）。

现在主要使用 import / export。

**ES6模块化规范用法**

1. 默认导出和引入（默认导出只能有一个，引入时名字可以随便起）：

\`\`\`typescript
//导出
export default { a:1 }

//引入
import test from "./test"
\`\`\`

2. 分别导出：

\`\`\`typescript
export default { a:1 }

export function add<T extends number>(a: T, b: T) {
    return a + b
}

export let xxx = 123

//引入
import obj,{xxx,add} from './test'
\`\`\`

3. 重名问题用as重命名：

\`\`\`typescript
import obj,{xxx as bbb,add} from './test'

console.log(bbb)
\`\`\`

4. 动态引入（import只能写在顶层，不能掺杂到逻辑里面，这时候就需要动态引入了）：

\`\`\`typescript
if(true){
    import('./test').then(res => {
        console.log(res)
    })
}
\`\`\`



### 21. webpack构建ts+vue3项目

https://www.bilibili.com/video/BV1wR4y1377K?t=40.9&p=25

**基础构建**：安装webpack、webpack-dev-server、webpack-cli，配置webpack.config.js。

**支持TypeScript**：安装ts-loader和typescript，配置module.rules。

**支持vue**：安装vue-loader和html-webpack-plugin。让ts识别.vue后缀需要在shim.d.ts中声明：

\`\`\`typescript
declare module "*.vue" {
    import { DefineComponent } from "vue"
    const component: DefineComponent<{}, {}, any>
    export default component
}
\`\`\`

**支持css + less**：安装css-loader、style-loader、less、less-loader。

**代码分包**：通过optimization.splitChunks配置cacheGroups进行分包，减少体积。

**单独提取css**：使用mini-css-extract-plugin，将style-loader替换为MiniCssExtractPlugin.loader。





## 六、实战练习

### 22. 发布订阅模式

发布订阅模式是一种常见的设计模式。使用addEventListener监听DOM事件、Vue的事件总线机制等都属于发布订阅模式。

需要定义三个角色：发布者、订阅者、调度者。

on订阅/监听，emit发布/注册，once只执行一次，off解除绑定：

\`\`\`typescript
interface EventFace {
    on: (name: string, callback: Function) => void;
    emit: (name: string, ...args: Array<any>) => void;
    off: (name: string, fn: Function) => void;
    once: (name: string, fn: Function) => void;
}

interface List {
    [key: string]: Array<Function>;
}

class Dispatch implements EventFace {
    list: List;

    constructor() {
        this.list = {};
    }

    // 订阅事件
    on(name: string, callback: Function) {
        const callbackList: Array<Function> = this.list[name] || [];
        callbackList.push(callback);
        this.list[name] = callbackList;
    }

    // 发布事件
    emit(name: string, ...args: Array<any>) {
        let eventName = this.list[name];
        if (eventName) {
            eventName.forEach(fn => {
                fn.apply(this, args);
            });
        } else {
            console.error('该事件未监听');
        }
    }

    // 解除绑定
    off(name: string, fn: Function) {
        let eventName = this.list[name];
        if (eventName && fn) {
            let index = eventName.findIndex(fns => fns === fn);
            eventName.splice(index, 1);
        } else {
            console.error('该事件未监听');
        }
    }

    // 一次性订阅
    once(name: string, fn: Function) {
        let decorator = (...args: Array<any>) => {
            fn.apply(this, args);
            this.off(name, decorator);
        };
        this.on(name, decorator);
    }
}

const o = new Dispatch();

o.on('abc', (...arg: Array<any>) => {
    console.log(arg, 1);
});

o.once('abc', (...arg: Array<any>) => {
    console.log(arg, 'once');
});

o.emit('abc', 1, true, '小满');
o.emit('abc', 2, true, '小满');
\`\`\`




### 23. Proxy & Reflect

**Proxy**对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

- handler.get() - 属性读取操作的捕捉器
- handler.set() - 属性设置操作的捕捉器

**Reflect**与大多数全局对象不同，并非一个构造函数。其所有属性和方法都是静态的。Reflect.get(target, name, receiver)查找并返回target对象的name属性，Reflect.set(target, name, value, receiver)设置target对象的name属性等于value。

\`\`\`typescript
type Person = {
    name: string,
    age: number,
    text: string
}

const proxy = (object: any, key: any) => {
    return new Proxy(object, {
        get(target, prop, receiver) {
            console.log(get key======>)
            return Reflect.get(target, prop, receiver)
        },
        set(target, prop, value, receiver) {
            console.log(set key======>)
            return Reflect.set(target, prop, value, receiver)
        }
        apply() // 函数调用
    })
}

const logAccess = <T>(object: T, key: keyof T): T => {
    return proxy(object, key)
}

let man: Person = logAccess({
    name: "小满", age: 20, text: "我的很小"
}, 'age')

man.age = 30
console.log(man)
\`\`\`

**案例：简单实现一个mobx观察者模式**

\`\`\`typescript
const list: Set<Function> = new Set()

const autorun = (cb: Function) => {
    if (cb) { list.add(cb) }
}

const observable = <T extends object>(params: T) => {
    return new Proxy(params, {
        set(target, key, value, receiver) {
            const result = Reflect.set(target, key, value, receiver)
            list.forEach(fn => fn())
            return result
        }
    })
}

const person = observable({ name: "小满", attr: "威猛先生" })

autorun(() => { console.log('我变化了') })

person.attr = '威猛个捶捶'
\`\`\`




### 30. LocalStorage封装

localStorage本身没有过期时间机制，只能人为手动删除。可以对其进行二次封装实现过期时间功能。

**实现思路**：在存储时设置过期时间并格式化数据，读取时判断是否过期。

\`\`\`typescript
// 枚举定义
export enum Dictionaries {
    expire = '__expire__',
    permanent = 'permanent'
}

// 类型定义
export type Key = string
export type expire = Dictionaries.permanent | number
export interface Data<T> {
    value: T
    [Dictionaries.expire]: Dictionaries.expire | number
}
export interface Result<T> {
    message: string,
    value: T | null
}

// 核心实现
export class Storage {
    public set<T = any>(key: Key, value: T, expire: expire = Dictionaries.permanent) {
        const data = { value, [Dictionaries.expire]: expire }
        localStorage.setItem(key, JSON.stringify(data))
    }

    public get<T = any>(key: Key): Result<T | null> {
        const value = localStorage.getItem(key)
        if (value) {
            const obj: Data<T> = JSON.parse(value)
            const now = new Date().getTime()
            if (typeof obj[Dictionaries.expire] == 'number' && obj[Dictionaries.expire] < now) {
                this.remove(key)
                return { message: 您的已过期, value: null }
            } else {
                return { message: "成功读取", value: obj.value }
            }
        } else {
            return { message: key值无效, value: null }
        }
    }

    public remove(key: Key) { localStorage.removeItem(key) }
    public clear() { localStorage.clear() }
}
\`\`\`



 
`;export{n as default};
