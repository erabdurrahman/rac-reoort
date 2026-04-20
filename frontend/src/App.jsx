import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Spinner from './components/ui/Spinner';
import Layout from './components/layout/Layout';

// Public pages
const Landing = lazy(() => import('./pages/public/Landing'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));

// Auth pages
const AdminLogin = lazy(() => import('./pages/auth/AdminLogin'));
const StudentLogin = lazy(() => import('./pages/auth/StudentLogin'));
const SupervisorLogin = lazy(() => import('./pages/auth/SupervisorLogin'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageStudents = lazy(() => import('./pages/admin/ManageStudents'));
const ManageSupervisors = lazy(() => import('./pages/admin/ManageSupervisors'));
const ManageDepartments = lazy(() => import('./pages/admin/ManageDepartments'));
const ScheduleMeetings = lazy(() => import('./pages/admin/ScheduleMeetings'));
const ViewReports = lazy(() => import('./pages/admin/ViewReports'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));

// Student pages
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const MyProfile = lazy(() => import('./pages/student/MyProfile'));
const SubmitRACForm = lazy(() => import('./pages/student/SubmitRACForm'));
const MyReports = lazy(() => import('./pages/student/MyReports'));
const MyDocuments = lazy(() => import('./pages/student/MyDocuments'));

// Supervisor pages
const SupervisorDashboard = lazy(() => import('./pages/supervisor/SupervisorDashboard'));
const AssignedScholars = lazy(() => import('./pages/supervisor/AssignedScholars'));
const ReviewReports = lazy(() => import('./pages/supervisor/ReviewReports'));
const ScholarProfile = lazy(() => import('./pages/supervisor/ScholarProfile'));

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return children;
};

const PageLoader = () => (
  <div className="flex items-center justify-center h-screen bg-slate-50">
    <Spinner size="lg" />
  </div>
);

export default function App() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/login/supervisor" element={<SupervisorLogin />} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><Layout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<ManageStudents />} />
          <Route path="supervisors" element={<ManageSupervisors />} />
          <Route path="departments" element={<ManageDepartments />} />
          <Route path="meetings" element={<ScheduleMeetings />} />
          <Route path="reports" element={<ViewReports />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        {/* Student routes */}
        <Route path="/student" element={<ProtectedRoute role="student"><Layout /></ProtectedRoute>}>
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="submit-report" element={<SubmitRACForm />} />
          <Route path="reports" element={<MyReports />} />
          <Route path="documents" element={<MyDocuments />} />
        </Route>

        {/* Supervisor routes */}
        <Route path="/supervisor" element={<ProtectedRoute role="supervisor"><Layout /></ProtectedRoute>}>
          <Route index element={<SupervisorDashboard />} />
          <Route path="scholars" element={<AssignedScholars />} />
          <Route path="scholars/:id" element={<ScholarProfile />} />
          <Route path="reviews" element={<ReviewReports />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
