# service.model
import torch
import cv2
import pymongo
from facenet_pytorch import MTCNN, InceptionResnetV1
import numpy as np

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Model MTCNN -> detect + crop faces
mtcnn = MTCNN(keep_all=True, device=device)

# Model ResNet -> embedding faces
resnet = InceptionResnetV1(pretrained='vggface2').eval().to(device)


def load_encoding_from_students():
    client = pymongo.MongoClient("mongodb+srv://dangminhnguyet2015:mongodb@cluster0.srvjgt8.mongodb.net/") 
    db = client["Attendances"]
    collection = db["students"]
    students = collection.find({})
    encoding_dict = {}

    for student in students:
        name = student.get("student_id")
        embedding = student.get("image_encoding")  # singular

        if not name or not embedding or name=="22023xxx":
            continue

        # Convert to numpy array
        encoding_dict[name] = [np.array(embedding)]

    print(f"[INFO] Loaded encodings for {len(encoding_dict)} students.")
    return encoding_dict

