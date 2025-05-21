from backend.entities.student import Student
from beanie import PydanticObjectId
from datetime import datetime
from typing import Optional, List
from backend.entities.student import Student
from datetime import datetime
from backend.service.face_service import get_image_encoding
import base64


def student_to_dict(student: Student) -> dict:
    return {
        "student_id": student.student_id,
        "name": student.name,
        "full_name": student.full_name,
        "image_encoding": student.image_encoding or [],
        "image": student.image or None,
        "created_at": student.created_at or datetime.utcnow(),
        "updated_at": student.updated_at or datetime.utcnow()
    }

# Lấy sinh viên theo ID
async def get_student_by_id(student_id: str):
    student = await Student.find_one({"student_id": student_id})
    
    if student:
        return {
            "success": True,
            "message": "Lấy thông tin sinh viên thành công",
            "data": student_to_dict(student)
        }
        
    return {
        "success": False,
        "message": "Sinh viên không tồn tại",
        "data": None
    }

# Lấy toàn bộ sinh viên
async def get_all_students():
    students = await Student.find().to_list()
    
    if not students:
        return {
            "success": False,
            "message": "Không có sinh viên nào",
            "data": None
        }  
        
    students_dictionaries = {}
    for student in students:
        print(student)
        students_dictionaries[student.full_name] = student_to_dict(student)
        
    return {
        "success": True,
        "message": "Lấy danh sách sinh viên thành công",
        "data": students_dictionaries
    }

async def add_student_to_database(student_data: dict):
    student = await get_student_by_id(student_data["student_id"])
    
    if student["success"] == True:
        return {
            "success": False,
            "message": "Sinh viên đã tồn tại",
            "data": None
        }
    
    # Lấy đúng key ảnh base64 từ frontend
    image_base64 = student_data.get("image_base64", "")
    image_encoding = await get_image_encoding(image_base64)
    # Đảm bảo image_encoding là list
    if image_encoding["success"] == True:
        if not isinstance(image_encoding, list):
            image_encoding = image_encoding.tolist() if hasattr(image_encoding, "tolist") else []

        student = Student(
            student_id=student_data["student_id"],
            name=student_data["name"],
            full_name=student_data["full_name"],
            image=image_base64,
            image_encoding=image_encoding,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        await student.insert()
    
        return {
            "success": True,
            "message": "Thêm sinh viên thành công",
            "data": student_data
        }
    
    return {
        "success": False,
        "message": image_encoding["message"],
        "data": None
    }

# async def add_student_to_database(student_data: dict):
#     try:
#         # Ưu tiên file nếu có
#         image_base64 = student_data.get("image_base64")
#         file = student_data.get("file")
#         if file:
#             image_bytes = await file.read()
#             image_base64 = "data:image/jpeg;base64," + base64.b64encode(image_bytes).decode()
        
#         # Sinh face_encoding từ ảnh
#         face_encoding_result = await handle_face_upload(image_base64)
#         if not face_encoding_result["success"]:
#             return {"success": False, "message": "Không nhận diện được khuôn mặt từ ảnh", "data": None}
#         face_encoding = face_encoding_result["face_encoding"]

#         # Kiểm tra trùng student_id
#         existing_student = await get_student_by_id(student_data["student_id"])
#         if existing_student['success']:
#             return {"success": False, "message": "Sinh viên đã tồn tại", "data": None}

#         student = Student(
#             student_id=student_data["student_id"],
#             name=student_data["name"],
#             full_name=student_data["full_name"],
#             image_base64=image_base64,
#             face_encoding=face_encoding,
#             created_at=datetime.utcnow(),
#             updated_at=datetime.utcnow()
#         )
#         await student.insert()
#         return {"success": True, "message": "Thêm sinh viên thành công", "data": student_to_dict(student)}
#     except Exception as e:
#         return {"success": False, "message": f"Lỗi: {str(e)}", "data": None}
    
# Cập nhật thông tin sinh viên
async def update_student(student_id: str, student_data: dict):
    existing = await get_student_by_id(student_id)

    if not existing['success']:
        return {
            "success": False,
            "message": "Sinh viên không tồn tại",
            "data": None
        }

    student_obj = existing["data"]

    # Lấy ảnh mới nếu có, nếu không giữ nguyên ảnh cũ
    image_base64 = student_data.get("image_base64", student_obj["image"])

    # Nếu có ảnh mới, cập nhật image_encoding
    if "image_base64" in student_data and student_data["image_base64"]:
        image_encoding = await get_image_encoding(student_data["image_base64"])
        if not isinstance(image_encoding, list):
            image_encoding = image_encoding.tolist() if hasattr(image_encoding, "tolist") else []
    else:
        image_encoding = student_obj.get("image_encoding", [])

    update_data = {
        "student_id": student_data.get("student_id", student_obj["student_id"]),
        "name": student_data.get("name", student_obj["name"]),
        "full_name": student_data.get("full_name", student_obj["full_name"]),
        "image_encoding": image_encoding,
        "image": image_base64,
        "created_at": student_obj["created_at"],
        "updated_at": datetime.utcnow()
    }

    await Student.find_one({"student_id": student_id}).update({"$set": update_data})

    return {
        "success": True,
        "message": "Cập nhật sinh viên thành công",
        "data": update_data
    }
# Xóa sinh viên
async def delete_student(student_id: str):
    existing = await get_student_by_id(student_id)

    if not existing['success']:
        return {
            "success": False,
            "message": "Sinh viên không tồn tại",
            "data": None
        }

    await Student.find_one({"student_id": student_id}).delete()

    return {
        "success": True,
        "message": "Xóa sinh viên thành công",
        "data": None
    }
# Thêm các hàm update_student, delete_student, get_all_students, get_student_by_id nếu chưa có, trả về dict chuẩn 