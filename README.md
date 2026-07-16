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

Both halves auto-deploy on every push to `main` — nothing to run by hand day-to-day. One-time setup for each:

### Frontend → Vercel (auto-deploys natively, no workflow file needed)

1. Import this GitHub repo into Vercel and set **Root Directory** to `frontend`.
2. Set the env var `VITE_API_URL` to your backend's public URL (e.g. `https://api.sawyun.com`).
3. Done. Vercel's own GitHub integration builds and deploys on every push to `main`; `vercel.json` already handles SPA routing.

### Backend → VPS (auto-deploys via GitHub Actions + SSH)

`.github/workflows/deploy-backend.yml` runs `deploy.sh` on your VPS over SSH whenever `backend/**` changes on `main`. One-time setup:

1. **Clone the repo on the VPS** at a fixed path — this must match the path used in both `deploy.sh` and `.github/workflows/deploy-backend.yml` (defaults to `/home/sawyun/Saw_Yun_LLC`; edit both files if you use a different user/path):
   ```bash
   git clone https://github.com/HeinHtetNyan/Saw_Yun_LLC.git /home/sawyun/Saw_Yun_LLC
   cd /home/sawyun/Saw_Yun_LLC/backend
   cp .env.example .env
   python3 setup.py                 # generates SECRET_KEY + your admin login
   # then set CORS_ORIGINS in .env to your Vercel URL(s)
   ```
2. **Create a dedicated deploy key** (don't reuse your personal SSH key):
   ```bash
   ssh-keygen -t ed25519 -f sawyun_deploy_key -N ""
   ```
3. **Restrict that key on the VPS** so it can only ever run `deploy.sh`, nothing else — add this to the VPS's `~/.ssh/authorized_keys` (one line, using the contents of `sawyun_deploy_key.pub`):
   ```
   command="/home/sawyun/Saw_Yun_LLC/deploy.sh",no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty ssh-ed25519 AAAA...your-public-key...
   ```
   This means even if the private key ever leaked, it's useless for anything beyond re-running this one deploy script.
4. **Add two GitHub repo secrets** (Settings → Secrets and variables → Actions):
   - `VPS_HOST` — your VPS's IP or hostname
   - `VPS_DEPLOY_KEY` — the full contents of the *private* key file (`sawyun_deploy_key`)
5. Point a Cloudflare Tunnel ingress rule at `localhost:${BACKEND_PORT}` (default `8000`) for your API subdomain, matching how your other projects on this VPS are wired up.

From then on, every push to `main` that touches `backend/` automatically: pulls latest, rebuilds the container, waits for it to report healthy, and prints status — see `deploy.sh` at the repo root. Uploaded screenshots (`backend/uploads`) and `.env` are untracked, so a deploy never touches them — back them up separately.

To deploy manually instead: SSH in and run `/home/sawyun/Saw_Yun_LLC/deploy.sh` (or just `git push` — that's the whole point).

## What's admin-managed vs. static

- **Projects & screenshots**: fully managed from `/admin` — create/edit/delete projects, set live/in-development status, upload a screenshot per platform, set a live demo URL. Nothing about the Projects page is hardcoded.
- **Home / Services / About / Contact copy**: static content in the React source (`frontend/src/pages/*.jsx`), matching the original design. Edit the JSX directly to change wording.
- **Contact form submissions**: land in `/admin/messages`, rate-limited to 5/minute per IP to deter spam. Optionally also emailed to you directly — see below.

## Email notifications for the contact form

Contact form submissions always save to the database and show up under `/admin` → Messages — that part needs no setup. To *also* get an email the moment one comes in, set these three variables in `backend/.env`:

```
EMAIL_ENABLED=true
MAILTRAP_API_TOKEN=<your token>
NOTIFY_TO_EMAIL=you@yourdomain.com
```

This uses [Mailtrap](https://mailtrap.io)'s Sending API (an HTTPS call) rather than raw SMTP — most VPS providers block outbound SMTP ports by default, so SMTP tends to work locally and then silently fail once deployed. Setup:

1. Sign up at mailtrap.io and verify a sending domain (or use their shared test domain while developing).
2. Grab an API token from Email Sending → Sending Domains → your domain → API Tokens.
3. Set `MAILTRAP_API_TOKEN` and `EMAIL_FROM` (must be an address on your verified sending domain) in `.env`, then restart the backend.

Leave `MAILTRAP_API_TOKEN` blank to skip email entirely — nothing else changes, submissions still save normally. A failed or misconfigured email send is logged but never blocks the visitor's form submission or the message being saved (see `app/services/email.py`).

## Security notes

- `.env` files are git-ignored on both sides — only `.env.example` (placeholder values) is committed. Never commit real secrets.
- The backend refuses to start if `SECRET_KEY` is missing or weak — `setup.py` generates a proper one.
- Change the admin password any time from `/admin/settings`.
