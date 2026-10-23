const t = (zh, en) => ({ zh, en });

export const ui = {
  brand: t("星轨手记", "ORBIT NOTES"),
  brandMark: "LC",
  nav: {
    home: t("首页", "Home"),
    notes: t("文章", "Articles"),
    categories: t("分类", "Categories"),
    about: t("我的", "Me"),
  },
  menuOpen: t("打开导航菜单", "Open navigation"),
  menuClose: t("关闭导航菜单", "Close navigation"),
  themeToLight: t("切换到浅色主题", "Switch to light theme"),
  themeToDark: t("切换到深色主题", "Switch to dark theme"),
  switchLanguage: t("Switch to English", "切换为中文"),
  available: t("目前接受新的创意项目", "Available for select projects"),
  scrollHint: t("向下探索", "Scroll to explore"),
  exploreWork: t("探索精选项目", "Explore selected work"),
  readNotes: t("阅读最近文章", "Read recent notes"),
  sectionEyebrow: {
    about: t("01 / 关于我", "01 / About"),
    skills: t("02 / 能力图谱", "02 / Capabilities"),
    work: t("03 / 精选项目", "03 / Selected work"),
    notes: t("04 / 最近书写", "04 / Recent notes"),
    journey: t("05 / 时间坐标", "05 / Journey"),
    contact: t("06 / 建立连接", "06 / Get in touch"),
  },
  aboutTitle: t("把想象编译成可以被触摸的体验。", "Compiling imagination into experiences you can feel."),
  aboutLead: t(
    "我是林澈，一名游走在设计与工程交界处的创意开发者。用代码构建光、空间与情绪，也关心一个界面在键盘、屏幕和慢网络里是否依然从容。",
    "I'm Lin Che, a creative developer working where design and engineering meet. I build light, space, and emotion with code—while caring how an interface holds up on a keyboard, a small screen, or a slow network."
  ),
  aboutBody: t(
    "过去五年，我把复杂的数据、品牌故事和实验性交互变成可用的数字产品。喜欢从一张草图开始，一路打磨到每一帧的节奏，也喜欢把不可见的技术细节变成直觉。",
    "For the past five years, I've turned complex data, brand stories, and experimental interactions into usable digital products. I like starting from a sketch and refining every frame, then making invisible technical details feel intuitive."
  ),
  aboutAvailability: t("上海 / 远程协作 / GMT+8", "Shanghai / Remote / GMT+8"),
  aboutSignature: t("设计工程师 · 空间叙事者", "Design engineer · Spatial storyteller"),
  skillsTitle: t("不止是技术栈，更是一套把想法推向真实世界的方法。", "More than a stack—a way of moving ideas into the real world."),
  skillsIntro: t(
    "从视觉原型到可交付产品，我愿意对体验、性能与细节负责。拖动视角，让能力图谱随你的指针流动。",
    "From visual prototype to production, I take ownership of experience, performance, and detail. Move your pointer and let the map flow with you."
  ),
  workTitle: t("四个被认真对待的世界。", "Four worlds built with care."),
  workIntro: t(
    "每个项目都从一个具体问题出发，以可用的界面、克制的动效和可持续的代码收尾。悬停卡片可查看空间反馈，点击进入完整案例。",
    "Each project begins with a specific problem and ends with a usable interface, restrained motion, and sustainable code. Hover for spatial feedback; open for the full story."
  ),
  notesTitle: t("在代码、空间与人的感受之间。", "Between code, space, and human feeling."),
  notesIntro: t(
    "记录构建过程中的判断、取舍与实践。筛选一种主题，或者直接打开一篇慢慢读。",
    "Notes on decisions, trade-offs, and practice. Filter a theme, or open one and take your time."
  ),
  journeyTitle: t("沿着时间，持续向未知偏移。", "Following time, drifting toward the unknown."),
  contactTitle: t("下一段轨迹，一起绘制。", "Let's chart the next orbit together."),
  contactBody: t(
    "如果你正在构思一个有野心的数字体验，或者只是想交换一个关于网页空间感的想法，欢迎来信。",
    "If you're shaping an ambitious digital experience—or simply want to trade ideas about space on the web—my inbox is open."
  ),
  emailLabel: t("发送邮件", "Send an email"),
  copyEmail: t("复制邮箱", "Copy email"),
  copied: t("邮箱已复制", "Email copied"),
  copyFailed: t("复制失败，请手动选择邮箱", "Copy failed. Please select the email manually."),
  currentFilter: t("当前主题", "Showing"),
  allNotes: t("全部文章", "All notes"),
  readArticle: t("打开文章", "Read article"),
  viewProject: t("查看案例", "View case study"),
  close: t("关闭", "Close"),
  discussProject: t("讨论这类项目", "Discuss a project like this"),
  projectOverview: t("项目概览", "Overview"),
  challenge: t("挑战", "The challenge"),
  solution: t("做法", "The approach"),
  outcome: t("成果", "Outcome"),
  roles: t("角色", "Role"),
  year: t("年份", "Year"),
  stack: t("技术栈", "Stack"),
  articleMeta: t("阅读时长", "Read time"),
  minutes: t("分钟", "min"),
  backToTop: t("回到顶部", "Back to top"),
  footerLine: t("用代码与好奇心持续构建", "Built with code and curiosity"),
  noResults: t("这个主题暂时还没有文章。", "No notes in this theme yet."),
  clearFilters: t("清除筛选", "Clear filters"),
  noSearchResults: t("没有找到与“{query}”匹配的文章。", "No articles match “{query}”."),
  noFilteredResults: t(
    "“{query}”在「{category}」中没有匹配结果。",
    "No {category} articles match “{query}”."
  ),
  noCategoryResults: t("「{category}」下暂时还没有文章。", "No {category} articles yet."),
  resultStatus: t("显示 {count} 条匹配结果。", "Showing {count} matching results."),
  clearSearch: t("清除搜索", "Clear search"),
  viewAllArticles: t("查看全部文章", "View all articles"),
  loading: t("正在构建视界", "Constructing the view"),
  loadingDetail: t("校准粒子 · 点亮轨道 · 加载文字", "Calibrating particles · Igniting orbits · Loading words"),
  skip: t("跳到主要内容", "Skip to main content"),
  demoNote: t("示例项目，无外部演示链接", "Concept project — no external demo"),
  articlesEyebrow: t("02 / 全部文章", "02 / All articles"),
  articlesTitle: t("一些值得展开的想法。", "Ideas worth unfolding."),
  articlesIntro: t(
    "从实时图形到交互细节，记录每一次判断背后的原因。先选择方向，再打开一篇慢慢读。",
    "From realtime graphics to interaction detail, these notes uncover the reasoning behind each decision. Pick a direction, then open one and take your time."
  ),
  categoriesEyebrow: t("03 / 内容分类", "03 / Categories"),
  categoriesTitle: t("顺着兴趣，找到下一条轨迹。", "Follow an interest to the next orbit."),
  categoriesIntro: t(
    "文章按照关注的方向组织。切换分类会立即更新文章列表，并保留在当前页面。",
    "Articles are organized by recurring themes. Switching a category updates the article list in place."
  ),
  profileEyebrow: t("04 / 关于我", "04 / About me"),
  featuredEyebrow: t("精选阅读", "Selected notes"),
  featuredTitle: t("最近写下的一些事。", "Recently written."),
  featuredLink: t("查看全部文章", "View all articles"),
  workEyebrow: t("实验与作品", "Experiments & work"),
  workLink: t("了解我的方法", "See how I work"),
  categoryLabel: t("篇文章", "articles"),
};

