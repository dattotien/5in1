import cv2
import numpy as np
import torch
from facenet_pytorch import MTCNN, InceptionResnetV1

# Initialize models globally (optional optimization)
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
mtcnn = MTCNN(keep_all=True, device=device)
resnet = InceptionResnetV1(pretrained='vggface2').eval().to(device)

# Define known faces (path to images)
known_faces = {
    "cin cit": "D:\\23020407 Dang Minh Nguyet\\5in1\\database\\nguyet.png",
    "minh ly": "D:\\23020407 Dang Minh Nguyet\\5in1\\database\\li.png",
    "datto": "D:\\23020407 Dang Minh Nguyet\\5in1\\database\\datto.jpg",
    "panh": "D:\\23020407 Dang Minh Nguyet\\5in1\\database\\cpa.jpg",
    "Nguyen Thi Phuong": "D:\\23020407 Dang Minh Nguyet\\5in1\\database\\phuong.png"
}

# Encode known faces to obtain embeddings
def encode_known_faces(known_faces: dict):
    encodings = []
    names = []

    for name, img_path in known_faces.items():
        img = cv2.imread(img_path)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Detect and extract face
        faces = mtcnn(img_rgb)
        if faces is not None:
            for face in faces:
                embedding = resnet(face.unsqueeze(0).to(device)).detach().cpu().numpy().flatten()
                encodings.append(embedding)
                names.append(name)
        else:
            print(f"[WARN] No face detected for {name} in {img_path}")

    return encodings, names

# Compare embeddings and return the name of the matched face
def compare_embeddings(embedding, known_encodings, known_names, threshold=0.6):
    for known_embedding, name in zip(known_encodings, known_names):
        dist = np.linalg.norm(embedding - known_embedding)
        if dist < threshold:
            return name
    return "Unknown"

# Detect faces from video stream and recognize them
def detect_faces_from_stream_with_recognition(known_encodings, known_names, show_window=True, skip_frame_interval=3):
    cap = cv2.VideoCapture(0)  # Open the video stream (0 for default camera)
    frame_counter = 0  # Counter to skip frames

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Skip frames based on the skip_frame_interval
        frame_counter += 1
        if frame_counter % skip_frame_interval != 0:
            continue  # Skip this frame

        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        boxes, _ = mtcnn.detect(img_rgb)

        if boxes is not None:
            faces = mtcnn.extract(img_rgb, boxes, save_path=None)

            for box, face in zip(boxes, faces):
                face_embedding = resnet(face.unsqueeze(0).to(device)).detach().cpu().numpy().flatten()
                name = compare_embeddings(face_embedding, known_encodings, known_names)

                # Draw bounding box and name
                box = [int(b) for b in box]
                cv2.rectangle(frame, (box[0], box[1]), (box[2], box[3]), (0, 255, 0), 2)
                cv2.putText(frame, name, (box[0], box[1] - 10), cv2.FONT_HERSHEY_SIMPLEX,
                            0.9, (36, 255, 12), 2)

        if show_window:
            cv2.imshow('Face Recognition', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    cap.release()
    cv2.destroyAllWindows()

# Load known face encodings
known_encodings, known_names = encode_known_faces(known_faces)

# Start face recognition from the video stream with frame skipping
detect_faces_from_stream_with_recognition(known_encodings, known_names, skip_frame_interval=3)
