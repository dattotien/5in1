import { useState, useCallback } from "react";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDropzone } from "react-dropzone";
import RecognitionResult from "./RecognitionResult";
import "./ImageUpload.css";

export default function ImageUpload() {
  const [image, setImage] = useState<string | null>(null);
  const [recognized, setRecognized] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImage(URL.createObjectURL(file));
      setRecognized(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  const handleRemove = () => {
    setImage(null);
    setRecognized(false);
  };

  const handleRecognize = () => {
    if (!image) return;
    setRecognized(true);
    alert("Bắt đầu nhận diện khuôn mặt...");
  };

  return (
    <div className="upload-wrapper">
      {!image ? (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? "active" : ""}`}
          tabIndex={0}
        >
          <input {...getInputProps()} />
          <UploadOutlined className="upload-icon" />
          <p>Kéo & thả ảnh vào đây hoặc nhấn để chọn ảnh</p>
          <small>(Chỉ hỗ trợ ảnh định dạng JPG, PNG...)</small>
        </div>
      ) : (
        <div className="preview-container">
          <img src={image} alt="preview" className="preview-image" />
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handleRemove} className="remove-btn" aria-label="Xóa ảnh">
              <DeleteOutlined /> Xóa ảnh
            </button>
            <button
              onClick={handleRecognize}
              className="recognize-btn"
              disabled={recognized}
            >
              {recognized ? "Đã nhận diện" : "Nhận diện"}
            </button>
          </div>
          {recognized && <RecognitionResult />}
        </div>
      )}
    </div>
  );
}
