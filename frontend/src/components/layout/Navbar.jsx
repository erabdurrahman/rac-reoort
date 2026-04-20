import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BellIcon, CheckIcon } from '@heroicons/react/24/outline';
import { NotificationContext } from '../../context/NotificationContext';
import { format } from 'date-fns';

const breadcrumbMap = {
  admin: 'Admin',
  student: 'Student',
  supervisor: 'Supervisor',
  students: 'Students',
  supervisors: 'Supervisors',
  departments: 'Departments',
  meetings: 'Meetings',
  reports: 'Reports',
  analytics: 'Analytics',
  profile: 'My Profile',
  'submit-report': 'Submit Report',
  documents: 'Documents',
  scholars: 'Scholars',
  reviews: 'Review Reports',
};

export default function Navbar() {
  const location = useLocation();
  const { notifications, unreadCount, fetchNotifications, markRead, markAllRead } = useContext(NotificationContext);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, i) => ({
    label: breadcrumbMap[part] || part,
    path: '/' + pathParts.slice(0, i + 1).join('/'),
    isLast: i === pathParts.length - 1,
  }));

  const typeColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 sticky top-0 z-30 gap-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm flex-1 ml-8 lg:ml-0">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb.path}>
            {i > 0 && <span className="text-slate-400">/</span>}
            <span className={crumb.isLast ? 'font-semibold text-slate-900' : 'text-slate-500'}>
              {crumb.label}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <BellIcon className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                      <CheckIcon className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-slate-500">No notifications</div>
                  ) : (
                    notifications.slice(0, 8).map((n) => (
                      <div
                        key={n._id}
                        onClick={() => { if (!n.isRead) markRead(n._id); }}
                        className={`px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${!n.isRead ? 'bg-blue-50/50' : ''}`}
                      >
                        <div className="flex items-start gap-2">
                          {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                          <div className={!n.isRead ? '' : 'ml-4'}>
                            <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                            <p className="text-[11px] text-slate-400 mt-1">{format(new Date(n.createdAt), 'MMM d, h:mm a')}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
