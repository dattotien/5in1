import './ScheduleTable.css';

export default function ScheduleTable() {
  const scheduleData = [
    { id: 1, subjectName: 'Mathematics', classCode: 'MTH101', time: '8:00-10:00' },
    { id: 2, subjectName: 'Physics', classCode: 'PHY202', time: '13:00-15:00' },
  ];

  return (
    <div className="schedule-table">
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Subject Name</th>
            <th>Class Code</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {scheduleData.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.subjectName}</td>
              <td>{item.classCode}</td>
              <td>{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
