import { Space } from "antd";
import ClassTable from "../ClassTable/ClassTable";
function Attendance() {
  return (
    <>
      <div>
        <h1>Danh sách các lớp học phần</h1>
        <ClassTable />
      </div>
    </>
  );
}
export default Attendance;
