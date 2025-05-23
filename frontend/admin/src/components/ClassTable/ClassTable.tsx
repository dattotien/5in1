import React, { useState, useEffect } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";

interface Attendace {
  key: string;
  student_id: string;
  name: string;
  create_at: string;
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
  },
];

function ClassTable() {
  const [Attendance, setAttendance] = useState<Attendace[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/attendance/get-all-attendances"
        );
        const rawData = res.data.data;
        let flatData: Omit<Attendace, "name">[] = [];
        let idx = 1;
        Object.values(rawData).forEach((arr: any) => {
          arr.forEach((item: any) => {
            flatData.push({
              key: idx.toString(),
              student_id: item.student_id,
              create_at: item.create_at,
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
    <Table
      columns={columns}
      dataSource={Attendance}
      loading={loading}
      rowKey="key"
    />
  );
}

export default ClassTable;
