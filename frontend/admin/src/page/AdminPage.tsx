import React, { useState } from "react";
import {
  CheckSquareOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, Button } from "antd";
import "./AdminPage.css";
import { Link } from "react-router-dom";
import { Avatar, Card } from "antd";
const { Header, Content, Footer, Sider } = Layout;
import { Route, Routes, useNavigate } from "react-router-dom";
import Attendance from "../components/Content/Attendance";
import StudentManagement from "../components/Content/StudentManagement";
import Settings from "../components/Content/Settings";
import FeedbackPage from "./FeedbackPage";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  className?: string,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    className,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    <Link to="attendance">Quản lý điểm danh</Link>,
    "attendance",
    <CheckSquareOutlined />,
    "menu-item"
  ),
  getItem(
    <Link to="students">Quản lý sinh viên</Link>,
    "studentmanagement",
    <TeamOutlined />,
    "menu-item"
  ),
  getItem(
    <Link to="settings">Cài đặt</Link>,
    "settings",
    <SettingOutlined />,
    "menu-item"
  ),
];

const App: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };
  return (
    <Layout style={{ minHeight: "100vh background-color: #CAF0F8" }}>
      <Sider className="site-layout">
        <div className="logo">
          <Avatar className="avatar" size={64} icon={<UserOutlined />} />
          <p className="name">PGS. TS Trần Thu Hà</p>
        </div>
        <Menu
          className="Menu"
          defaultSelectedKeys={["1"]}
          mode="vertical"
          items={items}
        />
        <Button
          type="primary"
          onClick={handleLogout}
          icon={<LogoutOutlined />}
          className="logout-button"
        >
          Đăng xuất
        </Button>
      </Sider>
      <Layout>
        <Header className="header">
          <Routes>
            <Route path="attendance" element={<p>Quản lý điểm danh</p>} />
            <Route path="students" element={<p>Quản lý sinh viên</p>} />
            <Route path="settings" element={<p>Cài đặt</p>} />
          </Routes>
        </Header>
        <Content>
          <Card className="ContentCard">
            <Routes>
              <Route path="attendance" element={<Attendance />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="settings" element={<FeedbackPage />} />
            </Routes>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
