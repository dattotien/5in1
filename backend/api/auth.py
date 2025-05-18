from fastapi import APIRouter, HTTPException
from backend.entities.user import LoginModel
from backend.service.user_service import login_user

router = APIRouter()

@router.post("/login")
async def login(data: LoginModel):
    result = await login_user(data.username, data.password)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return result
