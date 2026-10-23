import type { Article, Localized, Project } from '../types';

export const t = (zh: string, en: string): Localized => ({ zh, en });

export const profile = {
  name: t('林澈', 'LIN CHE'),
  role: t('创意开发者 / 设计工程师', 'Creative Developer / Design Engineer'),
  heroLineOne: t('在代码与想象之间，', 'Between code and imagination,'),
  heroLineTwo: t('构建有引力的体验。', 'I build experiences with gravity.'),
  intro: t('专注于 Three.js、交互叙事与高性能前端。把空间感、节奏和情绪，写进每一次点击、滚动与注视里。', 'Focused on Three.js, interactive storytelling, and high-performance frontend. I write space, rhythm, and emotion into every click, scroll, and glance.'),
  location: t('中国 · 上海', 'Shanghai · China'),
  signature: t('让屏幕拥有纵深', 'Give the screen depth'),
};

export const metrics = [
  { value: '05', suffix: '+', label: t('年创意开发', 'years creating') },
  { value: '24', suffix: '', label: t('个完整项目', 'projects shipped') },
  { value: '42', suffix: '', label: t('篇技术随笔', 'notes published') },
  { value: '09', suffix: '', label: t('次设计奖项', 'design awards') },
];

export const skillGroups = [
  { code: '01', title: t('创意工程', 'Creative engineering'), description: t('把视觉概念翻译成流畅、可靠的实时体验。', 'Turning visual concepts into fluid, reliable real-time experiences.'), skills: ['Three.js', 'WebGL / GLSL', 'Canvas 2D', 'Motion systems'] },
  { code: '02', title: t('界面系统', 'Interface systems'), description: t('从设计令牌到组件边界，保持复杂产品的一致与弹性。', 'From design tokens to component boundaries, keeping complex products coherent.'), skills: ['JavaScript / TS', 'Semantic HTML', 'CSS architecture', 'React'] },
  { code: '03', title: t('体验交付', 'Experience delivery'), description: t('用性能、可访问性和真实用户场景检验每个细节。', 'Testing every detail against performance, accessibility, and real use.'), skills: ['Performance', 'Accessibility', 'Animation QA', 'Node.js'] },
];

export const categories = [
  { id: 'all', code: '00', label: t('全部', 'All'), description: t('浏览所有文章与近期思考。', 'Browse every article and recent thought.') },
  { id: 'webgl', code: '01', label: t('空间与 WebGL', 'Space & WebGL'), description: t('实时图形、着色器、空间叙事与性能边界。', 'Realtime graphics, shaders, spatial stories, and performance limits.') },
  { id: 'motion', code: '02', label: t('动效节奏', 'Motion'), description: t('让反馈拥有因果、顺序和恰到好处的速度。', 'Giving feedback causality, sequence, and the right pace.') },
  { id: 'craft', code: '03', label: t('工程手记', 'Craft'), description: t('关于 CSS、性能、可访问性与可靠交付的实践。', 'Practice notes on CSS, performance, and reliable delivery.') },
];

export const projects: Project[] = [
  { id: 'nebula-atlas', index: '01', year: '2026', title: t('星云图谱', 'Nebula Atlas'), type: t('实时数据叙事', 'Real-time data story'), summary: t('将城市气候数据变成一片可探索的发光星云，让复杂趋势拥有空间与呼吸。', 'Turning urban climate data into an explorable luminous nebula, giving complex trends space to breathe.'), stack: ['Three.js', 'WebGL', 'D3'], art: 'atlas' },
  { id: 'echo-chamber', index: '02', year: '2025', title: t('回声剧场', 'Echo Chamber'), type: t('生成式声音现场', 'Generative audio experience'), summary: t('观众的声音在浏览器里变成可触摸的几何体，每一次表演都无法被复制。', 'Audience voices become touchable geometry in the browser. No two performances are ever the same.'), stack: ['Web Audio', 'GLSL', 'WebSocket'], art: 'echo' },
  { id: 'orbit-commerce', index: '03', year: '2025', title: t('轨道商店', 'Orbit Commerce'), type: t('3D 产品体验', '3D product experience'), summary: t('用轨道式浏览取代传统商品网格，让用户围绕产品理解材质、比例和细节。', 'Replacing a conventional product grid with orbital browsing so people understand material, scale, and detail.'), stack: ['Three.js', 'GSAP', 'Vite'], art: 'orbit' },
  { id: 'signal-journal', index: '04', year: '2024', title: t('信号手记', 'Signal Journal'), type: t('数字出版系统', 'Digital publishing system'), summary: t('一套会随文章节奏改变的编辑体验，让长阅读安静、专注而有记忆点。', 'An editorial experience that changes tempo with each story, making long-form reading calm and memorable.'), stack: ['Vanilla JS', 'CSS', 'Contentful'], art: 'signal' },
];

