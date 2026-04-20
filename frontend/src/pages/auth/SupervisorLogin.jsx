import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { UserGroupIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function SupervisorLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password, 'supervisor');
      toast.success('Welcome back!');
      navigate('/supervisor');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-700 to-blue-700 px-8 py-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserGroupIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Supervisor Login</h1>
            <p className="text-indigo-200 text-sm mt-1">Research Supervisor Portal</p>
          </div>
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input label="Email Address" type="email" icon={EnvelopeIcon} placeholder="supervisor@university.edu"
                error={errors.email?.message}
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
              />
              <Input label="Password" type="password" icon={LockClosedIcon} placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password', { required: 'Password is required' })}
              />
              <Button type="submit" loading={loading} className="w-full" size="lg">Sign In as Supervisor</Button>
            </form>
            <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-xs text-indigo-700 font-medium mb-1">Demo Credentials</p>
              <p className="text-xs text-indigo-600">Email: rajesh.kumar@university.edu</p>
              <p className="text-xs text-indigo-600">Password: Supervisor@123</p>
            </div>
            <p className="text-center text-sm text-slate-500 mt-6">
              <Link to="/login/admin" className="text-primary-600 hover:underline font-medium">Admin</Link>
              {' | '}
              <Link to="/login/student" className="text-primary-600 hover:underline font-medium">Student</Link>
            </p>
            <p className="text-center mt-3">
              <Link to="/" className="text-sm text-slate-400 hover:text-slate-600">← Back to Home</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
