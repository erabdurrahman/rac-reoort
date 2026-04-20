import api from './api';

export const reportService = {
  getAll: (params) => api.get('/reports', { params }),
  getById: (id) => api.get(`/reports/${id}`),
  getStats: () => api.get('/reports/stats'),
  create: (data) => api.post('/reports', data),
  update: (id, data) => api.put(`/reports/${id}`, data),
  delete: (id) => api.delete(`/reports/${id}`),
  generatePDF: (id) => api.post(`/reports/${id}/generate-pdf`),
  approve: (id, data) => api.put(`/reports/${id}/approve`, data),
};
