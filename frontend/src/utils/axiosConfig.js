// src/utils/axiosConfig.js

import axios from 'axios';

// Set token on app start
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axios;