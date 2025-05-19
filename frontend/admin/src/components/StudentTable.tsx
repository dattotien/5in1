import React, { useEffect, useState } from "react";
import { Table, Image, Typography, message, ConfigProvider } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";

const { Text } = Typography;

// ====== Kiểu dữ liệu ======
interface Student {
  student_id: string;
  name: string;
  full_name: string;
  image_encoding?: number[];
  image?: string;
  created_at: string;
  updated_at: string;
}

interface ResponseModel<T> {
  data: T;
  message: string;
  success: boolean;
}

// ====== Component chính ======
const StudentTable: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await axios.get<ResponseModel<Student[]>>(
          "http://127.0.0.1:8000/api/admin/get-all-students"
        );
        setStudents(
          res.data.data && typeof res.data.data === "object"
            ? Object.values(res.data.data)
            : []
        );
      } catch (error) {
        console.error(error);
        message.error("Không thể tải danh sách sinh viên.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);
  const columns: ColumnsType<Student> = [
    {
      title: "Mã SV",
      dataIndex: "student_id",
      key: "student_id",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Họ tên đầy đủ",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (image?: string) =>
        image ? (
          <Image
            width={40}
            src={image}
            alt="avatar"
            style={{ borderRadius: "50%" }}
          />
        ) : (
          <Text type="secondary">Không có ảnh</Text>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
    },
  ];

  return (
    <ConfigProvider>
      <div style={{ padding: 24 }}>
        <h2>Danh sách sinh viên</h2>
        <Table
          columns={columns}
          dataSource={students}
          rowKey="student_id"
          loading={loading}
          bordered
        />
      </div>
    </ConfigProvider>
  );
};

export default StudentTable;
