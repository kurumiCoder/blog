const n=`# Template

依赖包搜索：[npmx - Package Browser for the npm Registry](https://npmx.dev/)

## 常规vue3项目

![image-20260912151602930](%E9%A1%B9%E7%9B%AE%E6%9E%84%E5%BB%BA%E6%A8%A1%E6%9D%BF.assets/image-20260912151602930.png)

1. create项目
2. eslint
3. 目录
4. router
5. ui库
6. pinia
7. axios
8. 通用库

### 配置修改

#### code formatter

\`\`\`js
// .editorconfig

[*.{js,jsx,mjs,cjs,ts,tsx,mts,cts,vue,css,scss,sass,less,styl}]
charset = utf-8
indent_size = 2
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true
end_of_line = lf
max_line_length = 100

\`\`\`

\`\`\`json
// .oxlintrc.json
{
  // 指定 JSON Schema，用于在编辑器中提供配置项的自动补全和校验
  // （图中的黄色波浪线可能是 IDE 找不到该路径或还未安装 oxlint 导致的）
  "$schema": "./node_modules/oxlint/configuration_schema.json",

  // 启用的插件规则集
  "plugins": [
    "eslint",      // ESLint 核心规则
    "typescript",  // TypeScript 相关规则
    "unicorn",     // 一些更严格、更现代的 JS 最佳实践规则
    "oxc",         // Oxc 项目自身的特定规则
    "vue"          // Vue.js 相关规则
  ],

  // 运行环境
  "env": {
    "browser": true // 允许使用浏览器全局变量（如 window, document, location 等）
  },

  // 按类别批量启用规则
  "categories": {
    // 将“正确性”相关的所有规则设置为 error 级别（即报错，中断构建）
    "correctness": "error"
  }
}
\`\`\`

\`\`\`typescript
// eslint.config.ts

import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'
// 如果需要在 TS 环境下使用 process，建议显式导入
import process from 'node:process'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  // 对应图二中的 extends: ['plugin:vue/vue3-essential']
  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  // 👇 将图二的配置迁移到这里 👇
  {
    name: 'app/custom-rules',
    // 对应图二的 parserOptions (Flat Config 中通过 languageOptions 配置)
    languageOptions: {
      ecmaVersion: 'latest',
    },
    rules: {
      // 去掉函数 () 前面的空格
      'space-before-function-paren': 'off',
      
      // 根据环境变量动态控制
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      
      // 关闭驼峰命名规则
      'vue/multi-word-component-names': 'off',
      'vue/require-component-is': 'off',
      'vue/no-deprecated-slot-attribute': 'off',
    },
  },
  // 👆 迁移结束 👆

  // 将 Oxlint 的规则集成到 ESLint 中（两者取并集）
  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  // 关闭与 Prettier 冲突的格式化规则（对应图二注释掉的 skip-formatting）
  skipFormatting,
)
\`\`\`

#### vite

\`\`\`tsx
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

import VueRouter from 'vue-router/vite'
import { VueRouterAutoImports } from 'vue-router/unplugin'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    VueRouter({
      // 扫描多个文件夹
      routesFolder: ['src/pages', 'src/views'],
      extensions: ['.vue', '.md'],
      // 排除测试文件
      exclude: ['**/*.spec.ts', '**/*.test.ts'],
      // 生成类型声明到指定位置
      dts: 'src/route-map.d.ts',
    }),
    AutoImport({
      include: [/\\.[jt]sx?$/, /\\.vue$/, /\\.vue\\?vue/, /\\.md$/],
      imports: [
        'vue',
        '@vueuse/core',
        VueRouterAutoImports,
        {
          // add any other imports you were relying on
          'vue-router/auto': ['useLink'],
        },
      ],
      /**
       *   AutoImport({
      include: [/\\.[jt]sx?$/, /\\.vue$/, /\\.vue\\?vue/, /\\.md$/],
      imports: [
        'vue',
        'vue-i18n',
        '@vueuse/core',
        unheadVueComposablesImports,
        VueRouterAutoImports,
        {
          // add any other imports you were relying on
          'vue-router/auto': ['useLink'],
        },
      ],
       *
       */
      dts: 'src/auto-imports.d.ts', // 显式指定输出路径
      dirs: ['src/composables', 'src/stores'], // add扫描目录
      //ant-design-vue
      resolvers: [
        // ElementPlusResolver(),
        /*   // 自动导入图标组件
        IconsResolver() */
      ],
      vueTemplate: true, // 开启后，在 Vue 模板中也能使用自动导入的变量。比如在 <template> 中直接写 {{ count }}，而不需要额外在 <script setup> 中声明
    }),
    Components({
      dirs: ['src/components/**'],
      extensions: ['vue', 'md', 'tsx'],
      dts: 'src/components.d.ts',
      include: [/\\.vue$/, /\\.vue\\?vue/, /\\.md$/, /\\.[jt]sx$/],
      // 解析的 UI 组件库，这里以 Element Plus 和 Ant Design Vue 为例
      resolvers: [
        // ElementPlusResolver(),
        // AntDesignXVueResolver()
        /*   // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep']
        }) */
      ],
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },

  // 服务
  server: {
    host: true, // host设置为true才可以使用network的形式，以ip访问项目
    port: 8080, // 端口号
    open: false, // 自动打开浏览器
    cors: true, // 跨域设置允许
    strictPort: true, // 如果端口已占用直接退出
    // 接口代理
    proxy: {
      '/api': {
        // 本地 8000 前端代码的接口 代理到 8000 的服务端口
        target: 'http://localhost:81/',
        changeOrigin: true, // 允许跨域
        rewrite: (path) => path.replace('/api/', '/'),
      },
    },
  },
  // 还缺build

  // // https://github.com/vitest-dev/vitest
  // test: {
  //   include: ['test/**/*.test.ts'],
  //   environment: 'jsdom',
  // },
})

\`\`\`

#### tsconfig

![image-20260912163343532](%E9%A1%B9%E7%9B%AE%E6%9E%84%E5%BB%BA%E6%A8%A1%E6%9D%BF.assets/image-20260912163343532.png)

在ts7中不用path里面写了./xxx，然后baseUrl还要"."

\`\`\`json
// tsconfig.app.json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*.d.ts", "src/**/*", "src/**/*.vue"],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    // Extra safety for array and object lookups, but may have false positives.
    "noUncheckedIndexedAccess": true,

    // Path mapping for cleaner imports.
    "paths": {
      "@/*": ["./src/*"]
    },

    // \`vue-tsc --build\` produces a .tsbuildinfo file for incremental type-checking.
    // Specified here to keep it out of the root directory.
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo"
  }
}


// tsconfig.node.json
// TSConfig for modules that run in Node.js environment via either transpilation or type-stripping.
{
  "extends": "@tsconfig/node24/tsconfig.json",
  "include": [
    "vite.config.*",
    "vitest.config.*",
    "cypress.config.*",
    "playwright.config.*",
    "eslint.config.*"
  ],
  "compilerOptions": {
    // Most tools use transpilation instead of Node.js's native type-stripping.
    // Bundler mode provides a smoother developer experience.
    "module": "preserve",
    "moduleResolution": "bundler",

    // Include Node.js types and avoid accidentally including other \`@types/*\` packages.
    "types": ["node"],

    // Disable emitting output during \`vue-tsc --build\`, which is used for type-checking only.
    "noEmit": true,

    // \`vue-tsc --build\` produces a .tsbuildinfo file for incremental type-checking.
    // Specified here to keep it out of the root directory.
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo"
  }
}

\`\`\`







#### env.d.ts

\`\`\`typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { AttributifyAttributes } from '@unocss/preset-attributify'

declare interface Window {
  // extend the window
}

// with unplugin-vue-markdown, markdown files can be treated as Vue components
declare module '*.md' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

declare module '@vue/runtime-dom' {
  interface HTMLAttributes extends AttributifyAttributes {}
}

/// <reference types="vite/client" />
// 引入 Vite 内置类型（支持导入图片、CSS，以及 import.meta.hot 等）


// // 环境变量类型声明

// interface ImportMetaEnv {
// // 定义 import.meta.env 里面有哪些变量

//   readonly VITE_APP_TITLE: string
//   // 声明一个只读的字符串变量（对应 .env 里的同名变量）

//   readonly VITE_API_BASE_URL: string
//   // 同上，声明 API 基础地址

//   // 更多环境变量...
// }

// interface ImportMeta {
// // 扩展全局 ImportMeta 接口

//   readonly env: ImportMetaEnv
//   // 让 import.meta.env 指向上面定义的 ImportMetaEnv
// }

\`\`\`

#### index.html

\`\`\`html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <link rel="icon" href="/favicon.ico">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <script>
    // 防止主题闪烁
    ; (function () {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const setting = localStorage.getItem('vueuse-color-scheme') || 'auto'
      if (setting === 'dark' || (prefersDark && setting !== 'light'))
        document.documentElement.classList.toggle('dark', true)
    })()
  <\/script>
</head>

<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"><\/script>
</body>

</html>
\`\`\`





### 插件必下

#### vue-router自动路由

\`VueRouter\` 插件是 **\`unplugin-vue-router\`**，它的核心作用是实现**基于文件系统的自动路由（File-Based Routing）**。

简单来说，它让你不再需要手动维护 \`router/index.ts\` 里的路由数组，而是根据 \`src/pages/\` 目录（默认）下的文件结构自动生成路由。

\`\`\`css
src/pages/
├── index.vue          ->  路由 /
├── about.vue          ->  路由 /about
└── users/
    └── [id].vue       ->  路由 /users/:id
\`\`\`

> 规则速查

目录：src/pages

| 文件            | 路由       |
| --------------- | ---------- |
| index.vue       | /          |
| about.vue       | /about     |
| users/index.vue | /users     |
| users/[id].vue  | /users/:id |
| [...path].vue   | /:path(.*) |

**嵌套：**
users.vue + users/index.vue → /users 父子嵌套
users/_parent.vue → 父组件写在文件夹内
users.create.vue → /users/create（URL 嵌套，UI 不嵌套）

**分组：**
(admin)/dashboard.vue → /dashboard   # () 不进 URL

**命名视图：**
index@aux.vue → 视图名 aux

**插件：**
unplugin-vue-router / vite-plugin-pages
Nuxt：用 _id.vue 表示动态参数

**一句话：**
文件路径 = URL，文件夹 = 嵌套，[] = 参数，() = 分组，@ = 命名视图







> *无需下载*

\`\`\`typescript
import VueRouter from 'vue-router/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      extensions: ['.vue', '.md'],
      dts: 'src/route-map.d.ts',
    })
  ]
})
\`\`\`

\`\`\`js
VueRouter({
  // 扫描多个文件夹
  routesFolder: ['src/pages', 'src/views'],
  // 包含 .vue 和 .md 文件
  extensions: ['.vue', '.md'],
  // 排除测试文件
  exclude: ['**/*.spec.ts', '**/*.test.ts'],
  // 生成类型声明到指定位置
  dts: 'src/route-map.d.ts',
  // 所有页面都使用同步导入
  importMode: 'sync',
  // 自定义路由名称生成规则
  getRouteName: (routeNode) => {
    // 例如，为所有路由添加前缀
    return \`app-\${routeNode.name}\`
  },
  // 在生成路由时进行动态修改
  extendRoute(route) {
    // 为特定路由添加别名
    if (route.name === '/[id]') {
      route.addAlias('/user/:id')
    }
    // 为所有路由添加统一的 meta 信息
    route.addToMeta({
      requiresAuth: false,
    })
  },
  // 在写入文件前进行全局调整
  beforeWriteFiles(rootRoute) {
    // 例如，为根路由添加一个子路由
    rootRoute.addChild('/custom', {
      name: 'custom-route',
      component: () => import('src/pages/custom.vue'),
    })
  },
})
\`\`\`

\`\`\`typescript
// main.ts中引入

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './router' // 1. 从本地 router 文件导入路由实例

const app = createApp(App)

app.use(createPinia())
app.use(router) // 2. 直接使用导入的 router 实例

app.mount('#app')

// router/index.ts 中导入自动路由，默认支持懒加载
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes' // 关键：从虚拟模块导入自动生成的路由

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, // 直接使用自动生成的路由
})

export default router

\`\`\`



#### less

\`\`\`bash
pnpm add -D less
\`\`\`

#### auto-import

\`\`\`bash
# 自动导入
pnpm add -D unplugin-auto-import
\`\`\`

> 用于vite中配置自动导入

\`\`\`typescript
plugins: [
   	...,
    AutoImport({
      // 这里除了引入 vue 以外还可以引入pinia、vue-router、vueuse等，
      // 甚至你还可以使用自定义的配置规则，见 https://github.com/antfu/unplugin-auto-import#configuration
      //安装两行后你会发现在组件中不用再导入ref，reactive等
      imports: ['vue', 'vue-router'],
      //ant-design-vue
      resolvers: [
        // ElementPlusResolver(),
        /*   // 自动导入图标组件
        IconsResolver() */
      ],
    }),
],
\`\`\`

\`\`\`typescript
// 在 tsconfig.app.json 的 include 中添加 "auto-imports.d.ts"

"include": ["env.d.ts", "auto-imports.d.ts", "src/**/*", "src/**/*.vue"]
\`\`\`

#### unplugin-vue-components/vite

\`\`\`bash
pnpm i unplugin-vue-components -D
\`\`\`

修改vite配置



#### VueDevTools

\`\`\`bash
\`\`\`





### 开发工具

#### vueuse

\`\`\`bash
pnpm add @vueuse/core
\`\`\`

#### Unocss - 推荐

https://unocss.nodejs.cn/integrations/vite

> install

\`\`\`bash
pnpm add -D unocss @unocss/transformer-variant-group  @unocss/preset-wind3 @unocss/preset-attributify @unocss/transformer-directives @unocss/preset-typography @unocss/preset-icons @unocss/preset-web-fonts
\`\`\`

> vite

\`\`\`typescript
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    UnoCSS(),
  ],
})
\`\`\`

> 创建一个 \`uno.config.ts\` 文件

\`\`\`typescript
import { defineConfig } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
})
\`\`\`

> 导入main.ts

\`\`\`typescript
// main.ts
import 'virtual:uno.css'
\`\`\`

> 使用预设
>
> *可通过预设使用其他ui框架的设计*

\`\`\`bash
pnpm add -D @unocss/preset-wind3
\`\`\`

\`\`\`typescript
// uno.config.ts

import { defineConfig } from 'unocss'
import presetWind3 from '@unocss/preset-wind3'

export default defineConfig({
  shortcuts: [
    [
      'btn',
      'px-4 py-1  rounded inline-block bg-teal-700 text-white cursor-pointer !outline-none hover:bg-teal-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50',
    ],
  ], // 快捷映射
  presets: [presetWind3()],
})

\`\`\`

[vscode+UnoCSS 插件智能提示不生效解决_unocss vscode插件-CSDN博客](https://blog.csdn.net/Yydemo1/article/details/149544425)



##### Attributify 属性化

https://unocss.nodejs.cn/presets/attributify

<img src="%E9%A1%B9%E7%9B%AE%E6%9E%84%E5%BB%BA%E6%A8%A1%E6%9D%BF.assets/image-20260915174622300.png" alt="image-20260915174622300" style="zoom:50%;" />

\`\`\`bash
pnpm add -D @unocss/preset-attributify
\`\`\`

\`\`\`typescript
import presetAttributify from '@unocss/preset-attributify'

export default defineConfig({
  presets: [
    presetAttributify({ /* preset options */ }),
    // ...
  ],
})
\`\`\`

##### VariantGroup

![image-20260915180556805](%E9%A1%B9%E7%9B%AE%E6%9E%84%E5%BB%BA%E6%A8%A1%E6%9D%BF.assets/image-20260915180556805.png)

https://unocss.nodejs.cn/transformers/variant-group#variant-group-transformer

##### directives 指令转换器

> https://unocss.nodejs.cn/transformers/directives

<img src="%E9%A1%B9%E7%9B%AE%E6%9E%84%E5%BB%BA%E6%A8%A1%E6%9D%BF.assets/image-20260915181051645.png" alt="image-20260915181051645" style="zoom:67%;" />

\`@apply\` —— 在 CSS 里用工具类

\`\`\`css
.btn {
  @apply px-4 py-2 bg-blue-500 text-white rounded;
}
\`\`\`

构建后相当于：
\`\`\`css
.btn {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background-color: #3b82f6;
  color: #fff;
  border-radius: 0.25rem;
}
\`\`\`

\`@screen\` —— 用断点名写媒体查询

\`\`\`css
@screen sm {
  .card {
    @apply p-4;
  }
}
\`\`\`

构建后相当于：
\`\`\`css
@media (min-width: 640px) {
  .card {
    padding: 1rem;
  }
}
\`\`\`

\`theme()\` —— 读取主题值

\`\`\`css
.title {
  color: theme('colors.blue.500');
}
\`\`\`

构建后相当于：
\`\`\`css
.title {
  color: #3b82f6;
}
\`\`\`

##### presetTypography

\`presetTypography\` 是 UnoCSS 的一个排版预设，它提供一组 \`prose\` 类，用来给**原生 HTML 内容**（比如 Markdown 渲染出的文章）快速添加一套美观、一致的默认排版样式。

> 🎯 它解决什么问题？

你写文章或博客时，HTML 里的标题、段落、列表、代码块等元素，默认样式通常很朴素，需要一个个手动调。\`presetTypography\` 让你只需在文章容器上加一个 \`prose\` 类，它就会**自动为内部所有标准 HTML 元素应用一套精心设计的排版规则**。

> ✨ 核心用法与特点

**1. 基本用法**

\`\`\`html
<article class="prose">
  <!-- 这里的 h1, p, ul, code 等都会自动获得好看的排版 -->
</article>
\`\`\`

**2. 任意尺寸**
内置多种尺寸变体，直接叠加使用即可：

\`\`\`html
<article class="prose prose-sm">小号排版</article>
<article class="prose prose-lg">大号排版</article>
<article class="prose prose-xl">超大号排版</article>
\`\`\`
还支持响应式：
\`\`\`html
<article class="prose prose-sm md:prose-base lg:prose-lg">响应式缩放</article>
\`\`\`

**3. 任意颜色**
用 \`prose-\${颜色名}\` 改变整体色调，颜色取自你的主题配置：
\`\`\`html
<article class="prose prose-blue">蓝色主题排版</article>
<article class="prose prose-gray">灰色主题排版（默认）</article>
\`\`\`

**4. 暗色模式**
配合 \`dark:prose-invert\` 在暗色模式下自动反转颜色：
\`\`\`html
<article class="prose dark:prose-invert">...</article>
\`\`\`

**5. 排除元素**
如果某个子元素你不想应用 prose 样式，加上 \`not-prose\` 类即可：
\`\`\`html
<div class="prose">
  <p class="not-prose">这段不受 prose 影响</p>
</div>
\`\`\`

> ⚙️ 如何启用

安装（如果未包含在主包中）：
\`\`\`bash
pnpm add -D @unocss/preset-typography
\`\`\`
在配置中加入：
\`\`\`ts
// uno.config.ts
import { defineConfig, presetWind3, presetTypography } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),      // 必需，prose 的颜色依赖它
    presetTypography(),
  ],
})
\`\`\`

一句话总结：**\`presetTypography\` = 给文章内容一键套上专业排版样式的 UnoCSS 预设，核心就是 \`prose\` 这个类。**

##### presetIcons

\`presetIcons\` 是 UnoCSS 的一个预设，它让你能**像写普通 CSS 类一样，通过 \`class\` 属性来使用海量的图标**。这些图标来自 Iconify，一个汇集了上百个图标集、超过 20 万个图标的巨大图标库。

> 💡 核心用法：在 \`class\` 里写图标

它的用法非常简单直观。你只需要按照 \`<前缀><集合>-<图标名>\` 的格式来写类名，UnoCSS 就会自动把它渲染成一个图标。

你配置里设定的 \`prefix\` 是 \`i-\`，所以：

\`\`\`html
<!-- 来自 Phosphor 图标集的锚点图标 -->
<div class="i-ph-anchor-simple-thin" />

<!-- 来自 Material Design Icons 的闹钟图标，并设置为橙色 -->
<div class="i-mdi-alarm text-orange-400" />

<!-- 一个大尺寸的 Vue logo -->
<div class="i-logos-vue text-3xl" />
\`\`\`

如你所见，你还可以像给文字上色一样，用 \`text-orange-400\` 这样的工具类来改变图标的颜色。

> ⚙️ 如何配置

1.  **安装**：你需要同时安装预设本身和你想用的图标集。例如，如果你想用 Material Design Icons，就需要安装 \`@iconify-json/mdi\`。
    \`\`\`bash
    pnpm add -D @unocss/preset-icons @iconify-json/mdi
    \`\`\`

2.  **配置**：在你的 \`uno.config.ts\` 中引入并配置它。你提供的配置里设置了 \`scale: 1.2\`，意思是图标的默认大小会是当前字号的 1.2 倍。
    \`\`\`ts
    // uno.config.ts
    import { defineConfig, presetIcons } from 'unocss'
    
    export default defineConfig({
      presets: [
        presetIcons({
          scale: 1.2, // 图标相对于字体大小的缩放比例
          // ... 其他选项
        }),
      ],
    })
    \`\`\`

> 🎨 进阶技巧

*   **自动选择颜色**：对于单色图标（SVG 里用 \`currentColor\` 的），UnoCSS 会自动用 **mask** 模式渲染，这样你就可以用 \`text-*\` 类自由改颜色。对于自带多色的彩色图标，它会用 **background-img** 模式，保留原有颜色。你也能用 \`?mask\` 或 \`?bg\` 强制指定模式。
*   **动态切换**：图标可以配合变体使用，轻松实现交互效果。例如，用 \`dark:\` 变体让图标在暗色模式下自动切换：
    \`\`\`html
    <button class="i-carbon-sun dark:i-carbon-moon" />
    \`\`\`
*   **自定义图标**：你还可以用 \`collections\` 选项，把自定义的 SVG 或本地图标文件注册成图标集来使用。

##### presetWebFonts

\`presetWebFonts\` 是 UnoCSS 的一个预设，作用是**帮你自动引入 Web 字体，并生成对应的字体工具类**。  
你不用再手动写 \`<link>\` 或 \`@import\`，也不用自己配 \`font-family\`。

> 你配置里的这段

\`\`\`ts
presetWebFonts({
  fonts: {
    sans: 'DM Sans',
    serif: 'DM Serif Display',
    mono: 'DM Mono',
  },
  processors: createLocalFontProcessor(),
})
\`\`\`

意思是：

- \`sans\` 对应 \`DM Sans\`
- \`serif\` 对应 \`DM Serif Display\`
- \`mono\` 对应 \`DM Mono\`

然后你就能在 HTML 里直接写：

\`\`\`html
<div class="font-sans">用 DM Sans</div>
<div class="font-serif">用 DM Serif Display</div>
<div class="font-mono">用 DM Mono</div>
\`\`\`

UnoCSS 会自动生成对应的 \`font-family\` 样式，并处理好字体的加载。

> \`createLocalFontProcessor()\` 是什么？

它是**本地字体处理器**。  
默认情况下，\`presetWebFonts\` 会从 Google Fonts 之类的 CDN 引入字体。  
加上它之后，构建时会**把字体文件下载到本地**，并生成 \`@font-face\`，这样运行时就不依赖外部网络了。

> 它帮你省了什么？

不用这个预设，你得：

1. 去 Google Fonts 选字体
2. 复制 \`<link>\` 或 \`@import\` 到 HTML/CSS
3. 手动写 \`font-family: 'DM Sans', sans-serif;\`
4. 处理字体加载、本地化、缓存等

用了它，只需要在配置里写名字，然后直接用 \`font-sans\` 这类工具类。

一句话：**\`presetWebFonts\` = 自动引入 Web 字体 + 生成 \`font-*\` 工具类，\`createLocalFontProcessor()\` 让它把字体下载到本地。**











#### iconify图标库 - 推荐

\`Iconify\` 是一个**统一的图标框架**。它最大的特点是**用一个语法，就能使用超过 200 个图标集、总计 30 万个图标**。

> 🧩 它解决什么核心问题？

传统图标库（如 Font Awesome）通常需要你把整套字体或 SVG 都打包进项目，即使你只用到了其中一两个图标。Iconify 采用了**按需加载**的方式：它只加载你页面上实际用到的那几个图标。

> ⚙️ 它是怎么工作的？

Iconify 本身不直接包含图标数据，而是一个“调度中心”。当你指定一个图标名（比如 \`mdi:home\`）时，它会通过公开的 **Iconify API**，从对应的图标集中动态拉取那一个图标的数据，然后渲染成高质量的 **SVG**。

> 🛠️ 在实际项目中怎么用？

在 Vue 项目里，主要有两种使用方式，可以根据你的习惯选择。

**方式一：配合 UnoCSS（纯 CSS 方案）**

这是你之前配置 \`presetIcons\` 时用到的方式。你只需要安装对应的图标集包，然后在 \`class\` 里写图标名就行了。

\`\`\`bash
# 安装图标集
pnpm add -D @iconify-json/fa7-regular
\`\`\`

\`\`\`html
<!-- 在模板里直接用 class -->
<div class="i-fa7-regular:circle-user" />
\`\`\`

它的原理是 UnoCSS 在构建时，会把你用到的图标生成为一个 CSS 类（通过 \`mask\` 或 \`background-image\` 技术），最终渲染出来。

**方式二：使用 Iconify 官方的 Vue 组件**

Iconify 也提供了原生的 Vue 组件，用法非常直观。先安装 \`@iconify/vue\`，然后把它当普通组件用就行。

\`\`\`bash
npm install --save-dev @iconify/vue
\`\`\`

\`\`\`vue
<script setup>
import { Icon } from "@iconify/vue";
<\/script>

<template>
  <Icon icon="mdi-light:home" />
</template>
\`\`\`

这种方式在客户端运行时，会自动从 Iconify API 拉取图标数据并渲染成 SVG，你同样不需要手动导入任何图标文件。





#### unplugin-vue-markdown 可选

- Markdown 作为组件，也可以让组件在 Markdown 中使用

  - [\`markdown-it-prism\`](https://github.com/jGleitz/markdown-it-prism) - [Prism](https://prismjs.com/) 的语法高亮

  - [\`prism-theme-vars\`](https://github.com/antfu/prism-theme-vars) - 利用 CSS 变量自定义 Prism.js 的主题





#### pwa

作用是为你的 Vite 项目**一键开启 PWA（渐进式 Web 应用）能力**，让网站可以像原生 App 一样安装到桌面、离线访问以及接收推送通知

> 📦 安装依赖

在项目根目录下执行：

\`\`\`bash
# pnpm (推荐)
pnpm add -D vite-plugin-pwa

# npm
npm install -D vite-plugin-pwa

# yarn
yarn add -D vite-plugin-pwa
\`\`\`
*注意：\`vite-plugin-pwa\` v0.17+ 要求 Vite 5，且 Node 版本需 16 以上*



> ⚙️ 配置项

\`\`\`json
// https://github.com/antfu/vite-plugin-pwa
VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'safari-pinned-tab.svg'],
    manifest: {
        name: 'Vitesse',
        short_name: 'Vitesse',
        theme_color: '#ffffff',
        icons: [
            {
                src: '/pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: '/pwa-512x512.png',
            	sizes: '512x512',
            	type: 'image/png',
          	},
          	{
            	src: '/pwa-512x512.png',
           		sizes: '512x512',
            	type: 'image/png',
            	purpose: 'any maskable',
          	},
        ],
    },
})
\`\`\`

\`\`\`html
<!-- index.html -->
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="apple-touch-icon" href="/pwa-192x192.png" />
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#00aba9" />


\`\`\`



1. \`registerType: 'autoUpdate'\`

   控制 Service Worker 的注册与更新策略。

   *   **\`'autoUpdate'\`**：Service Worker 检测到新版本时**自动更新**，用户无需手动操作。

   *   **\`'prompt'\`**：检测到新版本时**弹出提示**，让用户决定是否更新。


2.  \`includeAssets: ['favicon.svg', 'safari-pinned-tab.svg']\`

   指定需要额外包含到 Service Worker 预缓存中的**静态资源**。这些文件会从 \`public\` 目录被复制并加入缓存，确保离线时也能访问。

3. \`manifest\` 配置

   这是 PWA 的**应用清单（Manifest）**，定义了应用安装到桌面后的名称、图标、主题色等元信息。

   *   **\`name\` / \`short_name\`**：应用全称与桌面图标下的短名称。

   *   **\`theme_color\`**：应用的主题色，影响浏览器 UI 颜色。

   *   **\`icons\`**：应用图标数组。每个图标需指定 \`src\`、\`sizes\`、\`type\`，\`purpose: 'any maskable'\` 表示该图标可被系统裁剪为各种形状（如圆形）。


> 🔄 后续必要步骤

1. 添加类型声明

在 \`tsconfig.json\` 的 \`compilerOptions.types\` 中添加 \`"vite-plugin-pwa/client"\`，以获得虚拟模块的类型提示：

\`\`\`json
{
  "compilerOptions": {
    "types": [
      "vite-plugin-pwa/client"
    ]
  }
}
\`\`\`

2. 注册 Service Worker（如果使用 \`prompt\` 策略）

若 \`registerType\` 设为 \`'prompt'\`，需要在 \`main.ts\` 中手动注册虚拟模块并处理更新提示：

\`\`\`typescript
// src/main.ts
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    // 显示“有新内容，是否更新？”的提示
    if (confirm('新内容可用，是否更新？')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('应用已准备好离线使用')
  },
})
\`\`\`
若使用 \`'autoUpdate'\`，插件会自动处理注册，但显式注册可获得更精细的控制。

> ⚠️ 注意事项

*   **HTTPS 要求**：Service Worker 仅在生产环境且**通过 HTTPS 访问**时生效（\`localhost\` 除外）。
*   **图标准备**：\`manifest.icons\` 中引用的 PNG 文件需提前放入 \`public\` 目录，否则 PWA 安装会失败。
*   **开发调试**：默认情况下，\`dev\` 环境不会启用 PWA 功能，需运行 \`pnpm build && pnpm preview\` 来测试完整效果。
*   **缓存策略**：如需自定义 Workbox 缓存规则（如缓存 API 请求、字体等），可参考官方文档在 \`workbox\` 字段中配置。



#### i18n

核心作用是在**构建阶段**对国际化资源进行**预编译和优化**，让 \`vue-i18n\` 在运行时的体积更小、性能更高。

> 📦 安装依赖

在项目根目录下执行：

\`\`\`bash
# 安装插件（作为开发依赖）
pnpm add -D @intlify/unplugin-vue-i18n

# 安装运行时库（作为生产依赖）
pnpm add vue-i18n
\`\`\`
*\`unplugin-vue-i18n\` 是构建工具插件，只在开发/构建时使用；\`vue-i18n\` 是运行时库，需要打包进最终产物*

> ⚙️ 配置 \`vite.config.ts\`

在 \`vite.config.ts\` 中引入并配置：

\`\`\`typescript
import { defineConfig } from 'vite'
import path from 'node:path'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

export default defineConfig({
  plugins: [
    VueI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),
  ],
})
\`\`\`

1. \`runtimeOnly: true\`

**作用**：开启“仅运行时”模式。\`vue-i18n\` 默认包含两部分：**消息编译器**（把翻译字符串编译成函数）和**运行时**（执行翻译函数）。开启此选项后，插件会在**构建时**预先完成消息编译，从而**不打包消息编译器**，显著减小最终产物体积。

**代价**：你将**无法在运行时动态编译新的语言消息**，例如从后端 API 获取翻译数据后动态编译。所有语言资源必须在构建时就能完全确定。

2. \`compositionOnly: true\`

**作用**：让 \`vue-i18n\` **只提供 Composition API**（如 \`useI18n\`），**移除 Options API 的兼容代码**（如 \`this.$t\`、\`this.$i18n\`），进一步缩减包体积。

**注意**：如果你需要在 Options API 中使用 \`this.$t\`，则必须将此选项设为 \`false\`，或者改为使用 \`useI18n\` 的 \`t\` 函数。

3. \`fullInstall: true\`

**作用**：控制是否安装 \`vue-i18n\` 的**全套组件和指令**。这些包括：

- **组件**：\`<i18n-t>\`、\`<i18n-d>\`、\`<i18n-n>\`
- **指令**：\`v-t\`

设为 \`true\` 时全部安装；设为 \`false\` 时它们会被 tree-shaking 移除，进一步减小体积。如果你不需要这些内置组件和指令，可以设为 \`false\`。

4. \`include: [path.resolve(__dirname, 'locales/**')]\`

**作用**：指定需要被插件**扫描和预编译**的语言资源文件路径。插件会读取这些路径下的 \`.json\`、\`.yaml\` 等文件，将其编译为优化后的 JavaScript 模块，供 \`vue-i18n\` 直接使用。

**常见写法**：\`include: [path.resolve(__dirname, 'locales/**')]\` 表示匹配 \`locales\` 目录下的所有子目录和文件。

> 🔗 配合 \`AutoImport\` 使用

\`\`\`typescript
AutoImport({
    imports: [
        'vue',
        'vue-i18n',
    ],
})
\`\`\`





> ✅ 验证配置是否生效

配置完成后，可以检查构建产物中是否**不包含**消息编译器的代码。一个简单的验证方式是搜索构建后的 JavaScript 文件，看是否存在 \`messageCompiler\` 相关代码。如果 \`runtimeOnly: true\` 生效，这些代码应该被 tree-shaking 移除。

> ⚠️ 常见问题

- **动态语言加载**：如果开启 \`runtimeOnly: true\` 后，你从后端获取语言包并尝试动态编译，会报错“The message format compilation is not supported”。此时需要将 \`runtimeOnly\` 设为 \`false\`。
- **\`dropMessageCompiler\` 与 \`runtimeOnly\` 的区别**：\`dropMessageCompiler\` 是更彻底的编译器移除，但需要配合 \`compilation.jit\` 等选项使用；而 \`runtimeOnly\` 是更简洁的“仅运行时”模式，官方推荐大多数项目使用。



#### [\`@vueuse/head\`](https://github.com/vueuse/head)

\`@vueuse/head\` 是一个专门为 Vue 3 设计的**文档头管理器**，用于动态管理页面 \`<head>\` 区域的内容，比如标题、描述和元标签。

> 🎯 它解决什么问题？

在单页应用（SPA）中，如果想让每个页面的标题、描述和社交分享信息（如微信卡片、Twitter Card）都不一样，手动修改 \`index.html\` 是做不到的。\`@vueuse/head\` 让你**在组件内部用响应式的方式管理这些信息**，并自动更新到页面上。

> 📦 安装与配置

**1. 安装**

\`\`\`bash
npm i @vueuse/head
# 或 yarn add @vueuse/head / pnpm add @vueuse/head
\`\`\`


**2. 在入口文件注册插件**

\`\`\`js
import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './App.vue'

const app = createApp(App)
const head = createHead()

app.use(head)
app.mount('#app')
\`\`\`

3. vite自动导入

\`\`\`typescript
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'
import { unheadVueComposablesImports } from '@unhead/vue'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: [
        'vue',
        // 替换或添加这一行
        unheadVueComposablesImports,
      ],
    }),
  ],
})
\`\`\`

> 📝 基本用法

**方式一：使用 \`useHead\` 组合式函数**

在任意组件的 \`setup\` 中调用 \`useHead\`，传入一个对象。

\`\`\`vue
<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: '我的网站',
  meta: [
    { name: 'description', content: '这是一个很棒的网站' },
    { property: 'og:title', content: '我的网站' },
  ],
})
<\/script>
\`\`\`

**方式二：使用 \`<Head>\` 组件**

也可以直接在模板中使用 \`<Head>\` 组件，写法更接近 HTML。

\`\`\`vue
<template>
  <Head>
    <title>我的网站</title>
    <meta name="description" content="这是一个很棒的网站" />
  </Head>
</template>
\`\`\`

> 🔄 响应式与动态更新

\`useHead\` 的参数可以是 **\`computed\`** 或 **\`ref\`**，当数据变化时，\`<head>\` 会自动更新。

\`\`\`vue
<script setup>
import { computed, ref } from 'vue'
import { useHead } from '@vueuse/head'

const post = ref({ title: '文章标题' })

useHead({
  title: computed(() => post.value.title),
})
<\/script>
\`\`\`

> 🌐 服务端渲染（SSR）支持

\`@vueuse/head\` 内置了 SSR 支持。在服务端使用 \`renderHeadToString\` 将 head 数据渲染成字符串，再拼接到最终返回的 HTML 中。

\`\`\`js
import { renderToString } from '@vue/server-renderer'
import { renderHeadToString } from '@vueuse/head'

const appHTML = await renderToString(yourVueApp)
const { headTags, htmlAttrs, bodyAttrs, bodyTags } = renderHeadToString(head)

const finalHTML = \`
  <html\${htmlAttrs}>
    <head>\${headTags}</head>
    <body\${bodyAttrs}>
      <div id="app">\${appHTML}</div>
      \${bodyTags}
    </body>
  </html>
\`
\`\`\`

> ⚠️ 重要提示：项目已迁移至 Unhead

\`@vueuse/head\` 项目**已停止维护**，官方现在**引导用户迁移到 \`@unhead/vue\`**。如果你是新项目，建议直接使用 \`@unhead/vue\`；如果是老项目，迁移过程也不复杂。

1.  **替换依赖**：移除 \`@vueuse/head\`，安装 \`@unhead/vue\`。
2.  **更新导入**：将 \`createHead\`、\`useHead\` 等 API 的导入来源从 \`@vueuse/head\` 改为 \`@unhead/vue\`（或 \`@unhead/vue/client\`、\`@unhead/vue/server\`）。

简单来说，\`@vueuse/head\` 让 Vue 3 项目能够像写组件一样去管理页面 \`<head>\`，是实现良好 SEO 和社交分享效果的关键工具。不过，由于它已由官方推荐迁移至 \`@unhead/vue\`，在新项目中可以直接选用后者。

\`\`\`bash
pnpm add @unhead/vue
\`\`\`

> App.vue 配置统一的head

\`\`\`vue
<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Vitesse',
  meta: [
    {
      name: 'description',
      content: 'Opinionated Vite Starter Template',
    },
    {
      name: 'theme-color',
      content: () => isDark.value ? '#00aba9' : '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
    },
  ],
})
<\/script>

<template>
  <RouterView />
</template>

\`\`\`

> dark切换

\`\`\`typescript
// src/composables/dark.ts
// these APIs are auto-imported from @vueuse/core
export const isDark = useDark()
export const toggleDark = useToggle(isDark)
export const preferredDark = usePreferredDark()

\`\`\`



#### md-editor

https://github.com/imzbf/md-editor-v3/blob/develop/README-CN.md

\`\`\`bash
pnpm add -D highlight.js
\`\`\`











### mpa

#### Layouts

\`Layouts()\` 来自 **\`vite-plugin-vue-layouts\`**，它的核心作用是**为你的页面自动套用布局（Layout）**，让你无需在每个页面里手动引入导航栏、侧边栏等公共结构

> 安装

\`\`\`bash
pnpm add -D vite-plugin-vue-layouts
\`\`\`

\`\`\`typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import Layouts from 'vite-plugin-vue-layouts'

export default defineConfig({
  plugins: [
    VueRouter({ /* ... */ }),
    Layouts({
      layoutsDirs: 'src/layouts', // 布局文件目录，默认为 'src/layouts'
      defaultLayout: 'default',    // 默认布局文件名，默认为 'default'
    }),
    vue(),
    // ...其他插件
  ],
})
\`\`\`

\`\`\`json
// tsconfig.json
{
  "compilerOptions": {
    "types": [
      "vite-plugin-vue-layouts/client"
    ]
  }
}
\`\`\`

\`\`\`typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { setupLayouts } from 'virtual:generated-layouts' // 关键导入

const router = createRouter({
  history: createWebHistory(),
  routes: setupLayouts(routes), // 用 setupLayouts 包裹自动生成的路由
})

export default router
\`\`\`

\`\`\`vue
<!-- src/layouts/default.vue -->
<template>
  <div class="app-layout">
    <header>网站标题</header>
    <main>
      <router-view /> <!-- 页面内容将在这里渲染 -->
    </main>
  </div>
</template>
\`\`\`



> ## 布局文件放在哪里

默认情况下，布局文件存放在 **\`src/layouts\`** 目录下。布局文件就是普通的 Vue 组件，模板中需要包含一个 \`<router-view></router-view>\` 来展示页面内容。

一个最简单的默认布局 \`src/layouts/default.vue\` 看起来是这样的

\`\`\`vue
<template>
  <div class="app-layout">
    <header>网站标题</header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>
\`\`\`

\`\`\`vue
<template>
  <main
    px-4 py-10
    text="center gray-700 dark:gray-200"
  >
    <RouterView />
    <TheFooter />
    <div mx-auto mt-5 text-center text-sm opacity-50>
      [Default Layout]
    </div>
  </main>
</template>

\`\`\`

所有**未指定布局**的页面，都会自动使用这个 \`default.vue\`

> ## 怎么指定使用什么布局

\`\`\`vue
<!-- src/pages/about.vue -->
<template>
  <div>关于我们</div>
</template>

<route lang="yaml">
meta:
  layout: users
</route>
\`\`\`

> # 路由文件修改

要与\`unplugin-vue-router\`的集成

\`\`\`typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { setupLayouts } from 'virtual:generated-layouts' // 关键导入

const router = createRouter({
  history: createWebHistory(),
  routes: setupLayouts(routes), // 用 setupLayouts 包裹自动生成的路由
})

export default router
\`\`\`

> App.vue

\`\`\`vue
<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Vitesse',
  meta: [
    {
      name: 'description',
      content: 'Opinionated Vite Starter Template',
    },
    {
      name: 'theme-color',
      content: () => isDark.value ? '#00aba9' : '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
    },
  ],
})
<\/script>

<template>
  <RouterView />
</template>

\`\`\`





#### unplugin-vue-markdown

你贴出的这段 \`Markdown()\` 配置，来自 **\`unplugin-vue-markdown\`** 插件。它的核心作用是**将 Markdown 文件编译成 Vue 组件**，让你能像使用普通 \`.vue\` 组件一样使用 \`.md\` 文件。

> 📦 安装依赖

首先，在项目根目录安装核心插件：

\`\`\`bash
pnpm add -D unplugin-vue-markdown markdown-it-link-attributes
\`\`\`

为了让代码块有漂亮的样式，通常还会安装 \`markdown-it-shiki\`：

\`\`\`bash
pnpm add -D @shikijs/markdown-it shiki
\`\`\`

> ⚙️ 配置 \`vite.config.ts\`

在你的 \`vite.config.ts\` 中，需要**先让 \`vue()\` 插件支持 \`.md\` 后缀**，再注册 \`Markdown()\` 插件：

\`\`\`typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite'
import LinkAttributes from 'markdown-it-link-attributes'
import Shiki from '@shikijs/markdown-it' // 1. 引入新包


export default defineConfig({
  plugins: [
    vue({
      // 关键：让 Vue 编译器也能处理 .md 文件
      include: [/\\.vue$/, /\\.md$/],
    }),
    Markdown({
      // ... 你的配置
    }),
  ],
})
\`\`\`

> 🔧 配置项逐项解读

\`\`\`js
// https://github.com/unplugin/unplugin-vue-markdown
// Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
Markdown({
    wrapperClasses: 'prose prose-sm m-auto text-left',
    headEnabled: true,
    async markdownItSetup(md) {
        md.use(LinkAttributes, {
            matcher: (link: string) => /^https?:\\/\\//.test(link),
            attrs: {
                target: '_blank',
                rel: 'noopener',
            },
        })
         md.use(Shiki, {
          themes: {
            light: 'vitesse-light',
            dark: 'vitesse-dark',
          },
        })
    },
})
\`\`\`



1. \`wrapperClasses: 'prose prose-sm m-auto text-left'\`

   这是应用在 Markdown 内容外层容器上的 CSS 类名。配合 Tailwind CSS 的 \`@tailwindcss/typography\` 插件时，可以自动为 Markdown 内容应用优雅的排版样式。

2. \`headEnabled: true\`

   开启后，插件会解析 Markdown 文件顶部的 **Frontmatter** 区域，并允许你通过 \`@unhead/vue\` 来动态管理页面的 \`<title>\`、\`<meta>\` 等 head 信息。

3. \`markdownItSetup(md) { ... }\`

   这是最灵活的配置项，接收一个 \`markdown-it\` 实例，让你可以自由地注册各种 \`markdown-it\` 插件来扩展 Markdown 的语法能力。

   - **\`md.use(LinkAttributes, { ... })\`**
     这段代码为**外部链接**自动添加 \`target="_blank"\` 和 \`rel="noopener"\` 属性，确保链接在新标签页安全打开。其 \`matcher\` 函数判断链接是否以 \`http://\` 或 \`https://\` 开头。
   - **\`md.use(await Shiki({ ... }))\`**
     这段代码为 Markdown 中的代码块启用 **Shiki** 语法高亮。它配置了亮色主题 \`vitesse-light\` 和暗色主题 \`vitesse-dark\`，并设置 \`defaultColor: false\` 以更好地支持主题切换。

> ✅ 配置后的效果

完成上述配置后，你就可以在项目中**直接导入 \`.md\` 文件当组件用**：

\`\`\`vue
<template>
  <HelloWorld />
</template>

<script setup>
import HelloWorld from './README.md' // 像导入 .vue 一样
<\/script>
\`\`\`

你甚至可以在 Markdown 中**直接使用 Vue 组件**：

\`\`\`md
# 我的文档
<Counter :init="5" />
\`\`\`

> ⚠️ TypeScript 类型声明

为了让 TypeScript 不报错，需要在 \`src/env.d.ts\` 或类似文件中添加对 \`.md\` 模块的声明：

\`\`\`typescript
// src/env.d.ts
declare module '*.md' {
  import type { ComponentOptions } from 'vue'
  const Component: ComponentOptions
  export default Component
}
\`\`\`

完成以上步骤后，你的项目就能完美支持 Markdown 文件了。

> 怎么自定义渲染





#### SSG

> package.json

\`\`\`json
"scripts": {
    "build": "vite-ssg build",
}
\`\`\`

\`\`\`bash
pnpm i -D vite-ssg vite-ssg-sitemap
\`\`\`

> src

\`\`\`typescript
// type.ts
import type { ViteSSGContext } from 'vite-ssg'
export type UserModule = (ctx: ViteSSGContext) => void
\`\`\`

\`\`\`typescript
// main.ts
import type { UserModule } from './types'

import { setupLayouts } from 'virtual:generated-layouts'
import { ViteSSG } from 'vite-ssg'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'

import './styles/main.css'


// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,                              // 根组件
  {                                 // 路由选项
    routes: setupLayouts([...routes]),
    base: import.meta.env.BASE_URL,
  },
  (ctx) => {                        // 回调：自定义设置
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))
  },
)

\`\`\`

**ctx解释：**自动扫描 \`src/modules/\` 下的文件并逐个安装插件。当你要安装 **Pinia、Vue I18n、全局组件、路由守卫** 等时，才需要在这里写。具体详见vitesse

*ViteSSG 本身不要求你这么做*

> vite

\`\`\`typescript
// vite.config.ts
import generateSitemap from 'vite-ssg-sitemap'

// https://github.com/antfu/vite-ssg 核心概念：减小体积
ssgOptions: {
    script: 'async',
    formatting: 'minify',
    beastiesOptions: {
      reduceInlineStyles: false,
    },
    onFinished() {
        generateSitemap()
    },
},
ssr: {
    // TODO: workaround until they support native ESM
    noExternal: ['workbox-window', /vue-i18n/],
}
\`\`\`









## vue+ts+shadcn

https://shadcn-vue.cndocs.org/

[Installation - shadcn/vue](https://shadcn-vue.com/docs/installation/vite)

注意使用node V24

### 基于Vite

若您使用 Tailwind v3，请使用 \`shadcn-vue@1.0.3\`。

1. **创建项目**  
   通过 Vite 新建 Vue + TypeScript 项目：  
   \`\`\`bash
   pnpm create vite@latest my-vue-app --template vue-ts
   \`\`\`

2. **添加 Tailwind CSS**  
   安装依赖：  
   
   \`\`\`bash
   pnpm add tailwindcss @tailwindcss/vite
   \`\`\`
   将 \`src/style.css\` 内容替换为：  
   \`\`\`css
   @import "tailwindcss";
   \`\`\`
   
3. **编辑 \`tsconfig.json\`**  
   在 \`compilerOptions\` 中添加 \`baseUrl\` 与 \`paths\`：  
   \`\`\`json
   {
     "files": [],
     "references": [...],
     "compilerOptions": {
       "baseUrl": ".",
       "paths": { "@/*": ["./src/*"] }
     }
   }
   \`\`\`

4. **编辑 \`tsconfig.app.json\`**  
   同样加入路径解析配置：  
   \`\`\`json
   {
     "compilerOptions": {
       // ...
       "baseUrl": ".",
       "paths": { "@/*": ["./src/*"] }
     }
   }
   \`\`\`

5. **更新 \`vite.config.ts\`**  

   \`\`\`ts
   import tailwindcss from "@tailwindcss/vite";
   import vue from "@vitejs/plugin-vue";
   import { defineConfig } from "vite";
   
   export default defineConfig({
     plugins: [vue(), tailwindcss()],
     resolve: {
       tsconfigPaths: true, // ← 启用原生 tsconfig paths 解析
     },
     server: {
       port: 8080,
     },
   });
   
   \`\`\`

6. **运行 CLI 初始化**  
   
   \`\`\`bash
   pnpm dlx shadcn-vue@latest init
   \`\`\`
   按提示选择颜色（如 \`Neutral\`）完成 \`components.json\` 配置。
   
7. **添加组件**  
   例如添加 Button：  
   \`\`\`bash
   pnpm dlx shadcn-vue@latest add button
   \`\`\`
   在 Vue 组件中使用：  
   \`\`\`vue
   <script setup>
   import { Button } from '@/components/ui/button'
   <\/script>
   <template>
     <Button>点击我</Button>
   </template>
   \`\`\`

8. vite 配置

\`\`\`typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    port:8080
  }
})

\`\`\`



## Vue-JS to Vue-TS

**手动迁移**

1. 创建新的Vue-TS项目\`ts-version\`

2. 复制资源

   - src/assets
   - components
   - utils
   - ...
3. 补充类型，type写在 src/types目录下
4. 

   











## react-ts-normal

\`\`\`bash
npm create vite my-app --template react-ts
\`\`\`







# vitesse

\`\`\`bash
npx degit antfu-collective/vitesse my-vitesse-app
cd my-vitesse-app
pnpm i
\`\`\`





https://github.com/antfu-collective/vitesse/blob/main/README.zh-CN.md

## 预配置



### UI 框架



- [UnoCSS](https://github.com/antfu/unocss) - 高性能且极具灵活性的即时原子化 CSS 引擎

### Icons



- [Iconify](https://iconify.design/) - 使用任意的图标集，浏览：[🔍Icônes](https://icones.netlify.app/)
- [UnoCSS 的纯 CSS 图标方案](https://github.com/antfu/unocss/tree/main/packages/preset-icons)

### 插件



- Vue Router

  - [\`unplugin-vue-router\`](https://github.com/posva/unplugin-vue-router) - 以文件系统为基础的路由
  - [\`vite-plugin-vue-layouts\`](https://github.com/JohnCampionJr/vite-plugin-vue-layouts) - 页面布局系统

- [Pinia](https://pinia.vuejs.org/) - 直接的, 类型安全的, 使用 Composition API 的轻便灵活的 Vue 状态管理

- [\`unplugin-vue-components\`](https://github.com/antfu/unplugin-vue-components) - 自动加载组件

- [\`unplugin-auto-import\`](https://github.com/antfu/unplugin-auto-import) - 直接使用 Composition API 等，无需导入

- [\`vite-plugin-pwa\`](https://github.com/antfu/vite-plugin-pwa) - PWA

- \`unplugin-vue-markdown\`

   

  \\- Markdown 作为组件，也可以让组件在 Markdown 中使用

  - [\`markdown-it-prism\`](https://github.com/jGleitz/markdown-it-prism) - [Prism](https://prismjs.com/) 的语法高亮
  - [\`prism-theme-vars\`](https://github.com/antfu/prism-theme-vars) - 利用 CSS 变量自定义 Prism.js 的主题

- Vue I18n

   

  \\- 国际化

  - [\`unplugin-vue-i18n\`](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n) - Vue I18n 的 Vite 插件

- [VueUse](https://github.com/antfu/vueuse) - 实用的 Composition API 工具合集

- [\`vite-ssg-sitemap\`](https://github.com/jbaubree/vite-ssg-sitemap) - 站点地图生成器

- [\`@vueuse/head\`](https://github.com/vueuse/head) - 响应式地操作文档头信息

- [\`vite-plugin-vue-devtools\`](https://github.com/webfansplz/vite-plugin-vue-devtools) - 旨在增强Vue开发者体验的Vite插件



### 编码风格



- 使用 Composition API 地 [\`\` SFC 语法](https://github.com/vuejs/rfcs/pull/227)
- [ESLint](https://eslint.org/) 配置为 [@antfu/eslint-config](https://github.com/antfu/eslint-config), 单引号, 无分号.

### 开发工具



- [TypeScript](https://www.typescriptlang.org/)

- [Vitest](https://github.com/vitest-dev/vitest) - 基于 Vite 的单元测试框架

- [Cypress](https://cypress.io/) - E2E 测试

- [pnpm](https://pnpm.js.org/) - 快, 节省磁盘空间的包管理器

- \`vite-ssg\`

   

  \\- 服务端生成

  - [beasties](https://github.com/danielroe/beasties) - 关键 CSS 生成器

- [Netlify](https://www.netlify.com/) - 零配置的部署

- VS Code 扩展

  - [Vite](https://marketplace.visualstudio.com/items?itemName=antfu.vite) - 自动启动 Vite 服务器
  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Vue 3 \`<script setup>\` IDE 支持
  - [Iconify IntelliSense](https://marketplace.visualstudio.com/items?itemName=antfu.iconify) - 图标内联显示和自动补全
  - [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally) - 多合一的 I18n 支持
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
`;export{n as default};
