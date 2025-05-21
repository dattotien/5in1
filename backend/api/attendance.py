from fastapi import APIRouter, UploadFile, File, HTTPException, Body, WebSocket, WebSocketDisconnect, Request
from typing import List, Optional
from datetime import date
from pydantic import BaseModel
from backend.entities.attendance import Attendance
from datetime import datetime
import asyncio
import base64
import cv2
import numpy as np
import json
from beanie import init_beanie
import motor.motor_asyncio
from backend.entities.student import Student

from backend.service.face_service import (
    get_image_encoding,
    stream_face_recognition
)

from backend.service.attendance_service import (
    get_attendance_by_id,
    add_attendance,
    get_attendances,
    confirm_student_attendance
)

router = APIRouter()

class ResponseModel(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

# Upload ảnh
@router.post("/scan-face-and-match", response_model=ResponseModel)
async def scan_face_and_match(data: dict):
    return await add_attendance(data["image"])

# Lấy danh sách điểm danh       
@router.get("/get-all-attendances", response_model=ResponseModel)
async def get_all_attendances():
    return await get_attendances()

# Stream xác nhận điểm danh
@router.post("/stream-confirm", response_model=ResponseModel)
async def attendance_stream_confirm(data: dict):
    return await stream_face_recognition(data["image"])

# Xác nhận điểm danh
@router.post("/attendance/confirm", response_model=ResponseModel)
async def confirm_attendance(request: Request):
    data = await request.json()
    student_id = data.get("student_id")
    confirmed = data.get("confirmed")

    if not student_id or confirmed not in [True, False]:
        return {"success": False, "message": "Thiếu thông tin xác nhận"}

    return await confirm_student_attendance(student_id, confirmed)

# Lấy điểm danh theo id
@router.post("/attendance/{student_id}", response_model=ResponseModel)
async def get_attendance_by_id(student_id: str):
    return await get_attendance_by_id(student_id)

"""
@router.post("/attendance/confirm", response_model=ResponseModel)
async def confirm_attendance(data: dict):
    student_id = data.get("student_id")
    confirmed = data.get("confirmed")
    print(student_id)

    if not student_id or confirmed not in [True, False]:
        return {"success": False, "message": "Thiếu thông tin xác nhận"}

    return await confirm_student_attendance(student_id, confirmed)
"""

# @router.post("/scan-face-and-match", response_model=ResponseModel)
# async def scan_face_and_match(file: UploadFile = File(...)):
#     if not file:
#         raise HTTPException(status_code=400, detail="No file uploaded")
    
#     face_encoding = await handle_face_upload(mtcnn, resnet, device, file, known_students)

#     if face_encoding["success"] == False:
#         return ResponseModel(success=False, message=face_encoding["message"], data=None)
    
#     if face_encoding["success"]:
#         is_attandance = await get_attendance_by_id(face_encoding["matched_name"])
#         if is_attandance["success"]:
#             return ResponseModel(success=False, message="Đã điểm danh hôm nay", data=is_attandance["data"])
            
#         await add_attendance({
#             "student_id": face_encoding["matched_name"],
#             "status": True,
#             "create_at": datetime.utcnow()
#         })
        
#         return ResponseModel(success=True, message="Điểm danh thành công", data=None)