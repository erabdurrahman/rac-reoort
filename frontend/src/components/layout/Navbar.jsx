import React from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar({ title }) {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{title || 'Dashboard'}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-slate-50 transition-colors">
          <BellIcon className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}
