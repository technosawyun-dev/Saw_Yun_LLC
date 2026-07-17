#!/usr/bin/env bash
set -euo pipefail

cd /home/Saw_Yun_LLC

echo "==> Syncing to latest main"
# Hard reset instead of a plain `git pull` — this runs non-interactively over
# SSH from CI, so any local drift (a manual edit on the VPS, a stray file)
# would otherwise leave it stuck requiring manual intervention. Never touches
# untracked files, so backend/.env and backend/uploads are always safe.
git fetch origin main
git reset --hard origin/main

echo "==> Rebuilding and restarting the backend"
cd backend
docker compose -f docker-compose.prod.yml up -d --build

echo "==> Waiting for backend to be healthy"
for i in $(seq 1 30); do
  status=$(docker inspect sawyun_backend --format '{{.State.Health.Status}}' 2>/dev/null || echo "starting")
  if [ "$status" = "healthy" ]; then
    break
  fi
  sleep 2
done

# No migration step: the backend creates/updates tables itself via
# SQLAlchemy's Base.metadata.create_all() on startup (see app/main.py) —
# there's no separate migration tool (e.g. Alembic) to run here. If one is
# added later, run it here before declaring the deploy complete.

echo "==> Deploy complete"
docker compose -f docker-compose.prod.yml ps
