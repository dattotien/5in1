import React, { useState } from "react";
import {
  CheckSquareOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, Button } from "antd";
import "./AdminPage.css";
import { Link, Outlet } from "react-router-dom";
import { Avatar, Card } from "antd";
const { Header, Content, Footer, Sider } = Layout;
import { Route, Routes, useNavigate } from "react-router-dom";

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
    <Link to="settings">Xử lý phản hồi</Link>,
    "settings",
    <QuestionCircleOutlined />,
    "menu-item"
  ),
];

const App: React.FC = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Admin";
  const handleLogout = () => {
    navigate("/");
  };
  return (
    <Layout style={{ minHeight: "100vh background-color: #CAF0F8" }}>
      <Sider className="site-layout">
        <div className="logo">
          <Avatar className="avatar" size={64} icon={<UserOutlined />} />
          <p className="name">{userName}</p>
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
            <Route path="settings" element={<p>Xử lý phản hồi</p>} />
          </Routes>
        </Header>
        <Content>
          <Card className="ContentCard">
            <Outlet />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
