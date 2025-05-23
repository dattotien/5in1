import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./FeedbackList.css";

interface FeedbackItem {
  title: string;
  content: string;
  status: string;
}

const FeedbackList: React.FC = () => {
  const { t } = useTranslation();
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    const mockData: FeedbackItem[] = [
      {
        title: "Improve classroom facilities",
        content: "The projectors are blurry and need replacement.",
        status: "Pending",
      },
      {
        title: "Add more parking space",
        content: "There's not enough parking for students' motorbikes.",
        status: "Resolved",
      },
      {
        title: "Cafeteria food quality",
        content: "The meals are expensive but low quality.",
        status: "Rejected",
      },
    ];

    setFeedbacks(mockData);
  }, []);

  return (
    <div className="feedback-list">
      <table>
        <thead>
          <tr>
            <th>{t("feedbackList.no")}</th>
            <th>{t("feedbackList.title")}</th>
            <th>{t("feedbackList.status")}</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((fb, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{fb.title}</td>
              <td>
                <span className={`status ${fb.status.toLowerCase()}`}>
                  {t(`feedbackList.statuses.${fb.status.toLowerCase()}`) || fb.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackList;
