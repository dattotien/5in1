import { Input, Button, Form } from "antd";
import { Card, Checkbox } from "antd";
import "./RightLogin.css";
function right_login() {
  return (
    <div className="r_box">
      <Card className="r_card">
        <Form name="basic" className="login-form">
          <h1 className="login-title">Đăng nhập hệ thống</h1>
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            className="login-item"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input className="login-input1" />
          </Form.Item>
          <Form.Item
            className="login-item"
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
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
export default right_login;
