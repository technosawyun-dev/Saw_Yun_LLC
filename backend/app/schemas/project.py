from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime

PlatformLiteral = Literal["ios", "android", "web", "windows"]
StatusLiteral = Literal["live", "in_development"]


class ScreenshotOut(BaseModel):
    id: int
    platform: str
    image_url: str
    sort_order: int

    model_config = {"from_attributes": True}


class ProjectCreate(BaseModel):
    slug: str
    title: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    status: StatusLiteral = "in_development"
    live_demo_url: Optional[str] = None
    sort_order: int = 0


class ProjectUpdate(BaseModel):
    slug: Optional[str] = None
    title: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    status: Optional[StatusLiteral] = None
    live_demo_url: Optional[str] = None
    sort_order: Optional[int] = None


class ProjectSummaryOut(BaseModel):
    id: int
    slug: str
    title: str
    tagline: Optional[str]
    status: str
    live_demo_url: Optional[str]
    sort_order: int
    cover_image_url: Optional[str] = None

    model_config = {"from_attributes": True}


class ProjectDetailOut(BaseModel):
    id: int
    slug: str
    title: str
    tagline: Optional[str]
    description: Optional[str]
    status: str
    live_demo_url: Optional[str]
    sort_order: int
    created_at: datetime
    screenshots: list[ScreenshotOut] = []

    model_config = {"from_attributes": True}
