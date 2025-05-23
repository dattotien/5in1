import React, { useState } from "react";
import { List, Button, Modal, Form, Input } from "antd";
import { useEffect } from "react";
import axios from "axios";
type RequestType = {
  student_id: string;
  heading: string;
  message: string;
  handled: boolean;
  create_at: string;
  handled_at?: string;
  response?: string;
};

function FeedBackResponse() {
  const [data, setData] = useState<RequestType[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<RequestType | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/get_requests"
        );
        const result = Object.values(response.data.data || {});
        setData(result as RequestType[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDetail = (item: RequestType) => {
    console.log("Chi tiết item:", item);
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
        console.log(selected?.heading);
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

  return (
    <>
      <List
        pagination={{ position: "bottom", align: "center" }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            style={{
              background: item.handled ? "#e6fffb" : undefined, // xanh nhạt nếu đã xử lý
              transition: "background 0.3s",
            }}
            actions={[
              <Button
                key="detail"
                type="link"
                onClick={() => handleDetail(item)}
              >
                Xem chi tiết
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={<p>{item.heading}</p>}
              description={`Ngày gửi: ${new Date(
                item.create_at
              ).toLocaleString()}`}
            />
          </List.Item>
        )}
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
    </>
  );
}

export default FeedBackResponse;
