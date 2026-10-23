# Orbit Notes 全栈博客

这是“星轨手记”的 Vue 3 全栈版本：公开访客可以阅读博客文章，管理员登录后可以使用 Markdown 编辑器管理文章。

## 目录

- `frontend/`：Vue 3、Vite、TypeScript、Vue Router、Pinia
- `backend/`：Node.js、Express、TypeScript、内置 SQLite
- 根目录原有的 `index.html`、`styles.css` 和 `js/`：原生版本，作为迁移参考并保留

## 本地运行

准备 Node.js 22.13+，然后安装依赖：

```powershell
npm install
npm run dev:backend
npm run dev:frontend
```

SQLite 数据库会自动创建在 `backend/data/orbit-notes.sqlite`。前端默认地址为 `http://localhost:5173`，后端默认为 `http://localhost:4000`。

在 `backend/.env` 配置 `JWT_SECRET`、`ADMIN_USERNAME` 和 `ADMIN_PASSWORD`。默认使用 `SQLITE_PATH` 指向的本地 SQLite 文件；部署到 Turso 时，同时设置 `TURSO_DATABASE_URL` 和 `TURSO_AUTH_TOKEN`，数据库表会在首次启动时自动初始化。首次启动时会创建管理员账号，并幂等导入示例文章。

## 路由

- `/`：公开博客首页
- `/articles`：文章检索与分类筛选
- `/articles/:slug`：Markdown 文章阅读页
- `/admin/login`：管理员登录
- `/admin/articles`：后台文章列表
- `/admin/articles/new`：新建文章
- `/admin/articles/:id/edit`：编辑文章

公开接口只返回已发布文章。后台所有写操作都由后端 JWT Cookie 和管理员角色校验保护；前端路由守卫只用于导航体验。

## 检查

```powershell
npm run typecheck
npm run build
```

## Vercel 部署

后端的 `backend/src/app.ts` 同时提供本地 Express 实例和 Vercel 默认函数导出。Vercel 项目使用仓库根目录，并在生产环境配置以下变量：

- `TURSO_DATABASE_URL`、`TURSO_AUTH_TOKEN`：托管数据库连接信息
- `JWT_SECRET`：足够长的随机字符串
- `ADMIN_USERNAME`、`ADMIN_PASSWORD`：初始管理员凭据
- `FRONTEND_ORIGIN`：站点完整地址，例如 `https://your-project.vercel.app`
- `VITE_API_BASE`：前后端同域时设为 `/api`

运行 `npm run build` 后，前端产物位于 `frontend/dist`，后端 Serverless 入口为 `backend/src/app.ts`。

