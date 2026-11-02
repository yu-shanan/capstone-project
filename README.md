# Full-Stack Portfolio & Blog 鈥?Capstone Project

A production-style personal portfolio and blog. A REST API on **Node.js + Express + MongoDB Atlas**
powers a **React 19 SPA** with public pages, authentication, comments and a protected admin dashboard.

- **Back-end:** Node.js, Express 5, MongoDB Atlas, Mongoose, JWT, bcrypt, helmet, dotenv, CORS
- **Front-end:** React 19 (Vite), React Router 7, Context API, Axios, responsive CSS with a dark theme

---

## Live URLs

| App | URL |
|-----|-----|
| Front-end (SPA) | https://capstone-project-ei2v.vercel.app |
| Back-end (API) | https://capstone-project-rose-two.vercel.app |
| API index / health | https://capstone-project-rose-two.vercel.app/ · /api/health |

> Deployed on Vercel (Hobby). The API runs as a serverless function (`server/api/index.js`); data lives in MongoDB Atlas (`capstone`). Demo admin: `admin@example.com` / `admin123456`. Verification record: `docs/DEPLOYED.md`.

---

## Features

**Portfolio & blog**
- Projects gallery and blog list, both fed by the API (loading / error / empty states everywhere)
- Blog detail page with comments; logged-in users can post comments
- Contact form that stores messages in MongoDB

**Authentication & authorization**
- Register / login with bcrypt-hashed passwords
- JWT issued on login and attached to every protected request (`Authorization: Bearer <token>`)
- `protect` middleware verifies the token and loads `req.user`
- A blog post can only be updated/deleted by its author (403 otherwise)
- Session survives refresh; an expired token logs the user out automatically

**Admin dashboard (`/admin`, protected route)**
- Full CRUD for projects and blog posts (create, edit, delete)
- Auth-aware header (Login/Register vs Admin/Logout)
- Light / dark theme toggle, remembered in `localStorage`

---

## Project structure

```
capstone/
鈹溾攢 README.md                 <- this file (required by the submission)
鈹溾攢 server/                   Express API 鈥?MVC
鈹? 鈹溾攢 config/db.js           MongoDB Atlas connection
鈹? 鈹溾攢 models/                User, Project, BlogPost, Comment, Message
鈹? 鈹溾攢 controllers/           one controller per resource
鈹? 鈹溾攢 routes/                /api/users, /api/projects, /api/blog, /api/contact
鈹? 鈹溾攢 middleware/            protect (JWT), error (central handler)
鈹? 鈹溾攢 utils/                 ErrorHandler, generateToken
鈹? 鈹溾攢 scripts/seedAdmin.js   optional demo admin
鈹? 鈹溾攢 app.js                 express app (helmet, cors, routes, 404, errors)
鈹? 鈹斺攢 server.js              connect DB + listen
鈹斺攢 client/                   React SPA
   鈹溾攢 src/api/axios.js       axios instance + JWT interceptor
   鈹溾攢 src/context/           AuthContext (global auth state), ThemeContext
   鈹溾攢 src/components/        Layout, Footer, ProjectCard, BlogCard, ProtectedRoute
   鈹溾攢 src/pages/             Home, Projects, Blog, BlogDetail, Contact, Login, Register, Admin, NotFound
   鈹斺攢 src/config.js          鈫?personalise your name, bio, photo, links here
```

---

## API endpoints

Base URL locally: `http://localhost:5000/api`

