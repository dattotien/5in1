// WebcamCapture.tsx
import React from "react";

interface WebcamCaptureProps {
  frameSrc?: string;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ frameSrc }) => {
  return (
    <div style={{ 
      width: "100%", 
      height: "480px", 
      borderRadius: "8px", 
      border: "4px solid #3b82f6",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f0f0f0"
    }}>
      {frameSrc ? (
        <img
          src={frameSrc}
          alt="Frame nhận diện"
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "contain" 
          }}
        />
      ) : (
        <div style={{ color: "#666", textAlign: "center" }}>
          Đang chờ nhận diện...
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
