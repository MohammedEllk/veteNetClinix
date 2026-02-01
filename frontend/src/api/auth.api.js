import axios from 'axios';
import API_BASE_URL from './apiConfig';

const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email, password) => {
  try {
    const response = await authAPI.post('/login', { email, password });
    const { user, accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    return { user };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logout = () => {
  localStorage.removeItem('accessToken');
};

export const register = async (name, email, password) => {
  try {
    const response = await authAPI.post('/register', { name, email, password });
    const { user, accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    return { user };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const response = await authAPI.get('/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    localStorage.removeItem('accessToken');
    return null;
  }
};
