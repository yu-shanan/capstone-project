# Deployment record — Capstone Portfolio & Blog

**Deployed:** 2 November 2026  
**Hosting:** Vercel (Hobby plan, no card required)  
**Database:** MongoDB Atlas free cluster, database `capstone`

## Live URLs

| Piece | URL |
| --- | --- |
| Front-end (React SPA) | https://capstone-project-ei2v.vercel.app |
| Back-end (Express API) | https://capstone-project-rose-two.vercel.app |
| Health check | https://capstone-project-rose-two.vercel.app/api/health |
| Projects endpoint | https://capstone-project-rose-two.vercel.app/api/projects |

## How it is wired

- The repository holds `client/` (React 19 + Vite) and `server/` (Express 5 + Mongoose).
- **Back end** — Vercel project `capstone-project`, *Root Directory* `server`. `server/api/index.js`
  wraps the existing Express app with the serverless handler, and caches the Mongoose connection
  between invocations so a warm function does not reconnect on every request.
- **Front end** — Vercel project `capstone-project-ei2v`, *Root Directory* `client`, framework Vite.
  `client/vercel.json` rewrites every path to `index.html`, so `/blog/:id` survives a refresh.
- **CORS** — the API reads `CLIENT_URL`. It is set to `https://capstone-project-ei2v.vercel.app`,
  so only the deployed SPA can read responses.
- **Database** — the connection uses the standard (non-SRV) Atlas URI with the three shard hosts,
  because the local network cannot resolve `mongodb+srv` SRV records. Atlas Network Access allows
  `0.0.0.0/0` for the demo.

## Environment variables

| Project | Key | Purpose |
| --- | --- | --- |
| API (`capstone-project`) | `MONGODB_URI` | Atlas connection string (shard hosts + `/capstone`) |
| | `JWT_SECRET` | 64-hex signing secret |
| | `CLIENT_URL` | allowed browser origin |
| | `NODE_ENV` | `production` |
| SPA (`capstone-project-ei2v`) | `VITE_API_URL` | `https://capstone-project-rose-two.vercel.app/api` |

`VITE_*` values are baked in at build time, so changing `VITE_API_URL` requires a redeploy of the SPA.

## Verification performed

| Check | Result |
| --- | --- |
| `GET /api/health` | `{"success":true,"status":"ok","time":"2026-11-02T09:04:12.534Z"}` |
| `GET /api/projects` | 3 seeded projects returned from Atlas |
| Home page | projects and article counters load from the API, no error banner |
| Projects / Blog pages | render the seeded content |
| SPA refresh on `/blog/:id` | serves `index.html`, no 404 |
| Admin login | `admin@example.com` / `admin123456` |

Seed data was written with `npm run seed:demo` from `server/`, which created the demo admin,
3 projects and 2 blog posts.

## Problems hit and fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| `querySrv ENOTFOUND / ETIMEOUT` | `mongodb+srv` needs a DNS SRV lookup that the local network blocks | switch to the standard URI with the three shard hosts |
| `bad auth` | Atlas user password was stale | reset the password in Database Access |
| `Could not reach the API` / `Failed to load posts` | `CLIENT_URL` still pointed at `localhost:5173`, so the browser blocked the response | set `CLIENT_URL` to the deployed SPA origin and redeploy |
| `*.vercel.app` timed out occasionally | unstable route to the deployment domain | retry; the domain works once the network settles |
| Contact email showed a shortened address | typo in `client/src/config.js` | corrected to `3783515499@qq.com` |
| Production build silently fell back to `localhost:5000` | `axios` baseURL fallback | dev-only fallback, `/api` in production |

## Redeploying

1. Push to `main` — both Vercel projects rebuild automatically.
2. Or use *Deployments → ⋯ → Redeploy* on each project after changing environment variables.
