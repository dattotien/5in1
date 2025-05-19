from pydantic import BaseModel
from typing import List, Optional

class ResponseModel(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None