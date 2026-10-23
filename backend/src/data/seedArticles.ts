import type { ArticleStatus } from '../models/Article.js';

export type SeedArticle = {
  title: string;
  slug: string;
  summary: string;
  contentMarkdown: string;
  category: string;
  tags: string[];
  coverUrl?: string;
  status: ArticleStatus;
  publishedAt: Date;
};

const seed = (input: Omit<SeedArticle, 'publishedAt'> & { publishedAt: string }): SeedArticle => ({
  ...input,
  publishedAt: new Date(input.publishedAt),
});

export const seedArticles: SeedArticle[] = [
  seed({
    title: '让 3D 发光，但不让浏览器尖叫',
    slug: 'light-without-noise',
    summary: '一次关于粒子、Bloom 和移动端性能预算的复盘：炫酷不等于把每一个像素都点亮。',
    category: 'webgl',
    tags: ['Three.js', 'Performance', 'Motion'],
    status: 'published',
    publishedAt: '2026-09-18T00:00:00.000Z',
    contentMarkdown: `## 先决定哪里应该安静\n\n第一次做实时 3D 页面时，我总想把更多粒子、更多光晕和更多运动塞进视野。真正开始测试后才发现，观众感受到的不是元素数量，而是视觉焦点是否清楚。星云的价值来自中心的晶体，而不是背景里每一颗都在抢注意力的星。\n\n因此我把场景分成三层：核心负责叙事，轨道负责方向感，星尘只提供深度。正文出现时，核心主动降低亮度和运动幅度，让界面从主角变成环境。\n\n## 像素预算比帧率更早耗尽\n\n在移动端，最昂贵的往往不是几何体，而是大面积透明叠加与后处理。Bloom 很迷人，但它的成本与分辨率直接相关。桌面保留完整辉光，中低宽度视口使用更小的粒子贴图、降低设备像素比，并把部分光晕交给 CSS 径向渐变完成。\n\n## 把性能做成可见的体验\n\n最终目标不是让开发者炫耀自己会写 GLSL，而是让访问者感觉页面愿意回应。指针移动时的轻微滞后、滚动时场景的缓慢退场、文章打开时背景的收敛，这些细节都在告诉人：你知道我正在做什么。`,
  }),
  seed({
    title: '动效不是装饰，是界面的语法',
    slug: 'motion-is-grammar',
    summary: '为什么好的动效会让操作看起来有因果，而不只是让页面看起来会动。',
    category: 'motion',
    tags: ['Interaction', 'CSS', 'Rhythm'],
    status: 'published',
    publishedAt: '2026-08-02T00:00:00.000Z',
    contentMarkdown: `## 每个动作都需要一个理由\n\n如果一个动效只能被描述为“飞进来”，它通常还不够具体。好的动效回答的是：元素从哪里来、为什么现在出现、它和谁发生了关系，以及用户接下来应该看哪里。\n\n在我的博客里，卡片倾斜不是为了让鼠标显得聪明，而是为了让平面拥有厚度。详情层从卡片位置扩展，也不是炫技，而是帮助用户保留空间记忆。\n\n## 节奏比曲线更重要\n\n很多动效看起来廉价，并不是因为缓动函数不对，而是因为所有元素同时出发、同时结束。我会把信息拆成主、次和背景三个节奏：标题先建立方向，内容随后抵达，环境最后轻轻跟随。\n\n## 为减少动态效果留出另一条路\n\n动效系统必须从第一天就考虑前庭敏感和注意力差异。减少动态并不是删掉所有状态，而是用淡入、颜色变化和即时位移表达同样的因果关系。`,
  }),
  seed({
    title: '用 CSS 建立真正的空间层级',
    slug: 'css-depth',
    summary: '玻璃、阴影和透视只有服务于阅读顺序时，才会让界面显得有纵深。',
    category: 'craft',
    tags: ['CSS', 'Depth', 'Design systems'],
    status: 'published',
    publishedAt: '2026-06-24T00:00:00.000Z',
    contentMarkdown: `## 先有层级，再有玻璃\n\n透明度不会自动创造空间。如果前后层没有清晰的内容职责，玻璃只会让文字更难读。我的顺序是先确定信息层、操作层和环境层，再给它们不同的明度、模糊程度与运动权限。\n\n在这个页面中，导航是最靠前的操作层，卡片是可触摸的信息层，星云和纹理是环境层。环境层可以慢，信息层需要稳定，操作层必须即时响应。\n\n## 阴影描述关系，不描述重量\n\n大而黑的阴影常常让界面显得沉重。更有效的办法是用光源方向、环境色溢出和极细的描边共同描述距离。悬停时的阴影应该更像光从卡片下方穿过，而不是卡片突然重了一倍。\n\n## 透视必须保护文字\n\n任何 3D 变换都不能牺牲可读性。卡片倾斜时，我会把文本放在更浅的变换层，并把最大角度控制在几度以内；移动端直接移除倾斜，改用按压缩放和高光位置表达反馈。`,
  }),
  seed({
    title: '为慢速浏览器设计，而不是为演示机',
    slug: 'slow-browser',
    summary: '真正可靠的创意前端，需要在网络变慢、设备变热之后仍然保住叙事。',
    category: 'craft',
    tags: ['Performance', 'Progressive enhancement', 'Access'],
    status: 'published',
    publishedAt: '2026-04-11T00:00:00.000Z',
    contentMarkdown: `## 先交付内容，再交付奇观\n\n演示视频中的页面永远拥有最好的设备和网络。真实用户没有。因此我把所有核心信息做成普通 HTML，让 Three.js 成为增强层。即使 WebGL 被禁用，标题、项目、文章和联系方式依然完整可读。\n\n这不是保守，而是让创意有更长的寿命。奇观会随着设备变旧而消失，清晰的结构会一直工作。\n\n## 降级不等于平凡\n\nCSS 同样可以表达空间：渐变光场、透视网格、错位文字和精准的阴影都能建立纵深。3D 失败时，页面不应该像被拔掉电池，而应该像换了一种观看角度。\n\n## 测量用户能感受到的东西\n\n我只关注三个指标：首次内容出现要快、交互开始后不能卡、滚动过程中不能出现突然的大面积重绘。它们比一个漂亮的总分更接近真实体验。`,
  }),
];
