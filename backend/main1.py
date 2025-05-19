from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect, APIRouter
from fastapi.responses import StreamingResponse
from backend.service.face_service import handle_face_upload, handle_stream
from backend.service.model import device, mtcnn, resnet, load_encoding_from_students
import asyncio
import cv2
import base64
import numpy as np
import json

app = FastAPI()
router = APIRouter()

known_faces = load_encoding_from_students()

@app.get("/")
async def root():
    return {"message": "API running"}

@app.post("/upload-face/")
async def upload_face(file: UploadFile = File(...)):
    return await handle_face_upload(mtcnn, resnet, device, file, known_faces)

frame_queues = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    input_queue = asyncio.Queue()
    output_queue = asyncio.Queue()

    # Start handle_stream với 2 queue
    asyncio.create_task(handle_stream(input_queue, output_queue, mtcnn, resnet, device, known_faces))

    try:
        while True:
            data = await websocket.receive_text()
            json_data = json.loads(data)
            base64_str = json_data.get("frame", "")
            if "," in base64_str:
                base64_str = base64_str.split(",")[1]
            img_data = base64.b64decode(base64_str)
            np_arr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            # Đẩy frame client gửi lên vào input_queue
            await input_queue.put(img)

            # Lấy frame đã xử lý từ output_queue gửi về client
            encoded_frame = await output_queue.get()
            await websocket.send_text(json.dumps({"frame": encoded_frame}))

    except Exception as e:
        print(f"WebSocket Error: {e}")