export const fallbackArticles: Article[] = [
  { _id: 'light-without-noise', title: '让 3D 发光，但不让浏览器尖叫', slug: 'light-without-noise', summary: '一次关于粒子、Bloom 和移动端性能预算的复盘：炫酷不等于把每一个像素都点亮。', contentMarkdown: '# 让 3D 发光，但不让浏览器尖叫\n\n第一次做实时 3D 页面时，我总想把更多粒子、更多光晕和更多运动塞进视野。真正开始测试后才发现，观众感受到的不是元素数量，而是视觉焦点是否清楚。\n\n## 先决定哪里应该安静\n\n我把场景分成三层：核心负责叙事，轨道负责方向感，星尘只提供深度。\n\n## 像素预算比帧率更早耗尽\n\n在移动端，最昂贵的往往不是几何体，而是大面积透明叠加与后处理。', category: 'webgl', tags: ['Three.js', 'Performance', 'Motion'], status: 'published', publishedAt: '2026-09-18T00:00:00.000Z', createdAt: '2026-09-18T00:00:00.000Z', updatedAt: '2026-09-18T00:00:00.000Z', featured: true, readTime: 7 },
  { _id: 'motion-is-grammar', title: '动效不是装饰，是界面的语法', slug: 'motion-is-grammar', summary: '为什么好的动效会让操作看起来有因果，而不只是让页面看起来会动。', contentMarkdown: '# 动效不是装饰，是界面的语法\n\n如果一个动效只能被描述为“飞进来”，它通常还不够具体。好的动效回答的是：元素从哪里来、为什么现在出现、它和谁发生了关系。\n\n## 节奏比曲线更重要\n\n我会把信息拆成主、次和背景三个节奏：标题先建立方向，内容随后抵达，环境最后轻轻跟随。', category: 'motion', tags: ['Interaction', 'CSS', 'Rhythm'], status: 'published', publishedAt: '2026-08-02T00:00:00.000Z', createdAt: '2026-08-02T00:00:00.000Z', updatedAt: '2026-08-02T00:00:00.000Z', readTime: 5 },
  { _id: 'css-depth', title: '用 CSS 建立真正的空间层级', slug: 'css-depth', summary: '玻璃、阴影和透视只有服务于阅读顺序时，才会让界面显得有纵深。', contentMarkdown: '# 用 CSS 建立真正的空间层级\n\n透明度不会自动创造空间。如果前后层没有清晰的内容职责，玻璃只会让文字更难读。\n\n## 阴影描述关系，不描述重量\n\n光源方向、环境色溢出和极细的描边共同描述距离。', category: 'craft', tags: ['CSS', 'Depth', 'Design systems'], status: 'published', publishedAt: '2026-06-24T00:00:00.000Z', createdAt: '2026-06-24T00:00:00.000Z', updatedAt: '2026-06-24T00:00:00.000Z', readTime: 6 },
  { _id: 'slow-browser', title: '为慢速浏览器设计，而不是为演示机', slug: 'slow-browser', summary: '真正可靠的创意前端，需要在网络变慢、设备变热之后仍然保住叙事。', contentMarkdown: '# 为慢速浏览器设计，而不是为演示机\n\n我把所有核心信息做成普通 HTML，让 Three.js 成为增强层。即使 WebGL 被禁用，标题、项目、文章和联系方式依然完整可读。\n\n## 先交付内容，再交付奇观\n\n这不是保守，而是让创意有更长的寿命。', category: 'craft', tags: ['Performance', 'Progressive enhancement', 'Access'], status: 'published', publishedAt: '2026-04-11T00:00:00.000Z', createdAt: '2026-04-11T00:00:00.000Z', updatedAt: '2026-04-11T00:00:00.000Z', readTime: 4 },
];

