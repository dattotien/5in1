from fastapi import APIRouter, HTTPException
from backend.entities.user import User
from backend.service.user_service import login_user

router = APIRouter()

@router.post("/login")
async def login(login_data: dict):
    return await login_user(login_data)