import create from 'zustand';
import axios from 'axios';

const rawApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const API_URL = rawApiUrl.startsWith('http') ? rawApiUrl : `https://${rawApiUrl}`;

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, loading: false });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      set({ loading: false });
      return false;
    }
  },

  register: async (email, password, name) => {
    set({ loading: true });
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        name,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, loading: false });
      return true;
    } catch (error) {
      console.error('Register error:', error);
      set({ loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  loadFromStorage: () => {
    const token = localStorage.getItem('token');
    if (token) {
      set({ token });
    }
  },
}));

export default useAuthStore;
