from backend.entities.attendance import Attendance
from datetime import datetime, timedelta, date
from backend.entities.student import Student
from backend.service.face_service import (
    get_image_encoding,
    stream_face_recognition
)

async def attendance_to_dict(attendance: Attendance):
    return {
        "student_id": attendance.student_id,
        "full_name": attendance.full_name,
        "status": attendance.status,
        "create_at": attendance.create_at
    }

async def get_attendance_by_id(student_id: str):
    try:
        # Lấy thông tin sinh viên
        student = await Student.find_one({"student_id": student_id})
        if not student:
            return {"success": False, "message": "Không tìm thấy sinh viên", "data": None}

        # Lấy điểm danh trong ngày
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = today_start + timedelta(days=1)
        
        attendance = await Attendance.find({
            "student_id": student_id,
            "create_at": {
                "$gte": today_start,
                "$lt": today_end
            }
        }).sort("-create_at").first_or_none()

        if attendance:
            time_str = attendance.create_at.strftime("%H:%M:%S")
            return {
                "success": True,
                "message": "Đã điểm danh",
                "data": {
                    "student_id": student_id,
                    "full_name": attendance.full_name,
                    "time": time_str,
                    "status": attendance.status
                }
            }
        else:
            return {
                "success": False, 
                "message": "Chưa có điểm danh nào trong ngày hôm nay", 
                "data": None
            }
    except Exception as e:
        return {"success": False, "message": f"Lỗi: {str(e)}", "data": None}

async def add_attendance(image: str):
    try:
        # 1. Nhận diện khuôn mặt
        notification = await stream_face_recognition(image)
        
        if not notification["success"]:
            return {
                "success": False,
                "message": notification["message"],
                "data": None
            }

        # 2. Validate dữ liệu nhận diện
        if not all(key in notification["data"] for key in ["student_id", "full_name", "time"]):
            return {
                "success": False,
                "message": "Dữ liệu nhận diện không hợp lệ",
                "data": None
            }

        student_id = notification["data"]["student_id"]
        full_name = notification["data"]["full_name"]
        time_str = notification["data"]["time"]

        # 3. Kiểm tra điểm danh trùng trong ngày
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = today_start + timedelta(days=1)
        
        existing_attendance = await Attendance.find_one({
            "student_id": student_id,
            "create_at": {
                "$gte": today_start,
                "$lt": today_end
            }
        })
        
        if existing_attendance:
            return {
                "success": False,
                "message": "Sinh viên đã điểm danh trong ngày hôm nay",
                "data": {
                    "student_id": student_id,
                    "full_name": full_name,
                    "time": existing_attendance.create_at,
                    "status": existing_attendance.status
                }
            }

        # 4. Tạo bản ghi điểm danh mới
        try:
            current_date = datetime.utcnow().date()
            full_time_str = f"{current_date} {time_str}"
            time_obj = datetime.strptime(full_time_str, "%Y-%m-%d %H:%M:%S")
            
            attendance = Attendance(
                student_id=student_id,
                full_name=full_name,
                status=True,
                create_at=time_obj
            )
            await attendance.insert()
            
            return {
                "success": True,
                "message": "Đã điểm danh thành công",
                "data": {
                    "student_id": student_id,
                    "full_name": full_name,
                    "time": time_obj,
                    "status": True
                }
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Lỗi khi lưu điểm danh: {str(e)}",
                "data": None
            }
            
    except Exception as e:
        return {
            "success": False,
            "message": f"Lỗi hệ thống: {str(e)}",
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

async def confirm_student_attendance(student_id: str, confirmed: bool):
    try:
        # Kiểm tra sinh viên tồn tại
        student = await Student.find_one({"student_id": student_id})
        if not student:
            return {
                "success": False,
                "message": "Không tìm thấy thông tin sinh viên",
                "data": None
            }

        if confirmed:
            # Kiểm tra đã điểm danh trong ngày chưa
            today_start = datetime.combine(datetime.today(), datetime.min.time())
            today_end = datetime.combine(datetime.today(), datetime.max.time())
            
            existing_attendance = await Attendance.find_one({
                "student_id": student_id,
                "create_at": {
                    "$gte": today_start,
                    "$lte": today_end
                }
            })
            
            if existing_attendance:
                return {
                    "success": False,
                    "message": "Sinh viên đã điểm danh trong ngày hôm nay",
                    "data": {
                        "student_id": student_id,
                        "full_name": student.full_name,
                        "time": existing_attendance.create_at.strftime("%H:%M:%S"),
                        "status": existing_attendance.status
                    }
                }

            # Thêm bản ghi điểm danh mới
            attendance = Attendance(
                student_id=student_id,
                status=True,
                create_at=datetime.utcnow()
            )
            await attendance.insert()

            return {
                "success": True,
                "message": f"Đã xác nhận điểm danh cho sinh viên {student.full_name}",
                "data": {
                    "student_id": student_id,
                    "full_name": student.full_name,
                    "time": attendance.create_at.strftime("%H:%M:%S"),
                    "status": attendance.status
                }
            }
        else:
            return {
                "success": True,
                "message": f"Đã huỷ điểm danh cho sinh viên {student.full_name}",
                "data": {
                    "student_id": student_id,
                    "full_name": student.full_name
                }
            }
    except Exception as e:
        return {
            "success": False,
            "message": f"Lỗi xử lý điểm danh: {str(e)}",
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