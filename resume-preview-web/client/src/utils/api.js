import axios from 'axios';

const API_BASE = '/api';

export const resumeApi = {
  getAll: () => axios.get(`${API_BASE}/resumes`),
  getById: (id) => axios.get(`${API_BASE}/resumes/${id}`),
  create: (data) => axios.post(`${API_BASE}/resumes`, data),
  update: (id, data) => axios.put(`${API_BASE}/resumes/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/resumes/${id}`),
  exportPdf: async (data) => {
    const response = await axios.post(`${API_BASE}/pdf`, data, {
      responseType: 'blob'
    });
    return response.data;
  }
};
