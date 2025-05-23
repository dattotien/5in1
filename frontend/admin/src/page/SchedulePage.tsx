import './SchedulePage.css';
import ScheduleTable from '../components/schedule/ScheduleTable';
import { useTranslation } from 'react-i18next';

export default function SchedulePage() {
  const { t } = useTranslation();

  return (
    <div className="schedule-page">
      <h2>{t('schedulePage.title')}</h2>
      <ScheduleTable />
    </div>
  );
}
