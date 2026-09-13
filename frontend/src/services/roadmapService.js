import api from './api';

export const roadmapService = {
  getAllPhases: async () => {
    const response = await api.get('/roadmap');
    return response.data;
  },
  getPhaseById: async (phaseId) => {
    const response = await api.get(`/roadmap/${phaseId}`);
    return response.data;
  },
  getDayByNumber: async (dayNumber) => {
    const response = await api.get(`/roadmap/day/${dayNumber}`);
    return response.data;
  }
};
