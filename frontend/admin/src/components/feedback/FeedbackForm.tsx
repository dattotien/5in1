import React, { useState } from "react";
import './FeedbackForm.css';

const FeedbackForm: React.FC = () => {
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
      alert("Gửi thành công!");
    } else {
      alert("Gửi thất bại!");
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <label>
        Tiêu đề <span className="required">*</span>
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nhập tiêu đề..."
        required
      />

      <label>
        Nội dung <span className="required">*</span>
      </label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Nhập nội dung góp ý..."
        rows={6}
        required
      />

      <button type="submit">Gửi</button>
    </form>
  );
};

export default FeedbackForm;
