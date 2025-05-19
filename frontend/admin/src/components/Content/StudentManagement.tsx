import React, { useState } from 'react';
import CourseSectionsList from './CourseSectionsList.tsx';
import StudentListInSection from './StudentListInSection.tsx';
import ClassTable from '../ClassTable/ClassTable.tsx';

const StudentManagementPage = () => {
  const [selectedSection, setSelectedSection] = useState(null);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách lớp học phần</h2>
      <ClassTable/>
    </div>
  );
};

export default StudentManagementPage;