from fastapi import APIRouter, HTTPException
from entities.user import User
from service.user_service import login_user

router = APIRouter()

@router.post("/login")
async def login(login_data: dict):
    return await login_user(login_data)