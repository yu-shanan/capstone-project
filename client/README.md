# Portfolio & Blog — React Client

Front-end SPA for the Capstone project. React 19 + Vite + React Router + Context API + Axios.

## Pages

| Route | Page | Notes |
|-------|------|-------|
| `/` | Home | hero, about me, featured projects, latest posts |
| `/projects` | Projects | public project gallery |
| `/blog` | Blog | public post list |
| `/blog/:id` | BlogDetail | post + comments, comment form when logged in |
| `/contact` | Contact | public contact form |
| `/login` | Login | JWT login |
| `/register` | Register | creates account and logs in |
| `/admin` | Admin | **protected**: manage projects & posts (create/update/delete) |
| `*` | NotFound | 404 |

## Run locally

```bash
cd client
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:5000/api
npm run dev              # http://localhost:5173
```

The backend must be running (default `http://localhost:5000`). See `../server/README.md`.

## Build

```bash
npm run build            # outputs dist/
npm run preview          # preview the production build
```

## Auth

- Token and user info are stored in `localStorage` under `user`.
- `src/api/axios.js` attaches `Authorization: Bearer <token>` to every request.
- `AuthContext` exposes `user`, `login()`, `logout()`; the header becomes auth-aware.
- `/admin` is wrapped in `ProtectedRoute`, which redirects to `/login` when logged out.

## Styling

Plain modern CSS (`src/index.css`) with CSS variables, responsive grid, mobile layout and a
light/dark theme (toggle in the header, remembered in `localStorage`) — no extra build step needed.

## Personalise

All personal content lives in `src/config.js` (name, role, bio, skills, email, GitHub link) and the
portrait is `public/my-photo.jpg`. Edit those two files and the whole site updates.
