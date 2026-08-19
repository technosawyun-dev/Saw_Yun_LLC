# Saw Yun LLC — Website

The company website for Saw Yun LLC, live in production at **sawyuntech.com**. It's a marketing site with a fully data-driven Projects/Showcase section (per-platform screenshots for iOS, Android, Web, and Windows) plus a password-protected admin panel that manages the showcase and reads incoming contact-form messages — a self-service CMS, not a hand-edited static site.

```
frontend/   React + Vite — public site + /admin panel   → deploys to Vercel
backend/    FastAPI + PostgreSQL + Docker                → deploys to a VPS
legal/      Company legal documents (source of truth)
```

## Tech Stack

**Backend** — FastAPI 0.115, SQLAlchemy 2.0 + PostgreSQL 16, JWT auth (`python-jose`) with `bcrypt` password hashing, `slowapi` for rate limiting, Pillow for image handling, `httpx` for outbound email API calls, served via Uvicorn in Docker.

**Frontend** — React 19 + Vite 8, `react-router-dom` v7, `axios` for API calls, `react-icons`; no CSS framework — styling is inline/JS-based (`src/styles/theme.js`). `oxlint` for linting.

**Infra** — Docker Compose (dev and prod variants), hourly Postgres backups via `postgres-backup-local` synced to Cloudflare R2 via `rclone` (prod only), GitHub Actions → SSH deploy to a VPS for the backend, native Vercel git integration for the frontend.

## Key Features (verified against code)

- **Project showcase, fully admin-managed** — `Project` + `ProjectScreenshot` models (`backend/app/models/project.py`). Admin can create/edit/delete projects, set status (`live` / `live_demo` / `in_development`), set a live-demo URL and per-platform download links (iOS/Android/Windows), and mark exactly one project as "featured" (drives the homepage band — setting a new one silently un-features the old one, enforced in `routes/projects.py`).
- **Per-platform screenshot management** — upload a screenshot per platform (ios/android/web/windows) per project, with focal-point + zoom fields (`focal_x`, `focal_y`, `zoom`) so an admin can reposition/crop the image inside its device mockup without re-uploading.
- **Per-platform "Built for X" notes** — optional `notes_ios` / `notes_android` / `notes_web` / `notes_windows` text fields, editable in the admin project editor; the project-detail page shows them as a bullet list under "Built for {platform}", falling back to generic platform copy when a project leaves the field blank.
- **Public API** — `GET /api/projects`, `GET /api/projects/featured`, `GET /api/projects/{slug}` — no auth required.
- **Admin API** — `/api/admin/projects/*` (CRUD + screenshot upload/reorder/delete), all behind a `require_admin` JWT dependency.
- **JWT auth** — single admin-role `User` model (`role` defaults to `"admin"`), login issues a 7-day bearer token (`/api/auth/login`), plus `/api/auth/me` and `/api/auth/change-password`.
- **Contact form → admin inbox** — `POST /api/contact` is public and rate-limited to 5/minute per IP (`slowapi`); every submission is saved to the `messages` table and viewable/markable-read/deletable from `/admin/messages`.
- **Optional email notification on new contact messages** — via the Mailtrap *Sending API* (HTTPS, not SMTP — most VPS providers block outbound SMTP), fired as a FastAPI background task so a failed send never blocks or delays the visitor's form submission (`app/services/email.py`). Fully optional: leave `MAILTRAP_API_TOKEN` blank and messages still save normally.
- **Auto-seeded flagship project** — on first boot with an empty `projects` table, "Saw Yun POS" is seeded automatically (`app/db/init_db.py`), status `live`, no screenshots (added later via admin panel).
- **Health check** — `GET /api/health`.
- **Legal pages** — `/legal` and `/legal/:doc` render Terms of Service, Privacy Policy, Refund Policy, and EULA content that is hardcoded in `frontend/src/pages/Legal.jsx` (kept in sync with, but not generated from, the markdown source in `legal/`).

## Project Structure

