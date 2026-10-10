"""One shared rate limiter for the whole API.

The backend only listens on 127.0.0.1 (see docker-compose.prod.yml), so every request reaches it
through the local Cloudflare tunnel / reverse proxy. Behind that proxy the TCP peer is always the
proxy itself, so the real visitor address is taken from the proxy's header - but ONLY when the peer
is a loopback/private address. A request that somehow arrives directly from the internet cannot
fake its address by sending the header.
"""
import ipaddress

from fastapi import Request
from slowapi import Limiter


def _is_local(host: str) -> bool:
    try:
        ip = ipaddress.ip_address(host)
    except ValueError:
        return False
    return ip.is_loopback or ip.is_private


def client_ip(request: Request) -> str:
    peer = request.client.host if request.client else "unknown"
    if _is_local(peer):
        forwarded = request.headers.get("cf-connecting-ip") or request.headers.get("x-forwarded-for", "").split(",")[0].strip()
        if forwarded:
            return forwarded
    return peer


limiter = Limiter(key_func=client_ip)
