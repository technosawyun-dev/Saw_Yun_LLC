from sqlalchemy import text
from sqlalchemy.engine import Engine

# This project uses Base.metadata.create_all() instead of Alembic, which only
# creates missing tables — it never alters existing ones. Any column added to
# a model after the first release has to be patched into already-running
# databases here. Each statement must stay idempotent (IF NOT EXISTS) since
# this runs on every startup, against both fresh and pre-existing databases.
STARTUP_MIGRATIONS = [
    "ALTER TABLE project_screenshots ADD COLUMN IF NOT EXISTS focal_x FLOAT NOT NULL DEFAULT 50.0",
    "ALTER TABLE project_screenshots ADD COLUMN IF NOT EXISTS focal_y FLOAT NOT NULL DEFAULT 50.0",
    "ALTER TABLE project_screenshots ADD COLUMN IF NOT EXISTS zoom FLOAT NOT NULL DEFAULT 1.0",
    "ALTER TABLE projects ADD COLUMN IF NOT EXISTS download_ios_url VARCHAR",
    "ALTER TABLE projects ADD COLUMN IF NOT EXISTS download_android_url VARCHAR",
    "ALTER TABLE projects ADD COLUMN IF NOT EXISTS download_windows_url VARCHAR",
]


def run_startup_migrations(engine: Engine) -> None:
    with engine.begin() as conn:
        for statement in STARTUP_MIGRATIONS:
            conn.execute(text(statement))
