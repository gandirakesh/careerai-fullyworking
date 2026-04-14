import axios from 'axios';

const api = axios.create({
  baseURL: 'https://career-ai-p1fj.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

export default api;