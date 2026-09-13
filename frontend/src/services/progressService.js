import api from './api';

export const progressService = {
  getOverallProgress: async () => {
    const response = await api.get('/progress');
    return response.data;
  },
  getWeeklyProgress: async () => {
    const response = await api.get('/progress/weekly');
    return response.data;
  },
  getMonthlyProgress: async () => {
    const response = await api.get('/progress/monthly');
    return response.data;
  }
};
