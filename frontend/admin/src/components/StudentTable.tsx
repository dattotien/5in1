import React, { useEffect, useState } from "react";
import {
  Table,
  Image,
  Typography,
  message,
  ConfigProvider,
  Button,
  Modal,
  Form,
  Input,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import "./StudentTable.css";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const handleAddStudent = () => {
    setModalOpen(true);
    form.resetFields();
  };

  // Đưa fetchStudents ra ngoài để có thể gọi ở nhiều nơi
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

  useEffect(() => {
    fetchStudents();
  }, []);
  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      const file = values.image?.[0]?.originFileObj;
      let image_base64 = "";
      if (file) {
        // Đọc file thành base64
        image_base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file); // sẽ ra dạng data:image/jpeg;base64,...
        });
      }
      // Ghép thông tin sinh viên
      const studentData = {
        student_id: values.student_id,
        name: values.ten,
        full_name: `${values.ho} ${values.dem} ${values.ten}`,
        image_base64: image_base64, // truyền base64 vào đây
        // Thêm các trường khác nếu cần
      };

      try {
        await axios.post(
          "http://127.0.0.1:8000/api/admin/add-student",
          studentData
        );
        message.success("Thêm sinh viên thành công!");
        setModalOpen(false);
        form.resetFields();
        // Reload lại danh sách sinh viên
        // (Gọi lại fetchStudents hoặc reload)
        fetchStudents();
      } catch (error) {
        console.error(error);
        message.error("Không thể thêm sinh viên.");
      }
    });
  };
  const columns: ColumnsType<Student> = [
    {
      title: "Mã SV",
      dataIndex: "student_id",
      key: "student_id",
      sorter: (a, b) => a.student_id.localeCompare(b.student_id),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Họ tên đầy đủ",
      dataIndex: "full_name",
      key: "full_name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
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
    {
      title: "Action",
      key: "action",
      render: (_, record) => <a>Chỉnh sửa</a>,
    },
  ];

  return (
    <ConfigProvider>
      <div style={{ padding: 24 }}>
        <div className="student-table-header">
          <h1>Danh sách sinh viên</h1>
          <Button onClick={handleAddStudent}>Thêm sinh viên</Button>
        </div>

        <Table
          columns={columns}
          dataSource={students}
          rowKey="student_id"
          loading={loading}
          bordered
        />
        <Modal
          title="Thêm sinh viên"
          open={modalOpen}
          onOk={handleModalOk}
          onCancel={() => setModalOpen(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Mã sinh viên"
              name="student_id"
              rules={[
                { required: true, message: "Vui lòng nhập mã sinh viên" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Họ"
              name="ho"
              rules={[{ required: true, message: "Vui lòng nhập họ" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Tên đệm"
              name="dem"
              rules={[{ required: true, message: "Vui lòng nhập họ đệm" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Tên"
              name="ten"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Ảnh sinh viên"
              name="image"
              valuePropName="fileList"
              getValueFromEvent={(e) =>
                Array.isArray(e) ? e : e && e.fileList
              }
              rules={[{ required: true, message: "Vui lòng chọn ảnh" }]}
            >
              <Upload
                listType="picture"
                maxCount={1}
                beforeUpload={() => false} // Ngăn upload tự động, chỉ lấy file trong form
              >
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </Form.Item>
            {/* Thêm các trường khác nếu cần */}
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default StudentTable;