export const profile = {
  name: t("林澈", "LIN CHE"),
  displayName: t("林澈", "Lin Che"),
  role: t("创意开发者 / 设计工程师", "Creative Developer / Design Engineer"),
  heroLineOne: t("在代码与想象之间，", "Between code and imagination,"),
  heroLineTwo: t("构建有引力的体验。", "I build experiences with gravity."),
  intro: t(
    "专注于 Three.js、交互叙事与高性能前端。把空间感、节奏和情绪，写进每一次点击、滚动与注视里。",
    "Focused on Three.js, interactive storytelling, and high-performance frontend. I write space, rhythm, and emotion into every click, scroll, and glance."
  ),
  location: t("中国 · 上海", "Shanghai · China"),
  coordinates: "31.2304° N / 121.4737° E",
  signature: t("让屏幕拥有纵深", "Give the screen depth"),
};

export const metrics = [
  { value: "05", suffix: "+", label: t("年创意开发", "years creating") },
  { value: "24", suffix: "", label: t("个完整项目", "projects shipped") },
  { value: "42", suffix: "", label: t("篇技术随笔", "notes published") },
  { value: "09", suffix: "", label: t("次设计奖项", "design awards") },
];

export const skillGroups = [
  {
    id: "creative",
    code: "01",
    title: t("创意工程", "Creative engineering"),
    description: t("把视觉概念翻译成流畅、可靠的实时体验。", "Turning visual concepts into fluid, reliable real-time experiences."),
    skills: ["Three.js", "WebGL / GLSL", "Canvas 2D", "Motion systems"],
    position: "top-left",
  },
  {
    id: "interface",
    code: "02",
    title: t("界面系统", "Interface systems"),
    description: t("从设计令牌到组件边界，保持复杂产品的一致与弹性。", "From design tokens to component boundaries, keeping complex products coherent and adaptable."),
    skills: ["JavaScript / TS", "Semantic HTML", "CSS architecture", "React"],
    position: "top-right",
  },
  {
    id: "delivery",
    code: "03",
    title: t("体验交付", "Experience delivery"),
    description: t("用性能、可访问性和真实用户场景检验每个细节。", "Testing every detail against performance, accessibility, and real use."),
    skills: ["Performance", "Accessibility", "Animation QA", "Node.js"],
    position: "bottom",
  },
];

