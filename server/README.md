# Full-Stack Portfolio & Blog — Backend API

Node.js + Express + MongoDB Atlas (Mongoose) backend for the Capstone project.

## Features

- MVC structure: `models/`, `controllers/`, `routes/`, `middleware/`, `utils/`
- 5 Mongoose models: User, Project, BlogPost, Comment, Message
- bcrypt password hashing, JWT authentication
- `protect` middleware (Bearer token), author-only update/delete for blog posts
- Central error handling, helmet, cors, dotenv

## API Endpoints

| Method | Endpoint | Auth | Body / Params |
|--------|----------|------|---------------|
| POST | `/api/users/register` | Public | `{ username, email, password }` |
| POST | `/api/users/login` | Public | `{ email, password }` → `{ token, ... }` |
| GET | `/api/users/me` | Bearer | current user (validates a stored token) |
| GET | `/api/projects` | Public | – |
| GET | `/api/projects/:id` | Public | – |
| POST | `/api/projects` | Bearer | `{ title, description, imageUrl?, repoUrl?, liveUrl? }` |
| PUT | `/api/projects/:id` | Bearer | same fields (partial allowed) |
| DELETE | `/api/projects/:id` | Bearer | – |
| POST | `/api/contact` | Public | `{ name, email, message }` |
| GET | `/api/blog` | Public | – |
| GET | `/api/blog/:id` | Public | – |
| POST | `/api/blog` | Bearer | `{ title, content }` |
| PUT | `/api/blog/:id` | Bearer + author | `{ title?, content? }` |
| DELETE | `/api/blog/:id` | Bearer + author | – |
| GET | `/api/blog/:postId/comments` | Public | – |
| POST | `/api/blog/:postId/comments` | Bearer | `{ body }` |
| GET | `/api/health` | Public | – |

## Run locally

```bash
cd server
npm install
cp .env.example .env   # then edit values
npm run dev
```

`.env`:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=some-long-random-string
PORT=5000
CLIENT_URL=http://localhost:5173
```

Seed an admin account (optional):

```bash
npm run seed
```

## Deploy (Render)

1. Push this folder to GitHub (exclude `.env` and `node_modules`).
2. Render → New Web Service → Root Directory `server`.
3. Build Command: `npm install`; Start Command: `node server.js`.
4. Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT`.
5. In MongoDB Atlas → Network Access, allow `0.0.0.0/0`.

## Response conventions

- Success: JSON object/array; create → `201`.
- Error: `{ "success": false, "message": "..." }` with proper status code
  (`400` validation, `401` unauthenticated, `403` not the author, `404` not found, `500` server).
