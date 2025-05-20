from backend.entities.attendance import Attendance
from datetime import datetime, timedelta, date

from backend.service.face_service import (
    get_image_encoding,
    stream_face_recognition
)

async def attendance_to_dict(attendance: Attendance):
    return {
        "student_id": attendance.student_id,
        "status": attendance.status,
        "create_at": attendance.create_at
    }

async def get_attendance_by_id(student_id: str):
    try:
        # Lấy bản ghi attendance mới nhất của student_id
        attendance = await Attendance.find({"student_id": student_id}).sort("-create_at").first_or_none()
        
        if attendance:
            time_str = attendance.create_at.strftime("%H:%M:%S")
            return {
                "success": True,
                "message": "Đã điểm danh",
                "data": {
                    "student_id": student_id,
                    "time": time_str,
                    "status": attendance.status
                }
            }
        else:
            return {"success": False, "message": "Chưa có điểm danh nào", "data": None}
    except Exception as e:
        return {"success": False, "message": f"Lỗi: {str(e)}", "data": None}

async def add_attendance(image: str):
    notification = await stream_face_recognition(image)
    
    if notification["success"]:
        time_str = notification["data"]["time"]  # ví dụ: '11:40:44'
        full_time_str = f"{date.today()} {time_str}"  # ví dụ: '2025-05-19 11:40:44'
        time_obj = datetime.strptime(full_time_str, "%Y-%m-%d %H:%M:%S")
        
        attendance = Attendance(
            student_id=notification["data"]["student_id"],
            status=True,
            create_at=time_obj
        )
        await attendance.insert()
        
        return {
            "success": True,
            "message": "Đã điểm danh",
            "data": {
                "student_id": notification["data"]["student_id"],
                "time": time_obj,
                "status": True
            }
        }
        
    return {
        "success": False,
        "message": "Điểm danh không thành công",
        "data": None
    }

# async def add_attendance(attendance_data: dict):
#     try:
#         # Kiểm tra nếu đã điểm danh trong vòng 1 phút gần nhất thì không cho điểm danh tiếp
#         student_id = attendance_data.get("student_id")
#         now = datetime.utcn# In the code snippet you provided, `now` is a variable representing the
# current datetime obtained using `datetime.utcnow()`.
# ow()
#         one_minute_ago = now - timedelta(minutes=1)
#         recent_attendance = await Attendance.find({
#             "student_id": student_id,
#             "create_at": {"$gte": one_minute_ago}
#         }).sort("-create_at").first_or_none()
#         if recent_attendance:
#             return {"success": False, "message": "Đã điểm danh trong vòng 1 phút trước", "data": None}
#         attendance = Attendance(**attendance_data)
#         await attendance.insert()
#         return {"success": True, "message": "Điểm danh thành công", "data": attendance.dict()}
#     except Exception as e:
#         return {"success": False, "message": f"Lỗi: {str(e)}", "data": None}

async def get_attendances():
    attendances = await Attendance.find_all().sort("-create_at").to_list()
    
    if attendances:
        attendance_list = {}
        for attendance in attendances:
            if attendance.student_id in attendance_list:
                attendance_list[attendance.student_id].append(await attendance_to_dict(attendance))
            else:
                attendance_list[attendance.student_id] = [await attendance_to_dict(attendance)]
                
        return {
            "success": True,
            "message": "Lấy danh sách điểm danh thành công",
            "data": attendance_list
        }
        
    return {
        "success": False,
        "message": "Không có điểm danh nào",
        "data": None
    }

# async def get_attendances():
#     try:
#         attendances = await Attendance.find_all().to_list()
#         data = [
#             {
#                 "student_id": a.student_id,
#                 "status": a.status,
#                 "time": a.create_at.strftime("%H:%M:%S")
#             }
#             for a in attendances
#         ]
#         return {"success": True, "message": "Lấy danh sách điểm danh thành công", "data": data}
#     except Exception as e:
#         return {"success": False, "message": f"Lỗi: {str(e)}", "data": None} 