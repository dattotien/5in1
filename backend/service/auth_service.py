from service.user_service import get_user_by_username
from core.security import verify_password, create_access_token
from entities.user import User

async def authenticate_user(username: str, password: str):
    user = await get_user_by_username(username)
    if not user or not verify_password(password, user["password_hash"]):
        return None
    return user

async def login_user(username: str, password: str):
    user = await authenticate_user(username, password)
    if not user:
        return None
    token = create_access_token({"sub": user["username"], "role": user["role"]})
    return {
            "access_token": token,
            "token_type": "bearer",
            "role": user["role"],
            "username": user["username"],
            "student_id": user["student_id"],
            "full_name": user.get("full_name", user["username"])  
        }
