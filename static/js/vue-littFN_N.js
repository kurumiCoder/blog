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

## 指令基础

### 内容指令

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

### 渲染指令

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

### 属性指令

\`\`\`html
<!-- data传给v-bind,单向 -->
<div v-bind:title="title">这是内容</div>
<!--只能用在表单类元素（输入类元素）-->
<div v-model:title="titleData">这是内容</div>
\`\`\`

### 事件指令

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

### 表单指令

\`\`\`html
<!--双向绑定 v-model= :value @input-->
<input type="text" v-model="">
\`\`\`

v-model = props（:value | :modelValue） + emit

\`\`\`vue
// 父
<vueModelCom v-model="flag"/>

// 子
<script setup lang="ts">
defineProps<{
    modelValue: boolean
}>()
defineEmits(['update:modelValue'])
    
    
<\/script>
\`\`\`







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



## 响应式

[小满Vue3（进阶 响应式原理源码实现）_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1dS4y1y7vd/?p=10)

























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

## 文件路由（新）

Vue Router v5

Vue Router现在也默认支持文件路由了，就像Nuxt/Next那样！(由unplugin-vue-router提供支持)

https://www.kimi.com/chat/19e95fb2-aab2-88b1-8000-096b361dcf2c?chat_enter_method=new_chat









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

## 组件缓存 keep-alive

![image-20230831214330212](./vue.assets/image-20230831214330212.png)

![image-20230831214656038](./vue.assets/image-20230831214656038.png)

写的是组件名

![image-20230831221229623](./vue.assets/image-20230831221229623.png)

<keep-alive&gt; 把不活跃的组件**缓存**起来而不是销毁，切回来时直接复用，
保留组件状态（表单内容、滚动位置等），避免重复渲染。

典型场景：Tab 切换、列表页 ↔ 详情页来回跳转，保持筛选条件和滚动位置。

#### 使用场景

> 适合

1. **列表页 ↔ 详情页来回跳**（移动端最典型）：返回列表时不重新请求、不丢滚动位置、不丢筛选条件
2. **多 Tab 切换**：如首页底部导航的多个页面（你的 H5 项目大概率就是这种）
3. **重交互页面**：表单填了一半去别的页面，回来要保留

> 不适合

| 场景                     | 原因                                             |
| ------------------------ | ------------------------------------------------ |
| 后台管理系统             | 每次进入都希望拿到最新数据，缓存了反而看到旧数据 |
| 详情页/支付页/表单提交页 | 必须每次重新初始化，缓存出 bug                   |
| 页面少、跳转简单的项目   | 缓存收益约等于零，白占内存                       |
| 数据实时性要求高的页面   | 缓存 = 脏数据风险                                |

> 全量

你截图的写法会让**所有访问过的路由组件都被缓存**，内存越攒越多。更常见的精细化写法：

\`\`\`vue
<router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component" v-if="$route.meta.keepAlive" />
  </keep-alive>
  <component :is="Component" v-if="!$route.meta.keepAlive" />
</router-view>
\`\`\`

路由里按需标记：

\`\`\`ts
{
  path: '/list',
  component: () => import('@/views/List.vue'),
  meta: { keepAlive: true }  // 只有需要缓存的页面才标
}
\`\`\`









#### 生命周期变化（重点）

初次进入：onMounted → onActivated
离开时（缓存不销毁）：onDeactivated，不走onUnmmounted
再次进入（复用缓存）：只触发 onActivated，不再走 onMounted

实践原则：
- 只执行一次的事（初始化、定时器、订阅）→ 放 onMounted
- 每次进入都要做的事（刷新数据）→ 放 onActivated
- 离开暂停但不销毁 → onDeactivated

#### Props

&lt;keep-alive :include="['ListA', 'DetailB']" :exclude="/Editor/" :max="10"&gt;
  &lt;component :is="view" /&gt;
&lt;/keep-alive&gt;

- include：名称匹配的组件会被缓存
- exclude：名称匹配的组件不会被缓存
- max：最多缓存几个实例，超出后最久未使用的被剔除（LRU）
- include/exclude 支持字符串、正则、数组
- ⚠️ 匹配的是组件的 name，不是路由名！
  &lt;script setup&gt; 组件要用 defineOptions({ name: 'ListA' }) 显式声明

#### 坑点清单

1. 匹配靠 name：&lt;script setup&gt; 没有 name，不声明 defineOptions 则 include 失效
2. 要求单个直接子节点，多根节点组件不能缓存
3. 配合 router-view 时 include 匹配的是页面组件的 name，不是路由 name
4. max 淘汰最久未访问的（LRU），不是先存先出
5. 被缓存组件的 DOM 在隐藏容器里，别用 querySelector 去找

#### 关联知识点

- router-view + keep-alive：经典缓存方案
- &lt;Transition&gt;：缓存也能带动画（process 处理了 transition hooks）
- LRU 策略：Map + Set 的经典工程实现











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











# Vue3（高阶）

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

\`\`\`typescript
export declare function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
\`\`\`

❌️

<img src="vue.assets/image-20261017140928464.png" alt="image-20261017140928464" style="zoom:67%;" />

✅️

\`\`\`js
list.push(...res)
\`\`\`

> shallowReactive 

不会更新

![image-20261017141318748](vue.assets/image-20261017141318748.png)

影响层次只到foo

![image-20261017141413786](vue.assets/image-20261017141413786.png)











### ref

![image-20230904213608418](./vue.assets/image-20230904213608418.png)

![image-20230904214208157](./vue.assets/image-20230904214208157.png)

> shallowRef

ref 深层次 shallowRef浅层次的响应

指的是value会变，但是响应update没有

ref和shallowRef不能一起写，因为会引起视图update，导致shallowRef失效

> triggerRef

\`\`\`js
triggerRef(Man2)
// ref视图更新底层，会强制update 
\`\`\`

> customRef

![image-20261017135252212](vue.assets/image-20261017135252212.png)

> ref dom

\`\`\`react
<div ref="dom"></div>


const dom = ref<HTMLDivElement>()
\`\`\`





### Effect

**\`effect\` 就是一个“会自动重跑的函数”**——它执行时读了哪些响应式数据，Vue 就记住；那些数据一变，Vue 就自动再跑一遍这个函数。

\`\`\`js
const count = ref(0)

effect(() => {
  console.log(count.value)
})
// 打印 0

count.value = 1
// 自动再打印 1
\`\`\`

平时你**不用直接写 \`effect\`**，用 \`watchEffect\` 就是它最直接的用法：

\`\`\`js
watchEffect(() => {
  console.log(count.value) // count 变了就自动重跑
})
\`\`\`

一句话：**effect = 被 Vue 盯着依赖、依赖一变就自动重新执行的函数**。组件的自动更新、\`computed\`、\`watchEffect\` 底层都是它。



### computed

计算属性就是当依赖的属性的值发生变化的时候，才会触发更改，不发生变化时，使用cache

![image-20230904221243600](./vue.assets/image-20230904221243600.png)

![image-20261017144151030](vue.assets/image-20261017144151030.png)



### watch

![image-20230904223756207](./vue.assets/image-20230904223756207.png)

<img src="./vue.assets/image-20230905141316496.png" alt="image-20230905141316496" style="zoom: 33%;" />

配置项

<img src="./vue.assets/image-20230905141916156.png" alt="image-20230905141916156" style="zoom:33%;" />

![image-20261017155052444](vue.assets/image-20261017155052444.png)

### Watch Effect

![image-20261017160139662](vue.assets/image-20261017160139662.png)

停止监听

![image-20261017160351040](vue.assets/image-20261017160351040.png)



[学习Vue3 第十一章（认识watchEffect高级侦听器）_vue3 watcheffect oninvalidate-CSDN博客](https://xiaoman.blog.csdn.net/article/details/122802130)



### To-xx

> toRef：只能修改响应式对象的值，非常规响应式视图不会变化

演示：非响应式对象经过toRef之后的变化

<img src="vue.assets/image-20261017141929352.png" alt="image-20261017141929352" style="zoom:67%;" />

![image-20261017141912024](vue.assets/image-20261017141912024.png)

> toRefs

![image-20261017142247958](vue.assets/image-20261017142247958.png)









> toRaw

将响应式对象 -> 普通对象











### 生命周期

![image-20230905143213015](./vue.assets/image-20230905143213015.png)

![image-20230905143454416](./vue.assets/image-20230905143454416.png)



### 动态组件

\`\`\`vue
import A from './A.vue'
import B from './B.vue


<component :is="A"></component>

const tab = reactive<Com[]>([{
    name: "A组件",
    comName: markRaw(A)
}, {
    name: "B组件",
    comName: markRaw(B)
}])
\`\`\`











### 父子通信

> 父传子

![image-20230905143553279](./vue.assets/image-20230905143553279.png)

直接{{调用}}

> 子传父

通过方法

![image-20230905145718089](./vue.assets/image-20230905145718089.png)

暴露参数用defineExpose

[defineExpose-Ts](#defineExpose)

\`子组件\`

![image-20261025165155794](vue.assets/image-20261025165155794.png)

\`父组件\`

![image-20261025165332045](vue.assets/image-20261025165332045.png)



### 兄弟组件传参和Bus



> **方案一：借助父组件当“中间人”**

- **思路**：子组件 A 把数据交给父组件，父组件再通过 \`props\` 传给子组件 B。
- **缺点**：流程绕，父组件被迫充当“传话筒”，代码会比较繁琐。

> **方案二：Event Bus（事件总线）**

- **思路**：利用“发布-订阅”模式。创建一个全局的事件中心，A 组件“发布”事件，B 组件“订阅”该事件，两者通过事件中心直接通信，不再需要父组件介入。
- **本质**：自己实现一个简易的 \`Bus\` 类，核心就是 \`emit\`（触发事件）和 \`on\`（监听事件）两个方法。

> JavaScriptの \`Bus\`

\`\`\`bash
# 发布订阅库
npm install mitt -S
\`\`\`

\`\`\`javascript
// bus.js
import mitt from 'mitt'
export const bus = mitt()
\`\`\`

然后在组件里：

\`\`\`javascript
// A组件：发送
bus.emit('change-color', 'red')

// B组件：接收
bus.on('change-color', (color) => { ... })
\`\`\`

> TypeScriptの \`Bus\`

\`\`\`typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import mitt from 'mitt'

const Mit = mitt()

// TypeScript注册
// 由于必须要拓展ComponentCustomProperties类型才能获得类型提示
declare module "vue" {
  export interface ComponentCustomProperties {
    $Bus: typeof Mit
  }
}

const app = createApp(App)

// Vue3挂载全局API
app.config.globalProperties.$Bus = Mit

app.mount('#app')

\`\`\`

\`\`\`vue
// 组件内
<template>
  <div>
    <h1>我是A</h1>
    <button @click="emit">emit</button>
  </div>
</template>

<script setup lang='ts'>
import {getCurrentInstance} from 'vue'

const instance = getCurrentInstance()

const emit = () => {
  instance?.proxy?.$Bus.emit('on-xiaoman','mitt')
}
<\/script>

<style>
</style>
\`\`\`

\`\`\`vue
<script setup lang='ts'>
import { getCurrentInstance } from 'vue'
const instance = getCurrentInstance()


// 接收所有的key
instance?.proxy?.$Bus.on('*', (type,str) => {
    console.log(type,str, '==========>B')
})
// 删除
$Bus.off(key, function)
$Bus.all.clear()
    
<\/script>

<style>

</style>
\`\`\`









### 模板引用

![image-20230905150701242](./vue.assets/image-20230905150701242.png)

### 暴露内部属性

![image-20230905152233990](./vue.assets/image-20230905152233990.png)

\`\`\`vue
<script setup>
import { ref, onMounted } from 'vue'
import ChildComponent from './ChildComponent.vue'

// 1. 创建一个 ref 变量，名称需与模板中的 ref 属性值一致
const childRef = ref(null)

onMounted(() => {
  // 3. 通过 childRef.value 访问子组件暴露的属性和方法
  console.log(childRef.value.message)    // 输出: Hello from Child
  childRef.value.childMethod()          // 输出: Child method called!
})
<\/script>

<template>
  <!-- 2. 在子组件标签上绑定 ref 属性 -->
  <ChildComponent ref="childRef" />
</template>
\`\`\`





### 跨层级传递

<img src="./vue.assets/image-20230905152720650.png" alt="image-20230905152720650" style="zoom:50%;" /><img src="./vue.assets/image-20230905152742872.png" alt="image-20230905152742872" style="zoom: 50%;" />

![image-20230905153454293](./vue.assets/image-20230905153454293.png)

![image-20230905153507373](./vue.assets/image-20230905153507373.png)

### defineOptions

![image-20230905153705991](./vue.assets/image-20230905153705991.png)

![image-20230905154057558](./vue.assets/image-20230905154057558.png)



### 异步组件 defineAsyncComponent



\`defineAsyncComponent(() => import('...'))\` 实现组件懒加载：首屏不下载，
组件**第一次渲染时**才去加载对应的 chunk。

#### Suspense

\`<Suspense>\` 只是处理异步组件**加载状态的一种方式**，不是前置条件。

\`\`\`vue
<Suspense>
  <template #default>
    <AsyncVue />
  </template>
  <template #fallback>
    <skeletonVue>私有的loading 骨架屏</skeletonVue>
  </template>
</Suspense>


<script setup lang='ts'>
import skeletonVue from './components/skeleton.vue'
// 这个使用顶级await去调用axios
const AysncVue = defineAysncComponent(()=> import('@/components/Async.vue'))
    
<\/script>
\`\`\`

\`\`\`js
// 关键点：<script setup> 中的顶层 await 会让 setup() 变成 async 函数
// setup() 返回 Promise 时，组件必须放在 <Suspense> 的 #default 里，否则不会被渲染
const profile = await fetchProfile()
\`\`\`



三种情况：

1. **想要统一的 loading 状态**，尤其是**嵌套异步组件**——内层组件的加载会"冒泡"到外层 Suspense，一个 fallback 盖住所有，不会层层闪 loading
2. **\`setup()\` 里用了顶层 \`await\`**——这种情况**必须**有 Suspense，否则 Vue 直接警告 \`setup() returned a promise but no Suspense boundary was found\`
3. **SSR 流式渲染**——配合 Suspense 才能实现渐进式输出 HTML





#### 基本用法

\`\`\`ts
import { defineAsyncComponent } from 'vue'

// ❌ 普通导入：打进主 bundle，首屏就加载
import SyncVue from './components/Sync.vue'

// ✅ 异步组件：拆成单独 chunk，用到才下载
const AsyncVue = defineAsyncComponent(() => import('./components/Sync.vue'))
\`\`\`

#### 完整写法：控制加载状态和超时

\`\`\`ts
const AsyncVue = defineAsyncComponent({
  loader: () => import('./components/Sync.vue'), // 加载函数

  loadingComponent: LoadingSpinner, // 加载中显示的组件
  delay: 200,                       // 延迟显示 loading，避免一闪而过

  errorComponent: ErrorBox,         // 加载失败显示的组件
  timeout: 3000,                    // 超时时间（毫秒）
})
\`\`\`

#### 典型场景：tab / 弹窗按需加载

\`\`\`ts
const current = ref('sync')
const AsyncVue = defineAsyncComponent(() => import('./Sync.vue'))
\`\`\`

\`\`\`vue
<!-- v-if 控制首次挂载时机 -->
<button @click="current = 'sync'">
    点我加载
</button>
<component :is="AsyncVue" v-if="current === 'sync'" />
\`\`\`





#### 坑点清单

1. **被 Suspense 包裹时 \`loadingComponent\` 不生效**（默认 suspensible: true），
   loading 由 Suspense 的 #fallback 接管。想保留自己的 loading 要加 suspensible: false。
2. **加载失败不会自动重试**：超时报错后进入 error 状态，重试逻辑要自己写。
3. **SSR 场景**：会等解析完成再输出 HTML，hydration 时注意 chunk 是否已预加载。
4. **错误兜底**：Promise reject 时触发 errorCaptured，可在 app 层统一处理。

#### 命名提醒

异步组件别叫 SyncVue 这种误导性名字，建议 AsyncVue / LazyXxx。

#### 关联知识点

- &lt;Suspense&gt;：Vue 3 内置异步依赖加载状态管理
- 动态 import()：构建工具据此做代码分割
- 路由懒加载：() =&gt; import('views/xxx.vue') 同一原理



### Teleport传送组件



<Teleport> 把模板内容渲染到**任意指定的 DOM 节点**，不受父级 style、v-show 等影响，
但逻辑上仍是原组件的子节点 —— data、props、插槽数据照常共用。类似 React 的 Portal。



#### 解决什么问题

弹窗/Loading 常遇到：父级 overflow:hidden、transform（导致 fixed 失效）、层级被遮挡。

Teleport 直接把内容挂到 body 下，彻底脱离父级样式环境。

典型场景：Dialog / Modal / Toast / Loading 全局挂载。

比如子div的\`absolute\`不受父div的\`relative\`的影响



#### 用法

> 基础：to 指定目标位置

\`\`\`vue
<Teleport to="body">
  <Loading />
</Teleport>

to 支持任意 CSS 选择器（id、class），目标元素需已存在于 DOM：
<Teleport to=".modal">

  <Dialog />

</Teleport>
\`\`\`

![image-20261025210834713](vue.assets/image-20261025210834713.png)

> 多个 Teleport 共存

\`\`\`vue
<Teleport to=".modal1"><Loading /></Teleport>
<Teleport to=".modal2"><Loading /></Teleport>
\`\`\`

> 动态控制：disabled

\`\`\`vue
:disabled="true" 时 to 失效，内容渲染在原位置；false 正常传送：
<teleport :disabled="true" to="body">
  <A />
</teleport>
\`\`\`



 



#### 源码解析（runtime-core）

**入口：patch 分发**
renderer.ts 的 patch 通过 shapeFlag & ShapeFlags.TELEPORT 识别，
调用 TeleportImpl.process()（与 Suspense 同一套分发机制）。

**TeleportImpl 结构**（components/Teleport.ts）：
- process()      创建 + 更新
- remove()       删除
- move: moveTeleport
- hydrate: hydrateTeleport

**process 关键流程**：
1. resolveTarget(props, querySelector)：读 props.to，querySelector 找目标 DOM；
   目标不存在 dev 警告 Invalid Teleport target
2. 先在原位置插入占位节点（placeholder/mainAnchor），保证 vnode 树完整
3. 判断 disabled：
   - disabled → mount(container, mainAnchor) 挂到原位置（to 不生效）
   - 否则 → mount(target, targetAnchor) 挂到目标位置

**TeleportMoveTypes 枚举**：
- TARGET_CHANGE：to 变化，整体搬家
- TOGGLE：enable/disable 切换
- REORDER：目标容器内顺序调整

#### 坑点

1. to 目标必须在挂载时已存在于 DOM，否则渲染不出来（dev 有警告）
2. 传送后 DOM 位置变了，但**事件冒泡仍沿组件树**（不是真实 DOM 树）
   —— 这是"逻辑仍是子组件"的体现
3. scoped 样式不受影响：作用域由 data-v-xxx 属性决定，与 DOM 位置无关
4. SSR 下需 hydration 特殊处理（hydrateTeleport）

#### 关联知识点

- React Portal：同一思想的跨框架版本
- <Suspense>：同为内置特殊组件，同样走 patch 分发 + Impl.process
- Dialog 标准实现：Teleport + 插槽（呼应之前"我在哪儿"插槽问题）









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



## Vue Transition 过渡组件

&lt;Transition&gt; 在元素进入/离开 DOM 时自动添加/移除过渡 class，
时机它控制，样式你写 CSS

### 触发条件

v-if / v-show / 动态组件 / router-view 才会触发。

### 六个 class（核心机制）

进入：v-enter-from（起始）→ v-enter-active（过程）→ v-enter-to（结束）
离开：v-leave-from → v-leave-active → v-leave-to

![image-20261031185250292](vue.assets/image-20261031185250292.png)

\`\`\`vue
<Transition enter-active-class="自定义类名，替代v-enter-active，其他同理，可以用animate.css的类">
  <div v-if="show" class="box">
      内容
    </div>
</Transition>

<style>
.box{        
    width: 200px;
    height: 200px;
}    
    
    
.v-enter-from {opacity: 0 }
.v-enter-active { transition: opacity .5s }
.v-leave-to { 
    // 一般不写，直接用.box原样式
    opacity: 0
}
.v-leave-active { transition: opacity .5s }
</style>
\`\`\`



name="fade" 则前缀变成 .fade-enter-from 等。

### 联动Animate.css

https://animate.style/

\`\`\`bash
pnpm install animate.css
\`\`\`

在main.ts中引入







### 常用属性

- mode="out-in"：先走后来（互切推荐，防抖动）
- mode="in-out"：先来后走
- appear：初次渲染也过渡
- :duration="{ enter: 500, leave: 800 }"：显式时长

### JS 钩子（配 GSAP 等）

@before-enter / @enter（要调 done()）/ @after-enter / 离开同理
纯 JS 动画加 :css="false" 跳过 class 检测



### TransitionGroup（列表）

&lt;Transition&gt; 只支持单根；v-for 列表用 &lt;TransitionGroup&gt;：
- 子元素必须有 key
- 默认渲染 span，用 tag="ul" 指定标签，在外面包一层
- move-class：换位过渡（FLIP 动画）

&lt;TransitionGroup name="list" tag="ul"  move-class="mmm"&gt;
  &lt;li v-for="item in items" :key="item.id"&gt;{{ item.text }}&lt;/li&gt;
&lt;/TransitionGroup&gt;

<img src="vue.assets/image-20261031191052957.png" alt="image-20261031191052957" style="zoom:50%;" />







### 坑点

1. v-show 是 display:none，隐藏过渡要特殊处理
2. 多根节点报错，互切用 key + mode
3. appear 只管初次渲染
4. mode="in-out" 两个组件同时占位会抖动

### 关联

- Transition 包 keep-alive 外层，缓存组件也带动画
- router-view 页面切换过渡的标准搭配



## provide & inject



\`\`\`vue
<!-- App.vue 祖先 -->
<script setup>
import { provide, ref } from 'vue'
import Child from './Child.vue'

const msg = ref('hello')
provide('msg', msg)
<\/script>

<template>
  <Child />
</template>
\`\`\`

\`\`\`vue
<!-- Child.vue 后代 -->
<script setup>
import { inject } from 'vue'
const msg = inject('msg')
<\/script>

<template>
  {{ msg }}
</template>
\`\`\`

> 样式trick

\`\`\`vue
<script setup lang='ts'>
import { ref, reactive, inject } from 'vue'
import type {Ref} from 'vue'
import provideBVue from './provideB.vue';
const color  = inject<Ref<string>>('color')
<\/script>

<style scoped>
.box {
  height: 50px;
  width: 50px;
  border: 1px solid #ccc;
  background: v-bind(color); // 提取setup变量
}
</style>
\`\`\`





## V-model



**1. 默认值的改变（Vue2 → Vue3）**

- **Prop**：\`value\` → **\`modelValue\`**
- **事件**：\`input\` → **\`update:modelValue\`**
- \`.sync\` 修饰符和组件的 \`model\` 选项已被**移除**。

**2. 核心本质**
在自定义组件上，\`v-model="xxx"\` 等价于：
\`\`\`html
<ChildComponent 
  :modelValue="xxx" 
  @update:modelValue="xxx = $event" 
/>
\`\`\`

**3. 新增：支持多个 v-model**
同一个组件上可以绑定多个双向数据：
\`\`\`html
<ChildComponent v-model:title="pageTitle" v-model:content="pageContent" />
\`\`\`
\`\`\`vue
<template>
  <!-- 顶部被截断了一部分，大概是 <div>父组件传来的值：{{ modelValue }}</div> 之类的 -->
  <div>内容：<input @input="change" :value="textVal" type="text"></div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
//vue2 value  vue3 modelValue

defineProps<{
  modelValue: boolean,
  textVal: string
}>()

const emit = defineEmits(['update:modelValue', 'update:textVal'])

const change = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:textVal', target.value)
}
<\/script>
\`\`\`



子组件通过 \`props: ['title', 'content']\` 接收，并分别 emit \`update:title\` 和 \`update:content\`。

**4. 新增：支持自定义修饰符**
- 默认 \`v-model\` 的修饰符通过 **\`modelModifiers\`** prop 提供给组件。
- 带参数的 \`v-model:xxx\` 修饰符通过 **\`xxxModifiers\`** prop 提供给组件（如 \`v-model:price.trim\` → \`priceModifiers\`）。
- 子组件拿到修饰符对象后，可自行决定如何处理（例如自动首字母大写）。

\`\`\`vue
// 父
<template>
  <MyInput v-model:title.trim="titleStr" />
</template>

<script setup>
import { ref } from 'vue'
const titleStr = ref('')
<\/script>
\`\`\`

\`\`\`vue
// 子
<template>
  <input :value="title" @input="update" />
</template>

<script setup>
const props = defineProps({
  title: String,
  // 注意：带参数的 v-model，修饰符名字是 "参数名 + Modifiers"
  titleModifiers: { 
    type: Object,
    default: () => ({}) 
  }
})
const emit = defineEmits(['update:title'])

const update = (e) => {
  let val = e.target.value
  // 如果父组件用了 .trim 修饰符，这里就把前后空格去掉
  if (props.titleModifiers.trim) {
    val = val.trim()
  }
  emit('update:title', val)
}
<\/script>
\`\`\`

## 指令（高阶）



### 性能优化

<img src="vue.assets/image-20261011165440797.png" alt="image-20261011165440797" style="zoom: 50%;" />



### 自定义指令

![image-20230829202419675](./vue.assets/image-20230829202419675.png)











#### 生命周期钩子的参数

每个钩子函数接收四个参数，其中第二个参数 \`binding\` 包含的元信息最为丰富：

1. **\`el\`**：当前绑定的 DOM 元素
2. **\`binding\`**（对象）：
   - \`instance\`：使用指令的组件实例
   - \`value\`：传递给指令的值（如 \`v-move="{ background: 'red' }"\` 中的 \`{ background: 'red' }\`）
   - \`oldValue\`：之前的值，**仅在 \`beforeUpdate\` 和 \`updated\` 中可用**
   - \`arg\`：指令参数（如 \`v-move:foo\` 中的 \`"foo"\`）
   - \`modifiers\`：修饰符对象（如 \`v-move.foo.bar\` → \`{ foo: true, bar: true }\`）
   - \`dir\`：注册指令时的参数对象
3. **\`vnode\`**：当前元素的虚拟 DOM
4. **\`prevNode\`**：上一个虚拟节点，**仅在 \`beforeUpdate\` 和 \`updated\` 中可用**



#### 定义局部指令

在 Composition API 的 \`setup\` 语法糖中定义自定义指令，**命名必须以 \`vNameOfDirective\` 的形式**，才能在模板中作为 \`v-name-of-directive\` 直接使用：

\`\`\`ts
const vMove: Directive = {
  created: () => { /* 初始化 */ },
  beforeMount: (...args) => { /* 挂载前 */ },
  mounted: () => { /* 挂载 */ },
  beforeUpdate: () => { /* 更新前 */ },
  updated: () => { /* 更新 */ },
  beforeUnmount: () => { /* 销毁前 */ },
  unmounted: () => { /* 销毁 */ },
}
\`\`\`

如果**只关心 \`mounted\` 和 \`updated\` 两个时机**，可以省略对象写法，直接传入一个函数作为指令：

\`\`\`ts
const vMove: Directive = (el, binding: DirectiveBinding<{ background: string }>) => {
  el.style.background = binding.value.background
}
\`\`\`

这种写法等价于只在 \`mounted\` 和 \`updated\` 时执行该函数，适合简单的 DOM 操作场景。





#### 实战案例

##### 权限按钮

\`\`\`vue
<template>
   <div class="btns">
       <button v-has-show="'shop:create'">创建</button>
 
       <button v-has-show="'shop:edit'">编辑</button>
 
       <button v-has-show="'shop:delete'">删除</button>
   </div>
</template>
 
<script setup lang='ts'>
import type {Directive} from 'vue'
    
//permission
localStorage.setItem('userId','xiaoman-zs')
 
//mock后台返回的数据
const permission = [
    'xiaoman-zs:shop:edit',
    'xiaoman-zs:shop:create',
    'xiaoman-zs:shop:delete'
]
const userId = localStorage.getItem('userId') as string
const vHasShow:Directive<HTMLElement,string> = (el,bingding) => {
   if(!permission.includes(userId+':'+ bingding.value)){
       el.style.display = 'none'
   }
}
 
<\/script>
 
<style scoped lang='less'>
.btns{
    button{
        margin: 10px;
    }
}
</style>

\`\`\`

##### 图片懒加载

\`\`\`vue
<template>
	<div>
        <div v-for="item in arr">
            <img height="500" :data-index="item" v-lazy="item" width="360" alt="">
        </div>
    </div>
</template>
 
<script setup lang='ts'>
import type { Directive } from 'vue'
const images: Record<string, { default: string }> = import.meta.globEager('./assets/images/*.*')
let arr = Object.values(images).map(v => v.default)
 
let vLazy: Directive<HTMLImageElement, string> = async (el, binding) => {
    let url = await import('./assets/vue.svg')
    el.src = url.default;
    let observer = new IntersectionObserver((entries) => {
        console.log(entries[0], el)
        if (entries[0].intersectionRatio > 0 && entries[0].isIntersecting) {
            setTimeout(() => {
                el.src = binding.value;
                observer.unobserve(el)
            }, 2000)
        }
    })
    observer.observe(el)
}
 
<\/script>
 
<style scoped lang='less'></style>
\`\`\`

\`IntersectionObserver\` 是浏览器原生 API，用来**监听元素是否进入视口**。它的回调会在“交叉状态变化”时触发。

回调参数 \`entries\` 是一个**数组**，每个 \`entry\` 描述一个被观察元素的状态







> HTML原生

\`\`\`tsx
<!-- 好的做法：明确指定宽高 -->
<img src="photo.jpg" loading="lazy" width="400" height="300" alt="...">
\`\`\`

- **\`eager\`**：**默认行为**
  - 浏览器会立即加载图片，无论它是否在可视区域内。
- **\`lazy\`**：**延迟加载**
  - 浏览器会推迟加载图片，直到它即将进入可视视口时才开始加载。









#### 全局注册

\`\`\`js
// main.js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 注册全局指令 v-focus
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

app.mount('#app')
\`\`\`

\`\`\`typescript
// main.ts
import { createApp } from 'vue'
import type { Directive } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 简单指令：v-focus
const vFocus: Directive<HTMLInputElement> = {
  mounted(el) {
    el.focus()
  }
}
app.directive('focus', vFocus)

// 带绑定值的指令：v-bg="{ background: 'red' }"
app.directive<HTMLElement, { background: string }>('bg', {
  mounted(el, binding) {
    el.style.background = binding.value.background
  }
})

app.mount('#app')
\`\`\`







#### 适用场景

自定义指令的核心价值在于**封装可复用的底层 DOM 操作逻辑**。当某个交互涉及直接访问、修改 DOM 元素（如拖拽、聚焦、懒加载、权限控制等），且需要在多个组件中重复使用时，适合用自定义指令来抽离



## Hook

就是utils函数

### Base64

\`\`\`typescript
import { onMounted } from 'vue'
 
 
type Options = {
    el: string
}
 
type Return = {
    Baseurl: string | null
}
export default function (option: Options): Promise<Return> {
 
    return new Promise((resolve) => {
        onMounted(() => {
            const file: HTMLImageElement = document.querySelector(option.el) as HTMLImageElement;
            file.onload = ():void => {
                resolve({
                    Baseurl: toBase64(file)
                })
            }
 
        })
 
 
        const toBase64 = (el: HTMLImageElement): string => {
            const canvas: HTMLCanvasElement = document.createElement('canvas')
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
            canvas.width = el.width
            canvas.height = el.height
            ctx.drawImage(el, 0, 0, canvas.width,canvas.height)
            console.log(el.width);
            
            return canvas.toDataURL('image/png')
 
        }
    })
 
 
}
\`\`\`

\`\`\`vue
<template>
	<div>
        <img id="img" wigth="300" height="300" src="...."/>
    </div>
</template>


<script setup lang="ts">
import useBase64 from '@hook/base64' // 推荐useXX的命名

useBase64({
    el:"#img"
}).then(res=>{
    console.log(res)
})


<\/script>
\`\`\`







### 监听元素变化

实现一个函数同时支持hook和自定义指令去监听dom宽高的变化



\`\`\`typescript
import { App, defineComponent, onMounted } from 'vue'
 
function useResize(el: HTMLElement, callback: (cr: DOMRectReadOnly,resize:ResizeObserver) => void) {
    let resize: ResizeObserver
        resize = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const cr = entry.contentRect;
                callback(cr,resize)
            }
        });
        resize.observe(el)
}
 
 
const install = (app: App) => {
    app.directive('resize', {
        mounted(el, binding) {
            useResize(el, binding.value)
        }
    })
}
 
useResize.install = install
 
export default useResize

// 仅供理解hook挂载，不推荐
\`\`\`

\`\`\`typescript
// main.ts
import useResize from '@/hooks/useResize'
app.use(useResize) // 触发 install，全局注册 v-resize
\`\`\`

\`\`\`react
<!-- 任意组件模板里直接用，不用 import -->
<template>
  <div v-resize="(cr) => console.log(cr.width)">内容</div>
</template>
\`\`\`





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

# JSX & TSX

![image-20240817174824961](./vue.assets/image-20240817174824961.png)

## 1. 基础环境配置

* **安装**：\`npm install @vitejs/plugin-vue-jsx -D\`

*   **配置 \`vite.config.ts\`**：
    
    \`\`\`typescript
    import vueJsx from '@vitejs/plugin-vue-jsx'
    export default defineConfig({ plugins: [vue(), vueJsx()] })
    \`\`\`
    
* **配置 \`tsconfig.json\`**：

  \`\`\`json
  {
      "jsx": "preserve",
      "jsxFactory": "h",
      "jsxFragmentFactory": "Fragment"
  }
  \`\`\`

  

## 2. 核心语法与指令对照

在 TSX 中，没有 \`<template>\`，所有模板指令都需要转成 JS/TS 表达式：

| 模板语法 (\`<template>\`) | TSX 等价写法                                               | 注意事项                                                     |
| :---------------------- | :--------------------------------------------------------- | :----------------------------------------------------------- |
| \`{{ msg }}\`             | \`{msg}\`                                                    | 单花括号                                                     |
| \`v-if="isShow"\`         | \`{isShow ? <div /> : null}\`                                | 或使用 \`&&\`                                                  |
| \`v-show="isShow"\`       | \`style={{ display: isShow ? 'block' : 'none' }}\`           | 无 \`v-show\`                                                  |
| \`v-for="item in list"\`  | \`{list.map(item => <div key={item.id}>{item.name}</div>)}\` | **必须加 key**                                               |
| \`v-html="htmlStr"\`      | \`innerHTML={htmlStr}\`                                      | 注意 XSS 风险                                                |
| \`@click="fn"\`           | \`onClick={fn}\`                                             | 驼峰命名，on 开头                                            |
| \`v-model="msg"\`         | \`v-model={msg.value}\`                                      | **不能加 \`:\`，且 ref 要 \`.value\`**                           |
| \`v-model:title="t"\`     | \`v-model:title={t.value}\`                                  | 或使用 \`title={t.value} onUpdate:title={(v) => t.value = v}\` |

## 3. 响应式与 Ref 陷阱

*   **Ref 必须 \`.value\`**：在 TSX 中，Vue 的自动解包失效，\`ref\` 声明后必须写 \`.value\`。
    \`\`\`tsx
    const count = ref<number>(0)
    return () => <button onClick={() => count.value++}>{count.value}</button>
    \`\`\`
*   **Reactive**：正常写对象即可。

## 4. Props / Emit / Slots 类型定义与使用

\`defineComponent\` 或 \`<script setup lang="ts">\` 为例

> **A. Props 定义与接收**

\`\`\`tsx
// 推荐使用泛型定义
interface Props {
  msg: string
  list?: string[]
}
const MyComp = defineComponent({
  props: {
    msg: { type: String, required: true },
    list: { type: Array as PropType<string[]>, default: () => [] }
  },
  setup(props: Props) {
    // ...
  }
})
\`\`\`

> **B. Emit 定义与触发**

\`\`\`tsx
// Emit 事件类型定义
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', val: string): void
}>()

// 触发
emit('change', 1)
\`\`\`

> **C. Slots 接收与渲染**

\`\`\`tsx
setup(props, { slots }) {
  return () => (
    <div>
      {slots.default?.()}
      {slots.header?.({ title: 'TSX' })}
    </div>
  )
}
\`\`\`

## 5. 完整 TSX 组件示例

\`\`\`tsx
import Test from './Test'

export default defineComponent({
  setup() {
    return () => (
      <Test title="标题">
        {/* 这里写的内容，就会传进子组件的 slots.default 里 */}
        <p>我是插槽里的内容</p>
      </Test>
    )
  }
})
\`\`\`

\`\`\`tsx
// Test.tsx
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'Test',
  props: { title: String },
  emits: ['update'],
  setup(props, { emit, slots }) {
    const count = ref(0)
    
    return () => (
      <div class="box">
        <h1>{props.title}</h1>
        <p>计数：{count.value}</p>
        <button onClick={() => count.value++}>+1</button>
        <button onClick={() => emit('update', '已更新')}>触发 Emit</button>
        <div>{slots.default?.()}</div>
      </div>
    )
  }
})
\`\`\`









## 6. 样式处理

*   **普通类名**：\`class="box"\` 或 \`class={['box', isActive ? 'active' : '']}\`
*   **内联样式**：\`style={{ color: 'red', fontSize: '14px' }}\` （注意是对象）
*   **Scoped 样式**：原生不支持 \`<style scoped>\`，需要通过引入 CSS/SCSS 文件或使用 CSS Modules：\`import styles from './test.module.scss'\` -> \`class={styles.box}















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
  },
  arr: number[]
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  // 复杂数据类型用函数，防止引用问题
  arr:()=>{
      return [1,2,3]
  }
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

### defineExpose

<a id="defineExpose-Ts"></a>

\`\`\`typescript
defineExpose({
    name: "lpl"
})
\`\`\`

\`\`\`vue
<waterFallVue ref="waterFall" @on-click="getName" :title="name"></waterFallVue>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import waterFallVue from './components/water-fall.vue';
const waterFall = ref<InstanceType<typeof waterFallVue>>()
let name = '小满'

waterFall.value.name

<\/script>
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





# Vue-cli（弃）

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

> 匿名插槽

\`\`\`vue
// 子组件
<div>
    <slot></slot>
</div>

// 父组件
<div>
    <Child>
    	<template v-slot> // 就是#default
        	<div>
                
            </div>
        </template>
    </Child>
</div>
\`\`\`







> 指定

\`\`\`vue
// 子组件 HelloWorld

<slot name="header">header</slot>

<slot name="footer" :childCount="childCount">footer,默认内容</slot>

// 父组件
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

> 动态插槽

\`\`\`vue
<template>
  <div class="content">
    <Dialog>
      <template #[name]>
        <div>我在哪儿</div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import Dialog from '../../components/Dialog/index.vue'
let name = ref('default')

<\/script>
\`\`\`



# vuex（弃）

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



























`;export{n as default};
