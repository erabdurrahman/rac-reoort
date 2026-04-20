import React from 'react';

const sizeMap = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10', xl: 'w-16 h-16' };

export default function Spinner({ size = 'md', color = 'primary', className = '' }) {
  const colors = { primary: 'text-primary-600', white: 'text-white', gray: 'text-slate-400' };
  return (
    <svg
      className={`animate-spin ${sizeMap[size]} ${colors[color]} ${className}`}
      fill="none" viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Spinner size="lg" />
      <p className="mt-4 text-slate-500 text-sm">Loading...</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-10 w-10 bg-slate-200 rounded-xl" />
      </div>
      <div className="h-8 bg-slate-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-slate-200 rounded w-2/3" />
    </div>
  );
}
