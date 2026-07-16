import logging

import httpx

from app.core.config import settings

logger = logging.getLogger("app.email")

MAILTRAP_API_URL = "https://send.api.mailtrap.io/api/send"


def _render_html(name: str, email: str, message: str) -> str:
    safe_message = message.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br>")
    return f"""<!DOCTYPE html>
<html><body style="margin:0;padding:24px;background:#F6F7FB;font-family:Arial,sans-serif;color:#0B1220;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr><td align="center">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#fff;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#0B1220;padding:24px 28px;">
          <span style="font-size:17px;font-weight:700;color:#fff;">SAW YUN — New contact form message</span>
        </td></tr>
        <tr><td style="padding:24px 28px 8px;">
          <p style="margin:0 0 4px;font-size:12px;color:#5B6472;text-transform:uppercase;letter-spacing:.5px;">From</p>
          <p style="margin:0 0 16px;font-size:16px;font-weight:700;">{name} &lt;{email}&gt;</p>
          <p style="margin:0 0 4px;font-size:12px;color:#5B6472;text-transform:uppercase;letter-spacing:.5px;">Message</p>
          <p style="margin:0;font-size:14.5px;line-height:1.7;">{safe_message}</p>
        </td></tr>
        <tr><td style="padding:20px 28px;background:#F6F7FB;border-top:1px solid rgba(11,18,32,0.08);">
          <p style="margin:0;font-size:12px;color:#5B6472;">Reply directly to this email to respond to {name}, or view it in the admin panel under Messages.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>"""


async def send_contact_notification(name: str, email: str, message: str) -> None:
    """Best-effort email notification for a new contact form submission.

    Never raises — a Mailtrap outage or bad token must never prevent the
    message from being saved or the visitor's form from submitting
    successfully. Failures are logged instead. Meant to be scheduled via
    FastAPI's BackgroundTasks so it runs after the response is already sent.
    """
    if not settings.email_notifications_enabled:
        return

    payload = {
        "from": {"email": settings.EMAIL_FROM, "name": settings.EMAIL_FROM_NAME},
        "to": [{"email": settings.NOTIFY_TO_EMAIL}],
        "subject": f"New contact form message from {name}",
        "html": _render_html(name, email, message),
        "category": "Contact form",
        # Replying goes straight to the visitor, not the site's own sender address.
        "headers": {"Reply-To": email},
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                MAILTRAP_API_URL,
                headers={
                    "Authorization": f"Bearer {settings.MAILTRAP_API_TOKEN}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
            response.raise_for_status()
    except Exception:
        logger.exception("Failed to send contact form notification email via Mailtrap")
