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
import { UploadOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Space, Popconfirm } from "antd";
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
  const [modalOpen1, setModalOpen1] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const handleAddStudent = () => {
    setModalOpen(true);
    form.resetFields();
  };
  const handleSearch = (value: string) => {
    setSearchText(value);
    if (!value) {
      setFilteredStudents(students);
      return;
    }
    const lowerValue = value.toLowerCase();
    setFilteredStudents(
      students.filter(
        (s) =>
          s.student_id.toLowerCase().includes(lowerValue) ||
          s.full_name.toLowerCase().includes(lowerValue)
      )
    );
  };
  const handleModalOk1 = () => {
    form1.validateFields().then(async (values) => {
      let image_base64 = undefined;
      const fileObj = values.image?.[0]?.originFileObj;

      if (fileObj) {
        // Nếu chọn ảnh mới
        image_base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(fileObj);
        });
      }
      // Nếu không chọn ảnh mới, KHÔNG gửi image_base64 (backend sẽ giữ ảnh cũ)

      const studentData: any = {
        student_id: values.student_id,
        name: values.ten,
        full_name: `${values.ho} ${values.dem} ${values.ten}`,
      };
      if (image_base64) studentData.image_base64 = image_base64;

      try {
        const res = await axios.put(
          `http://127.0.0.1:8000/api/admin/update-student/${values.student_id}`,
          studentData
        );
        message.success(res.data.message);
        fetchStudents();
        setModalOpen1(false);
      } catch (error) {
        console.error(error);
        message.error("Không thể chỉnh sửa sinh viên.");
      }
    });
  };
  const handleDeleteStudent = async (record: Student) => {
    try {
      const res = await axios.delete(
        `http://127.0.0.1:8000/api/admin/delete-student/${record.student_id}`
      );
      message.success(res.data.message);
      fetchStudents();
    } catch (error) {
      console.error(error);
      message.error("Không thể xóa sinh viên.");
    }
  };
  const handleChangeClick = (record: Student) => {
    setModalOpen1(true);

    const [ho = "", dem = "", ten = ""] = record.full_name
      ? record.full_name.split(" ").length > 2
        ? [
            record.full_name.split(" ")[0],
            record.full_name.split(" ").slice(1, -1).join(" "),
            record.full_name.split(" ").slice(-1)[0],
          ]
        : record.full_name.split(" ")
      : ["", "", ""];

    // Chuẩn bị ảnh cho Upload (nếu có)
    const imageFileList = record.image
      ? [
          {
            uid: "-1",
            name: "avatar.png",
            status: "done",
            url: record.image,
          },
        ]
      : [];

    form1.setFieldsValue({
      student_id: record.student_id,
      ho,
      dem,
      ten,
      image: imageFileList,
    });
  };

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
  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);
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
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleChangeClick(record)}>Chỉnh sửa</Button>
          <Popconfirm
            cancelText="Hủy"
            okText="Xác nhận"
            onConfirm={() => handleDeleteStudent(record)}
            title="Xóa sinh viên"
            description={
              <>
                <p>Bạn có chắc muốn xóa sinh viên này?</p>
                <p>Thông tin khi đã xóa không thể khôi phục.</p>
              </>
            }
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button danger>Xóa sinh viên</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider>
      <div style={{ padding: 24 }}>
        <div className="student-table-header">
          <h1>Danh sách sinh viên</h1>
          <div>
            <Input.Search
              placeholder="Tìm kiếm theo mã SV hoặc họ tên"
              allowClear
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300, marginRight: 16 }}
              value={searchText}
            />
            <Button onClick={handleAddStudent}>Thêm sinh viên</Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredStudents}
          rowKey="student_id"
          loading={loading}
          bordered
        />
        <Modal
          title="Chỉnh sửa sinh viên"
          open={modalOpen1}
          onOk={handleModalOk1}
          onCancel={() => setModalOpen1(false)}
        >
          <Form form={form1} layout="vertical">
            <Form.Item
              label="Mã sinh viên"
              name="student_id"
              rules={[{ required: true, message: "Vui nhập má sinh viên" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Họ"
              name="ho"
              rules={[{ required: true, message: "Vui nhập họ" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Tên đệm"
              name="dem"
              rules={[{ required: true, message: "Vui nhập tên đệm" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Tên"
              name="ten"
              rules={[{ required: true, message: "Vui nhập tên" }]}
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
            >
              <Upload
                listType="picture"
                maxCount={1}
                beforeUpload={() => false} // Ngăn upload tự động, chỉ lấy file trong form
              >
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
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
