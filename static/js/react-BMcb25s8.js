const n=`# React

## 快速入门

### 创建项目

\`\`\`bash
npx create-react-app my-app
\`\`\`

### 核心文件

\`\`\`js
// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
\`\`\`

\`\`\`jsx
//app.js
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

\`\`\`

### JSX

html与js卸载一起

\`\`\`jsx
import logo from './logo.svg';
import './App.css';

//根组件
//只能存在一个根元素
function App() {
  return (
   	<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
  //或者
  return (
      <>
      <div className="App">
          <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
          </header>
      </div>
      <>
  );
}

export default App;
\`\`\`

### 数据渲染

> 普通渲染

![image-20240416105725514](./react.assets/image-20240416105725514.png)

\`\`\`jsx
function App() {
  const divContent = "标签内容";
  const divTitle = "标签标题";

  return <div title={divTitle}>{divContent}</div>;
}

export default App;

\`\`\`

![image-20240416231531241](./react.assets/image-20240416231531241.png)

> 条件渲染

\`\`\`jsx
function App() {
  const divTitle = "标签标题";

  const flag = false;
  let divContent = "";
  if (flag) {
    divContent = "true";
  } else {
    divContent = "false";
  }

  return <div title={divTitle}>{divContent}</div>;
}

export default App;
\`\`\`

> 列表渲染

\`\`\`jsx
function App() {
  const list = [
    { id: 1, name: "小吴" },
    { id: 2, name: "小李" },
    { id: 3, name: "小张" },
  ];

  const content = list.map((item) => <li key={item.id}>{item.name}</li>);
  return <ul>{content}</ul>;
}
export default App;
\`\`\`

\`\`\`jsx

import { Fragment } from "react";

function App() {
  const list = [
    { id: 1, name: "小吴" },
    { id: 2, name: "小李" },
    { id: 3, name: "小张" },
  ];
  const content = list.map((item) => (
    <Fragment key={item.id}>
      <li>{item.name}</li>
      <li>-----------------</li>
    </Fragment>
  ));
  return <ul>{content}</ul>;
}
export default App;
\`\`\`

> 双向绑定

![image-20240416232712095](./react.assets/image-20240416232712095.png)



### 事件

\`\`\`jsx
function App() {
  const handleClick = (e) => {
    console.log("log",e);
  };

  return <button onClick={handleClick}>按钮</button>;
}
export default App;
\`\`\`

![image-20240416225508279](./react.assets/image-20240416225508279.png)

![image-20240416225623697](./react.assets/image-20240416225623697.png)





### 状态处理

> 基本使用

\`\`\`jsx
import { useState } from 'react'

function App() {
  const [data, setData] = useState({
    title: '默认标题',
    content: '默认内容'
  })

  const handleClick = (e) => {
    setData({
      ...data,
      content: 'new'
    })
  }

  return (
    <>
      <div title={data.title}>{data.content}</div>
      <button onClick={handleClick}>切换</button>
    </>
  )
}
export default App
\`\`\`

> 数组

\`\`\`jsx
import { useState } from 'react'

function App() {
  const [data, setData] = useState([
    { id: 1, name: '小吴' },
    { id: 2, name: '小李' },
    { id: 3, name: '小花' }
  ])

  const handleClick = (e) => {
    setData([...data, { id: 4, name: '小王' }])
  }

  const listData = data.map((item) => {
    return <li key={item.id}>{item.name}</li>
  })
  return (
    <>
      <ul>{listData}</ul>
      <button onClick={handleClick}>切换</button>
    </>
  )
}
export default App
\`\`\`

### 组件

> dom组件

\`\`\`jsx
import image from './logo.svg'
function App() {
  const imgData = {
    className: 'small', //设置class
    style: {
      width: 100,
      height: 200,
      backgroundColor: 'grey'
    }
  }

  return (
    <div>
      <img src={image} alt="" {...imgData} />
      {/* <img
        src={image}
        alt=""
        className="small" //设置class
        style={imageStyle}
      /> */}
    </div>
  )
}
export default App
\`\`\`

> react组件

\`\`\`jsx
function Article({ title, content }) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Article title="bq1" content="c1" />
      <Article title="bq2" content="c2" />
      <Article title="bq3" content="c3" />
    </>
  )
}
\`\`\`

\`\`\`jsx
function Detail({content}) {
  return (
    <>
      <p>{content}</p>
    </>
  )
}

function Article({ title, detailData }) {
  return (
    <div>
      <h2>{title}</h2>
      <Detail {...detailData}/>
    </div>
  )
}

export default function App() {
  const data = {
    title: 'bq1',
    detailData: {
      content: 'c1'
    }
  }

  return (
    <>
      <Article {...data} />
    </>
  )
}
\`\`\`

### 组件插槽

> 父传子

\`\`\`jsx
function List({children}){
  //children会接受到子标签li
  return(
    <ul>
      {children}
    </ul>
  )
}

export default function App() {
  return (
    <>
      <List>
        <li>列表项</li>
        <li>列表项</li>
        <li>列表项</li>
      </List>
    </>
  )
}
\`\`\`

\`\`\`jsx
function List({ children,title,footer }) {
  //children会接受到子标签li
  return (
    <>
      <h2>{title}</h2>
      <ul>{children}</ul>
      {footer}
    </>
  )
}

export default function App() {
  return (
    <>
      <List title="列表1" footer={<p>这是底部内容</p>} >
        <li>列表项1</li>
        <li>列表项2</li>
        <li>列表项3</li>
      </List>
    </>
  )
}
\`\`\`

> 子传父

![image-20240417095909803](./react.assets/image-20240417095909803.png)

\`\`\`jsx
import { useState } from 'react'

function Detail({ onActive }) {
  const [status, setStatus] = useState(false)

  const handleClick = () => {
    setStatus(!status)
    onActive(status)
  }
  return (
    <div>
      <button onClick={handleClick}>按钮</button>
      <p
        style={{
          display: status ? 'block' : 'none'
        }}
      >
        Detail
      </p>
    </div>
  )
}

export default function App() {
  const handleActive = (status) => {
    alert(status)
  }

  return (
    <>
      <Detail onActive={handleActive} />
    </>
  )
}
\`\`\`

> 多级传递

![image-20240417105010810](./react.assets/image-20240417105010810.png)

\`\`\`jsx
// App -> A -> B

import { createContext, useContext } from "react"

// 1. createContext方法创建一个上下文对象

const MsgContext = createContext()

// 2. 在顶层组件 通过Provider组件提供数据

// 3. 在底层组件 通过useContext钩子函数使用数据

function A () {
  return (
    <div>
      this is A component
      <B />
    </div>
  )
}

function B () {
  const msg = useContext(MsgContext)
  return (
    <div>
      this is B compnent,{msg}
    </div>
  )
}

function App () {
  const msg = 'this is app msg'
  return (
    <div>
      <MsgContext.Provider value={msg}>
        this is App
        <A />
      </MsgContext.Provider>
    </div>
  )
}

export default App

\`\`\`





### Hook

#### useState

单向数据绑定

####  useReducer

![image-20240416165053526](./react.assets/image-20240416165053526.png)

![image-20240416165225805](./react.assets/image-20240416165225805.png)

#### ref

> 

![image-20240416165840214](./react.assets/image-20240416165840214.png)

<img src="./react.assets/image-20240416165849467.png" alt="image-20240416165849467" style="zoom:67%;" />

> 绑定dom

<img src="./react.assets/image-20240416232942786.png" alt="image-20240416232942786" style="zoom:67%;" />

#### useImperativeHandle & forwardRef

 ![image-20240416170217196](./react.assets/image-20240416170217196.png)

![image-20240416171947987](./react.assets/image-20240416171947987.png)

#### useEffert

类似于onMounted

 ![image-20240417110949777](./react.assets/image-20240417110949777.png)

\`\`\`jsx
import { useEffect, useState } from "react"

const URL = 'http://geek.itheima.net/v1_0/channels'

function App () {
  // 创建一个状态数据
  const [list, setList] = useState([])
  useEffect(() => {
    // 额外的操作 获取频道列表
    async function getList () {
      const res = await fetch(URL)
      const jsonRes = await res.json()
      console.log(jsonRes)
      setList(jsonRes.data.channels)
    }
    getList()
  }, [])
  return (
    <div>
      this is app
      <ul>
        {list.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  )
}

export default App

\`\`\`

![image-20240417111814534](./react.assets/image-20240417111814534.png)

> 清除副作用

![image-20240417112807606](./react.assets/image-20240417112807606.png)

#### useMemo

数据缓存

#### 自定义Hook





`;export{n as default};
