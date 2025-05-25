from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from service.admin_service import update_student, add_student_to_database
from entities.student import Student
import base64
from typing import Optional, List, Any
from service.user_service import (
    add_request_to_database,
    get_requests_from_database,
    update_request_in_database,
    get_requests_by_student_id
)

router = APIRouter()

class ResponseModel(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
@router.post("/send_request", response_model=ResponseModel)
async def send_request(user_data: dict):
    return await add_request_to_database(user_data)

@router.get("/get_requests", response_model=ResponseModel)
async def get_requests():
    return await get_requests_from_database()

@router.put("/update_request", response_model=ResponseModel)
async def update_request(request_data: dict):
    return await update_request_in_database(request_data)

@router.get("/get_requests/{student_id}", response_model=ResponseModel)
async def get_request_by_student_id(student_id: str):
    return await get_requests_by_student_id(student_id)