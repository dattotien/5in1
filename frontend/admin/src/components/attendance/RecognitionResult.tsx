import React from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  if (!data || !data.student_id) {
    return (
      <div style={{ fontStyle: "italic", color: "#888" }}>
        {t("recognition.no_data")}
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
      <h3>{t("recognition.student_info")}</h3>
      <p><strong>{t("recognition.full_name")}:</strong> {data.full_name}</p>
      <p><strong>{t("recognition.student_id")}:</strong> {data.student_id}</p>

      {data.need_confirm && (
        <div style={{ marginTop: 12 }}>
          <p>{t("recognition.confirm_question")}</p>
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
            {t("recognition.confirm")}
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
            {t("recognition.cancel")}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecognitionResult;
