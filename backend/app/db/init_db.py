from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.core.config import settings
from app.models.user import User
from app.models.project import Project


def init_db(db: Session) -> None:
    existing = db.query(User).filter(User.email == settings.FIRST_ADMIN_EMAIL).first()
    if not existing:
        admin = User(
            email=settings.FIRST_ADMIN_EMAIL,
            password_hash=hash_password(settings.FIRST_ADMIN_PASSWORD),
            role="admin",
        )
        db.add(admin)
        db.commit()
        print(f"Created admin user: {settings.FIRST_ADMIN_EMAIL}")

    if db.query(Project).count() == 0:
        flagship = Project(
            slug="saw-yun-pos",
            title="Saw Yun POS",
            tagline="Point-of-sale system for retail & hospitality — one product, shipped natively to iOS, Android, Web and Windows.",
            description=(
                "A single point-of-sale system, built once and shipped natively everywhere a business needs "
                "it — from a phone at a market stall to a full checkout counter running Windows."
            ),
            status="live",
            live_demo_url=None,
            sort_order=0,
        )
        db.add(flagship)
        db.commit()
        print("Seeded flagship project: Saw Yun POS (add screenshots via the admin panel)")
