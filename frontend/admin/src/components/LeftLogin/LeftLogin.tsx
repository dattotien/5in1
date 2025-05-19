import "./LeftLogin.css";
import { Flex } from "antd";
import { Divider } from "antd";
function LeftLogin() {
  return (
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
  );
}
export default LeftLogin;
