import { Card, Typography, Button, Avatar } from "antd";
import { useState, useRef } from "react";
import Webcam from "react-webcam";
import { PoweroffOutlined, VideoCameraOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Attendance = () => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isNotMe, setIsNotMe] = useState(false);
  const webcamRef = useRef(null);

  const handleTurnOffCamera = () => {
    const stream = webcamRef.current?.video?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setIsCameraOn(false);
    }
  };

  const handleTurnOnCamera = () => {
    setIsCameraOn(true);
  };

  const handleToggleNotMe = () => {
    setIsNotMe(!isNotMe);
  };

  return (
    <Card
      title="Điểm danh"
      style={{
        width: "100%",
        padding: "24px",
        borderRadius: "8px",
        minHeight: "520px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        {/* Camera */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ position: "relative", width: "100%", margin: "0 auto" }}>
            {isCameraOn ? (
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
                style={{
                  width: "100%",
                  height: "500px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "500px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "#f0f0f0",
                  borderRadius: "8px",
                }}
              >
                <Text>Camera đã tắt</Text>
              </div>
            )}

            {/* Nút bật/tắt camera */}
            <div style={{ marginTop: 12, textAlign: "center" }}>
              {isCameraOn ? (
                <PoweroffOutlined
                  style={{ fontSize: 24, color: "red", cursor: "pointer" }}
                  onClick={handleTurnOffCamera}
                />
              ) : (
                <VideoCameraOutlined
                  style={{ fontSize: 24, color: "#1890ff", cursor: "pointer" }}
                  onClick={handleTurnOnCamera}
                />
              )}
            </div>
          </div>
        </div>

        {/* Student Info */}
        <div style={{ flex: 1, textAlign: "center", marginLeft: "20px" }}>
          <Avatar size={100} src="/avatar.png" />
          <div style={{ marginTop: 12 }}>
            <Title level={4}>Tô Tiến Đạt</Title>
            <Text>Mã sinh viên: 23020353</Text>
          </div>

          <Button
            type="primary"
            size="large"
            style={{ marginTop: 24 }}
            disabled={isNotMe}
          >
            Xác nhận
          </Button>

          <div style={{ marginTop: 12 }}>
            <Text
              style={{ color: "#1890ff", cursor: "pointer", fontWeight: 500 }}
              onClick={handleToggleNotMe}
            >
              Sai thông tin?
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Attendance;
