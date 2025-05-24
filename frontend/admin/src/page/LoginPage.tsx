import { Flex } from "antd";
import { Divider } from "antd";
import { Input, Button, Form, message } from "antd";
import React, { useState } from "react";
import { Card, Checkbox, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";
function LoginPage() {
  const [loginError, setLoginError] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  interface LoginFormValues {
    username: string;
    password: string;
    remember?: boolean;
  }

  const onFinish = async (values: LoginFormValues) => {
    try {
      if (values.remember) {
        localStorage.setItem("remembered_username", values.username);
        localStorage.setItem("remembered_password", values.password);
      } else {
        localStorage.removeItem("remembered_username");
        localStorage.removeItem("remembered_password");
      }
      const res = await axios.post(
        "http://127.0.0.1:8000/api/auth/login",
        values
      );
      message.success(res.data.message);
      console.log(res.data);
      if (res.data.success) {
        setLoginError(false);
        localStorage.setItem("student_id", res.data.data.student_id);
        localStorage.setItem("username", res.data.data.username);
        localStorage.setItem("role", res.data.data.role);
        localStorage.setItem("userName", res.data.data.full_name);
        if (res.data.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        setLoginError(true);
      }
    } catch (error) {
      setLoginError(true);
      console.error(error);
    }
  };
  interface OnFinishFailedInfo {
    errorFields: Array<{
      name: (string | number)[];
      errors: string[];
    }>;
    values: any;
    outOfDate: boolean;
  }
  React.useEffect(() => {
    const savedUsername = localStorage.getItem("remembered_username");
    const savedPassword = localStorage.getItem("remembered_password");
    if (savedUsername && savedPassword) {
      form.setFieldsValue({
        username: savedUsername,
        password: savedPassword,
        remember: true,
      });
    }
  }, [form]);
  const onFinishFailed = (errorInfo: OnFinishFailedInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Flex>
      <div className="lbox">
        <Flex vertical className="llogin-card">
          <Flex className="llogo-section">
            <img src="./src/assets/UET.png" alt="Logo" className="llogo" />
            <Divider type="vertical" className="ldivider" />
            <Flex vertical className="llogo-text-section">
              <h1 className="llogo-text">ĐẠI HỌC QUỐC GIA HÀ NỘI</h1>
              <h2 className="llogo-text">Trường Đại học Công nghệ</h2>
            </Flex>
          </Flex>
          <h1 className="ltitle">HỆ THỐNG ĐIỂM DANH KHUÔN MẶT</h1>
        </Flex>
      </div>
      <div className="r_box">
        <Card className="r_card">
          <Form
            form={form}
            name="basic"
            className="login-form"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <h1 className="login-title">Đăng nhập hệ thống</h1>

            <Form.Item
              label="Tên đăng nhập"
              name="username"
              className="login-item"
              rules={[
                { required: true, message: "Vui lòng nhập tên đăng nhập!" },
              ]}
            >
              <Input className="login-input1" />
            </Form.Item>

            <Form.Item
              className="login-item"
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password className="login-input2" />
            </Form.Item>
            {loginError && (
              <Alert
                message="Tài khoản hoặc mật khẩu sai"
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            <Form.Item name="remember" valuePropName="checked" label={null}>
              <Checkbox className="login-checkbox">Nhớ mật khẩu</Checkbox>
            </Form.Item>

            <Form.Item label={null}>
              <Button className="login-button" type="primary" htmlType="submit">
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Flex>
  );
}

export default LoginPage;
