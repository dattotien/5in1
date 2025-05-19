from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from backend.service.admin_service import update_student, add_student_to_database
from backend.entities.student import Student
import base64
from typing import Optional, List

router = APIRouter()

class ResponseModel(BaseModel):
    success: bool
    message: str
    data: dict = None

class StudentCreateModel(BaseModel):
    student_id: str
    name: str
    full_name: str
    image_base64: Optional[str] = None
    face_encoding: Optional[List[float]] = []

@router.post("/upload-student-image/{student_id}", response_model=ResponseModel)
async def upload_student_image(student_id: str, file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        return ResponseModel(success=False, message="Chỉ hỗ trợ file ảnh JPG hoặc PNG.")
    try:
        image_bytes = await file.read()
        image_base64 = f"data:{file.content_type};base64," + base64.b64encode(image_bytes).decode()
        student = await Student.find_one(Student.student_id == student_id)
        if not student:
            return ResponseModel(success=False, message="Không tìm thấy sinh viên.")
        student.image_base64 = image_base64
        await student.save()
        return ResponseModel(success=True, message="Upload ảnh thành công", data={"student_id": student_id})
    except Exception as e:
        return ResponseModel(success=False, message=f"Lỗi: {str(e)}")

@router.post("/add-student", response_model=ResponseModel)
async def add_student(student_data: StudentCreateModel):
    return await add_student_to_database(student_data.dict())
