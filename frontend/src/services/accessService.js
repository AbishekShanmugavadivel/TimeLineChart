import api from './api';

export const accessService = {
  verifyAccess: async (code) => {
    const response = await api.post('/access/verify', { code });
    return response.data;
  },
  getStatus: async () => {
    const response = await api.get('/access/status');
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/access/logout');
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  }
};

export default accessService;
