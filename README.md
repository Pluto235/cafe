# Event Horizon Café · 视界咖啡馆

一家由天文系几位学生开起来的小奶昔/咖啡铺。本仓库是它的下单网站。

## 快速启动

```bash
# 1. 装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env，把 ADMIN_PASSWORD 改成你自己的店员后台密码

# 3. 构建前端
npm run build

# 4. 启动服务（默认 8787）
ADMIN_PASSWORD=$(grep ADMIN_PASSWORD .env | cut -d= -f2) PORT=8787 npm start
```

打开 `http://<server-ip>:8787/` 就能看到主页。`http://<server-ip>:8787/admin` 是店员后台（用户名 `staff`，密码 = `ADMIN_PASSWORD`）。

## 开发模式

```bash
# 终端 A：跑 API（8787）
ADMIN_PASSWORD=dev npm run dev:api

# 终端 B：跑前端 dev server（5173，自动代理 /api 到 8787）
npm run dev:web
```

然后访问 `http://localhost:5173`。

## 维护

- **每日今夜星空**：编辑 `src/data/tonight.js` 后重新 `npm run build`。
- **菜单调整**：编辑 `src/data/menu.js`（`shakes` 和 `coffees` 两个数组）。
- **数据库**：SQLite 文件在 `server/data/ehc.db`。备份直接拷文件即可。
- **查订单**：店员后台 `/admin`，或 `sqlite3 server/data/ehc.db "SELECT * FROM orders;"`

## 上 Fly.io（推荐的公网部署方式）

需要 [flyctl](https://fly.io/docs/flyctl/install/) + Fly.io 账号（GitHub 登录最快，新账号会要求绑信用卡作信用校验）。

```bash
# 1) 把仓库根目录的 fly.toml 中的 app = "event-horizon-cafe" 换成自己的（重名会冲突）
# 2) 创建 app（用我们写好的 fly.toml，不要让它覆盖）
fly launch --no-deploy --copy-config

# 3) 创建 1GB 持久卷给 SQLite
fly volumes create ehc_data --size 1 --region hkg

# 4) 配 admin 密码（不要写进 fly.toml）
fly secrets set ADMIN_PASSWORD='你设的密码'

# 5) 部署
fly deploy

# 6) 拿 URL
fly status     # 看到 https://<app-name>.fly.dev
```

部署成功后：
- 主页：`https://<app-name>.fly.dev/`
- 店员后台：`https://<app-name>.fly.dev/admin`（用户 `staff`）
- 健康检查：`curl https://<app-name>.fly.dev/api/health`

**收款码**：吧台用的微信/支付宝静态收款码 PNG 放到 `public/pay-qr.png`，下单成功页会自动展示。

**每日更新菜单/星空**：编辑 `src/data/menu.js` 或 `src/data/tonight.js` → `git commit` → `fly deploy`（约 90 秒）。

**数据备份**：`fly ssh sftp shell`，`get /data/ehc.db ./backup-YYYYMMDD.db`。

**应急关站 / 复活**：`fly scale count 0` / `fly scale count 1`。

## 技术栈

- 前端：Vite 5 + React 18 + react-router
- 后端：Express + better-sqlite3
- 单端口部署：Express 既挂 `/api/*` 也 serve 静态产物 `dist/`
