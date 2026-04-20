import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { studentAPI } from '../../services/api';
import { DocumentArrowUpIcon, DocumentIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Documents() {
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [docName, setDocName] = useState('');

  useEffect(() => {
    studentAPI.getMyProfile().then(r => setProfile(r.data.data)).catch(() => {});
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a file'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', docName || file.name);
      await studentAPI.uploadDocument(formData);
      toast.success('Document uploaded!');
      setFile(null);
      setDocName('');
      const r = await studentAPI.getMyProfile();
      setProfile(r.data.data);
    } catch { toast.error('Upload failed'); } finally { setUploading(false); }
  };

  return (
    <DashboardLayout title="Documents">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Upload Document">
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Document Name</label>
              <input value={docName} onChange={e => setDocName(e.target.value)} placeholder="e.g., Research Proposal"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select File</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <DocumentArrowUpIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <input type="file" onChange={e => setFile(e.target.files[0])} className="hidden" id="file-input" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                <label htmlFor="file-input" className="cursor-pointer text-sm text-primary-600 hover:underline">
                  {file ? file.name : 'Click to select file'}
                </label>
                <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
              </div>
            </div>
            <Button type="submit" loading={uploading} className="w-full">Upload Document</Button>
          </form>
        </Card>

        <Card title={`Uploaded Documents (${profile?.documents?.length || 0})`}>
          {!profile?.documents?.length ? (
            <p className="text-slate-400 text-center py-8">No documents uploaded yet</p>
          ) : (
            <div className="space-y-2">
              {profile.documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <DocumentIcon className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                    <p className="text-xs text-slate-500">{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : '—'}</p>
                  </div>
                  {doc.url && <a href={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${doc.url}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline">View</a>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
