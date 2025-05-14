import React, { useState } from "react";
import { Layout, Menu, Modal } from "antd";
import {
  VideoCameraOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Attendance from "./components/Attendance";
import Schedule from "./components/Schedule";

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleMenuClick = (key) => {
    setSelectedKey(key);
  };

  // Hàm xử lý đăng xuất, mở Modal xác nhận
  const handleLogoutClick = () => {
    setLogoutModalVisible(true);
  };

  const handleCancelLogout = () => {
    setLogoutModalVisible(false); // Đóng modal
  };

  const handleConfirmLogout = () => {
    setLogoutModalVisible(false); // Đóng modal
    // Xử lý đăng xuất ở đây, ví dụ: chuyển hướng về trang đăng nhập
    console.log("Đã đăng xuất!");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250} // Điều chỉnh chiều rộng của Sider khi mở
        collapsedWidth={80} // Điều chỉnh chiều rộng của Sider khi thu gọn
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 120,
            marginBottom: 30,
          }}
        >
          <img src="/logo.png" alt="Logo" style={{ height: 70 }} />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => handleMenuClick(key)}
        >
          <Menu.Item
            key="1"
            icon={<VideoCameraOutlined />}
            style={{ fontSize: "20px", padding: "10px 16px" }}
          >
            Điểm danh
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<CalendarOutlined />}
            style={{ fontSize: "20px", padding: "10px 16px" }}
          >
            Lịch học
          </Menu.Item>
        </Menu>

        <div style={{ marginTop: "auto", paddingTop: 24 }}>
          <Menu
            theme="dark"
            mode="inline"
            selectable={false}
            onClick={handleLogoutClick}
          >
            <Menu.Item 
              key="3" 
              icon={<LogoutOutlined />}
              style={{ fontSize: "20px", padding: "10px 16px" }}
            >  
            Đăng xuất
            </Menu.Item>
          </Menu>
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#1890ff",
            padding: "0 30px",
            color: "#fff",
            height: 80,
            fontWeight: "bold",
            fontSize: 24
          }}
        >
          Hệ thống điểm danh
        </Header>

        <Content style={{ margin: "50px" }}>
          <div style={{ display: "flex", gap: 24 }}>
            {selectedKey === "1" && <Attendance />}
            {selectedKey === "2" && <Schedule />}
          </div>
        </Content>
      </Layout>

      {/* Modal Xác nhận Đăng xuất */}
      <Modal
        title="Xác nhận đăng xuất"
        visible={isLogoutModalVisible}
        onCancel={handleCancelLogout}
        onOk={handleConfirmLogout}
        style={{ top: 300 }}
      >
        <p>Bạn có chắc chắn muốn đăng xuất?</p>
      </Modal>
    </Layout>
  );
};

export default App;
