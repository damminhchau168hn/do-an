import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import UserManagementPage from '../pages/admin/UserManagementPage';
import CourseApprovalPage from '../pages/admin/CourseApprovalPage';
import InstructorDashboard from '../pages/instructors/InstructorDashboard';
import QuizList from "../pages/quiz/QuizList";
import QuizDoing from "../pages/quiz/QuizDoing";
import QuizResult from "../pages/quiz/QuizResult";
import CourseListPage from "../pages/courses/CourseListPage";
import CourseDetailPage from "../pages/courses/CourseDetailPage";
import InstructorListPage from '../pages/instructors/InstructorListPage';
import ComparePage from '../pages/courses/ComparePage';
import BlogListPage from '../pages/blogs/BlogListPage';
import BlogDetailPage from '../pages/blogs/BlogDetailPage';
import EnrollmentLookupPage from '../pages/enrollment/EnrollmentLookupPage';
import QuestionImportExportPage from "../components/question/QuestionImportExport";

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
        <Link to="/question-import-export" className={isActive('/question-import-export')}>Nhập/Xuất câu hỏi</Link>
      </nav>
    </header>
  );
}

function Layout() {
  const { pathname } = useLocation();
  const isExam = pathname.startsWith('/quiz-doing');
  return (
    <>
      {!isExam && <Header />}
      {!isExam && <AdminTabs />}
      <Routes>
        <Route path="/" element={<UserManagementPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/courses" element={<CourseApprovalPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/dashboard" element={<InstructorDashboard />} />
        <Route path="/quiz-list" element={<QuizList />} />
        <Route path="/quiz-doing/:quizId" element={<QuizDoing />} />
        <Route path="/quiz-result/:quizId" element={<QuizResult />} />
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/instructors" element={<InstructorListPage />} />
        <Route path="/blogs" element={<BlogListPage />} />
        <Route path="/blogs/:id" element={<BlogDetailPage />} />
        <Route path="/enrollment-lookup" element={<EnrollmentLookupPage />} />
        <Route path="/question-import-export" element={<QuestionImportExportPage />} />
      </Routes>
      {!isExam && <Footer />}
    </>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}