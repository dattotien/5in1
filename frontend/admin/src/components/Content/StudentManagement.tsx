import React, { useState } from 'react';
import StudentTable from '../StudentTable.tsx';
import ClassTable from '../ClassTable/ClassTable.tsx';

const StudentManagementPage = () => {
  const [selectedSection, setSelectedSection] = useState(null);

  return (
    <div className="p-4">
      <StudentTable></StudentTable>
    </div>
  );
};

export default StudentManagementPage;