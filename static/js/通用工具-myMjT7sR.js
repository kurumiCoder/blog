const n=`# 通用工具

## 图标

[Favicon.im: 即时网站图标获取器](https://favicon.im/zh)

## 异步数据缓存同步工具

### TanStack Query

[TanStack Query - TanStack 文档](https://tanstack.com.cn/query/latest)

**底层通常还是用 Axios（或 fetch）去请求**，但帮你管好了状态。

用了它之后，你的代码变成：
\`\`\`js
const { data, isLoading, error } = useQuery({
  queryKey: ['user'],
  queryFn: () => axios.get('/api/user').then(res => res.data)
})
\`\`\`
*   自动缓存：多个组件用同一个 \`queryKey\`，只发一次请求。
*   自动刷新：切回页面，数据自动更新。
*   自动重试：网络失败，自动重试。
*   自动处理 loading 和 error。
`;export{n as default};
