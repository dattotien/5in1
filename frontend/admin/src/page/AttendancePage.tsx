import './AttendancePage.css';
import AttendanceTabs from '../components/attendance/AttendanceTabs';

export default function AttendancePage() {
  return (
    <div className="attendance-page">
      <h2>Attendance Management</h2>
      <AttendanceTabs />
    </div>
  );
}
