// src/pages/UserLayout.tsx
import { Outlet, Link } from 'react-router-dom';
import './UserLayout.css';
import { useTranslation } from 'react-i18next';
import { LogoutOutlined } from '@ant-design/icons';

export default function UserLayout() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi');
  };

  const handleLogout = () => {
    alert(t('logout'));
  };

  return (
    <div className="user-layout">
      <header className="header">
        <h1 className="site-title">{t('title')}</h1>

        <nav className="nav-links">
          <Link to="/">{t('attendance')}</Link>
          <Link to="/schedule">{t('schedule')}</Link>
          <Link to="/feedback">{t('feedback')}</Link>
          <button className="nav-button" onClick={handleLogout}>
            <LogoutOutlined style={{ marginRight: 6 }} />
            {t('logout')}
          </button>
          
          {/* Nút đổi ngôn ngữ dạng chữ VI/EN */}
          <button
            className="lang-toggle-btn"
            onClick={toggleLanguage}
            title={t('change_language')}
          >
            {i18n.language.toUpperCase()}
          </button>
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}