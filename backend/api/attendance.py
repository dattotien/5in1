from fastapi import APIRouter, UploadFile, File, HTTPException, Body, WebSocket, WebSocketDisconnect, FastAPI
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

from backend.service.face_service import (
    handle_face_upload,
    handle_stream
)

from backend.service.attendance_service import (
    get_attendance_by_id,
    add_attendance,
    get_attendances
)

from backend.entities.student import Student
from backend.service.model import mtcnn, resnet, device, load_encoding_from_students
known_students = load_encoding_from_students()

router = APIRouter()

# Biến toàn cục để quản lý trạng thái chờ xác nhận
global awaiting_confirmation, pending_student_id, last_matched_id
awaiting_confirmation = False
pending_student_id = None

class ResponseModel(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

@router.on_event("startup")
async def app_init():
    client = motor.motor_asyncio.AsyncIOMotorClient("mongodb+srv://dangminhnguyet2015:mongodb@cluster0.srvjgt8.mongodb.net/?retryWrites=true&w=majority")
    await init_beanie(database=client.Attendances, document_models=[Student])

# Upload ảnh
@router.post("/scan-face-and-match", response_model=ResponseModel)
async def scan_face_and_match(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    face_encoding = await handle_face_upload(mtcnn, resnet, device, file, known_students)

    if face_encoding["success"] == False:
        return ResponseModel(success=False, message=face_encoding["message"], data=None)
    
    if face_encoding["success"]:
        is_attandance = await get_attendance_by_id(face_encoding["matched_name"])
        if is_attandance["success"]:
            return ResponseModel(success=False, message="Đã điểm danh hôm nay", data=is_attandance["data"])
            
        await add_attendance({
            "student_id": face_encoding["matched_name"],
            "status": True,
            "create_at": datetime.utcnow()
        })
        
        return ResponseModel(success=True, message="Điểm danh thành công", data=None)

# Lấy danh sách điểm danh    
@router.get("/get-all-attendances", response_model=ResponseModel)
async def get_all_attendances():
    attendances = await get_attendances()
    
    if attendances["success"]:
        return ResponseModel(success=True, message="Lấy toàn bộ danh sách điểm danh thành công", data=attendances["data"])
    
    return ResponseModel(success=False, message=attendances["message"], data=None)

# Stream mặt  
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    input_queue = asyncio.Queue()
    output_queue = asyncio.Queue()
    match_queue = asyncio.Queue()

    # Bắt đầu xử lý ảnh
    asyncio.create_task(
        handle_stream(input_queue, output_queue, match_queue, mtcnn, resnet, device, known_students)
    )

    global awaiting_confirmation, pending_student_id

    try:
        while True:
            # Tạo task để chờ 2 luồng: websocket nhận và nhận match
            receive_task = asyncio.create_task(websocket.receive_text())
            match_task = asyncio.create_task(match_queue.get())

            done, pending = await asyncio.wait(
                [receive_task, match_task],
                return_when=asyncio.FIRST_COMPLETED
            )

            for task in done:
                result = task.result()

                # Nếu là dữ liệu từ websocket
                if task == receive_task:
                    json_data = json.loads(result)

                    if json_data.get("type") == "frame":
                        base64_str = json_data.get("frame", "")
                        if "," in base64_str:
                            base64_str = base64_str.split(",")[1]
                        img_data = base64.b64decode(base64_str)
                        np_arr = np.frombuffer(img_data, np.uint8)
                        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

                        await input_queue.put(img)
                        encoded_frame = await output_queue.get()

                        await websocket.send_json({
                            "type": "frame",
                            "frame": encoded_frame
                        })

                # Nếu là kết quả matched từ handle_stream
                elif task == match_task:
                    matched_name = result
                    print(matched_name)
                    if matched_name != "Unknown" and not awaiting_confirmation:
                        # student = "Cit"
                        student = await Student.find_one({"student_id": matched_name})
                        if student:
                            awaiting_confirmation = True
                            pending_student_id = student.student_id
                            await websocket.send_json({
                                "type": "match",
                                "student_id": matched_name,
                                "full_name": student.full_name
                            })
        
            # Hủy task chưa hoàn tất để tránh warning
            for task in pending:
                task.cancel()
    except WebSocketDisconnect:
        print("Client disconnected")
        return
    except Exception as e:
        print(f"[WebSocket Error]: {e}")

@router.post("/attendance/stream-confirm", response_model=ResponseModel)
async def attendance_stream_confirm(
    student_id: str = Body(...),
    action: str = Body(...)  # "confirm" hoặc "cancel"
):
    global awaiting_confirmation, pending_student_id
    if not awaiting_confirmation:
        return ResponseModel(success=False, message="Không có sinh viên nào đang chờ xác nhận", data=None)
    if action == "confirm":
        if get_attendance_by_id(pending_student_id)["success"] == True:        
            awaiting_confirmation = False
            pending_student_id = None
            return ResponseModel(success=True, message="Sinh viên đã điểm danh trước đó", data=None)
        await add_attendance({
            "student_id": student_id,
            "status": True,
            "create_at": datetime.utcnow()
        })
        awaiting_confirmation = False
        pending_student_id = None
        return ResponseModel(success=True, message="Xác nhận điểm danh thành công", data=None)
    elif action == "cancel":
        awaiting_confirmation = False
        pending_student_id = None
        return ResponseModel(success=True, message="Đã hủy xác nhận, mời người tiếp theo", data=None)
    else:
        return ResponseModel(success=False, message="Hành động không hợp lệ", data=None)