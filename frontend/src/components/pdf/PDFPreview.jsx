import React from 'react';

export default function PDFPreview({ pdfUrl }) {
  if (!pdfUrl) return (
    <div className="flex items-center justify-center h-64 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300">
      <p className="text-slate-500 text-sm">No PDF generated yet</p>
    </div>
  );

  const fullUrl = pdfUrl.startsWith('http') ? pdfUrl : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${pdfUrl}`;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
        <span className="text-sm font-medium text-slate-700">PDF Preview</span>
        <a href={fullUrl} target="_blank" rel="noopener noreferrer"
          className="text-xs text-primary-600 hover:text-primary-700 font-medium">
          Open in new tab ↗
        </a>
      </div>
      <iframe
        src={fullUrl}
        className="w-full"
        style={{ height: '500px' }}
        title="RAC Report PDF"
      />
    </div>
  );
}
