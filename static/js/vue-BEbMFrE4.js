const n=`# 	Vue 基础

## 概念与介绍

1. 分vue2与vue3

2. 内置了DOM操作在框架中，可以专注于逻辑数据的处理
3. 将数据与界面的呈现分离，降低代码耦合度
4. 组件化开发

> 安装

\`\`\`html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"><\/script>
\`\`\`

> demo

\`\`\`html
<body>
    <div id="app">

    </div>

    <script src="../vue.js"><\/script>
    <script>
        const vm = new Vue({
            el: "#app",//不写时，用$mount代替
            
            
            data(){
                return {
                    
                }
            }
            //不写成():数据混乱
            methods: {

            },
            computed: {
                           
            }, //数据改变时，自执行的逻辑
            watch: {

            }
        });
        vm.$mount("#root")//挂载，Vue原型的方法
    <\/script>
</body>
\`\`\`

## 响应式与插值

### 插值表达式{{}}

\`\`\`html
<p>{{ 内容 }}</p>//data

<p>{{1+2+3}}</p>//支持逻辑运算,三元表达式等

<p>{{output()}}</p>//method

<p>{{outputContent}}</p>//computed
\`\`\`

### 方法调用methods

\`\`\`js
methods: {
	output() {
		return "test";
	}
}
\`\`\`

## 计算属性computed

\`\`\`js
//多次调用只会执行一次,有缓存
computed: {
    fullname:{
        get(){
            return this.firstname
        }
    },
    //等同于
    fullname(){
        
    }
        
    outputContent() {
        console.log("outputContent");
        return this.title;
    }
}
\`\`\`

\`\`\`html
<p>{{outputContent}}</p>
<p>{{outputContent}}</p>
<p>{{outputContent}}</p>
\`\`\`

## 侦听器watch

\`\`\`js
//数据改变时，自执行的逻辑
watch: {
    //方法名与data中的属性名对应
    title(newValue, oldValue) {
        console.log(newValue, oldValue);
    },
    
    //numbers{a:1,b:2}
    'numbers.a'(n,o){
        
    }
    
    'numbers ':{
        deep:true, //深度监视
        handler(){
            
        }    
            
    }
     
}

\`\`\`

## 指令

> 内容指令

\`\`\`html
//会覆盖标签原始内容
<p v-text="title">134</p><!--当成文本-->
<p v-html="htmlcontent">134</p><!--当成html结构-->

<P v-once>初始值{{data}},只设置一次</P>

\`\`\`

\`\`\`js
  return {
      title: "title",
      content: "content",
      htmlcontent: "<h1>html</h1>"
  }
\`\`\`

> 渲染指令

\`\`\`html
 <div v-for="item in 5">
     <font color="red">1</font>
</div>
<br>
<div v-for="(item, index) in items" :key="index">
    tem={{item}},index={{index}}
</div>
<!--key=key,value=item,arr=items-->
<div v-for="(item,key, index) in items" :key="index">
    tem={{item}},index={{index}}
</div>

<!--尽量使用唯一标识作为:key-->
<!--遍历对象-->
<div v-for="(value, key) of items" :key="index">
    
</div>
\`\`\`

![image-20230825205327055](./vue.assets/image-20230825205327055.png)

\`\`\`html
<div v-if="condition===1">
	v=1
</div>
    
<div v-else-if="condition===2">
	v=2
</div>
        
<div v-else>
	v=3
</div>

<!--style="display=none"-->
<div v-show="condition==2">
	show
</div>
\`\`\`

> 属性指令

\`\`\`html
<!-- data传给v-bind,单向 -->
<div v-bind:title="title">这是内容</div>
<!--只能用在表单类元素（输入类元素）-->
<div v-model:title="titleData">这是内容</div>
\`\`\`

> 事件指令

\`\`\`html
<!--
默认传了一个event
event.target获取点击标签
event.target.innerText
传参时
clickTest(122,$event)
-->
<div v-on:click="clickTest()">按钮</div>
<div @click="clickTest(122)">按钮</div>
------
<div @[event] = "xxx"></div>

<srcipt setip lang="ts">
    const xxx = 'click'
</srcipt>
----

<div @scoll="clickTest">滚动条</div>
<div @scoll="clickTest">滚轮</div>

<div @keyup="clickTest">键盘</div>

<div @blur=''>失去焦点</div>
\`\`\`

> 表单指令

\`\`\`html
<!--双向绑定 v-model= :value @input-->
<input type="text" v-model="">
\`\`\`



> 性能优化

<img src="vue.assets/image-20261011165440797.png" alt="image-20261011165440797" style="zoom: 50%;" />



> 自定义指令

![image-20230829202419675](./vue.assets/image-20230829202419675.png)

![image-20230829203419921](./vue.assets/image-20230829203419921.png)

## 修饰符

\`\`\`html
<input type="text" v-model.trim="">//trim去空格

<!--
prevent阻止跳转
stop阻止冒泡
once只触发一次
passive立即执行
-->
<a href="www" @click.prevent="show"></a>

<!--
enter,delete,esc,space
tab、ctrl、alt、shift、meta配合keydown
up,down,left,right
Vue.config.keyCodes.自定义键名=键码//自定义
可组合使用
-->
<div @keyup.enter="test">键盘</div>
\`\`\`

\`\`\`vue
show(e){
    e.preventDefault()//阻止跳转
}
\`\`\`

## 数据代理

<img src="./vue.assets/image-20230825163002572.png" alt="image-20230825163002572" style="zoom: 50%;" />

<img src="./vue.assets/image-20230825163312144.png" alt="image-20230825163312144" style="zoom: 80%;" />

> 数据绑定底层

<img src="./vue.assets/image-20230825163730282.png" alt="image-20230825163730282" style="zoom: 50%;" />

## 样式绑定

<img src="./vue.assets/image-20230827174426343.png" alt="image-20230827174426343" style="zoom: 67%;" />

\`\`\`vue
<div class="basic" :class="happy"></div>

<div class="basic" :class="arr"></div>

<script>
    new Vue({
        data(){
            //shift左移除,pull添加
            arr:['a','b','c']
        }
    })
<\/script>

<div class="basic" :style="{fontSize:fsize+'px'}"></div>
\`\`\`

## 收集表单数据

<img src="./vue.assets/image-20230825213912345.png" alt="image-20230825213912345" style="zoom:67%;" />

\`\`\`html
<body>
  <div id="app">
    <h3>小黑学习网</h3>

    姓名：
      <input type="text" v-model="username"> 
      <br><br>

    是否单身：
      <input type="checkbox" v-model="isSingle"> 
      <br><br>

    <!-- 
      前置理解：
        1. name:  给单选框加上 name 属性 可以分组 → 同一组互相会互斥
        2. value: 给单选框加上 value 属性，用于提交给后台的数据
      结合 Vue 使用 → v-model
    -->
    性别: 
      <input v-model="gender" type="radio" name="gender" value="1">男
      <input v-model="gender" type="radio" name="gender" value="2">女
      <br><br>

    <!-- 
      前置理解：
        1. option 需要设置 value 值，提交给后台
        2. select 的 value 值，关联了选中的 option 的 value 值
      结合 Vue 使用 → v-model
    -->
    所在城市:
      <select v-model="cityId">
        <option value="101">北京</option>
        <option value="102">上海</option>
        <option value="103">成都</option>
        <option value="104">南京</option>
      </select>
      <br><br>

    自我描述：
      <textarea v-model="desc"></textarea> 

    <button>立即注册</button>
  </div>

    <script>
    const app = new Vue({
      el: '#app',
      data: {
        username: '',
        isSingle: false,
        gender: "2",
        cityId: '102',
        desc: ""
      }
    })
  <\/script>
</body>

\`\`\`

## 过滤器

<iframe src="https://v2.cn.vuejs.org/v2/guide/filters.html" style="height:500px"></iframe>

## 生命周期

<img src="./vue.assets/image-20230827190606460.png" alt="image-20230827190606460" style="zoom: 67%;" />

> 流程

new Vue() ->

​	beforeCreate() \`此时无法通过vm范围访问data、method\`->

​	created \`已初始化，未挂载，可以通过vm范围访问data、method\`->

​	beforeMount() ->

​	mounted\`完成模板的解析并挂载完毕时调用\`() ->

​	beforeDestroy() ->

​	destroyed()

<img src="https://v2.cn.vuejs.org/images/lifecycle.png" alt="Vue 实例生命周期" style="zoom: 67%;" />

# Vue 源码

## 虚拟DOM

虚拟DOM就是通过JS来生成AST节点树

![image-20261011165836722](vue.assets/image-20261011165836722.png)

虚拟 DOM 本质是用 JavaScript 对象来描述真实 DOM 结构。  
比如：

\`\`\`js
{ tag: 'div', props: { id: 'app' }, children: ['hello'] }
\`\`\`

当数据变化时，Vue 会重新生成一棵新的虚拟 DOM 树，然后和旧树做 diff，找出差异，最后只把变化的部分更新到真实 DOM。

> 为什么需要虚拟DOM

**Vue 用虚拟 DOM，是为了在声明式、组件化、跨平台的前提下，用可接受的运行时开销，换取开发效率、可维护性和可预测的更新性能。**

![image-20261011165856685](vue.assets/image-20261011165856685.png)

Vue 用虚拟 DOM，不是因为它永远最快，而是因为它适合声明式组件框架：

- 开发者不用手动操作 DOM；

- 框架可以批量、diff、最小化更新；

  - 真实 DOM 操作通常比 JS 计算昂贵。虚拟 DOM 可以做：

    - 同一事件循环内多次数据变化，合并成一次更新；
    - 通过 diff 只更新变化节点，而不是整个页面重绘；
    - 以组件为粒度重新渲染，缩小 diff 范围。

    注意：虚拟 DOM 不是绝对比直接操作 DOM 快。直接精确操作 DOM 可以最快，但需要手动优化。虚拟 DOM 是在开发效率和性能之间取平衡。

- 可以跨平台渲染；

- 可以和响应式、编译优化结合。

所以虚拟 DOM 是 Vue 在**开发体验、可维护性、跨平台和性能**之间做出的工程取舍。Vue 3 仍然使用虚拟 DOM，但通过编译时优化，让它比传统虚拟 DOM 更高效。







## diff算法



[VUE3 VDOM DIFF手写_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1QL4y1u7Nd/?spm_id_from=333.788.top_right_bar_window_history.content.click)

[【尚硅谷】Vue源码解析之虚拟DOM和diff算法_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1v5411H7gZ/?)



这里没有使用到复用

![image-20261011171108299](vue.assets/image-20261011171108299.png)

有key，复用node

![image-20261011172207170](vue.assets/image-20261011172207170.png)

特殊情况

![image-20261011172336641](vue.assets/image-20261011172336641.png)

























# Vue-cli

基于Webpack打造的脚手架工具，构建项目

## 安装

node.js环境--nvm

\`\`\`bash
npm i @vue/cli -g
-g#表示在node的全局安装，类似下载到本地仓库，而非项目目录
\`\`\`

## 创建

\`\`\`bash
vue create my-vue-project
\`\`\`

\`\`\`bash
vue ui
\`\`\`

## 项目结构

<img src="./vue.assets/image-20230828175112631.png" alt="image-20230828175112631" style="zoom: 67%;" />

> package.json

\`\`\`json
 "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",//编译打包，生成dist
    "lint": "vue-cli-service lint"
 }
\`\`\`

> dist

\`\`\`bash
npm i serve -g
#启动一个静态资源服务器来执行
serve dist
\`\`\`

> main.js

\`\`\`js
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

\`\`\`

## 组件化开发

.vue =>

​	单文件组件，一个组件可以封装这一块功能的结构、样式、逻辑

\`\`\`vue
<template></template>

<style></style>

<script><\/script>
\`\`\`

![image-20230828185927213](./vue.assets/image-20230828185927213.png)

### 使用

\`\`\`vue
<!--普通组件的使用-->
<template>
	<!--vue2中有且只有一个根元素--> 
	<div class="hello">
 	    <h1>{{ msg }}</h1>
    </div>   
</template>

<script>
export default {
  name: "HelloWorld",//组件名，可省略
  props: {
    msg: String,
  },
};
<\/script>

<script>
	import Vue from 'vue'
	import App from './App.vue'
    import HelloWorld from './components/HelloWorld'
    
	Vue.config.productionTip = false

    //组件 全局注册
    Vue.component('HelloWorld',HelloWorld)
    
    
	new Vue({
  		render: h => h(App),
	}).$mount('#app')
<\/script>
\`\`\`

\`\`\`js
//组件导入
import HelloWorld from './components/HelloWorld.vue'

//导出的是当前组件的配置项
export default {
  name: 'App',//可以不写
  //组件的局部注册
  components: {
    //组件名:组件对象  
    HelloWorld
  }
}
\`\`\`

\`\`\`html
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <!--组件使用-->
    <HelloWorld msg="Vue.js App" 
                count=10/>
  </div>
</template>
\`\`\`

### 组件通信

> 父传子

<img src="./vue.assets/image-20230828200940823.png" alt="image-20230828200940823" style="zoom:67%;" />

![image-20230828201103852](./vue.assets/image-20230828201103852.png)

\`\`\`vue
 <HelloWorld msg="Vue.js App" />

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,//接受父组件设置的属性
    count: {
        type:[String,Numnber],//类型校验
        default:100//默认组
        required:true//是否必填
        validator(value){//自定义校验
             return 
        }
        
    }  
  },
};
<\/script>
\`\`\`

> 子传父

<img src="./vue.assets/image-20230828201514979.png" alt="image-20230828201514979" style="zoom: 67%;" />

> 父子 双向绑定

\`\`\`vue
<!--父组件-->
<BaseDialog :visible.sync="isShow"></BaseDialog>

<!--子组件-->
<script>
    pros:{
        visable:Boolean
    }
    this.$emit('update:visible',false)
<\/script>
\`\`\`

> 跨级传递

vuex全局状态管理工具

### 获取dom或组件实例

用ref和$refs,查找范围在当前组件内

![image-20230829195750002](./vue.assets/image-20230829195750002.png)

<img src="./vue.assets/image-20230829200035795.png" alt="image-20230829200035795" style="zoom: 67%;" />

### 异步dom更新

![image-20230829201135287](./vue.assets/image-20230829201135287.png)

### $nextTick

![image-20230829201504662](./vue.assets/image-20230829201504662.png)

### 组件插槽

\`\`\`vue
<slot name="header">header</slot>

<slot name="footer" :childCount="childCount">footer,默认内容</slot>

<HelloWorld>
      <template #header>
        <h1>test</h1>
      </template>
    
      <template #footer="dataObj">
        {{ dataObj }}
      </template>
      <template #footer="{ childCount }">
        {{ "childCount=" + childCount }}
      </template>
</HelloWorld>
\`\`\`

# Vue devtools

[Vue.js Devtools_6.0.0beta21_chrome扩展插件下载_极简插件 (zzzmh.cn)](https://chrome.zzzmh.cn/info/ljjemllljcmogpfapbkkighbhhppjdbg)

# Vue Router

## 介绍

在单页面应用（SPA）实现多页面

## 配置

<img src="./vue.assets/image-20230823190046953.png" alt="image-20230823190046953" style="zoom:67%;" />

 \`\`\`js
 import Vue from 'vue'
 import VueRouter from 'vue-router'
 import HomeView from '../views/HomeView.vue'
 
 Vue.use(VueRouter)
 
 const routes = [
   {
     path: '/',
     name: 'home',
     component: HomeView
   },
   {
     path: '/about',
     name: 'about',
     component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
   }
 ]
 
 const router = new VueRouter({
   mode: "history", //默认hash，路径中多了个#，兼容性更好
   base: process.env.BASE_URL,
   routes,//地址
 });
 
 export default router
 \`\`\`

\`\`\`json
{
    path: '/testeete/tete/about',
    name: 'about',
    component: HomeView
}
\`\`\`

\`\`\`vue
<!--App.vue-->
<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
      <router-link :to="{ name: 'about' }">About</router-link>   
    </nav>
    <router-view /><!--切换后在此显示-->
  </div>
</template>
\`\`\`

## 使用

> vue组件

\`\`\`vue
<template>
  <h3>Video.vue</h3>
</template>

<script>
export default {
  name: "Video.vue",
  data() {
    return {};
  },
  methods: {},
  created() {},
};
<\/script>
<style scoped></style>
\`\`\`

> routes/index.js

\`\`\`js
import VideoView from "../views/VideoView.vue";

const routes = [
  {
    path: "/video",
    name: "video",
    component: VideoView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
\`\`\`

> App.vue

\`\`\`vue
<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link :to="{ name: 'video' }">video</router-link>
    </nav>
    <router-view />
  </div>
</template>

\`\`\`

## 高亮

![image-20230830222148021](./vue.assets/image-20230830222148021.png)

![image-20230830222456500](./vue.assets/image-20230830222456500.png)

## 跳转传参

![image-20230830223806423](./vue.assets/image-20230830223806423.png)

## 动态路由

> VideoView.vue

\`\`\`vue
<template>
  <div id="video">
    <h3>Video.vue</h3>
    <p>id={{ id }}</p>
    <p>id={{ $route.params.id }}</p>
  </div>
</template>

<script>
export default {
  name: "VideoView",
  props: ["id"],
};
<\/script>

<style scoped></style>
\`\`\`

> router/index.js

\`\`\`js
import VideoView from "../views/VideoView.vue";

const routes = [
  {
    path: "/video/:id",//必须带参数
    //path: "/video/:id?"
    name: "video",
    component: VideoView,
    props: true,
  },
];
\`\`\`

> App.vue

\`\`\`vue
<router-link to="/video/1">video1</router-link>

<router-link :to="{ name: 'video', params: { id: 2 } }">video2</router-link><!--配合props--->
\`\`\`

## 重定向

![image-20230830230549694](./vue.assets/image-20230830230549694.png)

## 404

![image-20230830230854088](./vue.assets/image-20230830230854088.png)

## 嵌套路由

> VideoInfo1.vue | VideoInfo2.vue

\`\`\`vue
<template>
  <div id="videoInfo1">
    <h1>videoInfo1</h1>
  </div>
</template>

<script>
export default {
  name: "videoInfo1",
};
<\/script>
<style scoped></style>
\`\`\`

> index.js

\`\`\`js
import VideoView from "../views/VideoView.vue";
import VideoInfo1 from "../views/video/VideoInfo1.vue";
import VideoInfo2 from "../views/video/VideoInfo2.vue";

const routes = [
  {
    path: "/video/:id",
    name: "video",
    component: VideoView,
    children: [
      //  /video/:id/info1
      {
        path: "info1",
        name: "info1",
        component: VideoInfo1,
      },
      {
        path: "info2",
        name: "info2",
        component: VideoInfo2,
      },
    ],
    props: true,
  },
];
\`\`\`

> VideoView.vue

\`\`\`vue
<template>
  <div id="video">
    <h3>一级路由</h3>
    <h3>Video.vue</h3>
    <p>id={{ id }}</p>
    <router-link :to="{ name: 'info1'}">点赞信息</router-link>
  
    <br />
    <router-link :to="{ name: 'info2'}">互动信息</router-link>
    <hr />
      
    <h3>二级路由</h3>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "VideoView",
  props: ["id"],
};
<\/script>

<style scoped></style>
\`\`\`

## 编程式导航

**声明式导航**

使用 \`<router-link></router-link>\` 创建 \`a\` 标签来定义导航链接的称为**声明式导航**，\`to\` 显示的指明了导航的目的地。

**编程式导航**

顾名思义，就是**通过代码来进行路由的跳转**。

想要导航到不同的 URL，可使用 \`router.push\` 方法。在 Vue 实例内部，你可以通过 \`$router\` 访问路由实例。

因此使用 \`$router.push('/foo')\` 进行路由的跳转与以下声明式跳转等效：

\`\`\`vue
<!-- 点击后将在内部执行 router.push('/foo') -->
<router-link to="/foo"></router-link>
\`\`\`

该方法的参数可以是一个**字符串路径**，或者**一个描述地址的对象**。例如：

\`\`\`js
// 字符串
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由
router.push({ name: 'user', params: { id: 123 }})

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
router.replace//能根据历史返回
\`\`\`

## 历史记录

\`\`\`vue
<div @click='$router.back()'></div>
\`\`\`

## 路由守卫

用户访问拦截

1. 所有的路由一旦被匹配到，都会先经过全局前置守卫

2. 只有全局前置守卫放行，才会真正解析渲染组件，才能看到页面内容

\`\`\`jsx
//router/index.js
router.beforeEach((to, from, next) => {
  // 1. to   往哪里去， 到哪去的路由信息对象  
  // 2. from 从哪里来， 从哪来的路由信息对象
  // 3. next() 是否放行
  //    如果next()调用，就是放行
  //    next(路径) 拦截到某个路径页面
})
\`\`\`

\`\`\`jsx
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})
\`\`\`

\`\`\`js
const authUrls = ['/pay', '/myorder']

router.beforeEach((to, from, next) => {
  // console.log(to, from, next)
  // 看 to.path 是否在 authUrls 中出现过
  if (!authUrls.includes(to.path)) {
    // 非权限页面，直接放行
    next()
    return
  }

  // 是权限页面，需要判断token
  const token = store.getters.token
  if (token) {
    next()
  } else {
    next('/login')
  }
})
\`\`\`









# vuex

## 概述

> 是什么

vuex是vue的一个数据管理工具，可以管理vue通用的数据（多组件共享的数据）

> 场景

1. 某个数据 在 很多个组件来使用（个人信息）
2. 多个组价 共同维护 一份数据（购物车）

> 优势

![image-20230901181503353](./vue.assets/image-20230901181503353.png)

1. 共同维护一份数据，数据集中化管理
2. 响应式变化
3. 操作简洁（vuex提供了一些辅助函数）

## 简单使用

store/index.js

> 创建一个空仓库

\`\`\`js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
\`\`\`

> 调用

\`\`\`js
this.$store
\`\`\`

## state状态

<img src="./vue.assets/image-20230901192836131.png" alt="image-20230901192836131" style="zoom:80%;" />

<img src="./vue.assets/image-20230901192938115.png" alt="image-20230901192938115" style="zoom: 80%;" />

![image-20230901193508887](./vue.assets/image-20230901193508887.png)

\`\`\`js
computed: {
    hidden() {
      return this.$store.state.menu.hidden;
    },
  },
//实时更新，用data不会及时更新，computed会检测数据变化      
\`\`\`

> vue router

我们通常在vue中获取vuex中的数据，使用的是this.$store的方式来获取，但是在vue-router的路由守卫中，this并不是指向vue实例的，这个时候我们就需要变通一下了，例如，在main.js中，使用路由守卫，并在路由守卫中获取vuex中的数据可以像下图这样： 1.import vuex的实例。

\`\`\`js
js
复制代码import vuex from './store/index';
\`\`\`

2.在路由守卫中使用import进来的vuex实例.state的方式获取到vuex中的数据：

\`\`\`js
js复制代码router.beforeEach( (to, from, next) => {
    if(from.path === '/preview'){
    // vuex.state === this.$store.state
        console.log(vuex.state.stage)
    next()
})
\`\`\`

这样就可以在路由守卫中获取到vuex的值了。

。

## mutations

修改数据 符合规范不用也行

 ![image-20230901194553824](./vue.assets/image-20230901194553824.png)

![image-20230901194812184](./vue.assets/image-20230901194812184.png)

![image-20230901195322328](./vue.assets/image-20230901195322328.png)

 ## actions

目标：处理异步操作

需求：一秒钟后，修改state的count为666

一般axios请求放在这里

<img src="./vue.assets/image-20230901200223725.png" alt="image-20230901200223725" style="zoom: 63%;" />

## getter

计算属性

<img src="./vue.assets/image-20230901201017197.png" alt="image-20230901201017197" style="zoom: 80%;" />

##  module

![image-20230901201616835](./vue.assets/image-20230901201616835.png)

![image-20230901202626587](./vue.assets/image-20230901202626587.png)

# 项目流程

## 1.创建项目vue-cli

- babel、router、vuex、css、linter

- vue2

- hash模式

- less

## 2.调整目录

<img src="./vue.assets/image-20230901215434654.png" alt="image-20230901215434654" style="zoom: 80%;" />

- api：axios
- utils：工具类

## 3.vant组件库

> 其他Vue组件库

![image-20230902192420448](./vue.assets/image-20230902192420448.png)

> Vant

<img src="./vue.assets/image-20230902192537578.png" alt="image-20230902192537578"  />

### 1. 安装

\`\`\`bash
# Vue 3 项目，安装最新版 Vant：
npm i vant -S

# Vue 2 项目，安装 Vant 2：
npm i vant@latest-v2 -S
\`\`\`

\`\`\`vue
<!-- 引入样式文件 -->
<link
  rel="stylesheet"
  href="https://unpkg.com/vant@2.12/lib/index.css"
/>

<!-- 引入 Vue 和 Vant 的 JS 文件 -->
<script src="https://unpkg.com/vue@2.6/dist/vue.min.js"><\/script>
<script src="https://unpkg.com/vant@2.12/lib/vant.min.js"><\/script>

<script>
  // 在 #app 标签下渲染一个按钮组件
  new Vue({
    el: '#app',
    template: \`<van-button>按钮</van-button>\`,
  });

  // 调用函数组件，弹出一个 Toast
  vant.Toast('提示');

  // 通过 CDN 引入时不会自动注册 Lazyload 组件
  // 可以通过下面的方式手动注册
  Vue.use(vant.Lazyload);
<\/script>
\`\`\`

\`\`\`bash
#vue-cli
vue ui
\`\`\`

### 2. 引入组件

自动按需引入组件

\`\`\`js
//main.js
//全部导入
import Vant from "vant";
import 'vant/lib/index.css'

Vue.use(Vant);
\`\`\`

\`\`\`vue
<van-button type="primary">主要按钮</van-button>
<van-button type="info">信息按钮</van-button>
\`\`\`

---

\`按需导入\`

\`\`\`bash
#安装插件
npm i babel-plugin-import -D
\`\`\`

\`\`\`js
//babel.config.js
module.exports = {
  presets:['@vue/cli-plugin-babel/preset'],  
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
};
\`\`\`

\`\`\`js
//main.js
import { Button } from "vant";

Vue.use(Button);
\`\`\`

\`\`\`vue
<!-- .vue -->
<van-button type="primary">主要按钮</van-button>
<van-button type="info">信息按钮</van-button>
\`\`\`

### 3.vw适配

基于postcss插件，实现项目vw适配

设置好标准，使用时用px就行，编译会将px转成vw 

\`\`\`bash
npm i postcss-px-to-viewport@1.1.1 -D
\`\`\`

\`\`\`js
//postcss.config.js
module.exports = {
  plugins: {
    "postcss-px-to-viewport": {
      viewportWidth: 375,
    },
  },
};

\`\`\`

## 4.路由设计配置

**目标**：分析项目页面，设计路由，配置一级路由

但凡是单个页面，独立展示的，都是一级路由

![image-20230902205558494](./vue.assets/image-20230902205558494.png)

























# 实用技能

## 加载时页面

实现：

1. 准备一个loading类，通过伪元素定位，设置宽高，实现蒙层
2. 开启关闭loading状态，本质只需要添加移除类即可
3. 结合自定义指令的语法进行封装复用

\`\`\`css
.loading::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #fff url() no-repeat center;
}
\`\`\`

\`\`\`vue
<script>
import LoadingCat from "./components/Loading-cat.vue";

export default {
  name: "App",
  components: {
    LoadingCat,
  },
  data() {
    return {
      isLoading: true,
    };
  },
  created() {
    setTimeout(() => {
      console.log(11);
      this.isLoading = false;
    }, 5000);
  },
  // directives: {
  //   loading: {
  //     //初始状态
  //     inserted(el, binding) {
  //       binding.value
  //         ? el.classList.add("loading")
  //         : el.classList.remove("loading");
  //     },
  //     update(el, binding) {
  //       binding.value
  //         ? el.classList.add("loading")
  //         : el.classList.remove("loading");
  //     },
  //   },
  // },
};
<\/script>
    
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
      
    <LoadingCat :class="{ loading: isLoading }"></LoadingCat>
    <!-- <LoadingCat v-loading="isLoading"></LoadingCat> -->
  </div>
</template>
\`\`\`

## 组件缓存

![image-20230831214330212](./vue.assets/image-20230831214330212.png)

![image-20230831214656038](./vue.assets/image-20230831214656038.png)

写的是组件名

![image-20230831221229623](./vue.assets/image-20230831221229623.png)

## 文字溢出省略号

![image-20230902220644901](./vue.assets/image-20230902220644901.png)

## 项目

1. api接口模块
2. vant toast浮窗提示

## 倒计时

![image-20230903191001053](./vue.assets/image-20230903191001053.png)

![image-20230903191415107](./vue.assets/image-20230903191415107.png)

## 打包

\`\`\`bash
npm run build
#/dist
\`\`\`

![image-20230904190535381](./vue.assets/image-20230904190535381.png)

优化

![image-20230904192028567](./vue.assets/image-20230904192028567.png)



## element-ui

\`\`\`bash
npm i element-ui -S
\`\`\`

按需引入

\`\`\`bash
npm install babel-plugin-component -D
\`\`\`

然后，将 .babelrc 修改为：

\`\`\`json
module.exports = {
  presets: ["@vue/cli-plugin-babel/preset", ["@babel/preset-env", { modules: false }]],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk",
      },
    ],
  ],
};

\`\`\`

接下来，如果你只希望引入部分组件，比如 Button 和 Select，那么需要在 main.js 中写入以下内容

\`\`\`js
import Vue from 'vue';
import { Button, Select } from 'element-ui';
import App from './App.vue';

Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
/* 或写为
 * Vue.use(Button)
 * Vue.use(Select)
 */

new Vue({
  el: '#app',
  render: h => h(App)
});
\`\`\`

















## element-plus 使用技巧

看vue3项目	





## props 传对象

[vue props中定义多属性对象_vue props 定义object_悟世君子的博客-CSDN博客](https://blog.csdn.net/wsjzzcbq/article/details/120851968)



## Vditor

[Markdown编辑器Vditor的基本使用以及在Vue3中使用_秋天code的博客-CSDN博客](https://blog.csdn.net/weixin_55697693/article/details/131618403)

[Vditor 一款浏览器端的 Markdown 编辑器，支持所见即所得（富文本）、即时渲染（类似 Typora）和分屏 - 链滴 (ld246.com)](https://ld246.com/article/1549638745630)

[Demo 示例 - Vditor (b3log.org)](https://b3log.org/vditor/demo/index.html)



## markdown 渲染

[如何在前端渲染 markdown？ - SegmentFault 思否](https://segmentfault.com/q/1010000013941456)

[标记的文档 (marked.js.org)](https://marked.js.org/#installation)

[vue中使用marked+highlight.js实现代码高亮效果_marked-highlight_物语、的博客-CSDN博客](https://blog.csdn.net/qq_41965819/article/details/110500535)

[Class private methods are not enabled. Please add @babel/plugin-transform-private-methods to your co_Nimotip的博客-CSDN博客](https://blog.csdn.net/Nimotip/article/details/131047584)



## 表格校验

用 \`async-validator\` 是首选（Element Plus 底层用的就是它，你的 \`loginRules\` 几乎不用改）。

纯手写也可以，但比较繁琐。

直接看改造方案：

### 方案 A：使用 \`async-validator\`（推荐，最省事）

**1. 安装**
\`\`\`bash
npm install async-validator
\`\`\`

**2. 改造代码**
\`\`\`vue
<script setup>
import Schema from 'async-validator'
import { ref, reactive } from 'vue'

const loginForm = ref({ account: '', password: '' })

// 错误信息存储
const errors = reactive({ account: '', password: '' })

// 规则对象（和你原来几乎一样）
const rules = {
  account: [
    { required: true, message: '请输入用户名或邮箱' },
    {
      validator: (rule, value, callback) => {
        const isEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(value)
        const isUsername = value.length >= 2 && value.length <= 40
        if (!value) return callback(new Error('请输入用户名或邮箱'))
        if (!isEmail && !isUsername) return callback(new Error('格式有误'))
        callback()
      },
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码' },
    { pattern: /^\\S{6,15}$/, message: '密码必须是 6-15位 的非空字符' }
  ]
}

// 创建校验器
const validator = new Schema(rules)

// 单独校验某个字段（用于 blur 触发）
const validateField = async (field) => {
  try {
    await validator.validate({ [field]: loginForm.value[field] }, { firstFields: true })
    errors[field] = ''
  } catch (err) {
    errors[field] = err.errors[0].message
  }
}

// 提交时全量校验
const login = async () => {
  try {
    await validator.validate(loginForm.value)
    // 校验通过，执行登录
    userLoginService(loginForm.value).then(...)
  } catch (err) {
    console.log('校验失败', err)
  }
}
<\/script>

<template>
  <form @submit.prevent="login">
    <div>
      <input v-model="loginForm.account" @blur="validateField('account')" placeholder="账号" />
      <span v-if="errors.account">{{ errors.account }}</span>
    </div>
    <div>
      <input v-model="loginForm.password" @blur="validateField('password')" type="password" placeholder="密码" />
      <span v-if="errors.password">{{ errors.password }}</span>
    </div>
    <button type="submit">登录</button>
  </form>
</template>
\`\`\`

---

### 方案 B：纯手写（零依赖）

如果规则很简单，不想装包，自己写：

\`\`\`js
const errors = reactive({ account: '', password: '' })

const validateAccount = () => {
  const val = loginForm.value.account
  if (!val) { errors.account = '请输入用户名或邮箱'; return false }
  // ... 正则判断
  if (格式错误) { errors.account = '格式有误'; return false }
  errors.account = ''
  return true
}

const validatePassword = () => {
  const val = loginForm.value.password
  if (!val) { errors.password = '请输入密码'; return false }
  if (!/^\\S{6,15}$/.test(val)) { errors.password = '密码必须是 6-15位 的非空字符'; return false }
  errors.password = ''
  return true
}

const login = () => {
  if (validateAccount() && validatePassword()) {
    // 提交
  }
}
\`\`\`

**总结**：选 \`async-validator\`，你的 \`loginRules\` 可以原封不动搬过去，逻辑最一致。





### 方案C：VeeValidate + Zod

VeeValidate 搭配 Zod 的核心用法，就是把 Zod 的校验规则转换成 VeeValidate 能识别的“Schema”，然后通过 \`useForm\` 和 \`useField\` 等 Composition API 来管理表单状态和校验。

#### 📦 1. 安装依赖

首先，需要安装三个核心包：VeeValidate、Zod，以及连接它们的桥梁包。

\`\`\`bash
# 使用 pnpm
pnpm add vee-validate zod @vee-validate/zod

# 或使用 npm
npm install vee-validate zod @vee-validate/zod
\`\`\`

#### ✍️ 2. 定义 Zod Schema

这是最关键的一步。你需要用 Zod 的语法来描述表单数据的规则和自定义错误信息。

\`\`\`typescript
import { z } from 'zod';

// 定义表单的校验规则
const loginSchema = z.object({
  email: z
    .string({ required_error: '请输入邮箱' }) // 自定义“必填”错误
    .email('邮箱格式不正确'),
  password: z
    .string({ required_error: '请输入密码' })
    .min(6, '密码长度至少为6位')
    .max(15, '密码长度不能超过15位'),
});

// 从 Schema 中自动推导出表单数据的 TypeScript 类型
type LoginForm = z.infer<typeof loginSchema>;
\`\`\`

> **注意**：自定义“必填”错误信息时，需要在 \`z.string()\` 中通过 \`required_error\` 参数传入。

#### 🔗 3. 在 \`useForm\` 中绑定 Schema

使用 \`toTypedSchema\` 函数将 Zod Schema 转换后，传给 \`useForm\` 的 \`validationSchema\` 选项。

\`\`\`typescript
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { loginSchema } from './schema'; // 假设 Schema 定义在单独文件中

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  // 可以在这里提供初始值
  initialValues: {
    email: '',
    password: '',
  },
});

// 定义提交处理函数
const onSubmit = handleSubmit((values) => {
  // values 已经通过 Zod 校验，并且有完整的 TypeScript 类型
  console.log('表单提交成功:', values);
});
\`\`\`

#### 🧩 4. 在模板中绑定字段

在 \`<script setup>\` 中，使用 \`defineField\` 来获取每个字段的值和属性。

\`\`\`vue
<template>
  <form @submit="onSubmit">
    <div>
      <label>邮箱</label>
      <input v-model="email" type="email" v-bind="emailAttrs" />
      <span v-if="errors.email">{{ errors.email }}</span>
    </div>

    <div>
      <label>密码</label>
      <input v-model="password" type="password" v-bind="passwordAttrs" />
      <span v-if="errors.password">{{ errors.password }}</span>
    </div>

    <button type="submit">登录</button>
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { loginSchema } from './schema';

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(loginSchema),
});

// 获取 email 字段的 value 和属性
const [email, emailAttrs] = defineField('email');
// 获取 password 字段的 value 和属性
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit((values) => {
  console.log(values);
});
<\/script>
\`\`\`

#### 💡 补充说明

*   **字段级校验**：如果只想校验单个字段，可以将 Zod Schema 传给 \`useField\` 的第二个参数，而不是在 \`useForm\` 中定义整个表单的 Schema。
*   **表单级校验**：上面示例中展示的就是表单级校验，它会校验所有字段，并在提交时触发。

#### 💎 总结

整个过程可以概括为：**定义 Zod Schema → 用 \`toTypedSchema\` 转换 → 在 \`useForm\` 中绑定 → 在模板中用 \`defineField\` 绑定字段**。这样做的好处是，你的表单校验逻辑和 TypeScript 类型是完全同步的，可以获得很好的开发体验。











# Vue3

## 概述

![image-20230904193344628](./vue.assets/image-20230904193344628.png)

> 选项式 vs 组合式

![image-20230904194901075](./vue.assets/image-20230904194901075.png)

![image-20230904195029898](./vue.assets/image-20230904195029898.png)

## 构建项目

![image-20230904200718961](./vue.assets/image-20230904200718961.png)

![image-20230904200800028](./vue.assets/image-20230904200800028.png)









## 项目结构

![image-20230904202746774](./vue.assets/image-20230904202746774.png)

## 组合式api

### setup

1. ![image-20230904211652618](./vue.assets/image-20230904211652618.png)

2. 获取不到this

![image-20230904212140068](./vue.assets/image-20230904212140068.png)

![image-20230904212622920](./vue.assets/image-20230904212622920.png)

### reactive

使数据支持响应式

<img src="./vue.assets/image-20230904213414673.png" alt="image-20230904213414673" style="zoom: 67%;" />

### ref

![image-20230904213608418](./vue.assets/image-20230904213608418.png)

![image-20230904214208157](./vue.assets/image-20230904214208157.png)

### computed

![image-20230904221243600](./vue.assets/image-20230904221243600.png)

### watch

![image-20230904223756207](./vue.assets/image-20230904223756207.png)

<img src="./vue.assets/image-20230905141316496.png" alt="image-20230905141316496" style="zoom: 33%;" />

配置项

<img src="./vue.assets/image-20230905141916156.png" alt="image-20230905141916156" style="zoom:33%;" />

### 生命周期

![image-20230905143213015](./vue.assets/image-20230905143213015.png)

![image-20230905143454416](./vue.assets/image-20230905143454416.png)

### 父子通信

> 父传子

![image-20230905143553279](./vue.assets/image-20230905143553279.png)

直接{{调用}}

> 子传父

![image-20230905145718089](./vue.assets/image-20230905145718089.png)

### 模板引用

![image-20230905150701242](./vue.assets/image-20230905150701242.png)

### 暴露内部属性

![image-20230905152233990](./vue.assets/image-20230905152233990.png)

### 跨层级传递

<img src="./vue.assets/image-20230905152720650.png" alt="image-20230905152720650" style="zoom:50%;" /><img src="./vue.assets/image-20230905152742872.png" alt="image-20230905152742872" style="zoom: 50%;" />

![image-20230905153454293](./vue.assets/image-20230905153454293.png)

![image-20230905153507373](./vue.assets/image-20230905153507373.png)

### defineOptions

![image-20230905153705991](./vue.assets/image-20230905153705991.png)

![image-20230905154057558](./vue.assets/image-20230905154057558.png)

## Pinia

### 概述

Vuex的替代品

![image-20230905154851829](./vue.assets/image-20230905154851829.png)

### 使用

main.js

![image-20230905160041153](./vue.assets/image-20230905160041153.png)

### store

![image-20230905161500219](./vue.assets/image-20230905161500219.png)

![image-20230905161159650](./vue.assets/image-20230905161159650.png)

![image-20230905161646877](./vue.assets/image-20230905161646877.png)

### action

![image-20230905162818110](./vue.assets/image-20230905162818110.png)

### 持久化

![image-20230905163003941](./vue.assets/image-20230905163003941.png)

![image-20230905163242717](./vue.assets/image-20230905163242717.png)

![image-20230905164226900](./vue.assets/image-20230905164226900.png)

# vue3 项目

## 概述

![image-20230905164735568](./vue.assets/image-20230905164735568.png)

## 准备工作

### 创建项目

![image-20230905165150536](./vue.assets/image-20230905165150536.png)

![image-20230905165529213](./vue.assets/image-20230905165529213.png)

### Eslint 配置代码风格

### 配置代码检查工作流

husky

### 目录调整



### vue-router4 路由代码解析

<img src="./vue.assets/image-20230905175433343.png" alt="image-20230905175433343" style="zoom:150%;" />

![image-20230905180034806](./vue.assets/image-20230905180034806.png)

### 导入element-plus

element-plus for vue3

![image-20230905181104502](./vue.assets/image-20230905181104502.png)

![image-20230905181153570](./vue.assets/image-20230905181153570.png)

<img src="./vue.assets/image-20230905181232796.png" alt="image-20230905181232796" style="zoom: 67%;" />

<img src="./vue.assets/image-20230905181438790.png" alt="image-20230905181438790" style="zoom:50%;" />

\`可直接使用自己写的组件不用import\`

import 'element-plus/dist/index.css'



### Pinia

\`\`\`js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const setToken = (newToken) => {
    token.value = newToken
  }

  const removeToken = () => {
    token.value = ''
  }

  return {
    token,
    setToken,
    removeToken
  }
})
\`\`\`

设置持久化	

### axios 数据交互

![image-20230905190047750](./vue.assets/image-20230905190047750.png)

\`\`\`js
import axios from 'axios'
import { useUserStore } from '../stores/user.js'
import { ElMessage } from 'element-plus'
import { router } from 'vue-router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  baseURL,
  timeout: 5000
})

instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }

    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    data = res.data
    if (data.code === 0) {
      return res
    }

    ElMessage.error(data.message || '服务器繁忙')
  },
  (err) => {
    //401 token过期
    if (err.response.status === 401) {
      router.push('/login')
    }

    return Promise.reject(data)

    ElMessage.error(err.response.data.message || '服务器繁忙')

    return Promise.reject(err)
  }
)
export default instance
\`\`\`


### 整体路由设计

![image-20230905194749074](./vue.assets/image-20230905194749074.png)

\`\`\`js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user.js'

// createRouter 创建路由实例
// 配置 history 模式
// 1. history模式：createWebHistory     地址栏不带 #
// 2. hash模式：   createWebHashHistory 地址栏带 #
// console.log(import.meta.env.DEV)

// vite 中的环境变量 import.meta.env.BASE_URL  就是 vite.config.js 中的 base 配置项
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }, // 登录页
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

// 登录访问拦截 => 默认是直接放行的
// 根据返回值决定，是放行还是拦截
// 返回值：
// 1. undefined / true  直接放行
// 2. false 拦回from的地址页面
// 3. 具体路径 或 路径对象  拦截到对应的地址
//    '/login'   { name: 'login' }
router.beforeEach((to) => {
  // 如果没有token, 且访问的是非登录页，拦截到登录，其他情况正常放行
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') return '/login'
})

export default router

\`\`\`

​	

# JSX

![image-20240817174824961](./vue.assets/image-20240817174824961.png)

# 文件路由

Vue Router v5

Vue Router现在也默认支持文件路由了，就像Nuxt/Next那样！(由unplugin-vue-router提供支持)

https://www.kimi.com/chat/19e95fb2-aab2-88b1-8000-096b361dcf2c?chat_enter_method=new_chat





# Vue-TS

[TypeScript + Vue 3 实战：现代前端开发最佳实践 | 大木头WU的技术博客](https://wuxy1997.github.io/2026/01/07/2026-01-07-typescript-vue3-best-practices/#1-使用-Composition-API)

## 1. JS 和 TS 常用写法对照

| 场景         | JS 写法                                                | TS 写法                                                      |
| ------------ | ------------------------------------------------------ | ------------------------------------------------------------ |
| ref          | \`const count = ref(0)\`                                 | \`const count = ref<number>(0)\` 或直接 \`ref(0)\` 自动推断      |
| reactive     | \`const user = reactive({ name: '' })\`                  | \`interface User { name: string }\`<br>\`const user = reactive<User>({ name: '' })\` |
| props        | \`defineProps({ title: String })\`                       | \`defineProps<{ title: string; count?: number }>()\`           |
| props 默认值 | \`defineProps({ count: { type: Number, default: 0 } })\` | \`withDefaults(defineProps<Props>(), { count: 0 })\`           |
| emits        | \`defineEmits(['change'])\`                              | \`defineEmits<{ change: [value: number] }>()\`                 |
| 事件参数     | \`function handle(e) {}\`                                | \`function handle(e: MouseEvent) {}\`                          |
| 模板 ref     | \`const inputRef = ref(null)\`                           | \`const inputRef = ref<HTMLInputElement \\| null>(null)\`       |
| computed     | \`const double = computed(() => count.value * 2)\`       | 一般自动推断，也可 \`computed<number>(...)\`                   |

## 2. 一个完整 TS 组件示例

\`\`\`vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

const emit = defineEmits<{
  change: [value: number]
}>()

const num = ref(props.count)
const double = computed(() => num.value * 2)

function add() {
  num.value++
  emit('change', num.value)
}
<\/script>

<template>
  <h1>{{ title }}</h1>
  <p>{{ double }}</p>
  <button @click="add">+1</button>
</template>
\`\`\`

对应以前的 JS，大概就是：

\`\`\`vue
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: String,
  count: { type: Number, default: 0 }
})

const emit = defineEmits(['change'])

const num = ref(props.count)
const double = computed(() => num.value * 2)

function add() {
  num.value++
  emit('change', num.value)
}
<\/script>
\`\`\`



## 3. 几个最常用 TS 写法

### props

\`\`\`ts
interface Props {
  title: string
  count?: number
  user: {
    name: string
    age?: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})
\`\`\`

模板里可以直接用：

\`\`\`vue
<h1>{{ title }}</h1>
\`\`\`

脚本里用：

\`\`\`ts
console.log(props.title)
\`\`\`

### emits

Vue 3.3+ 推荐：

\`\`\`ts
const emit = defineEmits<{
  change: [value: number]
  submit: [payload: { name: string }]
}>()

emit('change', 1)
emit('submit', { name: 'Tom' })
\`\`\`

旧版本可以这样：

\`\`\`ts
const emit = defineEmits<{
  (e: 'change', value: number): void
  (e: 'submit', payload: { name: string }): void
}>()
\`\`\`

### ref 和 reactive

\`\`\`ts
import { ref, reactive } from 'vue'

const count = ref<number>(0)

interface User {
  name: string
  age?: number
}

const user = reactive<User>({
  name: 'Tom'
})
\`\`\`

### 事件类型

\`\`\`ts
function handleClick(e: MouseEvent) {
  console.log(e.target)
}

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  console.log(target.value)
}
\`\`\`

模板：

\`\`\`vue
<button @click="handleClick">点击</button>
<input @input="handleInput" />
\`\`\`

### 模板 ref

\`\`\`ts
import { ref } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)

function focusInput() {
  inputRef.value?.focus()
}
\`\`\`

模板：

\`\`\`vue
<input ref="inputRef" />
<button @click="focusInput">聚焦</button>
\`\`\`

### 组件实例类型

\`\`\`ts
import { ref } from 'vue'
import MyComponent from './MyComponent.vue'

const myRef = ref<InstanceType<typeof MyComponent> | null>(null)
\`\`\`

### 插槽类型

Vue 3.3+：

\`\`\`ts
defineSlots<{
  default?: (props: { item: string }) => any
  header?: (props: { title: string }) => any
}>()
\`\`\`

## 4. 从 JS 迁移到 TS 的建议

1. 把 \`<script setup>\` 改成 \`<script setup lang="ts">\`。
2. 先让项目能跑，不要一上来全写类型。
3. 优先给这些地方加类型：
   - props
   - emits
   - 接口数据
   - 函数参数
   - ref 复杂类型
4. 不懂的地方先写 \`any\`，但别长期滥用。
5. 用 \`vue-tsc --noEmit\` 做类型检查。
6. 类型可以统一放 \`src/types.ts\` 或 \`src/types/index.ts\`。

## 5. 容易踩的坑

- 模板里 \`ref\` 自动解包，不用写 \`.value\`。
- 脚本里 \`ref\` 要写 \`.value\`。
- \`defineProps\`、\`defineEmits\`、\`withDefaults\` 不需要 import。
- 可选属性用 \`?\`，比如 \`count?: number\`。
- 联合类型用 \`|\`，比如 \`string | number\`。
- 类型断言用 \`as\`，比如 \`e.target as HTMLInputElement\`。
- 非空断言 \`!\` 少用，优先 \`?.\` 和 \`if\` 判断。



































`;export{n as default};