export const projects = [
  {
    id: "nebula-atlas",
    index: "01",
    year: "2026",
    title: t("星云图谱", "Nebula Atlas"),
    type: t("实时数据叙事", "Real-time data story"),
    summary: t(
      "将城市气候数据变成一片可探索的发光星云，让复杂趋势拥有空间与呼吸。",
      "Turning urban climate data into an explorable luminous nebula, giving complex trends space to breathe."
    ),
    overview: t(
      "面向公众研究者的数据体验，让没有分析背景的人也能通过探索、比较和故事线索理解十年的气候变化。",
      "A public-facing data experience that helps people without an analytics background understand a decade of climate change through exploration, comparison, and narrative cues."
    ),
    challenge: t(
      "原始数据包含 18 个城市、多个年度和七类指标。传统仪表盘能够陈列数字，却无法传达数据之间的关系与变化的速度。",
      "The raw dataset covered 18 cities, multiple years, and seven metrics. A conventional dashboard could display numbers but not the relationships or the pace of change."
    ),
    solution: t(
      "我设计了以粒子密度表示样本量、色相表示温度偏移的 3D 图谱，并用可键盘控制的聚焦环替代纯鼠标探索。移动端将场域转化为可横向浏览的卡片轨道。",
      "I mapped sample density to particles and temperature deviation to hue, then replaced pointer-only exploration with a keyboard-accessible focus ring. On mobile, the field becomes a horizontal card orbit."
    ),
    outcome: t(
      "上线首月有超过 3.2 万次深度探索，平均停留时间提升 64%，并获得当年 CSS Design Awards 数据可视化提名。",
      "More than 32,000 deep explorations in the first month, a 64% increase in average session time, and a CSS Design Awards data visualization nomination."
    ),
    role: t("创意开发 / 视觉系统", "Creative development / Visual system"),
    stack: ["Three.js", "WebGL", "D3", "TypeScript"],
    metrics: [
      { value: "32K", label: t("首月探索", "first-month explorations") },
      { value: "+64%", label: t("停留时长", "session time") },
    ],
    art: "atlas",
  },
  {
    id: "echo-chamber",
    index: "02",
    year: "2025",
    title: t("回声剧场", "Echo Chamber"),
    type: t("生成式声音现场", "Generative audio experience"),
    summary: t(
      "观众的声音在浏览器里变成可触摸的几何体，每一次表演都无法被复制。",
      "Audience voices become touchable geometry in the browser. No two performances are ever the same."
    ),
    overview: t(
      "为独立音乐节创作的实时视觉装置，让现场观众通过手机麦克风参与一场不断生长的数字雕塑。",
      "A real-time visual installation for an independent music festival, inviting the audience to shape a growing digital sculpture through their phone microphones."
    ),
    challenge: t(
      "现场网络不稳定，参与者设备差异巨大，同时声音数据不能让观众感到隐私被侵犯。",
      "The venue network was unstable, participant devices varied wildly, and people needed to feel that their audio was handled privately."
    ),
    solution: t(
      "音频只在设备本地分析为能量与频率摘要，再通过低带宽消息驱动共享场景。视觉采用程序化几何与自定义噪波着色器，避免下载大型模型。",
      "Audio was analyzed locally into energy and frequency summaries, with only low-bandwidth messages driving the shared scene. Procedural geometry and custom noise shaders avoided heavy model downloads."
    ),
    outcome: t(
      "超过 1,100 名观众参与，装置在两天内持续运行 14 小时；团队用一套移动端降级方案覆盖了现场全部设备。",
      "Over 1,100 participants joined, and the installation ran for 14 hours across two days. One mobile fallback system covered every device in the venue."
    ),
    role: t("创意技术 / 实时系统", "Creative technology / Realtime system"),
    stack: ["Three.js", "Web Audio", "WebSocket", "GLSL"],
    metrics: [
      { value: "1.1K", label: t("现场参与者", "live participants") },
      { value: "14h", label: t("持续运行", "continuous runtime") },
    ],
    art: "echo",
  },
  {
    id: "orbit-commerce",
    index: "03",
    year: "2025",
    title: t("轨道商店", "Orbit Commerce"),
    type: t("3D 产品体验", "3D product experience"),
    summary: t(
      "用轨道式浏览取代传统商品网格，让用户围绕产品理解材质、比例和细节。",
      "Replacing a conventional product grid with orbital browsing so people understand material, scale, and detail."
    ),
    overview: t(
      "为一家模块化家居品牌设计的沉浸式电商概念，让产品的组合方式可以在空间中直接操作。",
      "An immersive commerce concept for a modular furniture brand, letting people assemble products directly in space."
    ),
    challenge: t(
      "3D 购物容易牺牲加载速度与可用性。项目需要在中端手机上 2.5 秒内呈现可操作场景，同时保留完整购买路径。",
      "3D shopping often sacrifices loading speed and usability. The experience needed an interactive scene within 2.5 seconds on a mid-range phone while preserving the complete purchase path."
    ),
    solution: t(
      "使用渐进式几何加载、简化材质和实例化渲染，并把视角控制、尺寸切换与购买操作放在同一信息层。用户可随时回到标准商品视图。",
      "Progressive geometry loading, simplified materials, and instanced rendering supported the scene. Camera controls, size selection, and purchase actions shared one information layer, with an always-available standard product view."
    ),
    outcome: t(
      "试穿式交互使产品配置完成率提高 38%，Lighthouse 移动端性能达到 91，3D 与二维视图均保持可购买。",
      "The configurator increased completed product setups by 38%. Mobile Lighthouse performance reached 91, with both 3D and 2D views checkout-ready."
    ),
    role: t("视觉原型 / 前端架构", "Visual prototype / Frontend architecture"),
    stack: ["Three.js", "GSAP", "Vite", "Shopify API"],
    metrics: [
      { value: "+38%", label: t("配置完成率", "config completion") },
      { value: "91", label: t("移动端性能", "mobile performance") },
    ],
    art: "orbit",
  },
  {
    id: "signal-journal",
    index: "04",
    year: "2024",
    title: t("信号手记", "Signal Journal"),
    type: t("数字出版系统", "Digital publishing system"),
    summary: t(
      "一套会随文章节奏改变的编辑体验，让长阅读安静、专注而有记忆点。",
      "An editorial experience that changes tempo with each story, making long-form reading calm, focused, and memorable."
    ),
    overview: t(
      "为独立科技媒体重构文章系统，在保留极快加载速度的前提下，为不同主题建立独特的视觉语气。",
      "A rebuilt article system for an independent technology publication, creating a distinct visual voice for each topic while keeping loading speed exceptional."
    ),
    challenge: t(
      "编辑部每周发布多篇长文，视觉表达必须来自内容结构，而不是依赖大型图片或难以维护的手工页面。",
      "The editorial team published several long reads each week. Visual expression had to emerge from content structure rather than large images or hard-to-maintain bespoke pages."
    ),
    solution: t(
      "建立基于文章标签的动态主题系统，并把引用、数据、代码与图集做成可组合的内容模块。滚动进度、标题定位和阅读节奏均由同一套轻量状态控制。",
      "A tag-driven theme system and composable modules for quotations, data, code, and galleries. Scroll progress, heading position, and reading rhythm all came from one lightweight state layer."
    ),
    outcome: t(
      "文章发布速度提升 2.6 倍，首屏体积下降 44%，四篇文章进入年度阅读榜前十。",
      "Publishing became 2.6× faster, initial payload dropped 44%, and four stories entered the year's top-ten most-read list."
    ),
    role: t("产品设计 / 前端开发", "Product design / Frontend development"),
    stack: ["Vanilla JS", "CSS", "Contentful", "Performance"],
    metrics: [
      { value: "2.6×", label: t("发布效率", "publishing speed") },
      { value: "-44%", label: t("首屏体积", "initial payload") },
    ],
    art: "signal",
  },
];

