# 星轨手记 / Orbit Notes

一个使用原生 HTML、CSS、JavaScript 和 Three.js 构建的双语个人博客。

## 本地运行

Three.js 通过 ES Module 从 CDN 加载，因此需要使用静态服务器：

```powershell
python -m http.server 4173
```

然后打开 <http://127.0.0.1:4173>。

## 功能

- Three.js 晶体、轨道环、粒子星云与 Bloom 辉光
- 中英双语切换和深浅主题切换，选择自动保存
- 四篇完整双语文章、分类筛选与标题/标签搜索
- 四个可展开项目案例、技能图谱和成长时间线
- 桌面与移动端响应式布局、键盘操作和减少动态效果模式
- CDN 或 WebGL 不可用时自动启用 CSS 星云降级

内容集中在 `js/data.js`，页面交互位于 `js/app.js`，Three.js 场景位于 `js/scene.js`。
