import api from './api';

export const milestoneService = {
  getMilestones: async () => {
    const response = await api.get('/milestones');
    return response.data;
  },
  toggleMilestone: async (id) => {
    const response = await api.put(`/milestones/${id}`);
    return response.data;
  }
};
