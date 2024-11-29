import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:7853/api', // Update this if your backend is deployed
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
