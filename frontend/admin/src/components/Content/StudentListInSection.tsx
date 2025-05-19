import React from "react";
type Props = {
  section: any;
  onBack: () => void;
};
const StudentListInSection: React.FC<Props> = ({ section, onBack }) => {
  // Dữ liệu mẫu sinh viên
  const students = [
    { id: "24022014", name: "Nguyễn Văn A" },
    { id: "24022030", name: "Trần Thị B" },
  ];

  return (
    <div>
      <button onClick={onBack} className="text-blue-600 mb-4">
        ← Quay lại danh sách lớp
      </button>
      <h3 className="text-lg font-semibold mb-2">{section.name}</h3>
      <ul>
        {students.map((student) => (
          <li key={student.id} className="border-b py-2">
            {student.id} - {student.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentListInSection;
