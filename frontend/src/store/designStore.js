import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const useDesignStore = create((set, get) => ({
  designs: [],
  currentDesign: null,
  loading: false,
  error: null,

  getDesigns: async (token) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/api/designs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ designs: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  getDesign: async (id, token) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/api/designs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ currentDesign: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createDesign: async (name, description, data, category, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/designs`,
        { name, description, data, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        designs: [response.data, ...state.designs],
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateDesign: async (id, updates, token) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/designs/${id}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        designs: state.designs.map((d) => (d.id === id ? response.data : d)),
        currentDesign: response.data,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteDesign: async (id, token) => {
    try {
      await axios.delete(`${API_URL}/api/designs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        designs: state.designs.filter((d) => d.id !== id),
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));

export default useDesignStore;
