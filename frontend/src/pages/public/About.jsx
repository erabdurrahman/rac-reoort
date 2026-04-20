import React from 'react';
import { Link } from 'react-router-dom';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-primary-600 font-semibold">
          <AcademicCapIcon className="w-6 h-6" /> RAC Report System
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600 font-medium">About</span>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">About RAC Report System</h1>
        <p className="text-slate-600 mb-6 leading-relaxed">
          The Automated RAC (Research Advisory Committee) Report Generation System is a comprehensive platform
          designed to streamline the management and reporting of PhD research progress at universities.
        </p>
        <div className="grid gap-6">
          {[
            { title: 'Mission', desc: 'To simplify the administrative burden of PhD program management while ensuring transparent and timely reporting of research progress.' },
            { title: 'Key Features', desc: 'Automated PDF generation, role-based access control, real-time notifications, progress analytics, and seamless communication between students, supervisors, and administrators.' },
            { title: 'Technology', desc: 'Built with modern web technologies including React.js, Node.js, MongoDB, and PDF generation capabilities for producing professional committee reports.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-2">{item.title}</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/" className="btn-primary">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
