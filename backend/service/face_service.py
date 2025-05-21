import cv2
import base64
import numpy as np
import torch
import asyncio
from datetime import datetime
from fastapi import UploadFile, HTTPException, WebSocket
from backend.entities.attendance import Attendance
from backend.entities.student import Student
from backend.service.model import mtcnn, resnet, device
from scipy.spatial.distance import cosine
from io import BytesIO
from PIL import Image

# Xử lý ảnh gửi về
async def get_image_encoding(image: str, mtcnn=mtcnn, resnet=resnet, device=device):
    # Xóa prefix data:image/jpg;base64, nếu có
    if "base64," in image:
        image = image.split("base64,")[1]
    
    # Decode base64 thành bytes
    img_data = base64.b64decode(image)
    np_arr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        return {
            "success": False,
            "message": "Ảnh không hợp lệ",
            "image_encoding": None
        }

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    faces = mtcnn(img_rgb)

    if faces is None or len(faces) == 0:
        return {
            "success": False,
            "message": "Ảnh không chứa khuôn mặt",
            "image_encoding": None
        }
        
    if len(faces) > 1:
        return {
            "success": False,
            "message": "Có nhiều hơn 1 khuôn mặt trong ảnh",
            "image_encoding": None
        }

    image_encoding = resnet(faces[0].unsqueeze(0).to(device)).detach().cpu().numpy().flatten()

    if image_encoding:
        return {
            "success": True,
            "message": "Đã nhận diện được mặt ở trong hình ảnh",
            "data": {
                "image_encoding": image_encoding
            }
        }
        
    return {
        "success": False,
        "message": "Không nhận diện được mặt ở trong hình ảnh",
        "data": None
    }
        
# async def handle_face_upload(mtcnn, resnet, device, file: UploadFile, known_students: dict):
#     contents = await file.read()
#     npimg = np.frombuffer(contents, np.uint8)
#     img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

#     if img is None:
#         raise HTTPException(status_code=400, detail="Không thể đọc ảnh")

#     img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#     faces = mtcnn(img_rgb)

#     if faces is None or len(faces) == 0:
#         raise HTTPException(status_code=400, detail="Không phát hiện khuôn mặt")
#     elif len(faces) > 1:
#         raise HTTPException(status_code=400, detail="Có nhiều hơn 1 khuôn mặt trong ảnh")

#     # Trích xuất embedding
#     face_embedding = resnet(faces[0].unsqueeze(0).to(device)).detach().cpu().numpy().flatten()

#     # So sánh
#     matched_name = compare_embeddings(face_embedding, known_students)

#     return {
#         "success": True,
#         "message": "Đã nhận diện khuôn mặt" if matched_name != "Unknown" else "Không nhận diện được",
#         "matched_name": matched_name
#     }
    
