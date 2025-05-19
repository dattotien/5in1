import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from 'antd';
import { CameraOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import './WebcamCapture.css';

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  return (
    <div className="webcam-container">
      <div className="camera-view">
        {isCameraOn ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam-video"
            videoConstraints={{ facingMode: 'user' }}
          />
        ) : (
          <div className="webcam-placeholder">
            <VideoCameraAddOutlined className="camera-off-icon" />
            <p>Camera đang tắt</p>
          </div>
        )}
      </div>
      
      <Button
        type="primary"
        icon={isCameraOn ? <VideoCameraAddOutlined /> : <CameraOutlined />}
        onClick={() => setIsCameraOn(!isCameraOn)}
        className="toggle-camera-btn"
      >
        {isCameraOn ? 'Tắt camera' : 'Bật camera'}
      </Button>
    </div>
  );
}