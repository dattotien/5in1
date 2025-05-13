import { Input, Button, Form } from 'antd';
function right_login() {
    return (
        <div className="right-panel">
        <div className="login-box">
          <Form layout="vertical">
            <Form.Item>
              <Input placeholder="Tài khoản" className="input" />
            </Form.Item>
            <Form.Item>
              <Input.Password placeholder="Mật khẩu" className="input" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-btn">
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
}
export default right_login;
 