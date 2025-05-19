import React from "react";
import "./RecognitionResult.css";

const RecognitionResult: React.FC = () => {
  // Dữ liệu mẫu - sau này bạn có thể truyền prop hoặc lấy từ state
  const recognizedStudent = {
    msv: "21020001",
    name: "Nguyễn Văn A",
    status: "Đã điểm danh", // hoặc "Chưa điểm danh"
  };

  return (
    <div className="recognition-result">
      <h3>Kết quả nhận diện</h3>
      <div className="info-item">
        <span className="label">MSV:</span>
        <span className="value">{recognizedStudent.msv}</span>
      </div>
      <div className="info-item">
        <span className="label">Họ tên:</span>
        <span className="value">{recognizedStudent.name}</span>
      </div>
      <div className={`info-item status ${recognizedStudent.status === "Đã điểm danh" ? "checked" : "unchecked"}`}>
        <span className="label">Trạng thái:</span>
        <span className="value">{recognizedStudent.status}</span>
      </div>
    </div>
  );
};

export default RecognitionResult;
