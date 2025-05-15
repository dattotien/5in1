import "./App.css";
import LoginPage from "./page/LoginPage.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminPage from "./page/AdminPage.tsx";
import Settings from "./page/Settings.tsx";
import Attendance from "./page/Attendance.tsx";
import StudentManagement from "./page/StudentManagement.tsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <AdminPage />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
