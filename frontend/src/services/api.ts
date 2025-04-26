import axios from 'axios';
import config from '../config/config';

const api = axios.create({
  baseURL: config.backendUrl,
  withCredentials: true
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const getUserData = async (token: string) => {
  const response = await api.get('/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};