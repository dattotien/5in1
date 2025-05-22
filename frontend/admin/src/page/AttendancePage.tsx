import "./AttendancePage.css";
import AttendanceTabs from "../components/attendance/AttendanceTabs";
import { useTranslation } from "react-i18next";

export default function AttendancePage() {
  const { t } = useTranslation();

  return (
    <div className="attendance-page">
      <h2>{t("attendance_page.title")}</h2>
      <AttendanceTabs />
    </div>
  );
}
