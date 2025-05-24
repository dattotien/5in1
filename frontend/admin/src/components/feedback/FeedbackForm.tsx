import React, { useState, useEffect } from "react";
import './FeedbackForm.css';
import { useTranslation } from "react-i18next";

const FeedbackForm: React.FC = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const studentId = localStorage.getItem("student_id");
    if (!studentId || !title || !content) {
      setMessage({ type: "error", text: t("feedbackForm.fillAllFields") });
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/user/send_request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          heading: title,
          message: content,
        }),
      });

      if (res.ok) {
        setTitle("");
        setContent("");
        setMessage({ type: "success", text: t("feedbackForm.success") });
      } else {
        setMessage({ type: "error", text: t("feedbackForm.fail") });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: t("feedbackForm.errorOccurred") });
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <label>
        {t("feedbackForm.title")} <span className="required">*</span>
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t("feedbackForm.titlePlaceholder")}
        required
      />

      <label>
        {t("feedbackForm.content")} <span className="required">*</span>
      </label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t("feedbackForm.contentPlaceholder")}
        rows={6}
        required
      />

      <button type="submit">{t("feedbackForm.submit")}</button>

      {message && (
        <div className={`form-message ${message.type}`}>
          {message.text}
        </div>
      )}
    </form>
  );
};

export default FeedbackForm;
