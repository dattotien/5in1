import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'antd/dist/reset.css'
import "./index.css";
import "../../admin/src/i18n/index.ts";
import { I18nextProvider } from "react-i18next";
import i18n from "../../admin/src/i18n/index.ts";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
