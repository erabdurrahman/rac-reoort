import api from './api';

export const studentService = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  getByUserId: (userId) => api.get(`/students/by-user/${userId}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

export const supervisorService = {
  getAll: (params) => api.get('/supervisors', { params }),
  getById: (id) => api.get(`/supervisors/${id}`),
  getByUserId: (userId) => api.get(`/supervisors/by-user/${userId}`),
  create: (data) => api.post('/supervisors', data),
  update: (id, data) => api.put(`/supervisors/${id}`, data),
  delete: (id) => api.delete(`/supervisors/${id}`),
};

export const departmentService = {
  getAll: () => api.get('/departments'),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const meetingService = {
  getAll: (params) => api.get('/meetings', { params }),
  getById: (id) => api.get(`/meetings/${id}`),
  getUpcoming: () => api.get('/meetings/upcoming'),
  create: (data) => api.post('/meetings', data),
  update: (id, data) => api.put(`/meetings/${id}`, data),
  delete: (id) => api.delete(`/meetings/${id}`),
};
