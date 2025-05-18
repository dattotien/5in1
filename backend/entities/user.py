from pydantic import BaseModel, Field
from typing import Optional

class UserBase(BaseModel):
    username: str
    full_name: Optional[str] = None
    role: str  # "admin" hoặc "user"

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: str
    password_hash: str

class LoginModel(BaseModel):
    username: str
    password: str

from beanie import Document
from pydantic import BaseModel, Field
from typing import Optional, List

class User(Document):
    username: str
    student_id: str
    password_hash: str
    role: str = Field(default="user")
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "admin",
                "student_id": "22023xxx",
                "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiAYMyzJ/IeG",
                "role": "admin"
            }
        }
        
    class Settings:
        name = "users"
        indexes = [
            "username"
        ]