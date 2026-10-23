import type { ArticleStatus } from '../models/Article.js';

export type SeedArticle = {
  title: string;
  titleEn: string;
  slug: string;
  summary: string;
  summaryEn: string;
  contentMarkdown: string;
  contentMarkdownEn: string;
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
    title: '从 20fps 到 50fps：重构 300+ 条任务列表',
    titleEn: 'From 20fps to 50fps: Rebuilding a 300+ Task List',
    slug: 'virtual-task-list',
    summary: '复盘 IMAS Studio 长列表性能优化：虚拟滚动、图片懒加载与渲染边界如何协同生效。',
    summaryEn: "A retrospective on optimizing IMAS Studio's long task list with virtual scrolling, lazy images, and tighter rendering boundaries.",
    category: 'engineering',
    tags: ['Nuxt', 'Virtual list', 'Performance'],
    status: 'published',
    publishedAt: '2026-09-18T00:00:00.000Z',
    contentMarkdown: `## 先减少同时存在的工作\n\nIMAS Studio 的任务列表包含 300 多条卡片，每张卡片又带有缩略图、状态标签和操作按钮。最初一次性渲染全部 DOM，让滚动明显掉帧。\n\n我引入虚拟滚动，只保留视口附近的卡片，再用图片懒加载延后非首屏资源。列表交互需要的数据保持独立，避免滚动时触发整棵组件树更新。\n\n## 用真实场景验证\n\n优化效果以长列表滚动、图片加载和筛选切换三类场景为准，最终帧率从 20fps 提升到 50fps 以上，同时保留了卡片交互与可访问操作。`,
    contentMarkdownEn: `## Reduce the work happening at once\n\nIMAS Studio's task list contains more than 300 cards, each with a thumbnail, status labels, and action buttons. Rendering every DOM node at once made scrolling visibly drop frames.\n\nI introduced virtual scrolling to keep only cards near the viewport, then used lazy image loading to defer off-screen assets. The data used by list interactions is kept separate so scrolling does not update the entire component tree.\n\n## Validate against real workflows\n\nI measured performance across long-list scrolling, image loading, and filter changes. The final frame rate rose from 20fps to more than 50fps while preserving card interactions and accessible controls.`,
  }),
  seed({
    title: '把自然语言交给 Agent 之前，先约束 SQL',
    titleEn: 'Constrain SQL Before Giving Natural Language to an Agent',
    slug: 'sql-safety-pipeline',
    summary: 'Chain-NL2SQL 如何通过意图判断、只读执行、AST 校验与结果复核组成可追踪的安全链路。',
    summaryEn: 'How Chain-NL2SQL combines intent checks, read-only execution, AST validation, and result review into a traceable safety pipeline.',
    category: 'ai',
    tags: ['LangGraph', 'RAG', 'SQL safety'],
    status: 'published',
    publishedAt: '2026-08-02T00:00:00.000Z',
    contentMarkdown: `## 多个 Agent，各做一件明确的事\n\n自然语言数据查询降低了分析门槛，也让权限边界变得更难处理。生成 SQL 只是其中一步，真正需要设计的是从提问到结果返回的整条安全链路。\n\n先判断问题是否属于数据查询，再进入授权 Schema 检索、SQL 生成、sqlglot 语法校验、只读执行和结果复核。任何一步失败都返回可解释的状态，而不是静默重试。\n\n## 安全约束必须可验证\n\n只读数据库账号、单条查询限制、超时与行数上限共同限制执行风险。授权 Schema 和字段级脱敏则负责控制模型能看到什么。`,
    contentMarkdownEn: `## Give each agent one clear responsibility\n\nNatural-language data queries lower the barrier to analysis while making permission boundaries harder to enforce. SQL generation is only one step; the real design problem is the full safety path from question to result.\n\nFirst determine whether the request is a data query, then move through authorized schema retrieval, SQL generation, sqlglot syntax validation, read-only execution, and result review. Any failure returns an explainable state instead of retrying silently.\n\n## Safety constraints must be verifiable\n\nA read-only database account, single-query limits, timeouts, and row caps jointly reduce execution risk. Authorized schemas and field-level redaction control what the model can see.`,
  }),
  seed({
    title: '让公共组件真正服务多个业务页面',
    titleEn: 'Make Shared Components Serve Multiple Product Pages',
    slug: 'reusable-business-components',
    summary: '燃气巡检平台组件复用复盘：如何用配置、插槽和回调控制差异，而不是让组件无限膨胀。',
    summaryEn: 'A retrospective on reusing components for a gas inspection platform with configuration, slots, and callbacks instead of letting one component grow without limits.',
    category: 'vue',
    tags: ['Vue 3', 'TypeScript', 'Components'],
    status: 'published',
    publishedAt: '2026-06-24T00:00:00.000Z',
    contentMarkdown: `## 配置负责字段，插槽负责结构\n\n公共组件最常见的失败方式，是把所有页面差异都塞进 boolean 参数。燃气安全巡检平台需要同时覆盖计划、工单、安检、隐患和审核流程，我先区分稳定结构与可变业务。\n\n查询筛选、状态操作和详情抽屉在多个页面重复出现。配置负责字段和选项，插槽负责特殊信息，回调只暴露业务动作。\n\n## 复用数量不是唯一指标\n\n最终 8 个公共组件服务了 20+ 个页面。更重要的是页面新增时只需补字段与配置，业务标签、样式和执行动作仍然保持一致。`,
    contentMarkdownEn: `## Configuration owns fields; slots own structure\n\nThe most common failure with shared components is to force every page difference into a boolean prop. The gas inspection platform needs plans, work orders, inspections, hazards, and review flows, so I first separated stable structure from business variation.\n\nSearch filters, status actions, and detail drawers appeared on many pages. Configuration owns fields and options, slots own special content, and callbacks expose business actions.\n\n## Reuse count is not the only metric\n\nEight shared components ultimately served more than 20 pages. More importantly, new pages only needed fields and configuration while business labels, styles, and execution actions remained consistent.`,
  }),
  seed({
    title: '给 LLM 输出加三层保险',
    titleEn: 'Three Layers of Protection for LLM Output',
    slug: 'stable-ai-extraction',
    summary: 'ResumeIQ 如何用正则、JSON 解析与兜底策略处理简历信息提取的不稳定性。',
    summaryEn: 'How ResumeIQ uses regular expressions, JSON parsing, and fallback strategies to handle unstable resume extraction.',
    category: 'ai',
    tags: ['LLM', 'Prompt', 'Validation'],
    status: 'published',
    publishedAt: '2026-04-11T00:00:00.000Z',
    contentMarkdown: `## 第一层先处理确定的信息\n\n招聘筛选场景不能把模型偶尔输出错当成可接受误差。ResumeIQ 需要把非结构化的 PDF/DOCX 简历稳定转换为姓名、邮箱、电话等字段。\n\n正则适合邮箱、电话和格式清晰的文本。只有模型擅长的字段才交给 LLM，避免把所有解析压力都放在生成阶段。\n\n## 第二层约束输出，第三层负责失败\n\nJSON 解析负责验证结构，字段校验负责拒绝空值和不合理格式，兜底策略则保证页面仍能展示原文与人工修正入口。三层机制让自动化流程可用，也让失败保持透明。`,
    contentMarkdownEn: `## Handle deterministic information first\n\nA recruiting workflow cannot treat occasional model output errors as acceptable variance. ResumeIQ needs to convert unstructured PDF and DOCX resumes into fields such as name, email, and phone reliably.\n\nRegular expressions work well for emails, phone numbers, and clearly formatted text. Only fields where the model adds value go to the LLM, avoiding unnecessary pressure on generation.\n\n## Constrain the output, then handle failure\n\nJSON parsing validates structure, field validation rejects empty values and malformed data, and fallback behavior keeps the original document and a manual correction path visible. These three layers make automation usable without hiding failures.`,
  }),
  seed({
    title: '把 Vue 组合式 API 用成真正的业务边界',
    titleEn: 'Use Vue Composables as Real Business Boundaries',
    slug: 'vue-composable-boundaries',
    summary: '从一个越来越大的页面拆出可测试的组合式函数，让查询、分页和权限状态各自负责一件事。',
    summaryEn: 'How to split a growing Vue page into testable composables so query, pagination, and permission state each own one responsibility.',
    category: 'vue',
    tags: ['Vue 3', 'Composition API', 'Architecture'],
    status: 'published',
    publishedAt: '2026-03-28T00:00:00.000Z',
    contentMarkdown: `## 页面变复杂前先识别状态边界\n\n一个业务页面通常同时处理筛选条件、列表请求、分页、弹窗和权限。把这些状态都留在 setup 函数里，短期看起来集中，长期却很难判断一次变更会影响什么。\n\n我把逻辑拆成 useQueryState、usePaginatedList 和 usePermission 三个组合式函数。每个函数只接收必要输入，并返回明确的状态和动作，页面组件只负责编排它们。\n\n## 组合式函数要能脱离页面验证\n\n组合式函数不应该依赖模板 ref 或隐含的全局变量。请求函数、路由参数和权限集合通过参数传入后，可以在单元测试里直接验证加载、失败和重置行为。\n\n## 抽象的目标是减少决策\n\n好的抽象不是把代码拆得更碎，而是让新增页面只需要选择已有能力。页面剩下的代码越接近业务语言，组件越容易维护。`,
    contentMarkdownEn: `## Find state boundaries before a page grows complex\n\nA product page often handles filters, list requests, pagination, dialogs, and permissions at the same time. Keeping all of that in one setup function hides the impact of future changes.\n\nI split the logic into useQueryState, usePaginatedList, and usePermission. Each composable accepts only the inputs it needs and returns explicit state and actions, while the page coordinates them.\n\n## Composables should be verifiable outside a page\n\nA composable should not depend on template refs or hidden global values. Passing request functions, route parameters, and permission sets makes loading, failure, and reset behavior easy to test directly.\n\n## The goal of abstraction is fewer decisions\n\nA useful abstraction lets a new page select existing capabilities while the remaining code stays close to business language.`,
  }),
  seed({
    title: 'TypeScript 不只是补全：把 API 边界变成契约',
    titleEn: 'TypeScript Is More Than Autocomplete: Make the API Boundary a Contract',
    slug: 'typescript-api-contracts',
    summary: '用请求类型、响应校验和状态模型收紧前后端边界，让错误尽早暴露在开发阶段。',
    summaryEn: 'Tighten the frontend and backend boundary with request types, response validation, and explicit state models so errors surface early.',
    category: 'vue',
    tags: ['TypeScript', 'API', 'Type safety'],
    status: 'published',
    publishedAt: '2026-02-16T00:00:00.000Z',
    contentMarkdown: `## 接口类型应该靠近请求\n\n很多项目把接口类型集中在一个 types 文件里，却没有让请求函数真正使用它们。结果是调用方拿到 any，类型只剩下文档作用。\n\n我让每个 API 方法同时声明参数和返回值，并把分页、错误和空数据状态写进类型。调用方因此必须处理未加载、加载失败和成功三种状态，而不是用可选链掩盖问题。\n\n## 类型不能代替运行时校验\n\n服务端返回的数据来自网络，TypeScript 在运行时不会检查它。对关键响应增加轻量 schema 校验，可以在数据结构变更时给出明确错误，并保护后续组件。\n\n## 先定义稳定的领域对象\n\n页面不应直接依赖后端字段的偶然命名。通过 mapper 把接口响应转换成稳定的领域对象，接口升级时只需要修改一处。`,
    contentMarkdownEn: `## Keep API types close to requests\n\nMany projects collect API types without making request functions use them. Callers then receive any, leaving the types as documentation rather than a working contract.\n\nEach API method declares its input and output, including pagination, errors, and empty states. Callers must handle loading, failure, and success explicitly.\n\n## Types cannot replace runtime validation\n\nNetwork data arrives at runtime, so TypeScript does not inspect it. Lightweight schema validation for important responses gives a clear error when the server changes.\n\n## Define stable domain objects first\n\nMapping responses into stable domain objects keeps API migrations local and prevents every page from changing at once.`,
  }),
  seed({
    title: '别只盯 Lighthouse：用真实交互理解 Web Vitals',
    titleEn: 'Look Beyond Lighthouse: Understand Web Vitals Through Real Interaction',
    slug: 'web-vitals-real-interaction',
    summary: '从 LCP、INP 和 CLS 出发建立性能预算，把优化从一次性分数变成持续可观测的工程习惯。',
    summaryEn: 'Use LCP, INP, and CLS to build a performance budget and turn optimization into an observable engineering habit.',
    category: 'engineering',
    tags: ['Web Vitals', 'Performance', 'Observability'],
    status: 'published',
    publishedAt: '2026-01-22T00:00:00.000Z',
    contentMarkdown: `## 分数只是线索\n\nLighthouse 能帮助定位问题，但它是一条实验室路径。真实用户可能在慢网络上打开页面，也可能在筛选列表时触发大量同步计算，所以性能问题必须回到具体交互。\n\n我为首屏、搜索和详情打开分别设定预算，记录 LCP、INP 和 CLS，并把设备类型、网络条件和路由一起上报。\n\n## 优化要先减少工作量\n\n减少首屏 JavaScript、延后非关键图片、拆分大组件，通常比调整某个 CSS 属性更有效。对于列表筛选，预计算索引和切断无关组件更新，能直接改善 INP。\n\n## 把回归放进发布流程\n\n每次发布都查看同一组关键路由和用户分位数，而不是只记录最好成绩。性能预算一旦被突破，就需要被处理。`,
    contentMarkdownEn: `## A score is only a clue\n\nLighthouse follows a lab path. Real users may open a page on a slow network or trigger expensive work while filtering a list, so performance needs to be tied to interactions.\n\nI set budgets for the first view, search, and detail routes, reporting LCP, INP, and CLS alongside device, network, and route data.\n\n## Reduce work before tuning details\n\nLess initial JavaScript, deferred images, and smaller components usually matter more than tweaking one CSS property.\n\n## Put regressions into the release flow\n\nReview the same key routes and user percentiles after every release instead of keeping only the best score.`,
  }),
  seed({
    title: '可访问性不是收尾工作，而是交互设计的起点',
    titleEn: 'Accessibility Is the Starting Point of Interaction Design',
    slug: 'accessibility-first-interaction',
    summary: '从键盘焦点、语义 HTML 和状态播报入手，让复杂后台页面对更多用户保持可操作。',
    summaryEn: 'Start with keyboard focus, semantic HTML, and state announcements so complex admin pages remain usable for more people.',
    category: 'engineering',
    tags: ['Accessibility', 'HTML', 'UX'],
    status: 'published',
    publishedAt: '2025-12-08T00:00:00.000Z',
    contentMarkdown: `## 先让结构表达意图\n\n如果一个可点击元素只是 div，键盘用户、读屏软件和自动化测试都很难知道它是什么。优先使用 button、a、nav、main 和 form 等语义元素，很多无障碍能力就会自然获得。\n\n## 焦点管理决定操作是否连贯\n\n打开抽屉或对话框时，把焦点移到标题或第一个控件；关闭后把焦点还给触发按钮。路由切换和异步加载也需要给出清晰的焦点落点。\n\n## 动态状态要被听见\n\n筛选完成、保存成功和请求失败都不应只通过颜色或 Toast 表示。为状态区域提供 aria-live，并保留可见文字。\n\n## 用键盘走完真实流程\n\n发布前我会用 Tab、Enter、Escape 完整走一遍搜索、编辑、弹窗和分页流程，再补充对比度和缩放检查。`,
    contentMarkdownEn: `## Let structure express intent first\n\nWhen a clickable element is only a div, keyboard users and screen readers cannot reliably understand it. Semantic elements such as button, a, nav, main, and form provide many accessibility behaviors by default.\n\n## Focus management keeps actions coherent\n\nWhen a drawer or dialog opens, move focus to its heading or first control, then return focus to the trigger when it closes.\n\n## Dynamic state needs an announcement\n\nCompleted filters, successful saves, and request errors should not be communicated only with color or a toast. An aria-live region and visible text keep users informed.\n\n## Walk through the real flow with a keyboard\n\nBefore release, I complete search, editing, dialogs, and pagination with Tab, Enter, and Escape, then check contrast and zoom behavior.`,
  }),
  seed({
    title: 'WebSocket 断线之后，页面应该如何继续工作',
    titleEn: 'How a Page Should Keep Working After a WebSocket Disconnects',
    slug: 'resilient-websocket-ui',
    summary: '设计连接状态、指数退避和消息去重，让实时协作页面在网络波动时保持可解释、可恢复。',
    summaryEn: 'Design connection states, exponential backoff, and message deduplication so collaborative pages remain recoverable during network changes.',
    category: 'engineering',
    tags: ['WebSocket', 'Real-time', 'Resilience'],
    status: 'published',
    publishedAt: '2025-10-19T00:00:00.000Z',
    contentMarkdown: `## 连接状态不是一个布尔值\n\n实时页面至少需要连接中、已连接、重连中和已离线四种状态。只用 isConnected 会让用户无法判断消息是正在发送、等待重试，还是已经丢失。\n\n我把连接状态和业务消息队列分开管理。断线时保留可重试的操作，展示明确提示；恢复后先完成握手，再按序发送队列并请求一次增量同步。\n\n## 重连要有边界\n\n使用指数退避并设置最大等待时间，避免大量客户端同时冲击服务端。每次重连都携带最后一条消息序号，服务端可以返回缺失区间。\n\n## 去重比重放更重要\n\n为事件提供稳定 id，在客户端和服务端都做幂等处理，才能保证任务状态不会因为重连被重复修改。\n\n## 把异常变成可见的产品状态\n\n实时系统不可能永远在线，但可以让用户知道当前发生了什么，并给出重试、刷新或稍后处理的选择。`,
    contentMarkdownEn: `## Connection is more than a boolean\n\nA real-time page needs connecting, connected, reconnecting, and offline states. An isConnected flag cannot tell users whether a message is sending, waiting for retry, or lost.\n\nI keep connection state separate from the business message queue. During a disconnect, retryable operations remain queued and the UI explains the condition. After recovery, the client completes a handshake, sends queued messages in order, and requests an incremental sync.\n\n## Retries need boundaries\n\nExponential backoff with a maximum delay prevents many clients from hitting the server at once. The last message sequence lets the server return a missing range.\n\n## Deduplication matters more than replay\n\nStable event IDs and idempotent handling keep a reconnect from changing a task twice.\n\n## Turn failures into visible product states\n\nA real-time system cannot stay online forever, but it can explain what is happening and offer retry, refresh, or later actions.`,
  }),
  seed({
    title: '用设计令牌让 CSS 从“能用”走向“可维护”',
    titleEn: 'Use Design Tokens to Make CSS Maintainable',
    slug: 'css-design-tokens',
    summary: '从颜色、间距和层级建立语义化令牌，让多页面产品在迭代和换肤时保持一致。',
    summaryEn: 'Build semantic tokens for color, spacing, and elevation so a multi-page product stays consistent through iteration and theming.',
    category: 'vue',
    tags: ['CSS', 'Design system', 'Theming'],
    status: 'published',
    publishedAt: '2025-08-30T00:00:00.000Z',
    contentMarkdown: `## 令牌应该描述用途\n\n--blue-500 这样的变量只描述颜色，不描述它在界面中的角色。改用 --color-action、--color-surface 和 --color-danger，组件就不需要知道具体色值，换主题时也更安全。\n\n间距、圆角、阴影和字体同样应该有有限的刻度。刻度越少，视觉越容易统一；组件出现例外时，也能更快判断它是否真的需要特殊值。\n\n## 在组件边界消费令牌\n\n令牌定义在全局，使用发生在组件内部。按钮只关心 action 色和 control 高度，卡片只关心 surface 和 border。\n\n## 令牌需要被约束\n\n如果任何人都能随意写一个新颜色，系统很快会重新失控。新值应先说明语义，并用样式检查找出未使用或重复令牌。\n\n## 设计系统服务于交付速度\n\n设计令牌的价值是让新增页面更快获得正确的默认状态，同时保留必要的业务表达空间。`,
    contentMarkdownEn: `## Tokens should describe purpose\n\nA variable such as --blue-500 describes a color but not its role. Semantic names such as --color-action, --color-surface, and --color-danger keep components independent from literal values and make theming safer.\n\nSpacing, radii, elevation, and type should use a limited scale as well. Fewer steps create visual consistency and make true exceptions easier to recognize.\n\n## Consume tokens at component boundaries\n\nTokens are defined globally and consumed inside components. A button needs action color and control height; a card needs surface and border.\n\n## Tokens need constraints\n\nNew values should explain their semantic role, while style checks can find unused and duplicate tokens.\n\n## A design system exists to speed delivery\n\nTokens help new pages start with correct defaults while leaving room for product-specific expression.`,
  }),
];
