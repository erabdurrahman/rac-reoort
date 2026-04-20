import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AcademicCapIcon, DocumentTextIcon, ChartBarIcon, BellIcon, ShieldCheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const features = [
  { icon: DocumentTextIcon, title: 'Automated Reports', desc: 'Generate professional RAC reports with one click, eliminating manual paperwork.' },
  { icon: ShieldCheckIcon, title: 'Role-Based Access', desc: 'Separate dashboards for Admins, Students, and Supervisors with secure authentication.' },
  { icon: AcademicCapIcon, title: 'PDF Generation', desc: 'Download beautifully formatted RAC report PDFs with all required information.' },
  { icon: ChartBarIcon, title: 'Progress Tracking', desc: 'Track PhD scholar progress visually with charts and timelines.' },
  { icon: BellIcon, title: 'Notifications', desc: 'Email and in-app alerts for meetings, report submissions, and approvals.' },
  { icon: DocumentTextIcon, title: 'Analytics Dashboard', desc: 'Comprehensive analytics for administrators with department-wise insights.' }
];

const stats = [
  { value: '500+', label: 'PhD Scholars' },
  { value: '50+', label: 'Supervisors' },
  { value: '1000+', label: 'Reports Generated' },
  { value: '100%', label: 'Automated' }
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
              <AcademicCapIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">RAC Report System</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/about" className="text-slate-600 hover:text-slate-900 text-sm font-medium">About</Link>
            <Link to="/contact" className="text-slate-600 hover:text-slate-900 text-sm font-medium">Contact</Link>
            <Link to="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.1))]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6">
              🎓 University PhD Management System
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Automate Your PhD<br />
              <span className="text-primary-200">RAC Reports</span>
            </h1>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl">
              Eliminate repetitive paperwork, reduce errors, and streamline Research Advisory Committee report generation for PhD scholars.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                Get Started <ArrowRightIcon className="w-4 h-4" />
              </button>
              <Link to="/about" className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <p className="text-3xl font-bold text-primary-400">{stat.value}</p>
                <p className="text-slate-300 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Everything You Need</h2>
            <p className="text-slate-500 mt-3">Comprehensive tools for PhD research management</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-primary-100 mb-8">Join your university's digital PhD management system today.</p>
          <button onClick={() => navigate('/login')}
            className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
            Login to Dashboard
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} RAC Report System. Automated PhD Research Management.</p>
      </footer>
    </div>
  );
}
