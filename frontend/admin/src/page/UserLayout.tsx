// src/pages/UserLayout.tsx
import { Outlet, NavLink } from "react-router-dom";
import "./UserLayout.css";
import { useTranslation } from "react-i18next";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function UserLayout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "vi" ? "en" : "vi");
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="user-layout">
      <header className="user-header">
        <h1 className="user-site-title">{t("title")}</h1>
        <nav className="nav-links">
          <NavLink to="" end>
            {t("attendance")}
          </NavLink>
          <NavLink to="feedback">{t("feedback")}</NavLink>
          <NavLink to="aboutus">{t("aboutus")}</NavLink>

          <button className="nav-button" onClick={handleLogout}>
            <LogoutOutlined style={{ marginRight: 6 }} />
            {t("logout")}
          </button>

          <button
            className="lang-toggle-btn"
            onClick={toggleLanguage}
            title={t("change_language")}
          >
            {i18n.language.toUpperCase()}
          </button>
        </nav>
      </header>

      <main className="user-main-content">
        <Outlet />
      </main>

      <footer className="user-footer">
        &copy; {new Date().getFullYear()} 5in1. All rights reserved.
      </footer>
    </div>
  );
}