async def stream_face_recognition(image: str, mtcnn=mtcnn, resnet=resnet, device=device):
    if "base64," in image:
        image = image.split("base64,")[1]
    
    img_data = base64.b64decode(image)
    np_arr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        return {"success": False, "message": "Video không hợp lệ", "data": None}

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    boxes, _ = mtcnn.detect(img_rgb)

    # Vẽ bounding box cho tất cả mặt nếu có
    if boxes is not None:
        for box in boxes:
            box = box.astype(int)
            cv2.rectangle(img, (box[0], box[1]), (box[2], box[3]), (0, 255, 0), 2)
    else:
        boxes = []

    # Nếu không có mặt, trả ảnh gốc kèm thông báo
    if len(boxes) == 0:
        pil_img = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        buffered = BytesIO()
        pil_img.save(buffered, format="JPEG")
        frame_with_box_base64 = base64.b64encode(buffered.getvalue()).decode()

        return {
            "success": False,
            "message": "Không phát hiện khuôn mặt nào",
            "data": {
                "frame": "data:image/jpeg;base64," + frame_with_box_base64,
                "need_confirm": False,
            }
        }

    # Nếu nhiều mặt, trả ảnh vẽ box nhiều mặt kèm thông báo
    if len(boxes) > 1:
        pil_img = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        buffered = BytesIO()
        pil_img.save(buffered, format="JPEG")
        frame_with_box_base64 = base64.b64encode(buffered.getvalue()).decode()

        return {
            "success": False,
            "message": f"Phát hiện {len(boxes)} khuôn mặt trong video",
            "data": {
                "frame": "data:image/jpeg;base64," + frame_with_box_base64,
                "need_confirm": False,
            }
        }

    # 1 mặt, xử lý nhận dạng
    faces = mtcnn(img_rgb)
    if faces is None or len(faces) == 0:
        pil_img = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        buffered = BytesIO()
        pil_img.save(buffered, format="JPEG")
        frame_with_box_base64 = base64.b64encode(buffered.getvalue()).decode()

        return {
            "success": False,
            "message": "Không nhận diện được khuôn mặt",
            "data": {
                "frame": "data:image/jpeg;base64," + frame_with_box_base64,
                "need_confirm": False,
            }
        }
    
    image_encoding = resnet(faces[0].unsqueeze(0).to(device)).detach().cpu().numpy().flatten()
    
    # Mặc định là không match
    is_matched = {"success": False}
    match_data = None

    if image_encoding is not None and len(image_encoding) > 0:
        is_matched = await compare_embeddings(image_encoding)

        if is_matched["success"]:
            match_data = is_matched["data"]
            id = match_data["student_id"]
            box = boxes[0].astype(int)
            cv2.putText(img, id, (box[0], box[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8,
                        (0, 255, 0), 2, cv2.LINE_AA)

    pil_img = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    buffered = BytesIO()
    pil_img.save(buffered, format="JPEG")
    frame_with_box_base64 = base64.b64encode(buffered.getvalue()).decode()

    if is_matched["success"]:
        return {
            "success": True,
            "message": f"Phát hiện sinh viên: {match_data['full_name']} ({match_data['student_id']}). Có đúng là bạn vừa điểm danh không?",
            "data": {
                "student_id": match_data["student_id"],
                "full_name": match_data["full_name"],
                "time": datetime.utcnow().strftime("%H:%M:%S"),
                "frame": "data:image/jpeg;base64," + frame_with_box_base64,
                "need_confirm": True
            }
        }
    else:
        return {
            "success": False,
            "message": "Không tìm thấy sinh viên trùng khớp với khuôn mặt",
            "data": {
                "frame": "data:image/jpeg;base64," + frame_with_box_base64,
                "need_confirm": False,
            }
        }


    
# Xử lý stream
# async def handle_stream(input_queue, output_queue, match_queue, 
#                         mtcnn, resnet, device, known_students):
#     while True:
#         frame = await input_queue.get()

#         img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#         boxes, _ = mtcnn.detect(img_rgb)

#         if boxes is not None:
#             faces = mtcnn.extract(img_rgb, boxes, save_path=None)

#             for box, face in zip(boxes, faces):
#                 face_embedding = resnet(face.unsqueeze(0).to(device)).detach().cpu().numpy().flatten()
#                 matched_name = compare_embeddings(face_embedding, known_students)

#                 # Đẩy thông tin nhận diện vào match_queue
#                 await match_queue.put(matched_name)

#                 # Vẽ lên frame
#                 box = [int(b) for b in box]
#                 cv2.rectangle(frame, (box[0], box[1]), (box[2], box[3]), (0, 255, 0), 2)
#                 cv2.putText(frame, matched_name, (box[0], box[1] - 10),
#                             cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36, 255, 12), 2)

#         encoded = encode_frame(frame)
#         await output_queue.put(encoded)
        
async def compare_embeddings(image_encoding: np.ndarray):
    students = await Student.find_all().to_list()
    known_students = {}
    
    for student in students:
        if student.image_encoding: 
            known_students[student.student_id] = {
                "student_id": student.student_id,
                "full_name": student.full_name,
                "image_encoding": np.array(student.image_encoding)  
            }
    
    best_match = None
    best_similarity = -1
    
    for student_id, student_data in known_students.items():
        if student_data["image_encoding"] is not None:
            
            similarity = 1 - cosine(image_encoding, student_data["image_encoding"])
            
            if similarity > best_similarity:
                best_similarity = similarity
                best_match = student_data
    
    SIMILARITY_THRESHOLD = 0.8
    
    if best_match and best_similarity >= SIMILARITY_THRESHOLD:
        return {
            "success": True,
            "message": "Đã tìm thấy sinh viên trùng khớp",
            "data": {
                "student_id": best_match["student_id"],
                "full_name": best_match["full_name"],
            }
        }
    
    return {
        "success": False,
        "message": "Không tìm thấy sinh viên trùng khớp với khuôn mặt",
        "data": None
    }