export const noteFilters = [
  {
    id: "all",
    code: "00",
    label: t("全部", "All"),
    description: t("浏览所有文章与近期思考。", "Browse every article and recent thought."),
  },
  {
    id: "webgl",
    code: "01",
    label: t("空间与 WebGL", "Space & WebGL"),
    description: t("实时图形、着色器、空间叙事与性能边界。", "Realtime graphics, shaders, spatial stories, and performance limits."),
  },
  {
    id: "motion",
    code: "02",
    label: t("动效节奏", "Motion"),
    description: t("让反馈拥有因果、顺序和恰到好处的速度。", "Giving feedback causality, sequence, and the right pace."),
  },
  {
    id: "craft",
    code: "03",
    label: t("工程手记", "Craft"),
    description: t("关于 CSS、性能、可访问性与可靠交付的实践。", "Practice notes on CSS, performance, accessibility, and reliable delivery."),
  },
];

export const posts = [
  {
    id: "light-without-noise",
    category: "webgl",
    date: "2026-09-18",
    readTime: 7,
    featured: true,
    title: t("让 3D 发光，但不让浏览器尖叫", "Make 3D Glow Without Making Browsers Scream"),
    excerpt: t(
      "一次关于粒子、Bloom 和移动端性能预算的复盘：炫酷不等于把每一个像素都点亮。",
      "A review of particles, bloom, and mobile budgets: spectacle does not mean lighting every pixel."
    ),
    tags: ["Three.js", "Performance", "Motion"],
    sections: [
      {
        heading: t("先决定哪里应该安静", "Decide where it should be quiet"),
        paragraphs: [
          t(
            "第一次做实时 3D 页面时，我总想把更多粒子、更多光晕和更多运动塞进视野。真正开始测试后才发现，观众感受到的不是元素数量，而是视觉焦点是否清楚。星云的价值来自中心的晶体，而不是背景里每一颗都在抢注意力的星。",
            "When I first built real-time 3D pages, I wanted to add more particles, more glow, and more movement. Testing revealed that people do not experience the number of elements; they experience whether the visual focus is clear. The nebula matters because of its crystal core, not because every background star competes for attention."
          ),
          t(
            "因此我把场景分成三层：核心负责叙事，轨道负责方向感，星尘只提供深度。正文出现时，核心主动降低亮度和运动幅度，让界面从主角变成环境。",
            "So I split the scene into three layers: the core carries the story, the orbits establish direction, and the dust supplies depth. When body copy enters, the core deliberately reduces brightness and movement, changing from protagonist to atmosphere."
          ),
        ],
      },
      {
        heading: t("像素预算比帧率更早耗尽", "The pixel budget runs out first"),
        paragraphs: [
          t(
            "在移动端，最昂贵的往往不是几何体，而是大面积透明叠加与后处理。Bloom 很迷人，但它的成本与分辨率直接相关。我的策略是桌面保留完整辉光，中低宽度视口使用更小的粒子贴图、降低设备像素比，并把部分光晕交给 CSS 径向渐变完成。",
            "On mobile, the biggest cost is often not geometry but large transparent overlaps and post-processing. Bloom is seductive, yet its cost scales directly with resolution. My strategy keeps full bloom on desktop while using smaller particle sprites, a lower device pixel ratio, and CSS radial gradients for part of the glow at narrower viewports."
          ),
          t(
            "这不是把移动端当成次等体验，而是换一种媒介语言。小屏幕上的 3D 一样需要空间感，只是它应该通过构图、速度和触控反馈来表达，而不是复制桌面端的全部成本。",
            "This is not treating mobile as a second-class experience; it is changing the medium's language. 3D on a small screen still needs depth, but it should express it through composition, tempo, and touch feedback instead of copying the desktop's full budget."
          ),
        ],
      },
      {
        heading: t("把性能做成可见的体验", "Make performance part of the experience"),
        paragraphs: [
          t(
            "最终目标不是让开发者炫耀自己会写 GLSL，而是让访问者感觉页面愿意回应。指针移动时的轻微滞后、滚动时场景的缓慢退场、文章打开时背景的收敛，这些细节都在告诉人：你知道我正在做什么。",
            "The goal is not to show that a developer can write GLSL. It is to make visitors feel the page is willing to respond. A slight follow when the pointer moves, a slow retreat during scroll, and a quieter field behind an open article all say: I know what you are doing."
          ),
        ],
      },
    ],
  },
  {
    id: "motion-is-grammar",
    category: "motion",
    date: "2026-08-02",
    readTime: 5,
    featured: false,
    title: t("动效不是装饰，是界面的语法", "Motion Is Interface Grammar"),
    excerpt: t(
      "为什么好的动效会让操作看起来有因果，而不只是让页面看起来会动。",
      "Why good motion makes actions feel causal, not merely animated."
    ),
    tags: ["Interaction", "CSS", "Rhythm"],
    sections: [
      {
        heading: t("每个动作都需要一个理由", "Every movement needs a reason"),
        paragraphs: [
          t(
            "如果一个动效只能被描述为“飞进来”，它通常还不够具体。好的动效回答的是：元素从哪里来、为什么现在出现、它和谁发生了关系，以及用户接下来应该看哪里。",
            "If an animation can only be described as 'flying in,' it is probably not specific enough. Good motion answers where an element came from, why it appears now, what it relates to, and where the user should look next."
          ),
          t(
            "在我的博客里，卡片倾斜不是为了让鼠标显得聪明，而是为了让平面拥有厚度。详情层从卡片位置扩展，也不是炫技，而是帮助用户保留空间记忆。",
            "On this site, card tilt is not there to make the pointer look clever; it gives a flat surface thickness. A detail layer growing from a card is not decoration either; it helps users keep a spatial memory of where they were."
          ),
        ],
      },
      {
        heading: t("节奏比曲线更重要", "Tempo matters more than easing"),
        paragraphs: [
          t(
            "很多动效看起来廉价，并不是因为缓动函数不对，而是因为所有元素同时出发、同时结束。我会把信息拆成主、次和背景三个节奏：标题先建立方向，内容随后抵达，环境最后轻轻跟随。",
            "Many animations feel cheap not because the easing curve is wrong, but because every element starts and ends together. I separate information into lead, support, and environment rhythms: the headline establishes direction, content arrives next, and the atmosphere follows gently."
          ),
        ],
      },
      {
        heading: t("为减少动态效果留出另一条路", "Leave another path for reduced motion"),
        paragraphs: [
          t(
            "动效系统必须从第一天就考虑前庭敏感和注意力差异。减少动态并不是删掉所有状态，而是用淡入、颜色变化和即时位移表达同样的因果关系。用户仍然能感知变化，只是页面不再接管他们的身体。",
            "Motion systems must account for vestibular sensitivity and attention differences from day one. Reduced motion does not remove every state; it uses fades, color changes, and immediate shifts to express the same causality. Users still understand change without the page taking over their body."
          ),
        ],
      },
    ],
  },
  {
    id: "css-depth",
    category: "craft",
    date: "2026-06-24",
    readTime: 6,
    featured: false,
    title: t("用 CSS 建立真正的空间层级", "Building Real Spatial Hierarchy with CSS"),
    excerpt: t(
      "玻璃、阴影和透视只有服务于阅读顺序时，才会让界面显得有纵深。",
      "Glass, shadows, and perspective create depth only when they serve reading order."
    ),
    tags: ["CSS", "Depth", "Design systems"],
    sections: [
      {
        heading: t("先有层级，再有玻璃", "Hierarchy before glass"),
        paragraphs: [
          t(
            "透明度不会自动创造空间。如果前后层没有清晰的内容职责，玻璃只会让文字更难读。我的顺序是先确定信息层、操作层和环境层，再给它们不同的明度、模糊程度与运动权限。",
            "Transparency does not create space on its own. If layers do not have clear content roles, glass only makes text harder to read. I define information, action, and environment layers first, then give them different luminance, blur, and motion permissions."
          ),
          t(
            "在这个页面中，导航是最靠前的操作层，卡片是可触摸的信息层，星云和纹理是环境层。环境层可以慢，信息层需要稳定，操作层必须即时响应。",
            "Here, navigation is the foremost action layer, cards are touchable information layers, and the nebula and texture are environment. Environment can move slowly, information must stay stable, and actions must respond immediately."
          ),
        ],
      },
      {
        heading: t("阴影描述关系，不描述重量", "Shadows describe relationships, not weight"),
        paragraphs: [
          t(
            "大而黑的阴影常常让界面显得沉重。更有效的办法是用光源方向、环境色溢出和极细的描边共同描述距离。悬停时的阴影应该更像光从卡片下方穿过，而不是卡片突然重了一倍。",
            "Large black shadows often make interfaces feel heavy. Light direction, ambient color spill, and very fine borders describe distance more effectively. Hover shadows should feel like light passing beneath a card, not like the card doubling in weight."
          ),
        ],
      },
      {
        heading: t("透视必须保护文字", "Perspective must protect language"),
        paragraphs: [
          t(
            "任何 3D 变换都不能牺牲可读性。卡片倾斜时，我会把文本放在更浅的变换层，并把最大角度控制在几度以内；移动端直接移除倾斜，改用按压缩放和高光位置表达反馈。",
            "No 3D transform should compromise legibility. When a card tilts, I keep text on a shallower transform layer and cap the angle at a few degrees. On mobile, I remove tilt entirely and express feedback through press scale and highlight position."
          ),
        ],
      },
    ],
  },
  {
    id: "slow-browser",
    category: "craft",
    date: "2026-04-11",
    readTime: 4,
    featured: false,
    title: t("为慢速浏览器设计，而不是为演示机", "Design for Slow Browsers, Not Demo Machines"),
    excerpt: t(
      "真正可靠的创意前端，需要在网络变慢、设备变热之后仍然保住叙事。",
      "Reliable creative frontend preserves the story after networks slow and devices heat up."
    ),
    tags: ["Performance", "Progressive enhancement", "Access"],
    sections: [
      {
        heading: t("先交付内容，再交付奇观", "Deliver content before spectacle"),
        paragraphs: [
          t(
            "演示视频中的页面永远拥有最好的设备和网络。真实用户没有。因此我把所有核心信息做成普通 HTML，让 Three.js 成为增强层。即使 WebGL 被禁用，标题、项目、文章和联系方式依然完整可读。",
            "Pages in demo videos always have the best device and network. Real users do not. I render all essential information as ordinary HTML and treat Three.js as enhancement. Even when WebGL is unavailable, the headline, projects, writing, and contact details remain fully readable."
          ),
          t(
            "这不是保守，而是让创意有更长的寿命。奇观会随着设备变旧而消失，清晰的结构会一直工作。",
            "This is not conservatism; it gives creative work a longer life. Spectacle fades as devices age. Clear structure keeps working."
          ),
        ],
      },
      {
        heading: t("降级不等于平凡", "Fallback does not mean bland"),
        paragraphs: [
          t(
            "CSS 同样可以表达空间：渐变光场、透视网格、错位文字和精准的阴影都能建立纵深。3D 失败时，页面不应该像被拔掉电池，而应该像换了一种观看角度。",
            "CSS can express space too: gradient light fields, perspective grids, layered type, and precise shadows all create depth. When 3D fails, the page should not look unplugged—it should look like we changed the viewing angle."
          ),
        ],
      },
      {
        heading: t("测量用户能感受到的东西", "Measure what users can feel"),
        paragraphs: [
          t(
            "我只关注三个指标：首次内容出现要快、交互开始后不能卡、滚动过程中不能出现突然的大面积重绘。它们比一个漂亮的总分更接近真实体验。",
            "I focus on three signals: first content needs to arrive quickly, interaction cannot stutter, and scrolling must not cause huge surprise repaints. They are closer to lived experience than one beautiful aggregate score."
          ),
        ],
      },
    ],
  },
];

