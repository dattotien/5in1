import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AttendancePage from './pages/AttendancePage';
import SchedulePage from './pages/SchedulePage';
import FeedbackPage from './pages/FeedbackPage';
import UserLayout from './pages/UserLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<AttendancePage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="feedback" element={<FeedbackPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;