import { Input, Button, Form, message } from "antd";
import { Card, Checkbox } from "antd";
import "./RightLogin.css";
import { useNavigate } from "react-router-dom";


function RightLogin() {
  const navigate = useNavigate();
  interface LoginFormValues {
    username: string;
    password: string;
    remember?: boolean;
  }

  const onFinish = (values: LoginFormValues) => {
    const { username, password } = values;
    if (username === "301-G2" && password === "123456") {
      navigate("/user");
      // Chuyển hướng hoặc lưu thông tin đăng nhập tại đây
    } else if (username === "23020353" && password === "123456") {
      navigate("/admin");
    } else {
      message.error("Tên đăng nhập hoặc mật khẩu không đúng!");
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

  const onFinishFailed = (errorInfo: OnFinishFailedInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="r_box">
      <Card className="r_card">
        <Form
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
  );
}

export default RightLogin;
