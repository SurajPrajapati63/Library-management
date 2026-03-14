import api from './api';

export function register(payload) {
  return api.post('/api/auth/register', payload);
}

export function login(payload) {
  return api.post('/api/auth/login', payload);
}
