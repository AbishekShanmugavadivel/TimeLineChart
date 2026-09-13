import api from './api';

export const careerService = {
  getCareerReadiness: async () => {
    const response = await api.get('/career');
    return response.data;
  }
};
