import React from 'react';

export default function Table({ columns, data, loading, emptyMessage = 'No data found' }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {columns.map(col => (
              <th key={col.key} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data?.length === 0 ? (
            <tr><td colSpan={columns.length} className="py-12 text-center text-slate-400">{emptyMessage}</td></tr>
          ) : (
            data?.map((row, i) => (
              <tr key={row._id || i} className="hover:bg-slate-50 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="py-3 px-4 text-slate-700">
                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
