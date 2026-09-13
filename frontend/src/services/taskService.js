import api from './api';

export const taskService = {
  getTodayTasks: async () => {
    const response = await api.get('/tasks/today');
    return response.data;
  },
  getAllTasks: async (params) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },
  completeTask: async (taskId) => {
    const response = await api.put(`/tasks/${taskId}/complete`);
    return response.data;
  },
  uncompleteTask: async (taskId) => {
    const response = await api.put(`/tasks/${taskId}/uncomplete`);
    return response.data;
  }
};
