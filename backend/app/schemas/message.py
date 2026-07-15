from pydantic import BaseModel, EmailStr
from datetime import datetime


class MessageCreate(BaseModel):
    name: str
    email: EmailStr
    message: str


class MessageOut(BaseModel):
    id: int
    name: str
    email: str
    message: str
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}
