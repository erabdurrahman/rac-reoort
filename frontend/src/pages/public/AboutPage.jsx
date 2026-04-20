import React from 'react';
import { Link } from 'react-router-dom';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <AcademicCapIcon className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900">RAC Report System</span>
        </Link>
      </nav>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">About RAC Report System</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
          <p className="text-lg">The Research Advisory Committee (RAC) Report System is a full-stack platform designed to automate the generation and management of RAC reports for PhD scholars at universities and research institutions.</p>
          <h2 className="text-2xl font-bold text-slate-800">Purpose</h2>
          <p>Traditionally, RAC reports are manually created every 6 months for each PhD scholar, resulting in significant administrative burden. This system eliminates repetitive paperwork, reduces human errors, centralizes all records, and dramatically improves workflow efficiency.</p>
          <h2 className="text-2xl font-bold text-slate-800">Key Features</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Automated PDF report generation with university-standard formatting</li>
            <li>Role-based access for Admins, Students, and Supervisors</li>
            <li>Real-time progress tracking and status updates</li>
            <li>Email notifications and in-app alerts</li>
            <li>Analytics dashboard with department-wise insights</li>
            <li>Secure JWT-based authentication</li>
          </ul>
          <h2 className="text-2xl font-bold text-slate-800">Technology</h2>
          <p>Built with React.js, Node.js, Express.js, MongoDB, and Tailwind CSS for a modern, responsive experience.</p>
        </div>
        <div className="mt-8">
          <Link to="/login" className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
