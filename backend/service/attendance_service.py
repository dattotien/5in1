from backend.entities.attendance import Attendance
from datetime import datetime, timedelta

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

async def add_attendance(attendance_data: dict):
    try:
        # Kiểm tra nếu đã điểm danh trong vòng 1 phút gần nhất thì không cho điểm danh tiếp
        student_id = attendance_data.get("student_id")
        now = datetime.utcnow()
        one_minute_ago = now - timedelta(minutes=1)
        recent_attendance = await Attendance.find({
            "student_id": student_id,
            "create_at": {"$gte": one_minute_ago}
        }).sort("-create_at").first_or_none()
        if recent_attendance:
            return {"success": False, "message": "Đã điểm danh trong vòng 1 phút trước", "data": None}
        attendance = Attendance(**attendance_data)
        await attendance.insert()
        return {"success": True, "message": "Điểm danh thành công", "data": attendance.dict()}
    except Exception as e:
        return {"success": False, "message": f"Lỗi: {str(e)}", "data": None}

async def get_attendances():
    try:
        attendances = await Attendance.find_all().to_list()
        data = [
            {
                "student_id": a.student_id,
                "status": a.status,
                "time": a.create_at.strftime("%H:%M:%S")
            }
            for a in attendances
        ]
        return {"success": True, "message": "Lấy danh sách điểm danh thành công", "data": data}
    except Exception as e:
        return {"success": False, "message": f"Lỗi: {str(e)}", "data": None} 