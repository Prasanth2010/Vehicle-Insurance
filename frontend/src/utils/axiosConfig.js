// src/utils/axiosConfig.js

import axios from 'axios';

// Base URL from env (Vite requires VITE_ prefix)
axios.defaults.baseURL = import.meta.env.VITE_API_BASE || 'https://backend-1-0-yssy.onrender.com';

// Set token on app start
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axios;