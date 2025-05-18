import './SchedulePage.css';
import ScheduleTable from '../components/schedule/ScheduleTable';

export default function SchedulePage() {
  return (
    <div className="schedule-page">
      <h2>Class Schedule</h2>
      <ScheduleTable />
    </div>
  );
}