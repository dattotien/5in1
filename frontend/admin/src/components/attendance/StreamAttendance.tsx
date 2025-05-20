import React, { useEffect, useRef, useState } from "react";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Hàm gửi ảnh webcam lên backend
  const fetchRecognition = async () => {
    // Đừng gửi request nếu đang xử lý hoặc đang chờ xác nhận
    if (isProcessing || recognitionData?.need_confirm || !canvasRef.current) return;

    setIsProcessing(true);
    setResultMessage("Đang xử lý...");
    setResultColor("black");

    try {
      const video = document.createElement("video");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      await video.play();

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      canvasRef.current.width = 640;
      canvasRef.current.height = 480;
      ctx.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const dataUrl = canvasRef.current.toDataURL("image/jpeg");

      video.pause();
      stream.getTracks().forEach((track) => track.stop());

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

  // Xác nhận điểm danh
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
            ? `Sinh viên ${recognitionData.full_name} - MSV: ${recognitionData.student_id} đã điểm danh thành công`
            : "Hủy điểm danh"
        );
        setResultColor(confirmed ? "green" : "red");
        setRecognitionData(null); // Reset để tiếp tục gửi request
      } else {
        setResultMessage(data.message || "Xác nhận thất bại");
        setResultColor("red");
      }
    } catch (error) {
      setResultMessage("Lỗi xác nhận: " + (error as Error).message);
      setResultColor("red");
    }
  };

  // Gọi nhận diện mỗi 3 giây (nếu không cần xác nhận)
  useEffect(() => {
    fetchRecognition(); // gọi ngay lần đầu

    intervalRef.current = setInterval(() => {
      fetchRecognition();
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [recognitionData?.need_confirm]); // re-trigger nếu need_confirm thay đổi

  return (
    <div style={{ display: "flex", gap: "20px", maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      {/* Bên trái: webcam */}
      <div style={{ flex: 1 }}>
        <WebcamCapture frameSrc={recognitionData?.frame} />
      </div>

      {/* Bên phải: kết quả */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#fafafa",
            color: resultColor,
            fontWeight: 600,
          }}
        >
          {resultMessage || "Chờ nhận diện..."}
        </div>

        <RecognitionResult
          data={recognitionData}
          onConfirm={handleConfirm}
          isConfirming={isProcessing}
        />
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default StreamAttendance;
