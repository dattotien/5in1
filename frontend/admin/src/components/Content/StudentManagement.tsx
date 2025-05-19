import React, { useState } from 'react';
import CourseSectionsList from './CourseSectionsList.tsx';
import StudentListInSection from './StudentListInSection.tsx';

const StudentManagementPage = () => {
  const [selectedSection, setSelectedSection] = useState(null);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Quản lý sinh viên</h2>
      {selectedSection ? (
        <StudentListInSection section={selectedSection} onBack={() => setSelectedSection(null)} />
      ) : (
        <CourseSectionsList onEditSection={(section: any) => setSelectedSection(section)} />
      )}
    </div>
  );
};

export default StudentManagementPage;