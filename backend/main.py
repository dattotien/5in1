from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from beanie import init_beanie
from backend.api import auth, admin, student, attendance
from backend.entities.student import Student
from backend.entities.attendance import Attendance
from backend.config.database import Database

app = FastAPI(title="Student Management API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Địa chỉ frontend của bạn
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["Attendance"])


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
            Attendance
        ]
    )

@app.on_event("shutdown")
async def shutdown_db_client():
    await Database.close_database_connection()

@app.get("/")
async def root():
    return {"message": "Welcome to Student Management API"} 