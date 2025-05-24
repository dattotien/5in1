import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Pagination, Tag } from "antd";
import axios from "axios";
import "./FeedBackResponse.css";
import type { ColumnType } from "antd/es/table";

type RequestType = {
  student_id: string;
  heading: string;
  message: string;
  handled: boolean;
  create_at: string;
  handled_at?: string;
  response?: string;
  full_name?: string; // Thêm nếu có
};

function FeedBackResponse() {
  const [data, setData] = useState<RequestType[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<RequestType | null>(null);
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/get_requests"
        );
        const result = response.data.data || [];

        const requestsWithName = await Promise.all(
          result.map(async (item: RequestType) => {
            try {
              const res = await axios.get(
                `http://127.0.0.1:8000/api/admin/get-student/${item.student_id}`
              );
              return { ...item, full_name: res.data.data.full_name || "" };
            } catch {
              return { ...item, full_name: "" };
            }
          })
        );
        setData(requestsWithName as RequestType[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDetail = (item: RequestType) => {
    setSelected(item);
    setOpenModal(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setOpenModal(false);
    setSelected(null);
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          await axios.put("http://127.0.0.1:8000/api/user/update_request", {
            student_id: selected?.student_id,
            heading: selected?.heading,
            message: selected?.message,
            response: values.response,
          });
          setOpenModal(false);
          setSelected(null);
          form.resetFields();
          window.location.reload();
        } catch (error) {
          console.error("Error updating request:", error);
        }
      })
      .catch(() => {});
  };

  const columns: ColumnType<RequestType>[] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, idx: number) =>
        (current - 1) * pageSize + idx + 1,
      width: 60,
      align: "center",
    },
    {
      title: "Mã sinh viên",
      dataIndex: "student_id",
      key: "student_id",
      width: 130,
      align: "center",
      sorter: (a: RequestType, b: RequestType) =>
        a.student_id.localeCompare(b.student_id),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Tên đầy đủ",
      dataIndex: "full_name",
      key: "full_name",
      width: 180,
      align: "center",
      render: (_: any, record: RequestType) => record.full_name || "",
    },
    {
      title: "Tiêu đề feedback",
      dataIndex: "heading",
      key: "heading",
      width: 400,
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "handled",
      key: "handled",
      width: 200,
      align: "center",
      filters: [
        { text: "Đã xử lý", value: true },
        { text: "Chưa xử lý", value: false },
      ],
      onFilter: (value: boolean | React.Key, record: RequestType) =>
        record.handled === Boolean(value),
      render: (handled: boolean) =>
        handled ? (
          <Tag color="green">Đã xử lý</Tag>
        ) : (
          <Tag color="red">Chưa xử lý</Tag>
        ),
    },
    {
      title: "Hành động",
      onFilter: (value: boolean | React.Key, record: RequestType) =>
        record.handled === Boolean(value),
      align: "center",
      render: (_: any, record: RequestType) => (
        <Button type="link" onClick={() => handleDetail(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const paginatedData = data.slice(
    (current - 1) * pageSize,
    current * pageSize
  );

  return (
    <div className="feedback-container">
      <h1>Danh sách phản hồi sinh viên</h1>
      <Table
        className="admin-feedback-table"
        columns={columns}
        dataSource={paginatedData}
        rowKey={(record) => record.student_id + record.heading}
        loading={loading}
        pagination={false}
        bordered
      />
      <Pagination
        style={{ alignSelf: "center", margin: "24px 0" }}
        current={current}
        pageSize={pageSize}
        total={data.length}
        onChange={setCurrent}
      />
      <Modal
        open={openModal}
        title={selected ? selected.heading : ""}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="ok" type="primary" onClick={handleOk}>
            Xác nhận
          </Button>,
        ]}
      >
        <p>
          <b>Nội dung:</b> {selected?.message}
        </p>
        <Form form={form} layout="vertical">
          <Form.Item
            name="response"
            label="Phản hồi"
            rules={[{ required: true, message: "Vui lòng nhập phản hồi!" }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập phản hồi..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default FeedBackResponse;
