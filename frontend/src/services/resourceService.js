import api from './api';

export const resourceService = {
  getResources: async (params) => {
    const response = await api.get('/resources', { params });
    return response.data;
  },
  createResource: async (resourceData) => {
    const response = await api.post('/resources', resourceData);
    return response.data;
  },
  deleteResource: async (id) => {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  }
};
