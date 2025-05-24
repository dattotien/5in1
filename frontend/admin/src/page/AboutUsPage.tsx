import React from 'react';
import { useTranslation } from 'react-i18next';
import './AboutUs.css';

interface Developer {
  id: number;
  name: string;
  studentId: string;
  avatar: string;
  role?: string;
}

const AboutUs: React.FC = () => {
  const { t } = useTranslation();

  const developers: Developer[] = [
    {
      id: 1,
      name: 'Chu Thị Phương Anh',
      studentId: '23020324',
      avatar: '/images/avatars/ctpa.jpg',
      role: t('aboutUs.roles.backendDeveloper')
    },
    {
      id: 2,
      name: 'Phạm Hà Anh',
      studentId: '23020330',
      avatar: '/images/avatars/pha.jpg',
      role: t('aboutUs.roles.databaseAssistant')
    },
    {
      id: 3,
      name: 'Tô Tiến Đạt',
      studentId: '23020353',
      avatar: '/images/avatars/ttd.jpg',
      role: t('aboutUs.roles.frontendDeveloper')
    },
    {
      id: 4,
      name: 'Nguyễn Thị Minh Ly',
      studentId: '23020399',
      avatar: '/images/avatars/ntml.jpg',
      role: t('aboutUs.roles.frontendDeveloper')
    },
    {
      id: 5,
      name: 'Đặng Minh Nguyệt',
      studentId: '23020407',
      avatar: '/images/avatars/dmn.jpg',
      role: t('aboutUs.roles.backendDeveloper')
    }
  ];

  return (
    <div className="about-us-container">
      <h1>{t('aboutUs.teamTitle')}</h1>
      <p className="team-description">{t('aboutUs.teamDescription')}</p>

      <div className="developers-grid">
        {developers.map((dev) => (
          <div key={dev.id} className="developer-card">
            <div className="avatar-container">
              <img
                src={dev.avatar}
                alt={dev.name}
                className="developer-avatar"
              />
            </div>
            <div className="developer-info">
              <h3>{dev.name}</h3>
              <p className="student-id">{t('aboutUs.studentId')}: {dev.studentId}</p>
              {dev.role && <p className="role">{dev.role}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
