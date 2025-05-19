from beanie import Document
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class Student(Document):
    student_id: str = Field(unique=True, index=True)
    name: str
    full_name: str
    image_encoding: Optional[List[float]] = None
    image: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "student_id": "22023xxx",
                "name": "Anh",
                "full_name": "Chu Thị Phương Anh",
                "image_encoding": [21, 123, 123123, 12312, 2222],
                "image": "data:image/jpeg;base64,..."
            }
        }
        
    class Settings:
        name = "students"
        indexes = [
            "student_id"
        ]
