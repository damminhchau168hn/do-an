import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import UserManagementPage from '../pages/admin/UserManagementPage';
import CourseApprovalPage from '../pages/admin/CourseApprovalPage';
import InstructorDashboard from '../pages/instructor/InstructorDashboard';
import QuizList from '../pages/quiz/QuizList';
import QuizDoing from '../pages/quiz/QuizDoing';
import QuizResult from '../pages/quiz/QuizResult';

function AdminTabs() {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? 'active' : '');

  return (
    <header className="app-header">
      <h2 style={{ fontSize: 18 }}>Khu vực quản trị</h2>
      <nav>
        <Link to="/admin/users" className={isActive('/admin/users')}>Quản lý người dùng</Link>
        <Link to="/admin/courses" className={isActive('/admin/courses')}>Duyệt khoá học</Link>
        <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard giảng viên</Link>
      </nav>
    </header>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Header />
      <AdminTabs />
      <Routes>
        <Route path="/" element={<UserManagementPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/courses" element={<CourseApprovalPage />} />
        <Route path="/dashboard" element={<InstructorDashboard />} />
        <Route path="/quiz-list" element={<QuizList />} />
        <Route path="/quiz-doing" element={<QuizDoing />} />
        <Route path="/quiz-result" element={<QuizResult />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}