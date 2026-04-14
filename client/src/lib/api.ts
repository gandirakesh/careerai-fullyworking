import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // ✅ FIXED
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('careerai_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;