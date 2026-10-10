from typing import Optional

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import get_db
from app.core.security import decode_token, marker_matches
from app.models.user import User

# auto_error=False: no Authorization header is fine when the login cookie is present.
bearer = HTTPBearer(auto_error=False)
SAFE_METHODS = {"GET", "HEAD", "OPTIONS"}


def _require_trusted_origin(request: Request) -> None:
    """CSRF guard for cookie logins: a change request must come from one of our own sites.

    Browsers always send the Origin header on cross-site and same-site POST/PUT/PATCH/DELETE.
    """
    origin = request.headers.get("origin")
    if not origin:
        referer = request.headers.get("referer", "")
        parts = referer.split("/")
        origin = "/".join(parts[:3]) if len(parts) >= 3 else ""
    if origin not in settings.cors_origins_list:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cross-site request blocked")


def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials if credentials else None
    from_cookie = False
    if not token:
        token = request.cookies.get(settings.COOKIE_NAME)
        from_cookie = bool(token)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    if from_cookie and request.method not in SAFE_METHODS:
        _require_trusted_origin(request)
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.query(User).filter(User.email == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    # A token issued before the last password change is no longer valid.
    if not marker_matches(payload, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user
