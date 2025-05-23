import './AttendanceList.css';
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface AttendanceItem {
  student_id: string;
  full_name: string;
  status: boolean;
  time: string;
}

interface ResponseModel {
  success: boolean;
  message: string;
  data: {
    [studentId: string]: {
      student_id: string;
      full_name: string;
      status: boolean;
      create_at: string;
    }[];
  };
}

export default function AttendanceList() {
  const { t } = useTranslation();
  const [attendances, setAttendances] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/attendance/get-all-attendances")
      .then(res => res.json())
      .then((data: ResponseModel) => {
        if (data.success) {
          const flatList: AttendanceItem[] = [];
          Object.values(data.data).forEach((records) => {
            records.forEach(record => {
              flatList.push({
                student_id: record.student_id,
                full_name: record.full_name,
                status: record.status,
                time: record.create_at
              });
            });
          });
          setAttendances(flatList);
        } else {
          setError(data.message);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>{t("attendanceList.loading")}</div>;
  if (error) return <div>{t("attendanceList.error", { error })}</div>;

  return (
    <div className="attendance-list">
      <table>
        <thead>
          <tr>
            <th>{t("attendanceList.studentId")}</th>
            <th>{t("attendanceList.fullName")}</th>
            <th>{t("attendanceList.status")}</th>
            <th>{t("attendanceList.time")}</th>
          </tr>
        </thead>
        <tbody>
          {attendances.map((item, index) => (
            <tr key={index}>
              <td>{item.student_id}</td>
              <td>{item.full_name}</td>
              <td>{item.status ? t("attendanceList.present") : t("attendanceList.absent")}</td>
              <td>{new Date(item.time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
