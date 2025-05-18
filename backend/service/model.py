# service.model
import torch
import cv2
from facenet_pytorch import MTCNN, InceptionResnetV1

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Model MTCNN -> detect + crop faces
mtcnn = MTCNN(keep_all=True, device=device)

# Model ResNet -> embedding faces
resnet = InceptionResnetV1(pretrained='vggface2').eval().to(device)

# Database tam
known_faces = {
    # "cin cit": "D:\\23020407 Dang Minh Nguyet\\5in1\\database\\nguyet.png",
    # "minh ly": "D:\\23020407 Dang Minh Nguyet\\5in1\\database\\li.png",
    # "datto": "D:\\23020407 Dang Minh Nguyet\\5in1\\database\\datto.jpg",
    # "panh": "D:\\23020407 Dang Minh Nguyet\\5in1\\database\\cpa.jpg",
    # "Nguyen Thi Phuong": "D:\\23020407 Dang Minh Nguyet\\5in1\\database\\phuong.png"
}

def encode_known_faces(known_faces: dict):
    encodings = {}

    for name, img_path in known_faces.items():
        img = cv2.imread(img_path)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        faces = mtcnn(img_rgb)

        if faces is not None:
            for face in faces:
                embedding = resnet(face.unsqueeze(0).to(device)).detach().cpu().numpy().flatten()
                if name not in encodings:
                    encodings[name] = []
                encodings[name].append(embedding)
        else:
            print(f"[WARN] Không phát hiện khuôn mặt trong ảnh: {img_path}")

    return encodings

# known_faces = encode_known_faces(known_faces)
known_faces = {}
for name, emb_list in known_faces.items():
    print(f"{name}: {type(emb_list)}, length = {len(emb_list)}")
