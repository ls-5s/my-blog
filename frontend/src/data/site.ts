import type { Article, Localized, Project } from '../types';

export const t = (zh: string, en: string): Localized => ({ zh, en });

export const profile = {
  name: t('LY', 'LY'),
  displayName: t('LY', 'LY'),
  role: t('前端开发', 'Frontend Developer'),
  heroLineOne: t('把复杂业务，', 'Turning complex products'),
  heroLineTwo: t('做成清晰好用的体验。', 'into clear, useful experiences.'),
  intro: t(
    '专注 Vue 3、TypeScript 与 AI 应用前端开发。参与燃气巡检、影视协作和自然语言数据查询项目，重视组件复用、性能优化与稳定交付。',
    'Frontend developer focused on Vue 3, TypeScript, and AI-powered products. I care about reusable components, frontend performance, and dependable delivery across real business workflows.',
  ),
  location: t('中国 · 成都', 'Chengdu · China'),
  coordinates: '30.5728° N / 104.0668° E',
  signature: t('把需求做稳，把体验做顺', 'Build reliably. Ship thoughtfully.'),
  email: '2408224899@qq.com',
  github: 'https://github.com/Ls-5s',
};

export const metrics = [
  { value: '12', suffix: '+', label: t('个业务页面', 'business pages') },
  { value: '20', suffix: '+', label: t('次组件复用', 'component reuses') },
  { value: '5K', suffix: '+', label: t('行代码精简', 'lines simplified') },
  { value: '02', suffix: '/567', label: t('专业排名', 'class rank') },
];

export const skillGroups = [
  { code: '01', title: t('前端应用开发', 'Frontend applications'), description: t('用 Vue 3 与 TypeScript 搭建复杂业务页面，让状态、权限和交互各有清晰边界。', 'Building complex product pages with Vue 3 and TypeScript, keeping state, permissions, and interactions clearly bounded.'), skills: ['Vue 3 / Nuxt', 'TypeScript', 'Pinia', 'Vue Router'] },
  { code: '02', title: t('工程与性能', 'Engineering & performance'), description: t('通过组件抽象、数据预计算和长列表优化，把性能改善落到真实交互中。', 'Turning component abstractions, precomputed data, and long-list optimization into measurable interaction gains.'), skills: ['Vite', 'WebSocket', 'Map caching', 'Performance'] },
  { code: '03', title: t('AI 应用实践', 'Applied AI'), description: t('连接前端交互与 Agent 服务，关注流式状态、RAG 检索与结构化输出的可靠性。', 'Connecting frontend interactions to agent services, with care for streaming state, RAG retrieval, and reliable structured output.'), skills: ['Python', 'FastAPI', 'LangGraph', 'RAG'] },
];

export const techStack = [
  { code: '01', title: t('语言与样式', 'Languages & styling'), skills: ['HTML', 'CSS', 'JavaScript ES6+', 'TypeScript'] },
  { code: '02', title: t('前端框架', 'Frontend frameworks'), skills: ['Vue 3 Composition API', 'Nuxt', 'Pinia', 'Vue Router', 'React 18', 'Zustand', 'Redux Toolkit'] },
  { code: '03', title: t('UI 与可视化', 'UI & visualization'), skills: ['Tailwind CSS', 'Element Plus', 'Nuxt UI', 'ECharts'] },
  { code: '04', title: t('后端与数据', 'Backend & data'), skills: ['Node.js', 'Express', 'Python', 'FastAPI', 'Pydantic', 'Drizzle ORM'] },
  { code: '05', title: t('AI 与 Agent', 'AI & agents'), skills: ['LangChain', 'LangGraph', 'RAG', 'Agent Tool Calling', 'Structured Output'] },
  { code: '06', title: t('工程与协作', 'Engineering & workflow'), skills: ['Vite', 'npm / pnpm', 'Git', 'WebSocket', 'Claude', 'Codex', 'MCP'] },
];

