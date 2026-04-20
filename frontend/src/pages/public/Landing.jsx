import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AcademicCapIcon, DocumentTextIcon, ChartBarIcon, ShieldCheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const features = [
  { icon: DocumentTextIcon, title: 'Automated PDF Reports', desc: 'Generate professional RAC reports with a single click, pre-filled with student and supervisor details.' },
  { icon: AcademicCapIcon, title: 'Scholar Management', desc: 'Complete lifecycle management of PhD scholars from registration to thesis submission.' },
  { icon: ChartBarIcon, title: 'Progress Analytics', desc: 'Visual dashboards and charts for tracking research progress across departments.' },
  { icon: ShieldCheckIcon, title: 'Role-Based Access', desc: 'Secure access control for admins, supervisors, and students with JWT authentication.' },
];

const loginRoles = [
  { role: 'Admin', path: '/login/admin', color: 'from-blue-600 to-blue-700', desc: 'System administrator' },
  { role: 'Supervisor', path: '/login/supervisor', color: 'from-indigo-600 to-indigo-700', desc: 'Research supervisor' },
  { role: 'Student', path: '/login/student', color: 'from-sky-500 to-sky-600', desc: 'PhD scholar' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
            <AcademicCapIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">RAC Report System</span>
        </div>
        <div className="flex gap-3">
          <Link to="/about" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">About</Link>
          <Link to="/contact" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Contact</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-20 pb-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-500/30 mb-6">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            Automated RAC Report Generation System
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Simplify PhD Research <br />
            <span className="bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">
              Progress Reports
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            A complete platform for universities to manage PhD scholars, generate RAC reports, schedule committee meetings, and track research progress.
          </p>

          {/* Login cards */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {loginRoles.map((r, i) => (
              <motion.div
                key={r.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Link
                  to={r.path}
                  className={`flex items-center gap-3 bg-gradient-to-r ${r.color} text-white font-semibold px-6 py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl group`}
                >
                  <span>{r.role} Login</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-16 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-6 text-center">
        <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} RAC Report System. Built for PhD Research Excellence.</p>
      </footer>
    </div>
  );
}
