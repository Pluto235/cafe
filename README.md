# Event Horizon Café · 视界咖啡馆

一家由天文系几位学生开起来的小奶昔/咖啡铺。本仓库是它的下单网站。

## 上 Cloudflare Workers（公网部署）

需要 [Node.js](https://nodejs.org) + [Cloudflare 账号](https://dash.cloudflare.com/sign-up)（免费，无需信用卡）。

```bash
# 1) 装依赖
npm install

# 2) 登录 Cloudflare
npx wrangler login

# 3) 创建 D1 数据库，把输出的 database_id 填入 wrangler.toml
npx wrangler d1 create ehc-db
# → 复制 database_id，粘贴到 wrangler.toml [[d1_databases]] 的 database_id 字段

# 4) 初始化数据库（建表 + seed 心愿数据）
npx wrangler d1 migrations apply ehc-db

# 5) 设置 Admin 密码（只存在 Cloudflare 云端，不进代码）
npx wrangler secret set ADMIN_PASSWORD

# 6) 一键构建 + 部署
npm run deploy
```

部署成功后，终端会输出：
```
https://event-horizon-cafe.<你的账号>.workers.dev
```

- 主页：`https://event-horizon-cafe.xxx.workers.dev/`
- 店员后台：`.../admin`（用户 `staff`，密码 = 上面设的 `ADMIN_PASSWORD`）
- 健康检查：`curl .../api/health`

**收款码**：把微信/支付宝静态收款码放到 `public/pay-qr.png`，再跑 `npm run deploy` 就自动上线。

**每日更新菜单/星空**：编辑 `src/data/menu.js` 或 `src/data/tonight.js` → `git commit` → `npm run deploy`。

**查订单**：店员后台 `/admin`，或 Cloudflare 控制台 → Workers & Pages → Storage → D1 → ehc-db。

**应急关站**：Cloudflare 控制台 → Workers & Pages → event-horizon-cafe → 右上角「停用」。

## 本地开发

```bash
# 先初始化本地 D1 模拟（只用跑一次）
npx wrangler d1 migrations apply ehc-db --local

# 终端 A：Worker + D1 本地模拟（8787）
npm run dev:api        # = wrangler dev

# 终端 B：Vite 前端（5173，自动代理 /api 到 8787）
npm run dev:web
```

访问 `http://localhost:5173`。Admin 密码在 `wrangler dev` 启动时会提示，也可以在 `wrangler.toml` 的 `[vars]` 临时加 `ADMIN_PASSWORD = "dev"`（本地专用，不提交）。

## 维护

- **菜单调整**：编辑 `src/data/menu.js`（`shakes` 和 `coffees` 两个数组）。
- **每日今夜星空**：编辑 `src/data/tonight.js`（默认兜底文案，不绑日期）。
- **数据库结构变更**：在 `migrations/` 新建 `0002_xxx.sql`，然后 `npx wrangler d1 migrations apply ehc-db`。

## 技术栈

- 前端：Vite 5 + React 18 + react-router（SPA）
- 后端：Hono（Cloudflare Workers）+ Cloudflare D1（托管 SQLite）
- 静态资源：Cloudflare Workers Assets（ASSETS 绑定）
- 备用本地后端：`server/`（Express + better-sqlite3，仅本地调试）