export const categories = [
  { id: 'all', code: '00', label: t('全部', 'All'), description: t('浏览所有文章与近期思考。', 'Browse every article and recent thought.') },
  { id: 'vue', code: '01', label: t('Vue 与 TypeScript', 'Vue & TypeScript'), description: t('复杂业务页面、状态管理与组件复用实践。', 'Complex product pages, state management, and reusable components.') },
  { id: 'engineering', code: '02', label: t('工程与性能', 'Engineering'), description: t('长列表、WebSocket、数据缓存与前端性能优化。', 'Long lists, WebSocket flows, data caching, and frontend performance.') },
  { id: 'ai', code: '03', label: t('AI 应用', 'Applied AI'), description: t('Agent、RAG、自然语言数据查询与结构化输出。', 'Agents, RAG, natural-language data queries, and structured output.') },
];

export const projects: Project[] = [
  { id: 'chain-nl2sql', index: '01', year: '2026', title: t('Chain-NL2SQL', 'Chain-NL2SQL'), type: t('AI 全栈 / Agent 编排', 'AI full stack / Agent orchestration'), summary: t('对话式自然语言数据查询平台，完成 Vue 3 前端、SSE 流式交互、LangGraph 多分支编排与只读 SQL 安全链路。', 'A conversational data query platform with a Vue 3 interface, SSE streaming, LangGraph branching, and a read-only SQL safety pipeline.'), stack: ['Vue 3', 'TypeScript', 'FastAPI', 'LangGraph'], art: 'atlas' },
  { id: 'resumeiq', index: '02', year: '2026', title: t('ResumeIQ', 'ResumeIQ'), type: t('智能招聘筛选', 'AI recruiting workflow'), summary: t('解析 PDF/DOCX 简历并完成 AI 评估，主导七维度评分模型、Prompt 设计与三级解析机制，提升筛选稳定性。', 'A resume screening workflow that parses PDF/DOCX files and applies a seven-dimension AI scoring model with layered response validation.'), stack: ['React', 'TypeScript', 'Node.js', 'SQLite'], art: 'echo' },
  { id: 'gas-inspection', index: '03', year: '2026', title: t('燃气安全巡检平台', 'Gas Safety Inspection'), type: t('业务前端 / 组件工程', 'Business frontend / Components'), summary: t('基于 Vue 3 与 TypeScript 开发 12+ 业务页面，沉淀 8 个公共组件并通过配置、插槽与回调适配 20+ 页面。', 'Developed 12+ business pages and eight reusable components configured and composed across more than 20 additional pages.'), stack: ['Vue 3', 'TypeScript', 'Pinia', 'RBAC'], art: 'orbit' },
  { id: 'imas-studio', index: '04', year: '2026', title: t('IMAS Studio', 'IMAS Studio'), type: t('影视协作平台 / 性能优化', 'Production platform / Performance'), summary: t('重构 300+ 条卡片任务列表，引入虚拟滚动与图片懒加载，将帧率从 20fps 提升到 50fps 以上。', 'Rebuilt a 300+ item task list with virtual scrolling and lazy images, raising frame rate from 20fps to over 50fps.'), stack: ['Nuxt 4', 'TypeScript', 'WebSocket', 'RBAC'], art: 'signal' },
];

