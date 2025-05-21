from beanie import Document
from pydantic import Field
from typing import Optional
from datetime import datetime

class Message(Document):
    student_id: str
    heading: str
    message: str
    handled: bool
    create_at: datetime = Field(default_factory=datetime.utcnow)
    handled_at: Optional[datetime] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "student_id": "SV001",
                "status": "True",
            }
        }
        
    class Settings:
        name = "message"
        indexes = [
            "student_id",
        ]
