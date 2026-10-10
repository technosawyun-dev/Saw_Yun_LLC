from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user import LoginRequest, TokenResponse, UserOut, ChangePasswordRequest
from app.models.user import User
from app.core.security import verify_password, verify_password_or_dummy, create_access_token, hash_password, password_marker
from app.core.deps import get_current_user
from app.core.limiter import limiter
from app.core.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Account lockout (stored in the database, survives restarts): after MAX_FAILED_LOGINS wrong
# passwords the account refuses every login - even the right password - for LOCKOUT_MINUTES.
MAX_FAILED_LOGINS = 10
LOCKOUT_MINUTES = 15


def _is_locked(user: User, now: datetime) -> bool:
    if user.locked_until is None:
        return False
    until = user.locked_until if user.locked_until.tzinfo else user.locked_until.replace(tzinfo=timezone.utc)
    return until > now


# Per visitor address: 5 tries a minute and 30 an hour. The limits stack - a slow guesser is
# still stopped by the hourly cap.
@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
@limiter.limit("30/hour")
def login(request: Request, response: Response, body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    now = datetime.now(timezone.utc)
    if user and _is_locked(user, now):
        verify_password_or_dummy(body.password, None)  # same time cost as a real check
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="account_locked",
                            headers={"Retry-After": str(LOCKOUT_MINUTES * 60)})
    if not verify_password_or_dummy(body.password, user.password_hash if user else None):
        if user:
            user.failed_login_count = (user.failed_login_count or 0) + 1
            if user.failed_login_count >= MAX_FAILED_LOGINS:
                user.locked_until = now + timedelta(minutes=LOCKOUT_MINUTES)
                user.failed_login_count = 0
            db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if user.failed_login_count or user.locked_until:
        user.failed_login_count = 0
        user.locked_until = None
        db.commit()
    token = create_access_token(subject=user.email, pwd_marker=password_marker(user.password_hash))
    # The browser keeps the login in an HttpOnly cookie: page scripts (even injected ones) cannot read it.
    response.set_cookie(
        settings.COOKIE_NAME, token,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=True, secure=settings.COOKIE_SECURE, samesite="lax", path="/",
    )
    return {"access_token": token, "token_type": "bearer"}


@router.post("/logout", status_code=204)
def logout(response: Response):
    response.delete_cookie(settings.COOKIE_NAME, path="/", httponly=True, secure=settings.COOKIE_SECURE, samesite="lax")


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/change-password", status_code=204)
@limiter.limit("10/hour")
def change_password(
    request: Request,
    body: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(body.current_password, current_user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    if len(body.new_password) < 8:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="New password must be at least 8 characters")
    current_user.password_hash = hash_password(body.new_password)
    db.add(current_user)
    db.commit()
