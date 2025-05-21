from beanie import Document
from pydantic import Field
from typing import Optional
from datetime import datetime

class Attendance(Document):
    student_id: str
    full_name: str
    status: bool = True  
    create_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "student_id": "SV001",
                "status": "True",
            }
        }
        
    class Settings:
        name = "attendance"
        indexes = [
            "student_id",
            "date"
        ]
