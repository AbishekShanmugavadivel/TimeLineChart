import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  savePhase: async (phaseData) => {
    const response = await api.post('/admin/roadmap', phaseData);
    return response.data;
  },
  saveTask: async (taskData) => {
    const response = await api.post('/admin/tasks', taskData);
    return response.data;
  }
};
