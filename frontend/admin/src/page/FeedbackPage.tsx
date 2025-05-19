import './FeedbackPage.css';

export default function FeedbackPage() {
  return (
    <div className="feedback-page">
      <div className="feedback-container">
        <h2>Feedback</h2>
        <div className="feedback-form">
          <label>
            Tiêu đề <span className="required">*</span>
          </label>
          <input type="text" placeholder="Nhập tiêu đề..." required />

          <label>
            Nội dung <span className="required">*</span>
          </label>
          <textarea placeholder="Nhập nội dung góp ý..." rows={6} required />

          <button type="submit">Gửi</button>
        </div>
      </div>
    </div>
  );
}
