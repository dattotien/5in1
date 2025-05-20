// StreamAttendance.tsx
import React, { useEffect, useState } from "react";
import WebcamCapture from "./WebcamCapture";
import RecognitionResult from "./RecognitionResult";

interface RecognitionData {
  student_id?: string;
  full_name?: string;
  frame?: string;
  need_confirm?: boolean;
  message?: string;
  success?: boolean;
}

const StreamAttendance: React.FC = () => {
  const [recognitionData, setRecognitionData] = useState<RecognitionData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultColor, setResultColor] = useState("black");
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // Hàm gửi ảnh webcam lên backend
  const fetchRecognition = async () => {
    if (isProcessing || !canvasRef.current) return;
    
    setIsProcessing(true);
    setResultMessage("Đang xử lý...");
    setResultColor("black");

    try {
      const video = document.createElement('video');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      await video.play();

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      canvasRef.current.width = 640;
      canvasRef.current.height = 480;
      ctx.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const dataUrl = canvasRef.current.toDataURL("image/jpeg");

      video.pause();
      stream.getTracks().forEach(track => track.stop());

      const response = await fetch("http://127.0.0.1:8000/api/attendance/stream-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });

      if (!response.ok) throw new Error("Lỗi server: " + response.status);

      const data = await response.json();
      setRecognitionData(data.data || null);
      
      if (data.message) {
        setResultMessage(data.message);
        setResultColor(data.success ? "green" : "red");
      }
    } catch (error) {
      setResultMessage("Lỗi khi nhận diện: " + (error as Error).message);
      setResultColor("red");
    } finally {
      setIsProcessing(false);
    }
  };

  // Xử lý xác nhận điểm danh
  const handleConfirm = async (confirmed: boolean) => {
    if (!recognitionData?.student_id) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/attendance/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: recognitionData.student_id,
          confirmed,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResultMessage(
          confirmed
            ? Sinh viên ${recognitionData.full_name} - MSV: ${recognitionData.student_id} đã điểm danh thành công
            : "Hủy điểm danh"
        );
        setResultColor(confirmed ? "green" : "red");
        setRecognitionData(null);
      } else {
        setResultMessage(data.message || "Xác nhận thất bại");
        setResultColor("red");
      }
    } catch (error) {
      setResultMessage("Lỗi xác nhận: " + (error as Error).message);
      setResultColor("red");
    }
  };

  // Gọi nhận diện mỗi 3 giây
  useEffect(() => {
    fetchRecognition();
    const interval = setInterval(fetchRecognition, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      display: "flex", 
      gap: "20px", 
      maxWidth: "1000px", 
      margin: "0 auto",
      padding: "20px"
    }}>
      {/* Bên trái: WebcamCapture */}
      <div style={{ flex: 1 }}>
        <WebcamCapture frameSrc={recognitionData?.frame} />
      </div>

      {/* Bên phải: RecognitionResult và thông báo */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Thông báo kết quả */}
        <div style={{ 
          padding: "12px", 
          border: "1px solid #ddd", 
          borderRadius: "8px",
          backgroundColor: "#fafafa",
          color: resultColor,
          fontWeight: 600
        }}>
          {resultMessage || "Chờ nhận diện..."}
        </div>

        {/* Kết quả nhận diện */}
        <RecognitionResult 
          data={recognitionData} 
          onConfirm={handleConfirm} 
          isConfirming={isProcessing}
        />
      </div>

      {/* Canvas ẩn để chụp ảnh */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default StreamAttendance;
