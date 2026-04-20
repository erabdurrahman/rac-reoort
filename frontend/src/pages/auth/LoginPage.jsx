import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const [activeRole, setActiveRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const roles = [
    { id: 'admin', label: 'Admin' },
    { id: 'student', label: 'Student' },
    { id: 'supervisor', label: 'Supervisor' }
  ];

  const dashboardRoute = { admin: '/admin/dashboard', student: '/student/dashboard', supervisor: '/supervisor/dashboard' };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(dashboardRoute[user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-primary-800 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
            <AcademicCapIcon className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">RAC Report System</h1>
          <p className="text-primary-200 text-sm mt-1">PhD Research Management</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Sign In</h2>

          {/* Role Tabs */}
          <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
            {roles.map(role => (
              <button key={role.id} onClick={() => setActiveRole(role.id)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors
                  ${activeRole === role.id ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {role.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input type="email" placeholder={`${activeRole}@university.edu`}
                {...register('email', { required: 'Email is required' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" placeholder="Enter your password"
                {...register('password', { required: 'Password is required' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Admin: admin@university.edu / Admin@123<br />
              Student: student1@university.edu / Student@123
            </p>
          </div>
        </div>

        <p className="text-center text-primary-200 text-sm mt-6">
          <Link to="/" className="hover:text-white">← Back to Home</Link>
        </p>
      </motion.div>
    </div>
  );
}
