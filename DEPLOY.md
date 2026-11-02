# 部署上线指南 / Deployment Guide

本项目已经可以上线，但需要**两个属于你自己的账号**：一个 MongoDB Atlas（数据库），一个 Vercel 或 Render（托管）。
代码和配置已经准备好，按下面步骤点几下即可。

---

## 0. 先修好数据库（必要前提）

现在 `server/.env` 里的 Atlas 账号密码已经**认证失败**（接口返回 `bad auth : authentication failed`），
云端部署后后端会启动失败。请先做这一步：

1. 打开 <https://cloud.mongodb.com> → 你的 Cluster → **Database Access**
2. 找到用户 `3783515499_db_user` → **Edit** → **Edit Password** → 设置一个新密码（只含字母数字，避免 `@ : / ?` 等字符）
3. **Network Access** → Add IP Address → `0.0.0.0/0`（演示用；正式可只放行 Render 出口 IP）
4. 复制新的连接串：**Connect → Drivers → Node.js**，形如
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/capstone?retryWrites=true&w=majority`
5. 把新连接串写进 `server/.env` 的 `MONGODB_URI=`，然后本地运行 `npm run seed:demo` 验证能连上

---

## 1. 后端 → Render（免费）

1. 把项目推到 GitHub（仓库根目录包含 `server/` 和 `client/`）
2. Render → **New +** → **Web Service** → 选择仓库
3. 填写：
   - Name: `capstone-api`
   - Root Directory: `server`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Environment Variables**：

   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | 第 0 步的新连接串 |
   | `JWT_SECRET` | 一串随机字符（≥32 位） |
   | `CLIENT_URL` | 前端地址，先填 `http://localhost:5173`，部署完前端再改 |
   | `NODE_ENV` | `production` |

5. Deploy → 打开 `https://<你的服务>.onrender.com/api/health`，返回 `{"success":true,...}` 即成功。

> 仓库里已有 `render.yaml`，也可以在 Render 里用 **Blueprint** 一键创建。

---

## 2. 前端 → Vercel（免费）

1. Vercel → **Add New… → Project** → 导入同一个仓库
2. 填写：
   - Root Directory: `client`
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Environment Variables**：

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://<你的服务>.onrender.com/api` |

4. Deploy → 得到 `https://<你的项目>.vercel.app`
5. 回到 Render，把 `CLIENT_URL` 改成这个 Vercel 域名（多个域名用英文逗号分隔）
6. 打开线上站点，注册账号 → 进 `/admin` 添加内容

> `client/vercel.json` 已配置 SPA 重写，刷新 `/blog/xxx` 不会 404。

---

## 3. 上线后检查清单

- [ ] `https://<api>/api/health` 返回 ok
- [ ] 首页统计数字不是 0（说明接口连通）
- [ ] 注册 → 登录 → 新建项目 → 首页能看到
- [ ] 手机宽度下 Header 出现 Menu/Close 按钮，菜单能开合
- [ ] 刷新 `/blog/xxx` 不报 404
- [ ] 浏览器控制台没有 CORS 报错（有的话检查 Render 的 `CLIENT_URL`）

---

## 4. 如果不想自己点：把权限交给我

任选其一，我就能直接执行部署并返回线上地址：

- **Vercel**：登录后到 <https://vercel.com/account/tokens> 创建 token（Scope 选你的账号），把 token 发我
- **Render**：到 <https://dashboard.render.com/u/settings#api-keys> 创建 API Key，把 key 发我
- **GitHub**：如果先要建仓库，给我一个具备 `repo` 权限的 token

> 提醒：token 等同于账号权限，演示结束后请在对应平台删除。

---

## English (short version)

1. **Fix the database first** — the Atlas user in `server/.env` currently fails with `bad auth`. Reset the
   password in Atlas → Database Access, allow `0.0.0.0/0` in Network Access, and put the new
   `mongodb+srv://...` string into `MONGODB_URI`.
2. **Back end → Render**: Root Directory `server`, Build `npm install`, Start `npm start`,
   env `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV=production`. Check `/api/health`.
3. **Front end → Vercel**: Root Directory `client`, Framework Vite, Build `npm run build`,
   Output `dist`, env `VITE_API_URL=https://<api>.onrender.com/api`.
4. Set Render's `CLIENT_URL` to the Vercel domain, then register an account and add content in `/admin`.

Everything else — SPA rewrites (`vercel.json`, `_redirects`), the Tailwind build, and the API
proxy used for local previews — is already configured.
