import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const apiService = {
  // Auth
  login: (email, password) =>
    axios.post(`${API_URL}/auth/login`, { email, password }),
  
  register: (userData) =>
    axios.post(`${API_URL}/auth/register`, userData),

  // Results
  uploadResults: (file, token) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/results/upload`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  getParentResults: (parentId, token) =>
    axios.get(`${API_URL}/results/parent/${parentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};
