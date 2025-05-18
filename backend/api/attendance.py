from fastapi import APIRouter, UploadFile, File, HTTPException, Body
from typing import List, Optional
from datetime import date
from pydantic import BaseModel
from backend.entities.attendance import Attendance
from datetime import datetime

from backend.service.face_service import (
    compare_embeddings,
    handle_face_upload
)

from backend.service.attendance_service import (
    get_attendance_by_id,
    add_attendance,
    get_attendances
)

from backend.entities.student import Student
from backend.service.model import mtcnn, resnet, device
# , known_students

router = APIRouter()

# Biến toàn cục để quản lý trạng thái chờ xác nhận
awaiting_confirmation = False

class ResponseModel(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None
    
@router.post("/scan-face-and-match", response_model=ResponseModel)
async def scan_face_and_match(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    face_encoding = await handle_face_upload(file)
    if face_encoding["success"] == False:
        return ResponseModel(success=False, message=face_encoding["message"], data=None)
        
    is_match =  await compare_embeddings(face_encoding["face_encoding"])
    if is_match["success"]:
        is_attandance = await get_attendance_by_id(is_match["data"]["student_id"])
        if is_attandance["success"]:
            return ResponseModel(success=False, message="Đã điểm danh hôm nay", data=is_attandance["data"])
            
        await add_attendance({
            "student_id": is_match["data"]["student_id"],
            "status": True,
            "create_at": datetime.utcnow()
        })
        
        return ResponseModel(success=True, message="Điểm danh thành công", data=None)
        
@router.get("/get-all-attendances", response_model=ResponseModel)
async def get_all_attendances():
    attendances = await get_attendances()
    
    if attendances["success"]:
        return ResponseModel(success=True, message="Lấy toàn bộ danh sách điểm danh thành công", data=attendances["data"])
    
    return ResponseModel(success=False, message=attendances["message"], data=None)

@router.post("/attendance/stream-frame", response_model=ResponseModel)
async def attendance_stream_frame(file: UploadFile = File(...)):
    global awaiting_confirmation
    if awaiting_confirmation:
        return ResponseModel(success=False, message="Đang chờ xác nhận/hủy, không nhận diện người mới", data=None)
    # Giả sử bạn đã có các đối tượng mtcnn, resnet, device, known_students được khởi tạo ở nơi khác
    # Ở đây chỉ là ví dụ, bạn cần truyền đúng các đối tượng này vào hàm handle_face_upload
    result = await handle_face_upload(mtcnn, resnet, device, file, known_students)
    if result["success"] and result["matched_name"] != "Unknown":
        # Lấy thông tin sinh viên từ tên (hoặc id)
        student = await Student.find_one({"name": result["matched_name"]})
        if student:
            awaiting_confirmation = True
            return ResponseModel(success=True, message="Nhận diện thành công", data={
                "student_id": student.student_id,
                "full_name": student.full_name,
                "matched_name": result["matched_name"]
            })
        else:
            return ResponseModel(success=False, message="Không tìm thấy thông tin sinh viên", data=None)
    else:
        return ResponseModel(success=False, message=result["message"], data=None)

@router.post("/attendance/stream-confirm", response_model=ResponseModel)
async def attendance_stream_confirm(
    student_id: str = Body(...),
    action: str = Body(...)  # "confirm" hoặc "cancel"
):
    global awaiting_confirmation
    if not awaiting_confirmation:
        return ResponseModel(success=False, message="Không có sinh viên nào đang chờ xác nhận", data=None)
    if action == "confirm":
        await add_attendance({
            "student_id": student_id,
            "status": True,
            "create_at": datetime.utcnow()
        })
        awaiting_confirmation = False
        return ResponseModel(success=True, message="Xác nhận điểm danh thành công", data=None)
    elif action == "cancel":
        awaiting_confirmation = False
        return ResponseModel(success=True, message="Đã hủy xác nhận, mời người tiếp theo", data=None)
    else:
        return ResponseModel(success=False, message="Hành động không hợp lệ", data=None)