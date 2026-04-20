import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'hover:bg-slate-100 text-slate-700 font-medium py-2 px-4 rounded-lg transition-all duration-200',
  link: 'text-primary-600 hover:text-primary-700 font-medium underline-offset-2 hover:underline',
};

const sizes = {
  xs: 'py-1 px-2.5 text-xs',
  sm: 'py-1.5 px-3 text-sm',
  md: '',
  lg: 'py-2.5 px-6 text-base',
  xl: 'py-3 px-8 text-lg',
};

export default function Button({
  children, variant = 'primary', size = 'md', loading = false,
  icon: Icon, iconRight, className = '', disabled, ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${variants[variant]} ${sizes[size]} inline-flex items-center justify-center gap-2 ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? <Icon className="w-4 h-4" /> : null}
      {children}
      {iconRight && !loading && <iconRight className="w-4 h-4" />}
    </motion.button>
  );
}
