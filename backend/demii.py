from backend.service.model import mtcnn, resnet, device, load_encoding_from_students
import base64
from fastapi import WebSocket, APIRouter, FastAPI
import asyncio
import cv2
import numpy as np
import json

known_students = load_encoding_from_students()

def encode_frame(frame):
    ret, buffer = cv2.imencode('.jpg', frame)
    return base64.b64encode(buffer).decode('utf-8') if ret else None

# So sánh embeddings giữa ảnh gửi về + dtb
def compare_embeddings(embedding, known_students, threshold=0.6):
    for name, embeddings_list in known_students.items():
        for known_embedding in embeddings_list:
            dist = np.linalg.norm(embedding - known_embedding)
            if dist < threshold:
                return name
    return "Unknown"

# Xử lý stream
async def handle_stream(input_queue, output_queue, mtcnn, resnet, device, known_students,
                        ws: WebSocket, pending_name_wrapper, pending_name_lock):
    print("[Stream] Bắt đầu xử lý frame...")
    while True:
        frame = await input_queue.get()
        print("[Stream] Đã nhận frame từ input_queue")

        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        boxes, _ = mtcnn.detect(img_rgb)
        print(f"[Stream] Phát hiện {len(boxes) if boxes is not None else 0} khuôn mặt")

        if boxes is not None:
            faces = mtcnn.extract(img_rgb, boxes, save_path=None)

            for box, face in zip(boxes, faces):
                face_embedding = resnet(face.unsqueeze(0).to(device)).detach().cpu().numpy().flatten()
                matched_name = compare_embeddings(face_embedding, known_students)
                print(f"[Stream] Nhận diện được: {matched_name}")

                # Chỉ gửi nếu chưa có người đang chờ xác nhận
                async with pending_name_lock:
                    if pending_name_wrapper["value"] is None:
                        await ws.send_json({
                            "type": "match",
                            "name": matched_name
                        })
                        pending_name_wrapper["value"] = matched_name
                        print(f"[Stream] Gửi thông tin match: {matched_name}")

                # Vẽ lên frame
                box = [int(b) for b in box]
                cv2.rectangle(frame, (box[0], box[1]), (box[2], box[3]), (0, 255, 0), 2)
                cv2.putText(frame, matched_name, (box[0], box[1] - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36, 255, 12), 2)

        encoded = encode_frame(frame)
        if encoded is None:
            print("[Stream] Cảnh báo: encode_frame trả về None")
        await output_queue.put(encoded)
        print("[Stream] Frame đã được encode và đưa vào output_queue")

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    print("[WebSocket] Đang khởi tạo websocket...")
    await websocket.accept()
    print("[WebSocket] Client đã kết nối")

    input_queue = asyncio.Queue()
    output_queue = asyncio.Queue()

    pending_name_wrapper = {"value": None}
    pending_name_lock = asyncio.Lock()
    asyncio.create_task(
        handle_stream(input_queue, output_queue, mtcnn, resnet, device, known_students,
                      websocket, pending_name_wrapper, pending_name_lock)
    )

    try:
        while True:
            data = await websocket.receive_text()
            json_data = json.loads(data)
            print(f"[WebSocket] Nhận data: {json_data.get('type')}")

            if json_data.get("type") == "frame":
                base64_str = json_data.get("frame", "")
                if "," in base64_str:
                    base64_str = base64_str.split(",")[1]
                img_data = base64.b64decode(base64_str)
                np_arr = np.frombuffer(img_data, np.uint8)
                img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

                if img is not None:
                    await input_queue.put(img)
                    print("[WebSocket] Đã đẩy frame vào input_queue")

                    encoded_frame = await output_queue.get()
                    await websocket.send_json({
                        "type": "frame",
                        "frame": encoded_frame
                    })
                    print("[WebSocket] Đã gửi frame đã xử lý cho client")
                else:
                    print("[WebSocket] Cảnh báo: Không decode được ảnh")

            elif json_data.get("type") == "confirm":
                async with pending_name_lock:
                    print("[WebSocket] Xác nhận từ người dùng, reset pending_name")
                    pending_name_wrapper["value"] = None

    except Exception as e:
        print(f"[WebSocket Error]: {e}")