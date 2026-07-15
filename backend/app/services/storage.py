import os
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException
from app.core.config import settings

ALLOWED_IMAGE = {"image/jpeg", "image/png", "image/webp", "image/gif"}

MAX_BYTES = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024


async def save_upload(file: UploadFile) -> str:
    """Saves an uploaded image to UPLOAD_DIR and returns its public /uploads URL."""
    if file.content_type not in ALLOWED_IMAGE:
        raise HTTPException(status_code=400, detail=f"File type {file.content_type} not allowed")

    content = await file.read()
    if len(content) > MAX_BYTES:
        raise HTTPException(status_code=400, detail=f"File exceeds {settings.MAX_UPLOAD_SIZE_MB}MB limit")

    ext = Path(file.filename or "file").suffix.lower() or ".bin"
    unique_name = f"{uuid.uuid4().hex}{ext}"

    upload_path = Path(settings.UPLOAD_DIR)
    upload_path.mkdir(parents=True, exist_ok=True)
    dest = upload_path / unique_name

    with open(dest, "wb") as f:
        f.write(content)

    return f"/uploads/{unique_name}"


def delete_file(image_url: str) -> None:
    if not image_url:
        return
    path = Path(settings.UPLOAD_DIR) / Path(image_url).name
    if path.exists():
        os.remove(path)
