import cv2
import base64
import numpy as np
import torch
import asyncio
from fastapi import UploadFile, HTTPException, WebSocket
# from backend.entities.student import Student

# So sánh embeddings giữa ảnh gửi về + dtb
def compare_embeddings(embedding, known_students, threshold=0.6):
    for name, embeddings_list in known_students.items():
        for known_embedding in embeddings_list:
            dist = np.linalg.norm(embedding - known_embedding)
            if dist < threshold:
                return name
    return "Unknown"

# Xử lý ảnh gửi lên
async def handle_face_upload(mtcnn, resnet, device, file: UploadFile, known_students: dict):
    contents = await file.read()
    npimg = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    if img is None:
        raise HTTPException(status_code=400, detail="Không thể đọc ảnh")

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    faces = mtcnn(img_rgb)

    if faces is None or len(faces) == 0:
        raise HTTPException(status_code=400, detail="Không phát hiện khuôn mặt")
    elif len(faces) > 1:
        raise HTTPException(status_code=400, detail="Có nhiều hơn 1 khuôn mặt trong ảnh")

    # Trích xuất embedding
    face_embedding = resnet(faces[0].unsqueeze(0).to(device)).detach().cpu().numpy().flatten()

    # So sánh
    matched_name = compare_embeddings(face_embedding, known_students)

    return {
        "success": True,
        "message": "Đã nhận diện khuôn mặt" if matched_name != "Unknown" else "Không nhận diện được",
        "matched_name": matched_name
    }

def encode_frame(frame):
    ret, buffer = cv2.imencode('.jpg', frame)
    return base64.b64encode(buffer).decode('utf-8') if ret else None

# Xử lý stream
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

                # Đẩy thông tin nhận diện vào match_queue
                await match_queue.put(matched_name)

                # Vẽ lên frame
                box = [int(b) for b in box]
                cv2.rectangle(frame, (box[0], box[1]), (box[2], box[3]), (0, 255, 0), 2)
                cv2.putText(frame, matched_name, (box[0], box[1] - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36, 255, 12), 2)

        encoded = encode_frame(frame)
        await output_queue.put(encoded)
