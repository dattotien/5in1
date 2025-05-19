
from beanie import Document
from pydantic import BaseModel, Field
from typing import Optional, List

class User(Document):
    student_id: str
    username: str
    password_hash: str
    full_name: str
    role: str = Field(default="user")
    
    class Config:
        json_schema_extra = {
            "example": {
                "student_id": "23020324",
                "username": "phuonganh",
                "password_hash": "$2b$12$9barYEey9N2Vk/qeK5xlbOUOys3LMBGRYuZKnJOAAu.Q70I24hG1C",
                "full_name": "Chu Thị Phương Anh",
                "role": "admin"
            }
        }
        
    class Settings:
        name = "users"
        indexes = [
            "student_id"
        ]