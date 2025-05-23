import { useState, useCallback } from "react";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import RecognitionResult from "./RecognitionResult";
import "./ImageUpload.css";

export default function ImageUpload() {
  const { t } = useTranslation();
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
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleRemove = () => {
    setImage(null);
    setRecognized(false);
  };

  const handleRecognize = () => {
    if (!image) return;
    setRecognized(true);
    alert(t("upload.start_recognition"));
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
          <p>{t("upload.drop_here")}</p>
          <small>{t("upload.only_support")}</small>
        </div>
      ) : (
        <div className="preview-container">
          <img src={image} alt="preview" className="preview-image" />
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handleRemove} className="remove-btn" aria-label={t("upload.remove_image")}>
              <DeleteOutlined /> {t("upload.remove_image")}
            </button>
            <button
              onClick={handleRecognize}
              className="recognize-btn"
              disabled={recognized}
            >
              {recognized ? t("upload.recognized") : t("upload.recognize")}
            </button>
          </div>
          {recognized && <RecognitionResult />}
        </div>
      )}
    </div>
  );
}
