import axios from 'axios';

const api = axios.create();

const isLocalDevHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const configuredApiBaseUrl = process.env.REACT_APP_API_BASE_URL;

if (configuredApiBaseUrl) {
  api.defaults.baseURL = configuredApiBaseUrl;
} else if (isLocalDevHost && window.location.port !== '5004') {
  api.defaults.baseURL = 'http://localhost:5004';
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
