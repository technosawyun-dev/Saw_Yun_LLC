import hashlib
import hmac
from datetime import datetime, timedelta, timezone
from typing import Optional
import bcrypt
from jose import JWTError, jwt
from app.core.config import settings


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


# A real bcrypt hash of a throw-away value. Checking a login attempt for an unknown email against
# this takes the same time as checking a real account, so response time cannot reveal which
# emails exist.
_DUMMY_HASH = hash_password("not-a-real-password-for-timing-only")


def verify_password_or_dummy(plain: str, hashed: Optional[str]) -> bool:
    if hashed is None:
        verify_password(plain, _DUMMY_HASH)
        return False
    return verify_password(plain, hashed)


def password_marker(password_hash: str) -> str:
    """Short fingerprint of the current password hash, stored inside each token.

    Changing the password changes the hash, so every token issued before the change stops working.
    """
    return hashlib.sha256(password_hash.encode()).hexdigest()[:16]


def create_access_token(subject: str, pwd_marker: str, expires_delta: Optional[timedelta] = None) -> str:
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return jwt.encode({"sub": subject, "exp": expire, "pv": pwd_marker}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    """Returns the token's claims, or None if it is invalid/expired."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None
    if not payload.get("sub") or not payload.get("pv"):
        return None
    return payload


def marker_matches(payload: dict, password_hash: str) -> bool:
    return hmac.compare_digest(str(payload.get("pv", "")), password_marker(password_hash))
