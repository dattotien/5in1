import React, { useEffect, useRef, useState } from "react";
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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [recognitionData, setRecognitionData] = useState<RecognitionData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultColor, setResultColor] = useState("black");
  const [pauseCapture, setPauseCapture] = useState(false);

  useEffect(() => {
    async function setupWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (error) {
        setResultMessage("Không mở được webcam: " + (error as Error).message);
        setResultColor("red");
      }
    }
    setupWebcam();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (recognitionData?.need_confirm) {
      setPauseCapture(true);
    } else {
      setPauseCapture(false);
    }
  }, [recognitionData?.need_confirm]);

  const captureAndSend = async () => {
    if (isProcessing || !canvasRef.current || !videoRef.current || pauseCapture) return;

    setIsProcessing(true);
    setResultMessage("Đang xử lý...");
    setResultColor("black");

    try {
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) throw new Error("Không lấy được context canvas");

      canvasRef.current.width = 640;
      canvasRef.current.height = 480;

      ctx.drawImage(videoRef.current, 0, 0, 640, 480);
      const dataUrl = canvasRef.current.toDataURL("image/jpeg");

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

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!pauseCapture) {
      intervalRef.current = setInterval(() => {
        captureAndSend();
      }, 2000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pauseCapture]);

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
        setRecognitionData(null);
        setPauseCapture(false);
      } else {
        setResultMessage(data.message || "Xác nhận thất bại");
        setResultColor("red");
      }
    } catch (error) {
      setResultMessage("Lỗi xác nhận: " + (error as Error).message);
      setResultColor("red");
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px", maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={{ flex: 1 }}>
        {recognitionData?.frame ? (
          <img
            src={recognitionData.frame}
            alt="Nhận diện"
            style={{ width: "100%", borderRadius: 8 }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 360,
              border: "1px solid #ddd",
              borderRadius: 8,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#888",
            }}
          >
            Vui lòng chờ nhận diện
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 8,
            backgroundColor: "#fafafa",
            color: resultColor,
            fontWeight: 600,
            minHeight: 72,
            display: "flex",
            alignItems: "center",
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
    </div>
  );
};

export default StreamAttendance;