const chineseFallbackArticles: Article[] = [
  { _id: 'virtual-task-list', title: '从 20fps 到 50fps：重构 300+ 条任务列表', slug: 'virtual-task-list', summary: '复盘 IMAS Studio 长列表性能优化：虚拟滚动、图片懒加载与渲染边界如何协同生效。', contentMarkdown: '# 从 20fps 到 50fps：重构 300+ 条任务列表\n\nIMAS Studio 的任务列表包含 300 多条卡片，每张卡片又带有缩略图、状态标签和操作按钮。最初一次性渲染全部 DOM，让滚动明显掉帧。\n\n## 先减少同时存在的工作\n\n我引入虚拟滚动，只保留视口附近的卡片，再用图片懒加载延后非首屏资源。列表交互需要的数据则保持独立，避免滚动时触发整棵组件树更新。\n\n## 用真实场景验证\n\n优化效果以长列表滚动、图片加载和筛选切换三类场景为准，最终帧率从 20fps 提升到 50fps 以上，同时保留了卡片交互与无障碍操作。', category: 'engineering', tags: ['Nuxt', 'Virtual list', 'Performance'], status: 'published', publishedAt: '2026-09-18T00:00:00.000Z', createdAt: '2026-09-18T00:00:00.000Z', updatedAt: '2026-09-18T00:00:00.000Z', featured: true, readTime: 7 },
  { _id: 'sql-safety-pipeline', title: '把自然语言交给 Agent 之前，先约束 SQL', slug: 'sql-safety-pipeline', summary: 'Chain-NL2SQL 如何通过意图判断、只读执行、AST 校验与结果复核组成可追踪的安全链路。', contentMarkdown: '# 把自然语言交给 Agent 之前，先约束 SQL\n\n自然语言数据查询降低了分析门槛，也让权限边界变得更难处理。生成 SQL 只是其中一步，真正需要设计的是从提问到结果返回的整条安全链路。\n\n## 多个 Agent，各做一件明确的事\n\n先判断问题是否属于数据查询，再进入授权 Schema 检索、SQL 生成、sqlglot 语法校验、只读执行和结果复核。任何一步失败都返回可解释的状态，而不是静默重试。\n\n## 安全约束必须可验证\n\n只读数据库账号、单条查询限制、超时与行数上限共同限制执行风险。授权 Schema 和字段级脱敏则负责控制模型能看到什么。', category: 'ai', tags: ['LangGraph', 'RAG', 'SQL safety'], status: 'published', publishedAt: '2026-08-02T00:00:00.000Z', createdAt: '2026-08-02T00:00:00.000Z', updatedAt: '2026-08-02T00:00:00.000Z', featured: true, readTime: 6 },
  { _id: 'reusable-business-components', title: '让公共组件真正服务多个业务页面', slug: 'reusable-business-components', summary: '燃气巡检平台组件复用复盘：如何用配置、插槽和回调控制差异，而不是让组件无限膨胀。', contentMarkdown: '# 让公共组件真正服务多个业务页面\n\n公共组件最常见的失败方式，是把所有页面差异都塞进 boolean 参数。燃气安全巡检平台需要同时覆盖计划、工单、安检、隐患和审核流程，我尝试先区分稳定结构与可变业务。\n\n## 配置负责字段，插槽负责结构\n\n查询筛选、状态操作和详情抽屉在多个页面重复出现。配置负责字段和选项，插槽负责特殊信息，回调只暴露业务动作，不把页面状态塞进组件内部。\n\n## 复用数量不是唯一指标\n\n最终 8 个公共组件服务了 20+ 个页面。更重要的是页面新增时只需补字段与配置，业务标签、样式和执行动作仍然保持一致。', category: 'vue', tags: ['Vue 3', 'TypeScript', 'Components'], status: 'published', publishedAt: '2026-06-24T00:00:00.000Z', createdAt: '2026-06-24T00:00:00.000Z', updatedAt: '2026-06-24T00:00:00.000Z', readTime: 5 },
  { _id: 'stable-ai-extraction', title: '给 LLM 输出加三层保险', slug: 'stable-ai-extraction', summary: 'ResumeIQ 如何用正则、JSON 解析与兜底策略处理简历信息提取的不稳定性。', contentMarkdown: '# 给 LLM 输出加三层保险\n\n招聘筛选场景不能把“模型偶尔输出错”当成可接受误差。ResumeIQ 需要把非结构化的 PDF/DOCX 简历稳定转换为姓名、邮箱、电话等字段。\n\n## 第一层先处理确定的信息\n\n正则适合邮箱、电话和格式清晰的文本。只有模型擅长的字段才交给 LLM，避免把所有解析压力都放在生成阶段。\n\n## 第二层约束输出，第三层负责失败\n\nJSON 解析负责验证结构，字段校验负责拒绝空值和不合理格式，兜底策略则保证页面仍能展示原文与人工修正入口。三层机制让自动化流程可用，也让失败保持透明。', category: 'ai', tags: ['LLM', 'Prompt', 'Validation'], status: 'published', publishedAt: '2026-04-11T00:00:00.000Z', createdAt: '2026-04-11T00:00:00.000Z', updatedAt: '2026-04-11T00:00:00.000Z', readTime: 4 },
  { _id: 'vue-composable-boundaries', title: '把 Vue 组合式 API 用成真正的业务边界', slug: 'vue-composable-boundaries', summary: '从一个越来越大的页面拆出可测试的组合式函数，让查询、分页和权限状态各自负责一件事。', contentMarkdown: '# 把 Vue 组合式 API 用成真正的业务边界\n\n一个业务页面通常同时处理筛选条件、列表请求、分页、弹窗和权限。\n\n## 先识别状态边界\n\n我把逻辑拆成 useQueryState、usePaginatedList 和 usePermission 三个组合式函数，每个函数只接收必要输入并返回明确动作。\n\n## 抽象的目标是减少决策\n\n好的抽象让新增页面只需要选择已有能力，剩下的代码保持接近业务语言。', category: 'vue', tags: ['Vue 3', 'Composition API', 'Architecture'], status: 'published', publishedAt: '2026-03-28T00:00:00.000Z', createdAt: '2026-03-28T00:00:00.000Z', updatedAt: '2026-03-28T00:00:00.000Z', readTime: 5 },
  { _id: 'typescript-api-contracts', title: 'TypeScript 不只是补全：把 API 边界变成契约', slug: 'typescript-api-contracts', summary: '用请求类型、响应校验和状态模型收紧前后端边界，让错误尽早暴露在开发阶段。', contentMarkdown: '# TypeScript 不只是补全：把 API 边界变成契约\n\n每个 API 方法同时声明参数和返回值，并把分页、错误和空数据状态写进类型。\n\n## 类型不能代替运行时校验\n\n服务端返回的数据来自网络，对关键响应增加轻量 schema 校验，可以在结构变更时给出明确错误。\n\n## 先定义稳定的领域对象\n\n通过 mapper 把接口响应转换成稳定的领域对象，接口升级时只需要修改一处。', category: 'vue', tags: ['TypeScript', 'API', 'Type safety'], status: 'published', publishedAt: '2026-02-16T00:00:00.000Z', createdAt: '2026-02-16T00:00:00.000Z', updatedAt: '2026-02-16T00:00:00.000Z', readTime: 5 },
  { _id: 'web-vitals-real-interaction', title: '别只盯 Lighthouse：用真实交互理解 Web Vitals', slug: 'web-vitals-real-interaction', summary: '从 LCP、INP 和 CLS 出发建立性能预算，把优化变成持续可观测的工程习惯。', contentMarkdown: '# 别只盯 Lighthouse：用真实交互理解 Web Vitals\n\nLighthouse 是实验室路径，真实性能问题必须回到具体交互。\n\n## 优化要先减少工作量\n\n减少首屏 JavaScript、延后非关键图片、拆分大组件，通常比调整某个 CSS 属性更有效。\n\n## 把回归放进发布流程\n\n每次发布都查看关键路由和用户分位数，而不是只记录最好成绩。', category: 'engineering', tags: ['Web Vitals', 'Performance', 'Observability'], status: 'published', publishedAt: '2026-01-22T00:00:00.000Z', createdAt: '2026-01-22T00:00:00.000Z', updatedAt: '2026-01-22T00:00:00.000Z', readTime: 5 },
  { _id: 'accessibility-first-interaction', title: '可访问性不是收尾工作，而是交互设计的起点', slug: 'accessibility-first-interaction', summary: '从键盘焦点、语义 HTML 和状态播报入手，让复杂后台页面对更多用户保持可操作。', contentMarkdown: '# 可访问性不是收尾工作，而是交互设计的起点\n\n优先使用 button、a、nav、main 和 form 等语义元素，很多无障碍能力会自然获得。\n\n## 焦点管理决定操作是否连贯\n\n打开对话框时移动焦点，关闭后还给触发按钮；动态状态用 aria-live 和可见文字表达。\n\n## 用键盘走完真实流程\n\n发布前用 Tab、Enter、Escape 完整走一遍搜索、编辑、弹窗和分页流程。', category: 'engineering', tags: ['Accessibility', 'HTML', 'UX'], status: 'published', publishedAt: '2025-12-08T00:00:00.000Z', createdAt: '2025-12-08T00:00:00.000Z', updatedAt: '2025-12-08T00:00:00.000Z', readTime: 4 },
  { _id: 'resilient-websocket-ui', title: 'WebSocket 断线之后，页面应该如何继续工作', slug: 'resilient-websocket-ui', summary: '设计连接状态、指数退避和消息去重，让实时协作页面在网络波动时保持可解释、可恢复。', contentMarkdown: '# WebSocket 断线之后，页面应该如何继续工作\n\n实时页面至少需要连接中、已连接、重连中和已离线四种状态。\n\n## 重连要有边界\n\n使用指数退避并设置最大等待时间，恢复后按序发送队列并请求增量同步。\n\n## 去重比重放更重要\n\n为事件提供稳定 id，在客户端和服务端都做幂等处理，避免任务状态被重复修改。', category: 'engineering', tags: ['WebSocket', 'Real-time', 'Resilience'], status: 'published', publishedAt: '2025-10-19T00:00:00.000Z', createdAt: '2025-10-19T00:00:00.000Z', updatedAt: '2025-10-19T00:00:00.000Z', readTime: 5 },
  { _id: 'css-design-tokens', title: '用设计令牌让 CSS 从“能用”走向“可维护”', slug: 'css-design-tokens', summary: '从颜色、间距和层级建立语义化令牌，让多页面产品在迭代和换肤时保持一致。', contentMarkdown: '# 用设计令牌让 CSS 从“能用”走向“可维护”\n\n用 --color-action、--color-surface 和 --color-danger 描述用途，组件就不需要知道具体色值。\n\n## 在组件边界消费令牌\n\n令牌定义在全局，使用发生在组件内部，品牌色变化时修改一处即可覆盖大量页面。\n\n## 令牌需要被约束\n\n新值先说明语义，并用样式检查找出未使用或重复令牌。', category: 'vue', tags: ['CSS', 'Design system', 'Theming'], status: 'published', publishedAt: '2025-08-30T00:00:00.000Z', createdAt: '2025-08-30T00:00:00.000Z', updatedAt: '2025-08-30T00:00:00.000Z', readTime: 4 },
];

