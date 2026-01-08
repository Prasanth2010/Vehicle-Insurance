// src/utils/axiosInterceptor.js

import axios from 'axios';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Ensure baseURL from env is applied if not already
  const base = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_URL;
  if (!axios.defaults.baseURL && base) {
    axios.defaults.baseURL = base;
  }
  // Sanitize bad URLs that include 'undefined/' or localhost hardcoding
  if (typeof config.url === 'string') {
    if (config.url.startsWith('undefined/')) {
      config.url = config.url.replace(/^undefined\//, '');
    }
    if (config.url.startsWith('http://localhost:8080')) {
      config.url = config.url.replace('http://localhost:8080', '');
    }
  }
  return config;
});

export default axios;