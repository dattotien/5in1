import React from "react";
import { Card, Typography, Switch, Divider } from "antd";

const { Title, Paragraph } = Typography;

const Settings: React.FC = () => {
  // Giả lập các tùy chọn cài đặt
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [autoSave, setAutoSave] = React.useState(true);

  return (
    <>
      <Title level={2}>CÀI ĐẶT CHUNG</Title>
      <Divider />

      <Paragraph>
        Tại đây bạn có thể điều chỉnh các thiết lập cá nhân hóa cho tài khoản và
        trải nghiệm sử dụng.
      </Paragraph>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <span>Chế độ tối (Dark Mode)</span>
        <Switch checked={darkMode} onChange={setDarkMode} />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <span>Nhận thông báo</span>
        <Switch checked={notifications} onChange={setNotifications} />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <span>Tự động lưu dữ liệu</span>
        <Switch checked={autoSave} onChange={setAutoSave} />
      </div>

      {/* Bạn có thể thêm nút lưu nếu cần */}
      </>
  );
};

export default Settings;
