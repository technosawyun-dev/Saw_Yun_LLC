#!/usr/bin/env bash
# Manual / reference copy of the production deploy. Production is
# "Appbox: Company ubuntu" (user appbox, folder /home/appbox/sawyun-llc).
# GitHub Actions does NOT run this file: the deploy key's forced command is
# /home/appbox/sawyun-llc/ci-deploy.sh, an UNTRACKED copy of this logic, so the
# `git reset --hard` below can never replace the running script mid-deploy.
set -euo pipefail

main() {
  cd /home/appbox/sawyun-llc

  echo "==> Syncing to latest main"
  # Hard reset instead of a plain `git pull` — this runs non-interactively over
  # SSH from CI, so any local drift (a manual edit on the server, a stray file)
  # would otherwise leave it stuck requiring manual intervention. Never touches
  # untracked files, so backend/.env, backend/uploads and backups are always safe.
  git fetch --quiet origin main
  git reset --hard origin/main

  echo "==> Rebuilding and restarting the backend"
  cd backend
  docker compose -f docker-compose.prod.yml up -d --build

  echo "==> Waiting for the backend to answer"
  for i in $(seq 1 30); do
    if curl -fsS -m 3 http://127.0.0.1:8011/api/health >/dev/null 2>&1; then
      echo "backend healthy"
      break
    fi
    [ "$i" = 30 ] && { echo "BACKEND NOT HEALTHY after 60 s" >&2; docker compose -f docker-compose.prod.yml ps; exit 1; }
    sleep 2
  done

  # No migration step: the backend creates/updates tables itself via
  # SQLAlchemy's Base.metadata.create_all() on startup (see app/main.py) —
  # there's no separate migration tool (e.g. Alembic) to run here. If one is
  # added later, run it here before declaring the deploy complete.

  echo "==> Deploy complete"
  docker compose -f docker-compose.prod.yml ps
}

main "$@"; exit $?
