import React, { useState, useEffect } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import { Button } from "antd";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
interface Attendace {
  key: string;
  student_id: string;
  name: string;
  create_at: string; // hiển thị
  create_at_raw: string; // dùng để sort
}

const columns: ColumnsType<Attendace> = [
  {
    title: "STT",
    dataIndex: "key",
    key: "key",
  },
  {
    title: "Mã sinh viên",
    dataIndex: "student_id",
    key: "student_id",
    sorter: (a, b) => a.student_id.localeCompare(b.student_id),
  },
  {
    title: "Tên sinh viên",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Thời gian điểm danh",
    dataIndex: "create_at",
    key: "create_at",
    sorter: (a, b) =>
      new Date(a.create_at_raw).getTime() - new Date(b.create_at_raw).getTime(),
  },
];
function Attendance() {
  const [Attendance, setAttendance] = useState<Attendace[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const exportToExcel = () => {
    // Đổi tên trường thành tên cột hiển thị
    const data = Attendance.map((item) => ({
      STT: item.key,
      "Mã sinh viên": item.student_id,
      "Tên sinh viên": item.name,
      "Thời gian điểm danh": item.create_at,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "attendance.xlsx");
  };
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/attendance/get-all-attendances"
        );
        const rawData = res.data.data;
        console.log(rawData);
        let flatData: Omit<Attendace, "name">[] = [];
        let idx = 1;
        Object.values(rawData).forEach((arr: any) => {
          arr.forEach((item: any) => {
            flatData.push({
              key: idx.toString(),
              student_id: item.student_id,
              create_at: item.create_at,
              create_at_raw: item.create_at,
            });
            idx++;
          });
        });
        const studentIds = Array.from(
          new Set(flatData.map((item) => item.student_id))
        );

        const nameMap: Record<string, string> = {};
        await Promise.all(
          studentIds.map(async (id) => {
            try {
              const res = await axios.get(
                `http://127.0.0.1:8000/api/admin/get-student/${id}`
              );
              nameMap[id] = res.data?.data?.full_name || "";
            } catch {
              nameMap[id] = "";
            }
          })
        );
        const dataWithName: Attendace[] = flatData.map((item) => ({
          ...item,
          name: nameMap[item.student_id] || "",
          create_at: new Date(item.create_at).toLocaleString("vi-VN", {
            hour12: false,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          create_at_raw: item.create_at, // giữ nguyên chuỗi gốc để sort
        }));

        setAttendance(dataWithName);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);
  return (
    <>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>Danh sách điểm danh</h1>
          <Button
            onClick={exportToExcel}
            type="primary"
            style={{ marginBottom: 16 }}
          >
            Xuất Excel
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={Attendance}
          loading={loading}
          rowKey="key"
        />
      </div>
    </>
  );
}
export default Attendance;
