from config.database import Database
from core.security import hash_password
from entities.user import User

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
    user_password_hash = hash_password(password)
    
    if user_password_hash == password_hash:
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
    
    if user:
        auth_result = await authenticate_user(user_data["password"], user["data"]["password_hash"])
        
        if auth_result["success"]:
            return auth_result
            
        return  auth_result
        
    return {
        "success": False,
        "message": "Tài khoản không tồn tại",
        "data": {
            "username": user_data["username"],
        }
    }
