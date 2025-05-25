import { useState, useCallback } from "react";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDropzone } from "react-dropzone";
import RecognitionResult from "./RecognitionResult";
import { useTranslation } from "react-i18next";
import "./ImageUpload.css";

interface RecognitionData {
  student_id?: string;
  full_name?: string;
  frame?: string;
  need_confirm?: boolean;
  message?: string;
  success?: boolean;
}

export default function ImageUpload() {
  const { t } = useTranslation(); 
  const [image, setImage] = useState<string | null>(null);
  const [recognized, setRecognized] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [recognitionData, setRecognitionData] = useState<RecognitionData | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusColor, setStatusColor] = useState<"green" | "red" | "black">("black");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFile(file);
      setImage(URL.createObjectURL(file));
      setRecognized(false);
      setRecognitionData(null);
      setStatusMessage("");
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
    setFile(null);
    setRecognitionData(null);
    setStatusMessage("");
  };

  const handleRecognize = () => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result?.toString() || "";

      try {
        const res = await fetch("http://127.0.0.1:8000/api/attendance/scan-face-and-match", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64String }),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const responseJson = await res.json();

        if (responseJson.success) {
          setRecognitionData(responseJson.data || null);
          setRecognized(true);
          setStatusMessage(responseJson.message || t("recognize.success"));
          setStatusColor("green");
        } else {
          setRecognized(false);
          setRecognitionData(null);
          setStatusMessage(responseJson.message || t("recognize.failed"));
          setStatusColor("red");
        }
      } catch (error) {
        console.error("Recognition failed:", error);
        setRecognized(false);
        setRecognitionData(null);
        setStatusMessage(t("recognize.error"));
        setStatusColor("red");
      }
    };

    reader.readAsDataURL(file);
  };

  const handleConfirm = async (confirmed: boolean) => {
    if (!recognitionData?.student_id) return;

    setIsConfirming(true);
    setStatusMessage("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/attendance/attendance/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: recognitionData.student_id,
          confirmed,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const result = await res.json();
      setStatusMessage(result.message || t("confirm.sent"));
      setStatusColor(result.success ? "green" : "red");
      handleRemove();
    } catch (error) {
      console.error("Confirm failed:", error);
      setStatusMessage(t("confirm.error"));
      setStatusColor("red");
    } finally {
      setIsConfirming(false);
    }
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
          <p>{t("upload.prompt")}</p>
          <small>{t("upload.note")}</small>
        </div>
      ) : (
        <div className="preview-container">
          <img src={image} alt="preview" className="preview-image" />
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handleRemove} className="remove-btn">
              <DeleteOutlined /> {t("button.remove")}
            </button>
            <button
              onClick={handleRecognize}
              className="recognize-btn"
              disabled={recognized}
            >
              {recognized ? t("button.recognized") : t("button.recognize")}
            </button>
          </div>

          {statusMessage && (
            <div
              style={{
                marginTop: 16,
                padding: "8px 12px",
                color: statusColor,
                fontWeight: 500,
              }}
            >
              {statusMessage}
            </div>
          )}

          {recognized && recognitionData && (
            <RecognitionResult
              data={recognitionData}
              onConfirm={handleConfirm}
              isConfirming={isConfirming}
            />
          )}
        </div>
      )}
    </div>
  );
}
