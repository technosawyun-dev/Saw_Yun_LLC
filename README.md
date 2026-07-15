# Saw Yun LLC — Website

A software house marketing site with a fully data-driven Projects/Showcase section (screenshots per platform: iOS, Android, Web, Windows) and a password-protected admin panel to manage everything.

```
frontend/   React + Vite — public site + /admin panel   → deploy to Vercel
backend/    FastAPI + PostgreSQL + Docker                → deploy to your VPS
```

## Backend setup (local dev)

```bash
cd backend
cp .env.example .env
python3 setup.py          # generates SECRET_KEY + your admin login, writes them into .env
docker compose up -d      # starts Postgres + the API on http://localhost:8000
```

Check it's running: `curl http://localhost:8000/api/health` → `{"status":"ok"}`

The flagship "Saw Yun POS" project is seeded automatically on first boot (no screenshots yet — add them from the admin panel).

## Frontend setup (local dev)

```bash
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:8000
npm install
npm run dev                # http://localhost:5173
```

Log into the admin panel at `http://localhost:5173/admin/login` with the email/password you set via `setup.py`.

## Deploying

**Frontend → Vercel**
1. Import the `frontend/` folder as a Vercel project.
2. Set the env var `VITE_API_URL` to your backend's public URL (e.g. `https://api.sawyun.com`).
3. `vercel.json` already handles SPA routing.

**Backend → VPS (Docker + Cloudflare Tunnel)**
1. Copy `backend/` to the VPS, `cp .env.example .env`, run `python3 setup.py` (or set the vars by hand), and set `CORS_ORIGINS` to your Vercel URL(s).
2. `docker compose -f docker-compose.prod.yml up -d --build` — this binds Postgres and the API to `127.0.0.1` only (no public ports exposed).
3. Point a Cloudflare Tunnel ingress rule at `localhost:${BACKEND_PORT}` (default `8000`) for your API subdomain, matching how your other projects on this VPS are wired up.
4. Uploaded screenshots persist in `backend/uploads` via a bind mount — back this up along with the database.

## What's admin-managed vs. static

- **Projects & screenshots**: fully managed from `/admin` — create/edit/delete projects, set live/in-development status, upload a screenshot per platform, set a live demo URL. Nothing about the Projects page is hardcoded.
- **Home / Services / About / Contact copy**: static content in the React source (`frontend/src/pages/*.jsx`), matching the original design. Edit the JSX directly to change wording.
- **Contact form submissions**: land in `/admin/messages`, rate-limited to 5/minute per IP to deter spam.

## Security notes

- `.env` files are git-ignored on both sides — only `.env.example` (placeholder values) is committed. Never commit real secrets.
- The backend refuses to start if `SECRET_KEY` is missing or weak — `setup.py` generates a proper one.
- Change the admin password any time from `/admin/settings`.
