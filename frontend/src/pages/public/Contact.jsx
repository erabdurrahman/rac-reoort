import React from 'react';
import { Link } from 'react-router-dom';
import { AcademicCapIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-primary-600 font-semibold">
          <AcademicCapIcon className="w-6 h-6" /> RAC Report System
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600 font-medium">Contact</span>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Contact Us</h1>
        <p className="text-slate-600 mb-8">Get in touch with the RAC Report System support team.</p>
        <div className="grid gap-4 mb-8">
          {[
            { icon: EnvelopeIcon, label: 'Email', value: 'support@university.edu' },
            { icon: PhoneIcon, label: 'Phone', value: '+91-11-2345-6789' },
            { icon: MapPinIcon, label: 'Address', value: 'University Campus, Academic Block, New Delhi - 110001' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 p-4">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="font-medium text-slate-900">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
        <Link to="/" className="btn-primary">← Back to Home</Link>
      </div>
    </div>
  );
}
