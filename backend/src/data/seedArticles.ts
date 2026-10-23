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
];
