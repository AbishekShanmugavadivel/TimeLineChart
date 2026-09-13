import api from './api';

export const noteService = {
  getNotes: async (params) => {
    const response = await api.get('/notes', { params });
    return response.data;
  },
  createNote: async (noteData) => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },
  updateNote: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },
  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  }
};
