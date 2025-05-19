import './AttendanceList.css';

export default function AttendanceList() {
  // Temporary dummy data
  const dummyData = [
    { id: 1, name: 'Nguyen Van A', status: 'Present', time: '2023-05-01 08:00' },
    { id: 2, name: 'Tran Thi B', status: 'Absent', time: '2023-05-01 08:00' },
  ];

  return (
    <div className="attendance-list">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.status}</td>
              <td>{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}