export const timeline = [
  {
    year: "2021",
    title: t("第一束信号", "First signal"),
    company: t("独立工作室 / 前端开发", "Independent studio / Frontend"),
    description: t(
      "从信息型网站开始，第一次意识到布局、加载速度与文字选择会共同决定用户的信任。",
      "Starting with information-rich websites and learning that layout, loading speed, and typography together shape trust."
    ),
  },
  {
    year: "2023",
    title: t("进入空间叙事", "Enter spatial storytelling"),
    company: t("数字体验机构 / 创意开发", "Digital experience studio / Creative developer"),
    description: t(
      "开始把 WebGL 与品牌故事结合，在大型活动、产品发布和互动展览中打磨实时视觉系统。",
      "Bringing WebGL into brand storytelling and refining real-time visual systems for launches, events, and interactive exhibitions."
    ),
  },
  {
    year: "2025",
    title: t("让技术变得安静", "Making technology quiet"),
    company: t("创意技术负责人", "Creative technology lead"),
    description: t(
      "从单点效果转向完整体验，建立性能预算、无障碍规范与跨设备动效策略。",
      "Moving from isolated effects to complete experiences, with performance budgets, accessibility standards, and cross-device motion strategies."
    ),
  },
  {
    year: "NOW",
    title: t("持续向未知偏移", "Still drifting"),
    company: t("独立创意开发者", "Independent creative developer"),
    description: t(
      "与全球团队合作，探索浏览器里的空间、材质与新的叙事方式。",
      "Collaborating with teams worldwide to explore new forms of space, material, and narrative in the browser."
    ),
  },
];

export const contacts = [
  {
    id: "email",
    label: t("电子邮箱", "Email"),
    value: "hello@linche.example",
    action: "copy",
  },
  {
    id: "wechat",
    label: t("微信", "WeChat"),
    value: "orbit_linche",
    action: "copy",
  },
  {
    id: "location",
    label: t("当前位置", "Location"),
    value: t("上海，中国", "Shanghai, China"),
    action: "none",
  },
];
