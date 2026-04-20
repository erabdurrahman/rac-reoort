import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentsPage from './pages/admin/StudentsPage';
import SupervisorsPage from './pages/admin/SupervisorsPage';
import DepartmentsPage from './pages/admin/DepartmentsPage';
import MeetingsPageAdmin from './pages/admin/MeetingsPage';
import ReportsPageAdmin from './pages/admin/ReportsPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import ResearchProgress from './pages/student/ResearchProgress';
import Documents from './pages/student/Documents';
import RACReports from './pages/student/RACReports';
import NewRACReport from './pages/student/NewRACReport';

// Supervisor Pages
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import ScholarsList from './pages/supervisor/ScholarsList';
import SupervisorReports from './pages/supervisor/SupervisorReports';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><StudentsPage /></ProtectedRoute>} />
        <Route path="/admin/supervisors" element={<ProtectedRoute allowedRoles={['admin']}><SupervisorsPage /></ProtectedRoute>} />
        <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={['admin']}><DepartmentsPage /></ProtectedRoute>} />
        <Route path="/admin/meetings" element={<ProtectedRoute allowedRoles={['admin']}><MeetingsPageAdmin /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><ReportsPageAdmin /></ProtectedRoute>} />

        {/* Student */}
        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />
        <Route path="/student/progress" element={<ProtectedRoute allowedRoles={['student']}><ResearchProgress /></ProtectedRoute>} />
        <Route path="/student/documents" element={<ProtectedRoute allowedRoles={['student']}><Documents /></ProtectedRoute>} />
        <Route path="/student/reports" element={<ProtectedRoute allowedRoles={['student']}><RACReports /></ProtectedRoute>} />
        <Route path="/student/reports/new" element={<ProtectedRoute allowedRoles={['student']}><NewRACReport /></ProtectedRoute>} />

        {/* Supervisor */}
        <Route path="/supervisor/dashboard" element={<ProtectedRoute allowedRoles={['supervisor']}><SupervisorDashboard /></ProtectedRoute>} />
        <Route path="/supervisor/scholars" element={<ProtectedRoute allowedRoles={['supervisor']}><ScholarsList /></ProtectedRoute>} />
        <Route path="/supervisor/reports" element={<ProtectedRoute allowedRoles={['supervisor']}><SupervisorReports /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
