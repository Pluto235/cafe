# CLAUDE.md

> 给未来的 Claude / 接班同学读的项目说明。要改这个文件本身时记得保持简洁，能让人 30 秒内上手。

## 项目是什么

天文系学生在系里吧台开的 Event Horizon Café（视界咖啡馆）下单网页。
顾客扫吧台二维码 → 选奶昔/咖啡 + 取餐时间 → 拿订单号 → 看到收款码扫码付款 → 到吧台凭订单号取餐。

## 技术栈

- 前端：Vite 5 + React 18 + react-router（单端口、无 SSR）
- 后端：Express + better-sqlite3（同一进程同时挂 `/api/*` 与 `dist/` 静态产物）
- 部署：Fly.io（HKG region），SQLite 文件挂在 `/data` 持久卷

## 关键路径

- `src/pages/Home.jsx` — 主页（Hero、Menu、Tonight Sky、OrderForm、WishWall）
- `src/pages/Admin.jsx` — 店员后台（Basic Auth，用户 `staff`，密码 = `ADMIN_PASSWORD`）
- `src/data/menu.js` — 奶昔 + 咖啡定义（每日营业前可改 → `fly deploy`）
- `src/data/tonight.js` — 今夜星空文案（默认是兜底版，不绑日期）
- `server/index.js` — Express 入口，`trust proxy` 已开
- `server/db.js` — SQLite 初始化 + seed 心愿；`DB_PATH` 环境变量可覆盖路径
- `server/routes/orders.js` — 下单 + admin 列单 + 状态切换
- `server/routes/wishes.js` — 心愿墙读写
- `server/rateLimit.js` — 内存 IP 滑动窗口限流（orders 3/min、wishes 10/min）
- `Dockerfile` / `fly.toml` / `.dockerignore` — Fly.io 部署配置

## 常用命令

```bash
# 本地开发（两个终端）
npm install
ADMIN_PASSWORD=dev npm run dev:api    # API 在 8787
npm run dev:web                       # 前端在 5173，自动代理 /api

# 本地完整模式（构建 + 单端口）
npm run build
ADMIN_PASSWORD=dev PORT=8787 npm start

# 部署到 Fly
fly deploy
fly logs -f
fly status
```

## Git 工作流

### 远程仓库

- 主仓库：`git@github.com:Pluto235/cafe.git`
- 默认分支：`main`
- 提交者：`Pluto235 <ngc4535@outlook.com>`（已配在全局 git config）

### 分支策略

小项目，**直接在 `main` 上推**就好；做实验性大改时再开 `feature/<名字>` 分支。

### 提交习惯

- 短小 commit：一个改动一条 commit，避免"一坨"。
- 消息格式（中英都行）：动词开头 + 范围。例：
  - `add rate limit on POST /api/orders`
  - `fix tonight.js 兜底文案`
  - `chore: bump vite to 5.4.21`
- 不写编辑器指纹（如 "auto-format"）。

### push 之前的快检

```bash
npm run build              # 构建必须通过
ADMIN_PASSWORD=t PORT=8788 npm start &
curl -s localhost:8788/api/health   # → {"ok":true}
kill %1
```

### 不进库的东西（已在 `.gitignore`）

- `node_modules/`、`dist/`、`server/data/*.db*`、`.env*`、`*.log`
- **`public/pay-qr.png`** — 私人微信/支付宝收款码，绝不进库。每台部署机器自己放，或者通过 `fly deploy` 单独 SCP/SFTP 上传到容器：

  ```bash
  # 把本地的收款码塞进运行中的容器持久卷（或者直接放进 dist/ 重新部署）
  fly ssh sftp shell
  put public/pay-qr.png /app/dist/pay-qr.png
  ```

  注：放进 `dist/` 在容器重启后会丢，因为 dist/ 不挂卷。**长期方案**是把图复制到 `/data/pay-qr.png` 然后改 server 加一条静态路由 `/pay-qr.png → /data/pay-qr.png`；MVP 阶段用 deploy 时先放到 `public/` 后 build → 部署，每次部署自带就行（`public/` 在 build 时会被复制到 `dist/`，但 `.gitignore` 阻止它进库；CI 跑不到这一步，但本地 `fly deploy` 因为是从本地工作树打 Docker，`.gitignore` 不影响 docker context，会被一起带进镜像）。

- `.claude/` — Claude Code 本地配置
- `.vscode/`、`.idea/` — IDE 个人配置

### 敏感信息

- `ADMIN_PASSWORD` **永远走 `fly secrets set`**，不写进 `fly.toml`、不进 commit。
- `.env` 永远只在本地，已忽略。
- 收款码不进 git 历史。

### 常见操作小抄

```bash
# 拉最新
git pull --ff-only

# 直接推到 main
git add -A && git commit -m "..." && git push

# 看远程是否有新提交
git fetch && git log HEAD..origin/main --oneline

# 不小心提交了敏感文件 → 立刻：
git reset --soft HEAD~1   # 撤销最近的 commit 但保留改动
# 编辑去掉敏感内容 → 重新 commit
# 如果已经 push 出去了，告诉店主，需要 force push 或重写历史

# 紧急关站
fly scale count 0
# 复活
fly scale count 1
```

## 部署清单（每次 `fly deploy` 前）

1. `npm run build` 本地通过
2. 若改了菜单 / 星空 / 价格，肉眼跑一遍 dev：`npm run dev:web`
3. `git status` 干净（敏感文件没出现）
4. `git push`（保持远程跟本地一致）
5. `fly deploy`
6. `curl https://<app>.fly.dev/api/health` → `{"ok":true}`
7. 手机 4G 扫海报二维码下一笔单 → admin 后台能看到

## 不在仓库里 / 在系里其他地方

- 海报设计源文件（如 .ai/.psd）—— 设计同学的设备
- 收款码 PNG —— 谁负责吧台谁带，`fly deploy` 前放到 `public/pay-qr.png`
- Fly.io 账号 —— 谁开的谁管，`fly auth whoami` 看
