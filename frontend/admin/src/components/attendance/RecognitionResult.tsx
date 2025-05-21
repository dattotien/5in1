import React from "react";

interface RecognitionData {
  student_id?: string;
  full_name?: string;
  frame?: string;
  need_confirm?: boolean;
  message?: string;
  success?: boolean;
}

interface Props {
  data: RecognitionData | null;
  onConfirm: (confirmed: boolean) => void;
  isConfirming: boolean;
}

const RecognitionResult: React.FC<Props> = ({ data, onConfirm, isConfirming }) => {
  if (!data || !data.student_id) {
    return (
      <div style={{ fontStyle: "italic", color: "#888" }}>
        Không có thông tin sinh viên nhận diện
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 16,
        borderRadius: 8,
        backgroundColor: "#f5f5f5",
      }}
    >
      <h3>Thông tin sinh viên</h3>
      <p><strong>Họ tên:</strong> {data.full_name}</p>
      <p><strong>Mã sinh viên:</strong> {data.student_id}</p>

      {data.need_confirm && (
        <div style={{ marginTop: 12 }}>
          <p>Bạn có muốn xác nhận điểm danh?</p>
          <button
            onClick={() => onConfirm(true)}
            disabled={isConfirming}
            style={{
              marginRight: 10,
              padding: "6px 12px",
              backgroundColor: "#4caf50",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Xác nhận
          </button>
          <button
            onClick={() => onConfirm(false)}
            disabled={isConfirming}
            style={{
              padding: "6px 12px",
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Hủy
          </button>
        </div>
      )}
    </div>
  );
};

export default RecognitionResult;