import './ScheduleTable.css';
import { useTranslation } from 'react-i18next';

export default function ScheduleTable() {
  const { t } = useTranslation();

  const scheduleData = [
    { id: 1, subjectName: 'Mathematics', classCode: 'MTH101', time: '8:00-10:00' },
    { id: 2, subjectName: 'Physics', classCode: 'PHY202', time: '13:00-15:00' },
  ];

  return (
    <div className="schedule-table">
      <table>
        <thead>
          <tr>
            <th>{t('scheduleTable.no')}</th>
            <th>{t('scheduleTable.subjectName')}</th>
            <th>{t('scheduleTable.classCode')}</th>
            <th>{t('scheduleTable.time')}</th>
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
