import "./App.css";
import LoginPage from "./page/LoginPage.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminPage from "./page/AdminPage.tsx";
import FeedBackResponse from "./components/Content/FeedBackResponse.tsx";
import Attendance from "./components/Content/Attendance.tsx";
import StudentManagement from "./components/Content/StudentManagement.tsx";
import AttendancePage from "./page/AttendancePage";
import FeedbackPage from "./page/FeedbackPage";
import UserLayout from "./page/UserLayout";
import AboutUs from "./page/AboutUsPage.tsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />}>
            <Route path="attendance" element={<Attendance />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="settings" element={<FeedBackResponse />} />
          </Route>
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<AttendancePage />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="aboutus" element={<AboutUs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
