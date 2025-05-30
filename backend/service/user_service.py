from config.database import Database
from core.security import hash_password
from entities.user import User
from entities.message import Message
from datetime import datetime

async def user_to_dict(user: User):
    return {
        "student_id": user.student_id,
        "username": user.username,
        "full_name": user.full_name,
        "password_hash": user.password_hash,
        "role": user.role
    }

async def get_user_by_username(username: str):
    user = await User.find_one({"username": username})
    
    if user:
        return {
            "success": True,
            "message": "Tìm thấy user",
            "data": await user_to_dict(user)
        }
        
    return {
        "success": False,
        "message": "Không tìm thấy user",
        "data": None
    }

async def authenticate_user(password: str, password_hash: str):    
    if password == password_hash:
        return {
            "success": True,
            "message": "Đăng nhập thành công",
            "data": None
        }
        
    return {
        "success": False,
        "message": "Mật khẩu không chính xác",
        "data": None
    }

async def login_user(user_data: dict):
    user = await get_user_by_username(user_data["username"])
    
    if user["success"] == True:
        auth_result = await authenticate_user(user_data["password"], user["data"]["password_hash"])
        
        if auth_result["success"]:
            return {
                "success": True,
                "message": "Đăng nhập thành công",
                "data": {
                    "username": user_data["username"],
                    "role": user["data"]["role"],
                    "student_id": user["data"]["student_id"],
                    "full_name": user["data"]["full_name"]  # Thêm dòng này
                }
            }
            
        return {
            "success": False,
            "message": "Mật khẩu không chính xác",
            "data": None
        }
        
    return {
        "success": False,
        "message": "Tài khoản không tồn tại",
        "data": {
            "username": user_data["username"],
        }
    }

async def add_request_to_database(user_data: dict):
    message = Message(
        student_id=user_data["student_id"],
        heading=user_data["heading"],
        message=user_data["message"],
        create_at=datetime.utcnow(),
        handled=False,
        handled_at=None,
        response=None
    )
    await message.insert()

    return {
        "success": True,
        "message": "Yêu cầu đã được gửi thành công",
        "data": None
    } 

async def get_requests_from_database():
    requests = await Message.find_all().to_list()
    print(requests)
    if requests:
        request_list = []
        for request in requests:
            request_list.append({
                "student_id": request.student_id,
                "heading": request.heading,
                "message": request.message,
                "create_at": request.create_at,
                "handled": request.handled,
                "handled_at": request.handled_at,
                "response": request.response
            })
        
        return {
            "success": True,
            "message": "Lấy danh sách yêu cầu thành công",
            "data": request_list
        }
    
    return {
        "success": False,
        "message": "Không có yêu cầu nào",
        "data": []
    }

async def update_request_in_database(request_data: dict):
    request = await Message.find_one({
        "student_id": request_data["student_id"],
        "heading": request_data["heading"],
        "message": request_data["message"]
        })
    
    if request:
        request.handled = True
        request.handled_at = datetime.utcnow()
        request.response = request_data["response"]
        await request.save()

        return {
            "success": True,
            "message": "Yêu cầu đã được xử lý thành công",
            "data": None
        }
    
    return {
        "success": False,
        "message": "Không tìm thấy yêu cầu",
        "data": None
    }
        
async def get_requests_by_student_id(student_id: str):
    requests = await Message.find(Message.student_id == student_id).to_list()

    if requests:
        request_dictionaries = {}
        for request in requests:
            request_dictionaries[request.heading] = {
                "student_id": request.student_id,
                "heading": request.heading,
                "message": request.message,
                "create_at": request.create_at,
                "handled": request.handled,
                "handled_at": request.handled_at,
                "response": request.response
            }
        
        return {
            "success": True,
            "message": "Lấy danh sách yêu cầu thành công",
            "data": request_dictionaries
        }
    
    return {
        "success": False,
        "message": "Không có yêu cầu nào",
        "data": None
    }
        
        