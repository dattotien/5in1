import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./FeedbackList.css";

interface FeedbackItem {
  student_id?: string;
  title: string;
  content: string;
  createdAt?: string;
  handled: boolean;
  handledAt?: string | null;
  response?: string | null;
}
interface FeedbackListProps {
  activeTab: string;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ activeTab }) => {
  const { t } = useTranslation();
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "status" | "createdAt" | "">(
    ""
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const studentId = localStorage.getItem("student_id");

  useEffect(() => {
    async function fetchFeedbacks() {
      if (!studentId) {
        console.warn("No student_id found in localStorage");
        return;
      }

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/user/get_requests/${studentId}`
        );
        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();

        if (json.success && json.data) {
          const dataArray: FeedbackItem[] = [];

          for (const heading in json.data) {
            const item = json.data[heading];
            const feedback: FeedbackItem = {
              student_id: item.student_id,
              title: item.heading || heading,
              content: item.message || "",
              createdAt: item.create_at,
              handled: item.handled,
              handledAt: item.handled_at,
              response: item.response,
            };

            dataArray.push(feedback);
          }

          setFeedbacks(dataArray);
        } else {
          setFeedbacks([]);
        }
      } catch (error) {
        console.error("Fetch feedbacks error:", error);
        setFeedbacks([]);
      }
    }

    fetchFeedbacks();
  }, [studentId, activeTab]);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const filtered = feedbacks.filter(
    (fb) =>
      fb.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "status") {
      return Number(a.handled) - Number(b.handled);
    } else if (sortBy === "createdAt") {
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    }
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = sorted.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="feedback-list">
      <div className="feedback-controls">
        <input
          type="text"
          placeholder={t("feedbackListPage.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          onChange={(e) => {
            setSortBy(e.target.value as "title" | "status" | "createdAt" | "");
            setCurrentPage(1);
          }}
          value={sortBy}
        >
          <option value="">{t("feedbackListPage.sort.label")}</option>
          <option value="createdAt">
            {t("feedbackListPage.sort.createdAt")}
          </option>
          <option value="title">{t("feedbackListPage.sort.title")}</option>
          <option value="status">{t("feedbackListPage.sort.status")}</option>
        </select>
      </div>

      <p style={{ marginBottom: "10px" }}>
        {t("feedbackListPage.totalRequests", { count: filtered.length })}
      </p>

      <table>
        <thead>
          <tr>
            <th>{t("feedbackListPage.table.no")}</th>
            <th>{t("feedbackListPage.table.studentId")}</th>
            <th>{t("feedbackListPage.table.title")}</th>
            <th>{t("feedbackListPage.table.status")}</th>
            <th>{t("feedbackListPage.table.action")}</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((fb, idx) => {
            const globalIdx = startIdx + idx;
            return (
              <React.Fragment key={globalIdx}>
                <tr>
                  <td>{globalIdx + 1}</td>
                  <td>{fb.student_id}</td>
                  <td>{fb.title}</td>
                  <td
                    className={`status ${fb.handled ? "resolved" : "pending"}`}
                  >
                    {fb.handled
                      ? t("feedbackListPage.table.statusResolved")
                      : t("feedbackListPage.table.statusPending")}
                  </td>
                  <td>
                    <span
                      onClick={() => toggleExpand(globalIdx)}
                      className="toggle-detail"
                      aria-expanded={expandedIndex === globalIdx}
                      style={{ cursor: "pointer", color: "#1e40af" }}
                    >
                      {expandedIndex === globalIdx
                        ? t("feedbackListPage.table.toggleHide")
                        : t("feedbackListPage.table.toggleShow")}
                    </span>
                  </td>
                </tr>
                {expandedIndex === globalIdx && (
                  <tr>
                    <td colSpan={5} className="detail-row">
                      <strong>{t("feedbackListPage.detail.content")}:</strong>{" "}
                      {fb.content} <br />
                      <strong>
                        {t("feedbackListPage.detail.createdAt")}:
                      </strong>{" "}
                      {fb.createdAt
                        ? new Date(fb.createdAt).toLocaleString()
                        : t("feedbackListPage.detail.notAvailable")}{" "}
                      <br />
                      <strong>
                        {t("feedbackListPage.detail.handledAt")}:
                      </strong>{" "}
                      {fb.handledAt
                        ? new Date(fb.handledAt).toLocaleString()
                        : t("feedbackListPage.detail.notAvailable")}{" "}
                      <br />
                      <strong>
                        {t("feedbackListPage.detail.response")}:
                      </strong>{" "}
                      {fb.response || t("feedbackListPage.detail.noResponse")}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              padding: "6px 12px",
              backgroundColor: currentPage === i + 1 ? "#1e3a8a" : "#f1f5f9",
              color: currentPage === i + 1 ? "white" : "#1e3a8a",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: currentPage === i + 1 ? "bold" : "normal",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;
