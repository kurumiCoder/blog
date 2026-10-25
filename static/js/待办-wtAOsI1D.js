const n=`# Next









# Test

\`\`\`R
你的 2D time-lapse
        ↓
① 确认数据参数
   ├─ 帧数
   ├─ 时间间隔 Δt
   ├─ 像素尺寸
   ├─ 图像 bit depth
   └─ 是否存在漂移
        ↓
② 做单帧 segmentation
        ↓
③ 验证 MitoGraph 能不能正确分割
        ↓
④ 得到 skeleton
        ↓
⑤ 测试 MitoTNT 能不能在 2D 情况下运行
        ↓
⑥ 得到 tracking
        ↓
⑦ 人工制作少量 GT
        ↓
⑧ 计算 tracking accuracy
        ↓
⑨ 与简单 baseline 比较
        ↓
⑩ 再做 biological validation
\`\`\`

`;export{n as default};
