import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import {
  HomeIcon, UserGroupIcon, AcademicCapIcon, BuildingOfficeIcon,
  CalendarIcon, DocumentTextIcon, ChartBarIcon, UserCircleIcon,
  DocumentPlusIcon, FolderOpenIcon, ClipboardDocumentCheckIcon,
  UsersIcon, Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const adminNav = [
  { label: 'Dashboard', path: '/admin', icon: HomeIcon, end: true },
  { label: 'Students', path: '/admin/students', icon: AcademicCapIcon },
  { label: 'Supervisors', path: '/admin/supervisors', icon: UserGroupIcon },
  { label: 'Departments', path: '/admin/departments', icon: BuildingOfficeIcon },
  { label: 'Meetings', path: '/admin/meetings', icon: CalendarIcon },
  { label: 'Reports', path: '/admin/reports', icon: DocumentTextIcon },
  { label: 'Analytics', path: '/admin/analytics', icon: ChartBarIcon },
];

const studentNav = [
  { label: 'Dashboard', path: '/student', icon: HomeIcon, end: true },
  { label: 'My Profile', path: '/student/profile', icon: UserCircleIcon },
  { label: 'Submit Report', path: '/student/submit-report', icon: DocumentPlusIcon },
  { label: 'My Reports', path: '/student/reports', icon: DocumentTextIcon },
  { label: 'Documents', path: '/student/documents', icon: FolderOpenIcon },
];

const supervisorNav = [
  { label: 'Dashboard', path: '/supervisor', icon: HomeIcon, end: true },
  { label: 'My Scholars', path: '/supervisor/scholars', icon: UsersIcon },
  { label: 'Review Reports', path: '/supervisor/reviews', icon: ClipboardDocumentCheckIcon },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = user?.role === 'admin' ? adminNav : user?.role === 'student' ? studentNav : supervisorNav;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm">
            <AcademicCapIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-tight">RAC Report</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role} Panel</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50">
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-primary-700">{user?.name?.charAt(0)?.toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
              ${isActive
                ? 'bg-primary-600 text-white shadow-sm shadow-primary-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-md border border-slate-200"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="lg:hidden fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 shadow-xl z-40"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </div>
    </>
  );
}
