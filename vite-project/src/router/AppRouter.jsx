import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import RoleGuard from '../components/common/RoleGuard';
import { RoleProvider } from '../context/RoleContext';
import { PAGE_ACCESS } from '../context/roles';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
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

function Layout() {
  const { pathname } = useLocation();
  const isExam = pathname.startsWith('/quiz-doing');
  return (
    <>
      {!isExam && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Trang dành cho mọi người dùng */}
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/quiz-list" element={<QuizList />} />
        <Route path="/quiz-doing/:quizId" element={<QuizDoing />} />
        <Route path="/quiz-result/:quizId" element={<QuizResult />} />
        <Route path="/instructors" element={<InstructorListPage />} />
        <Route path="/blogs" element={<BlogListPage />} />
        <Route path="/blogs/:id" element={<BlogDetailPage />} />
        <Route path="/enrollment-lookup" element={<EnrollmentLookupPage />} />
        <Route path="/compare" element={<ComparePage />} />

        {/* Trang theo vai trò */}
        <Route path="/admin/users" element={
          <RoleGuard allow={PAGE_ACCESS['/admin/users']}><UserManagementPage /></RoleGuard>
        } />
        <Route path="/admin/courses" element={
          <RoleGuard allow={PAGE_ACCESS['/admin/courses']}><CourseApprovalPage /></RoleGuard>
        } />
        <Route path="/dashboard" element={
          <RoleGuard allow={PAGE_ACCESS['/dashboard']}><InstructorDashboard /></RoleGuard>
        } />
      </Routes>
      {!isExam && <Footer />}
    </>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <RoleProvider>
        <Layout />
      </RoleProvider>
    </BrowserRouter>
  );
}