import React, { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, hint, icon: Icon, className = '', required, ...props }, ref) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-slate-400" />
          </div>
        )}
        <input
          ref={ref}
          className={`input-field ${Icon ? 'pl-9' : ''} ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
});

export const Select = forwardRef(function Select({ label, error, className = '', required, children, ...props }, ref) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={`input-field ${error ? 'border-red-400 focus:border-red-500' : ''}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea({ label, error, className = '', required, rows = 4, ...props }, ref) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`input-field resize-none ${error ? 'border-red-400 focus:border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
});

export default Input;
