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

