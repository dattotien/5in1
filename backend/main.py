from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from beanie import init_beanie
from api import auth, admin, student, attendance, user
from entities.student import Student
from entities.attendance import Attendance
from config.database import Database
from entities.user import User
from entities.message import Message

app = FastAPI(title="Student Management API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # hoặc thay * bằng domain frontend của bạn
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["Attendance"])
app.include_router(attendance.router, prefix="/api/student", tags=["Student"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(user.router, prefix="/api/user", tags=["User"])
@app.on_event("startup")
async def startup_event():
    # Kết nối database
    await Database.connect_to_database()
    client = Database.client
    
    # Khởi tạo Beanie với các models
    await init_beanie(
        database=client.Attendances,
        document_models=[
            Student,
            Attendance,
            User,
            Message
        ]
    )

@app.on_event("shutdown")
async def shutdown_db_client():
    await Database.close_database_connection()

@app.get("/")
async def root():
    return {"message": "Welcome to Student Management API"} 