```
backend/app/
  main.py           FastAPI app, CORS, rate limiter, router mounting, static /uploads
  core/              config (pydantic-settings), security (JWT/bcrypt), deps (auth dependencies)
  db/                SQLAlchemy session, init_db (admin + flagship project seeding), migrate.py
  models/            Project, ProjectScreenshot, User, Message (SQLAlchemy ORM)
  schemas/           Pydantic request/response schemas
  routes/            auth.py, projects.py, messages.py
  services/          email.py (Mailtrap), storage.py (upload handling)
  setup.py           interactive one-time script: generates SECRET_KEY + admin credentials
  docker-compose.yml / docker-compose.prod.yml
  scripts/rclone-sync.sh   R2 backup upload (prod)

frontend/src/
  pages/             Home, Services, Projects, ProjectDetail, About, Contact, Legal
  pages/admin/        AdminLogin, AdminDashboard, AdminProjectsList, AdminProjectEditor,
                       AdminMessages, AdminSettings
  components/         Nav, Footer, ProjectCard, PublicLayout, CtaBand, PosMocks
  components/admin/   AdminLayout, ProtectedRoute, ScreenshotAdjuster
  components/devices/ device-frame mockups (iOS, Android, Mac window, browser window)
  api/                axios wrappers: auth.js, contact.js, messages.js, projects.js, client.js

legal/    Company legal documents — NOT app code. Terms of Service, Privacy Policy,
          Refund Policy, EULA, an internal company legal profile, and a Reseller
          Agreement, as Markdown. This is the canonical source; see note above about
          the frontend's Legal.jsx content being a hardcoded, separately-maintained copy.

deploy.sh   Production deploy script, run on the VPS via GitHub Actions over SSH
```

## Getting Started / Local Dev

**Backend**
```bash
cd backend
cp .env.example .env
python3 setup.py          # generates SECRET_KEY + admin login, writes into .env
docker compose up -d      # Postgres + API on http://localhost:8000
curl http://localhost:8000/api/health   # → {"status":"ok"}
```

**Frontend**
```bash
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:8000
npm install
npm run dev                # http://localhost:5173
```
Admin panel: `http://localhost:5173/admin/login`, using the credentials from `setup.py`.

## Deployment

Both halves auto-deploy on push to `main`:

- **Frontend → Vercel.** Native GitHub integration, Root Directory `frontend`, env var `VITE_API_URL` set to the backend's public URL. `vercel.json` handles SPA routing.
- **Backend → VPS.** `.github/workflows/deploy-backend.yml` triggers on changes under `backend/**`, SSHes in with a deploy key restricted (via `authorized_keys` `command=`) to only running `deploy.sh`. `deploy.sh` does a hard `git reset --hard origin/main` (never touches untracked `.env`/`uploads`), then `docker compose -f docker-compose.prod.yml up -d --build`, and polls the container health check before declaring success. There is no separate migration step — tables are created/updated via `SQLAlchemy Base.metadata.create_all()` on startup (no Alembic).
- `docker-compose.prod.yml` additionally runs an hourly Postgres backup container and an `rclone` sidecar that syncs those backups to Cloudflare R2 — not present in the plain dev `docker-compose.yml`.

## Architecture Notes

- **Single admin, not multi-user.** `User.role` exists but only `"admin"` is used anywhere in the code — there's no team/multi-account admin model.
- **Featured project is exclusive.** Setting `is_featured` on one project clears it on all others in the same request (`_clear_other_featured` in `routes/projects.py`) — enforced in application code, not a DB constraint.
- **Route ordering matters.** `/api/projects/featured` must be declared before `/api/projects/{slug}` or FastAPI would match "featured" as a slug.
- **Legal content is duplicated by design.** The `legal/` Markdown files are the canonical/legally-reviewed documents; the live `/legal` pages render separately hardcoded content in `frontend/src/pages/Legal.jsx`. Updating one does not update the other.
- **Email is best-effort.** Contact-form email notification always runs after the DB commit as a background task, so a Mailtrap outage or misconfiguration can never block or fail the visitor-facing form submission.
- **`.env` files are git-ignored** on both sides; only `.env.example` placeholders are committed. `Settings.SECRET_KEY` validation refuses to start the backend with a missing or weak key.
