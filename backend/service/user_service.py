from backend.config.database import Database
from backend.core.security import hash_password
from backend.entities.user import User
from backend.service.admin_service import add_student_to_database

async def get_user_by_username(username: str):
    user = await User.find_one({"username": username})
    if user:
        return {
            "success": True,
            "message": "Tìm thấy user",
            "data": user.dict()
        }
    else:
        return {
            "success": False,
            "message": "Không tìm thấy user",
            "data": None
        }

async def create_user(user_data: dict):
    try:
        await add_student_to_database(user_data)
        user = User(
            username=user_data["username"],
            student_id=user_data["student_id"],
            password_hash=hash_password(user_data["password"]),
            role="user"
        )
        await user.insert()
        return {
            "success": True,
            "message": "Tạo user thành công",
            "data": user.dict()
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Lỗi: {str(e)}",
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
    else:
        return {
            "success": False,
            "message": "Mật khẩu không chính xác",
            "data": None
        }

async def login_user(user_data: dict):
    user = await User.find_one({"username": user_data["username"]})
    if user:
        auth_result = await authenticate_user(user_data["password"], user.password_hash)
        if auth_result["success"]:
            return {
                "success": True,
                "message": "Đăng nhập thành công",
                "data": user.dict()
            }
        return {
            "success": False,
            "message": "Mật khẩu không chính xác",
            "data": None
        }
    return {
        "success": False,
        "message": "Tài khoản không tồn tại",
        "data": None
    }
