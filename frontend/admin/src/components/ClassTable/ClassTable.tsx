import React from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";

interface SubjectData {
  key: React.Key; // Dùng làm STT, hoặc bạn có thể tạo riêng cột STT
  subjectName: string;
  classCode: string;
  schedule: string;
  classroom: string;
}

const columns: TableColumnsType<SubjectData> = [
  {
    title: "STT",
    dataIndex: "key",
    key: "key",
    render: (text, record, index) => index + 1, // hiển thị STT bắt đầu từ 1
  },
  {
    title: "Tên môn học",
    dataIndex: "subjectName",
    key: "subjectName",
  },
  {
    title: "Mã lớp học phần",
    dataIndex: "classCode",
    key: "classCode",
  },
  {
    title: "Lịch học",
    dataIndex: "schedule",
    key: "schedule",
  },
  {
    title: "Giảng đường",
    dataIndex: "classroom",
    key: "classroom",
  },
];

const data: SubjectData[] = [
  {
    key: 1,
    subjectName: "Cấu trúc dữ liệu và giải thuật",
    classCode: "CTDLGT01",
    schedule: "Thứ 2, 7:30 - 9:30",
    classroom: "A101",
  },
  {
    key: 2,
    subjectName: "Lập trình hướng đối tượng",
    classCode: "OOP02",
    schedule: "Thứ 4, 9:45 - 11:45",
    classroom: "B202",
  },
  {
    key: 3,
    subjectName: "Cơ sở dữ liệu",
    classCode: "CSDL03",
    schedule: "Thứ 6, 13:00 - 15:00",
    classroom: "C303",
  },
];

const App: React.FC = () => (
  <Table<SubjectData> columns={columns} dataSource={data} pagination={false} />
);

export default App;
