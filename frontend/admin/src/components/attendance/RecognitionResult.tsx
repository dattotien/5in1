// RecognitionResult.tsx
import React from "react";

interface RecognitionResultProps {
  data?: {
    student_id?: string;
    full_name?: string;
    need_confirm?: boolean;
  };
  onConfirm: (confirmed: boolean) => void;
  isConfirming: boolean;
}

const RecognitionResult: React.FC<RecognitionResultProps> = ({ 
  data, 
  onConfirm, 
  isConfirming 
}) => {
  if (!data || !data.need_confirm) {
    return (
      <div style={{ 
        padding: "12px", 
        border: "1px solid #ddd", 
        borderRadius: "8px", 
        backgroundColor: "#fafafa" 
      }}>
        <p>Chưa có sinh viên cần xác nhận</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "12px", 
      border: "1px solid #ddd", 
      borderRadius: "8px", 
      backgroundColor: "#fafafa" 
    }}>
      <h3 style={{ marginBottom: "12px", fontSize: "1.2rem" }}>Kết quả nhận diện</h3>
      <p><strong>Họ và tên:</strong> {data.full_name || "Không rõ"}</p>
      <p><strong>MSV:</strong> {data.student_id || "Không rõ"}</p>

      <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
        <button
          disabled={isConfirming}
          onClick={() => onConfirm(true)}
          style={{ 
            padding: "6px 12px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            opacity: isConfirming ? 0.7 : 1
          }}
        >
          Xác nhận
        </button>
        <button
          disabled={isConfirming}
          onClick={() => onConfirm(false)}
          style={{ 
            padding: "6px 12px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            opacity: isConfirming ? 0.7 : 1
          }}
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

export default RecognitionResult;