| Method | Endpoint | Access | Body / notes |
|--------|----------|--------|--------------|
| POST | `/api/users/register` | Public | `{ username, email, password }` (password 鈮?6) |
| POST | `/api/users/login` | Public | `{ email, password }` 鈫?`{ token, _id, username, email }` |
| GET | `/api/users/me` | Bearer | current user (used to validate a stored token) |
| GET | `/api/projects` | Public | all projects, `user` populated with `username` |
| GET | `/api/projects/:id` | Public | single project |
| POST | `/api/projects` | Bearer | `{ title, description, imageUrl?, repoUrl?, liveUrl? }` |
| PUT | `/api/projects/:id` | Bearer | partial update of the fields above |
| DELETE | `/api/projects/:id` | Bearer | 鈥?|
| POST | `/api/contact` | Public | `{ name, email, message }` 鈫?stored as a Message |
| GET | `/api/blog` | Public | all posts, `author` populated with `username` |
| GET | `/api/blog/:id` | Public | post + `author` + `comments[]` |
| POST | `/api/blog` | Bearer | `{ title, content }` (author = `req.user`) |
| PUT | `/api/blog/:id` | Bearer + author | `{ title?, content? }` 鈥?403 if not the author |
| DELETE | `/api/blog/:id` | Bearer + author | also deletes the post's comments |
| GET | `/api/blog/:postId/comments` | Public | all comments for a post |
| POST | `/api/blog/:postId/comments` | Bearer | `{ body }` |
| GET | `/api/health` | Public | `{ success: true, status: "ok" }` |

Errors always come back as `{ "success": false, "message": "..." }` with a proper status code
(`400` validation, `401` missing/invalid token, `403` not the author, `404` not found, `500` server).

---

## Run locally

Requirements: Node.js 20+, a MongoDB Atlas cluster.

### 1. Back-end

```bash
cd server
npm install
cp .env.example .env      # Windows: copy .env.example .env
```

Edit `server/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/capstone?retryWrites=true&w=majority
JWT_SECRET=some-long-random-string
PORT=5000
CLIENT_URL=http://localhost:5173
```

```bash
npm run seed        # optional: creates admin@example.com / admin123456
npm run seed:demo   # optional: also adds 3 demo projects + 2 blog posts
npm run dev         # nodemon, http://localhost:5000
```

In MongoDB Atlas 鈫?**Network Access**, allow your IP (or `0.0.0.0/0` for a demo).

### 2. Front-end

```bash
cd client
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm run dev               # http://localhost:5173
```

Open <http://localhost:5173>, register an account (or log in with the seeded admin),
then manage content from **/admin**.

### 3. Personalise it

Edit `client/src/config.js` 鈥?name, role, bio, skills, photo (`client/public/my-photo.jpg`),
email and GitHub link all come from that one object.

---

## Deployment

**Back-end 鈫?Render (or Railway/Heroku)**
1. Push the repository to GitHub.
2. New **Web Service** 鈫?Root Directory `server`, Build `npm install`, Start `node server.js`.
3. Environment variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL), `PORT` (leave unset).
4. Deploy, then check `https://<your-api>.onrender.com/api/health`.

**Front-end 鈫?Vercel (or Netlify)**
1. Import the repo, Root Directory `client`, Framework preset **Vite**,
   Build `npm run build`, Output `dist`.
2. Environment variable `VITE_API_URL=https://<your-api>.onrender.com/api`.
3. Deploy. `client/vercel.json` and `client/public/_redirects` already provide the SPA rewrite so
   deep links such as `/blog/:id` work after a refresh.
4. Go back to Render and set `CLIENT_URL` to the deployed front-end URL (comma-separate several origins).

---

## Submission checklist

- [ ] Live front-end URL and live back-end URL added to the table at the top of this README
- [ ] `StudentID_StudentName_CapstoneProject.zip` containing `server/` and `client/`
- [ ] `node_modules/`, `dist/`, `.env` excluded from the zip
- [ ] This `README.md` at the root of the zip
- [ ] `client/src/config.js` updated with your own name, photo and links

Build the zip on Windows PowerShell:

```powershell
# from the folder that contains server/ and client/ (README.md included)
$exclude = 'node_modules','dist','.env','.git','package-lock.json'
# easiest: delete node_modules/dist first, then
Compress-Archive -Path server,client,README.md -DestinationPath "$env:USERPROFILE\Desktop\StudentID_StudentName_CapstoneProject.zip"
```
