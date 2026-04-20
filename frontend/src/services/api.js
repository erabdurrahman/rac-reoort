import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: data => api.post('/auth/register', data),
  login: data => api.post('/auth/login', data),
  forgotPassword: data => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.post(`/auth/reset-password/${token}`, data),
  getMe: () => api.get('/auth/me'),
  updateProfile: data => api.put('/auth/update-profile', data),
  changePassword: data => api.put('/auth/change-password', data),
  logout: () => api.post('/auth/logout')
};

export const studentAPI = {
  getAll: params => api.get('/students', { params }),
  getById: id => api.get(`/students/${id}`),
  create: data => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: id => api.delete(`/students/${id}`),
  getMyProfile: () => api.get('/students/me/profile'),
  updateProgress: data => api.put('/students/me/progress', data),
  uploadDocument: formData => api.post('/students/me/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
};

export const supervisorAPI = {
  getAll: params => api.get('/supervisors', { params }),
  getById: id => api.get(`/supervisors/${id}`),
  create: data => api.post('/supervisors', data),
  update: (id, data) => api.put(`/supervisors/${id}`, data),
  delete: id => api.delete(`/supervisors/${id}`),
  getMyProfile: () => api.get('/supervisors/me/profile'),
  getMyStudents: () => api.get('/supervisors/me/students')
};

export const reportAPI = {
  getAll: params => api.get('/reports', { params }),
  getById: id => api.get(`/reports/${id}`),
  create: data => api.post('/reports', data),
  update: (id, data) => api.put(`/reports/${id}`, data),
  review: (id, data) => api.post(`/reports/${id}/review`, data),
  getPDF: id => api.get(`/reports/${id}/pdf`, { responseType: 'blob' }),
  getMyReports: () => api.get('/reports/me/my-reports'),
  getDashboardStats: () => api.get('/reports/stats/dashboard')
};

export const meetingAPI = {
  getAll: () => api.get('/meetings'),
  getById: id => api.get(`/meetings/${id}`),
  create: data => api.post('/meetings', data),
  update: (id, data) => api.put(`/meetings/${id}`, data),
  delete: id => api.delete(`/meetings/${id}`),
  getUpcoming: () => api.get('/meetings/upcoming')
};

export const notificationAPI = {
  getMy: () => api.get('/notifications/me'),
  markRead: id => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  delete: id => api.delete(`/notifications/${id}`)
};

export const departmentAPI = {
  getAll: () => api.get('/departments'),
  getById: id => api.get(`/departments/${id}`),
  create: data => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: id => api.delete(`/departments/${id}`),
  getStats: () => api.get('/departments/stats')
};

export const userAPI = {
  getAll: params => api.get('/users', { params }),
  getById: id => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: id => api.delete(`/users/${id}`),
  toggleStatus: id => api.put(`/users/${id}/toggle-status`),
  getDashboardStats: () => api.get('/users/admin/dashboard-stats')
};

export default api;
