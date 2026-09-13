import api from './api';

export const studyService = {
  recordSession: async (sessionData) => {
    const response = await api.post('/study/sessions', sessionData);
    return response.data;
  },
  getSessions: async () => {
    const response = await api.get('/study/sessions');
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/study/stats');
    return response.data;
  }
};
