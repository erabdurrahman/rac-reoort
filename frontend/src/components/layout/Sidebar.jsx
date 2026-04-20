import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import {
  HomeIcon, UserGroupIcon, AcademicCapIcon, BuildingOfficeIcon,
  CalendarIcon, DocumentTextIcon, BellIcon, Cog6ToothIcon,
  ChartBarIcon, ArrowRightOnRectangleIcon, UserIcon, BookOpenIcon
} from '@heroicons/react/24/outline';

const adminLinks = [
  { to: '/admin/dashboard', icon: HomeIcon, label: 'Dashboard' },
  { to: '/admin/students', icon: AcademicCapIcon, label: 'Students' },
  { to: '/admin/supervisors', icon: UserGroupIcon, label: 'Supervisors' },
  { to: '/admin/departments', icon: BuildingOfficeIcon, label: 'Departments' },
  { to: '/admin/meetings', icon: CalendarIcon, label: 'Meetings' },
  { to: '/admin/reports', icon: DocumentTextIcon, label: 'RAC Reports' },
];

const studentLinks = [
  { to: '/student/dashboard', icon: HomeIcon, label: 'Dashboard' },
  { to: '/student/profile', icon: UserIcon, label: 'My Profile' },
  { to: '/student/progress', icon: ChartBarIcon, label: 'Research Progress' },
  { to: '/student/documents', icon: BookOpenIcon, label: 'Documents' },
  { to: '/student/reports', icon: DocumentTextIcon, label: 'RAC Reports' },
];

const supervisorLinks = [
  { to: '/supervisor/dashboard', icon: HomeIcon, label: 'Dashboard' },
  { to: '/supervisor/scholars', icon: AcademicCapIcon, label: 'My Scholars' },
  { to: '/supervisor/reports', icon: DocumentTextIcon, label: 'RAC Reports' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = user?.role === 'admin' ? adminLinks
    : user?.role === 'student' ? studentLinks
    : supervisorLinks;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <motion.aside
      initial={{ x: -280 }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col z-40 shadow-sm"
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
            <AcademicCapIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm leading-tight">RAC Report</p>
            <p className="text-xs text-slate-500">PhD Management</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
            ${isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
          }>
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-100">
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </motion.aside>
  );
}
