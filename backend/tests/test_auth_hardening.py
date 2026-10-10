"""Login hardening: rate limit, unknown-email timing parity, token revocation on password change.

Run from backend/:  DATABASE_URL=sqlite:///./test_auth.db SECRET_KEY=<32+ chars> \
FIRST_ADMIN_EMAIL=a@b.co FIRST_ADMIN_PASSWORD=x pytest tests
"""
import os
import time

os.environ.setdefault("COOKIE_SECURE", "false")  # the test client talks plain http
os.environ.setdefault("CORS_ORIGINS", "https://sawyuntech.com,http://localhost:5173")
os.environ.setdefault("DATABASE_URL", "sqlite:///./test_auth.db")
os.environ.setdefault("SECRET_KEY", "t" * 40)
os.environ.setdefault("FIRST_ADMIN_EMAIL", "admin@example.com")
os.environ.setdefault("FIRST_ADMIN_PASSWORD", "unused-in-tests")

import pytest
from fastapi.testclient import TestClient

from app.core.security import hash_password
from app.db.session import Base, SessionLocal, engine
from app.main import app
from app.core.limiter import limiter
from app.models.user import User

class _ViaLocalProxy:
    """In production the TCP peer is the local proxy (loopback), which is what makes the forwarded
    header trusted. The test client's own peer is the text "testclient", so present a loopback one."""

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        if scope["type"] in ("http", "websocket"):
            scope["client"] = ("127.0.0.1", 50000)
        await self.inner(scope, receive, send)


EMAIL, PASSWORD = "owner@example.com", "correct horse battery"


@pytest.fixture()
def client():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    db.add(User(email=EMAIL, password_hash=hash_password(PASSWORD), role="admin"))
    db.commit()
    db.close()
    limiter.reset()
    return TestClient(_ViaLocalProxy(app))


def _login(c, pw=PASSWORD, email=EMAIL, ip="203.0.113.5"):
    return c.post("/api/auth/login", json={"email": email, "password": pw}, headers={"cf-connecting-ip": ip})


def test_good_login_works(client):
    r = _login(client)
    assert r.status_code == 200 and r.json()["access_token"]


def test_sixth_wrong_try_in_a_minute_is_blocked(client):
    codes = [_login(client, pw="wrong").status_code for _ in range(6)]
    assert codes[:5] == [401] * 5 and codes[5] == 429
    # ...and the real password from the same address is also held back now.
    assert _login(client).status_code == 429


def test_limit_is_per_visitor_not_global(client):
    for _ in range(6):
        _login(client, pw="wrong", ip="198.51.100.1")
    assert _login(client, ip="198.51.100.2").status_code == 200


def test_unknown_email_takes_as_long_as_wrong_password(client):
    def avg(email):
        t = time.perf_counter()
        for i in range(3):
            _login(client, pw="wrong", email=email, ip=f"192.0.2.{i + 10}")
        return (time.perf_counter() - t) / 3
    known, unknown = avg(EMAIL), avg("nobody@example.com")
    assert unknown > known * 0.5  # an unknown email must NOT come back much faster


def test_token_dies_after_password_change(client):
    token = _login(client).json()["access_token"]
    h = {"Authorization": f"Bearer {token}"}
    assert client.get("/api/auth/me", headers=h).status_code == 200
    r = client.post("/api/auth/change-password", headers=h, json={"current_password": PASSWORD, "new_password": "a brand new password"})
    assert r.status_code == 204
    assert client.get("/api/auth/me", headers=h).status_code == 401
    assert _login(client, pw="a brand new password", ip="203.0.113.77").status_code == 200


def test_forged_and_old_style_tokens_are_refused(client):
    from jose import jwt
    from app.core.config import settings
    no_marker = jwt.encode({"sub": EMAIL}, settings.SECRET_KEY, algorithm="HS256")
    wrong_key = jwt.encode({"sub": EMAIL, "pv": "x"}, "z" * 40, algorithm="HS256")
    for t in (no_marker, wrong_key, "garbage"):
        assert client.get("/api/auth/me", headers={"Authorization": f"Bearer {t}"}).status_code == 401


def test_header_cannot_be_faked_from_a_public_peer():
    from types import SimpleNamespace
    from app.core.limiter import client_ip
    fake = lambda host: SimpleNamespace(client=SimpleNamespace(host=host), headers={"cf-connecting-ip": "1.2.3.4"})
    assert client_ip(fake("127.0.0.1")) == "1.2.3.4"      # from the local proxy: trusted
    assert client_ip(fake("172.18.0.3")) == "1.2.3.4"     # docker network: trusted
    assert client_ip(fake("8.8.8.8")) == "8.8.8.8"        # public peer: header ignored


# ---- cookie login ----------------------------------------------------------------------------

def test_login_sets_an_httponly_samesite_cookie(client):
    r = _login(client)
    sc = r.headers["set-cookie"].lower()
    assert "sawyun_admin=" in sc and "httponly" in sc and "samesite=lax" in sc and "path=/" in sc


def test_cookie_is_marked_secure_in_production(client, monkeypatch):
    from app.core.config import settings
    monkeypatch.setattr(settings, "COOKIE_SECURE", True)
    assert "secure" in _login(client).headers["set-cookie"].lower()


def test_cookie_alone_authenticates_reads(client):
    _login(client)  # the client now holds the cookie
    assert client.get("/api/auth/me").status_code == 200


def test_cookie_changes_need_a_trusted_origin(client):
    _login(client)
    body = {"current_password": PASSWORD, "new_password": "another good password"}
    assert client.post("/api/auth/change-password", json=body).status_code == 403                       # no Origin
    assert client.post("/api/auth/change-password", json=body, headers={"origin": "https://evil.example"}).status_code == 403
    assert client.post("/api/auth/change-password", json=body, headers={"referer": "https://evil.example/x"}).status_code == 403
    assert client.post("/api/auth/change-password", json=body, headers={"origin": "https://sawyuntech.com"}).status_code == 204


def test_bearer_header_still_works_without_origin(client):
    token = _login(client).json()["access_token"]
    client.cookies.clear()
    h = {"Authorization": f"Bearer {token}"}
    body = {"current_password": PASSWORD, "new_password": "another good password"}
    assert client.post("/api/auth/change-password", json=body, headers=h).status_code == 204


def test_logout_clears_the_cookie(client):
    _login(client)
    r = client.post("/api/auth/logout")
    assert r.status_code == 204
    client.cookies.clear()  # what the browser does with the expired cookie
    assert client.get("/api/auth/me").status_code == 401


def test_no_cookie_no_token_is_401(client):
    assert client.get("/api/auth/me").status_code == 401
