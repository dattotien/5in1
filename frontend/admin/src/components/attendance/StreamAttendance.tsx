import React, { useEffect, useRef, useState } from "react";
import RecognitionResult from "./RecognitionResult";
import { useTranslation } from "react-i18next";

interface RecognitionData {
  student_id?: string;
  full_name?: string;
  frame?: string;
  need_confirm?: boolean;
  message?: string;
  success?: boolean;
}

const StreamAttendance: React.FC = () => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [recognitionData, setRecognitionData] = useState<RecognitionData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultColor, setResultColor] = useState("black");
  const [pauseCapture, setPauseCapture] = useState(false);
  const lastCaptureTimeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

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
        setResultMessage(t("stream.webcam_error", { error: (error as Error).message }));
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
  }, [t]);

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
    setResultMessage(t("stream.processing"));
    setResultColor("black");

    try {
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) throw new Error(t("stream.canvas_error"));

      canvasRef.current.width = 640;
      canvasRef.current.height = 480;

      ctx.drawImage(videoRef.current, 0, 0, 640, 480);
      const dataUrl = canvasRef.current.toDataURL("image/jpeg");

      const response = await fetch("http://127.0.0.1:8000/api/attendance/stream-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });

      if (!response.ok) throw new Error(t("stream.server_error", { code: response.status }));

      const data = await response.json();
      setRecognitionData(data.data || null);

      if (data.message) {
        setResultMessage(data.message);
        setResultColor(data.success ? "green" : "red");
      }
    } catch (error) {
      setResultMessage(t("stream.recognition_error", { error: (error as Error).message }));
      setResultColor("red");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    function loop(time: number) {
      if (!pauseCapture) {
        if (time - lastCaptureTimeRef.current > 1500) {
          captureAndSend();
          lastCaptureTimeRef.current = time;
        }
        animationFrameRef.current = requestAnimationFrame(loop);
      }
    }

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [pauseCapture]);

  const handleConfirm = async (confirmed: boolean) => {
    if (!recognitionData?.student_id) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/attendance/attendance/confirm", {
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
            ? t("stream.confirm_success", {
                name: recognitionData.full_name,
                id: recognitionData.student_id,
              })
            : t("stream.confirm_cancel")
        );
        setResultColor(confirmed ? "green" : "red");
        setRecognitionData(null);
        setPauseCapture(false);
      } else {
        setResultMessage(data.message || t("stream.confirm_failed"));
        setResultColor("red");
      }
    } catch (error) {
      setResultMessage(t("stream.confirm_error", { error: (error as Error).message }));
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
            {t("stream.waiting_recognition")}
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
          {resultMessage || t("stream.waiting_text")}
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
