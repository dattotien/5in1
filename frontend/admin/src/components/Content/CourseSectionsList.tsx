import React from "react";

interface CourseSection {
  id: number;
  name: string;
}

interface CourseSectionsListProps {
  onEditSection: (section: CourseSection) => void;
}

const CourseSectionsList: React.FC<CourseSectionsListProps> = ({ onEditSection }) => {
  // Dữ liệu mẫu (thay bằng fetch từ API)
  const courseSections = [
    { id: 1, name: "Lập trình Python - Nhóm 01" },
    { id: 2, name: "Cơ sở dữ liệu - Nhóm 02" },
  ];

  return (
    <div>
      <ul>
        {courseSections.map((section) => (
          <li
            key={section.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{section.name}</span>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => onEditSection(section)}
            >
              Chỉnh sửa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseSectionsList;
