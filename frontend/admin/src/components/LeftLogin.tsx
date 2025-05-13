import "./LeftLogin.css"
import { Flex } from "antd";
import { Divider } from "antd";
function LeftLogin() {
    return (
    <div className="box">
        <Flex vertical className="login-card">
          <Flex className="logo-section">
            <img src="./src/assets/UET.png" alt="Logo" className="logo"/>
            <Divider type="vertical" className="divider" />
            <Flex vertical className="logo-text-section">
            <h1 className="logo-text">ĐẠI HỌC QUỐC GIA HÀ NỘI</h1>
            <h2 className="logo-text">Trường Đại học Công nghệ</h2>
            </Flex>
          </Flex>
          <h1 className="title">HỆ THỐNG ĐIỂM DANH KHUÔN MẶT</h1>
        </Flex>
    </div>
    )
}
export default LeftLogin;