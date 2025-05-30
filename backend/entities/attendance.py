from beanie import Document
from pydantic import Field
from typing import Optional
from datetime import datetime

class Attendance(Document):
    student_id: str
    full_name: Optional[str] = None
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
            "create_at",
            [("student_id", 1), ("create_at", -1)]  # Composite index for efficient queries
        ]
