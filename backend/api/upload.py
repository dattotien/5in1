from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.service.face_service import handle_face_upload

router = APIRouter()

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        return {"success": False, "message": "Chỉ hỗ trợ file ảnh JPG hoặc PNG."}
    # Có thể kiểm tra thêm kích thước file ở đây
    try:
        result = await handle_face_upload(file)
        return result  # Đảm bảo result luôn có success/message/data
    except Exception as e:
        return {"success": False, "message": f"Lỗi hệ thống: {str(e)}"}

