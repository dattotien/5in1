from service.model import mtcnn, resnet, device, load_encoding_from_students
import base64
from fastapi import WebSocket, APIRouter, FastAPI
import asyncio
import cv2
import numpy as np
import json

known_students = load_encoding_from_students()
app = FastAPI()

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
# --- xử lý ảnh và nhận diện khuôn mặt ---
async def handle_stream(input_queue, output_queue, match_queue,
                        mtcnn, resnet, device, known_students):
    while True:
        frame = await input_queue.get()

        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        boxes, _ = mtcnn.detect(img_rgb)

        if boxes is not None:
            faces = mtcnn.extract(img_rgb, boxes, save_path=None)

            for box, face in zip(boxes, faces):
                face_embedding = resnet(face.unsqueeze(0).to(device)).detach().cpu().numpy().flatten()
                matched_name = compare_embeddings(face_embedding, known_students)
                print(f"[handle_stream] matched_name: {matched_name}")

                # Đẩy thông tin nhận diện vào match_queue
                await match_queue.put(matched_name)

                # Vẽ kết quả
                box = [int(b) for b in box]
                cv2.rectangle(frame, (box[0], box[1]), (box[2], box[3]), (0, 255, 0), 2)
                cv2.putText(frame, matched_name, (box[0], box[1] - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36, 255, 12), 2)

        encoded = encode_frame(frame)
        await output_queue.put(encoded)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    input_queue = asyncio.Queue()
    output_queue = asyncio.Queue()
    match_queue = asyncio.Queue()
    pending_name = None

    # Bắt đầu xử lý ảnh
    asyncio.create_task(
        handle_stream(input_queue, output_queue, match_queue, mtcnn, resnet, device, known_students)
    )

    try:
        while True:
            # Tạo task để chờ 2 luồng: websocket nhận và nhận match
            receive_task = asyncio.create_task(websocket.receive_text())
            match_task = asyncio.create_task(match_queue.get())

            done, pending = await asyncio.wait(
                [receive_task, match_task],
                return_when=asyncio.FIRST_COMPLETED
            )

            for task in done:
                result = task.result()

                # Nếu là dữ liệu từ websocket
                if task == receive_task:
                    json_data = json.loads(result)

                    if json_data.get("type") == "frame":
                        base64_str = json_data.get("frame", "")
                        if "," in base64_str:
                            base64_str = base64_str.split(",")[1]
                        img_data = base64.b64decode(base64_str)
                        np_arr = np.frombuffer(img_data, np.uint8)
                        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

                        await input_queue.put(img)
                        encoded_frame = await output_queue.get()

                        await websocket.send_json({
                            "type": "frame",
                            "frame": encoded_frame
                        })

                    elif json_data.get("type") == "confirm":
                        pending_name = None  # reset sau xác nhận

                # Nếu là kết quả matched từ handle_stream
                elif task == match_task:
                    matched_name = result
                    print(f"[websocket] sending match: {matched_name}")
                    if matched_name != "Unknown" and matched_name != pending_name:
                        await websocket.send_json({
                            "type": "match",
                            "name": matched_name
                        })
                        pending_name = matched_name
                        print(f"[WS] Gửi match: {matched_name}")

            # Hủy task chưa hoàn tất để tránh warning
            for task in pending:
                task.cancel()

    except Exception as e:
        print(f"[WebSocket Error]: {e}")