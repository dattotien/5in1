from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional
import base64

from service.admin_service import (
    get_student_by_id,
    add_student_to_database,
    update_student,
    delete_student,
    get_all_students
)

class ResponseModel(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

class StudentCreateModel(BaseModel):
    student_id: str
    name: str
    full_name: str
    image_base64: Optional[str] = None
    face_encoding: Optional[List[float]] = []

router = APIRouter()

#Thêm sinh viên 
@router.post("/add-student", response_model=ResponseModel)
async def add_student(student_data: dict):
    return await add_student_to_database(student_data)

#Sửa thông tin sinh viên
@router.put("/update-student/{student_id}", response_model=ResponseModel)
async def update_student_info(student_id: str, student_data: dict):
    return await update_student(student_id, student_data)

#Xóa sinh viên
@router.delete("/delete-student/{student_id}", response_model=ResponseModel)
async def delete_student_info(student_id: str):
    return await delete_student(student_id)

# Lấy danh sách toàn bộ sinh viên
@router.get("/get-all-students", response_model=ResponseModel)
async def get_all_students_info():
    return await get_all_students()

# Lấy thông tin sinh viên theo ID
@router.get("/get-student/{student_id}", response_model=ResponseModel)
async def get_student_info(student_id: str):
    return await get_student_by_id(student_id)