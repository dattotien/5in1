import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import './FeedbackForm.css';

const FeedbackForm: React.FC = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const res = await fetch("/api/feedbacks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      setTitle("");
      setContent("");
      alert(t("feedbackForm.successMessage"));
    } else {
      alert(t("feedbackForm.failureMessage"));
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <label>
        {t("feedbackForm.titleLabel")} <span className="required">{t("feedbackForm.requiredMark")}</span>
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t("feedbackForm.titlePlaceholder")}
        required
      />

      <label>
        {t("feedbackForm.contentLabel")} <span className="required">{t("feedbackForm.requiredMark")}</span>
      </label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t("feedbackForm.contentPlaceholder")}
        rows={6}
        required
      />

      <button type="submit">{t("feedbackForm.submitButton")}</button>
    </form>
  );
};

export default FeedbackForm;
