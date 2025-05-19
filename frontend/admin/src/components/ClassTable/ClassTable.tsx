import React, { useState } from "react";
import { Table, Button, Modal, List } from "antd";
import type { TableColumnsType } from "antd";

interface SubjectData {
  key: React.Key;
  subjectName: string;
  classCode: string;
  schedule: string;
  classroom: string;
}

interface Student {
  name: string;
  studentId: string;
}

// Giả lập danh sách sinh viên của từng môn
const studentDataMap: Record<string, Student[]> = {
  CTDLGT01: [
    { name: "Nguyễn Văn A", studentId: "SV001" },
    { name: "Trần Thị B", studentId: "SV002" },
  ],
  OOP02: [
    { name: "Lê Văn C", studentId: "SV003" },
    { name: "Phạm Thị D", studentId: "SV004" },
  ],
  CSDL03: [
    { name: "Hoàng Văn E", studentId: "SV005" },
    { name: "Đặng Thị F", studentId: "SV006" },
  ],
};

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

const App: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");

  const handleEdit = (record: SubjectData) => {
    const students = studentDataMap[record.classCode] || [];
    setSelectedStudents(students);
    setSelectedClass(record.classCode);
    setOpen(true);
  };

  const columns: TableColumnsType<SubjectData> = [
    {
      title: "STT",
      dataIndex: "key",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Tên môn học",
      dataIndex: "subjectName",
    },
    {
      title: "Mã lớp học phần",
      dataIndex: "classCode",
    },
    {
      title: "Lịch học",
      dataIndex: "schedule",
    },
    {
      title: "Giảng đường",
      dataIndex: "classroom",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Chỉnh sửa
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table<SubjectData>
        columns={columns}
        dataSource={data}
        pagination={false}
      />
      <Modal
        title={`Danh sách sinh viên - ${selectedClass}`}
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setOpen(false)}>
            Hủy
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={() => {
              // TODO: xử lý lưu dữ liệu tại đây
              console.log("Đã lưu thay đổi cho lớp:", selectedClass);
              setOpen(false);
            }}
          >
            Lưu thay đổi
          </Button>,
        ]}
      >
        <List
          dataSource={selectedStudents}
          renderItem={(student) => (
            <List.Item>
              {student.name} ({student.studentId})
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default App;