export const fallbackArticles = chineseFallbackArticles;

export const timeline = [
  {
    year: '2025',
    title: t('进入产品前端开发', 'Into product frontend'),
    company: t('北京东我无限科技有限公司 / 前端开发实习生', 'Beijing Dongwo Infinity Technology / Frontend intern'),
    description: t(
      '参与 IMAS Studio 影视创作协作平台开发，负责卡片列表性能优化、组件重构与实时协作稳定性改善。',
      'Contributed to the IMAS Studio production platform, improving long-list performance, component architecture, and real-time collaboration stability.',
    ),
  },
  {
    year: '2026',
    title: t('补齐业务与组件能力', 'Building business systems'),
    company: t('浙江创锐城科技有限公司 / 前端开发实习生', 'Zhejiang Chuangruicheng Technology / Frontend intern'),
    description: t(
      '参与燃气安全巡检平台核心模块，完成 12+ 业务页面与 8 个公共组件，覆盖计划、工单、安检、隐患和审核流程。',
      'Built 12+ core pages and eight shared components for gas safety inspection workflows, from plans and work orders to audits and hazards.',
    ),
  },
  {
    year: '2026',
    title: t('探索 AI 全栈与 Agent', 'Exploring AI full stack'),
    company: t('Chain-NL2SQL / 前端全栈工程师', 'Chain-NL2SQL / Full-stack engineer'),
    description: t(
      '独立完成对话式数据查询平台前后端，串联 Vue 3、SSE、LangGraph 多分支 Agent、双 RAG 检索与 SQL 安全执行。',
      'Built the conversational data platform end to end with Vue 3, SSE, LangGraph agents, dual RAG retrieval, and guarded SQL execution.',
    ),
  },
  {
    year: '2027',
    title: t('完成计算机科学本科学习', 'Computer science degree'),
    company: t('成都锦城学院 / 计算机科学与技术', 'Chengdu Jincheng College / Computer Science'),
    description: t(
      '专业排名 2 / 567（Top 0.35%），获国家励志奖学金、校一等奖学金，并在算法竞赛中获得省级奖项。',
      'Ranked 2 of 567 (top 0.35%), with a national encouragement scholarship, first-class college scholarship, and provincial algorithm awards.',
    ),
  },
];

export type Contact = {
  id: string;
  label: Localized;
  value: string | Localized;
  action: 'copy' | 'link' | 'none';
  href?: string;
  external?: boolean;
};

export const contacts: Contact[] = [
  { id: 'github', label: t('GitHub', 'GitHub'), value: profile.github, action: 'link' as const, href: profile.github, external: true },
  { id: 'email', label: t('Email', 'Email'), value: profile.email, action: 'link' as const, href: `mailto:${profile.email}` },
];

