import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = false, onClick, padding = 'p-6' }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 shadow-sm ${padding} ${hover ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function StatCard({ title, value, icon: Icon, color = 'blue', change, subtitle }) {
  const colors = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' },
    green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-500' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: 'text-yellow-500' },
    red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-500' },
  };
  const c = colors[color] || colors.blue;
  return (
    <Card hover className="overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {change !== undefined && (
            <p className={`text-xs mt-1 font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
            </p>
          )}
        </div>
        {Icon && (
          <div className={`${c.bg} p-3 rounded-xl`}>
            <Icon className={`w-6 h-6 ${c.icon}`} />
          </div>
        )}
      </div>
    </Card>
  );
}
