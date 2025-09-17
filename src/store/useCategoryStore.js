import { create } from 'zustand';
import axios from 'axios';
import lien from "../components/lien.js";
const API_URL = lien.url+'/categories';

// Fonction utilitaire pour récupérer le token
const getAuthHeader = () => {
    const token = localStorage.getItem('jwt'); // ou via un autre store
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const useCategoryStore = create((set) => ({
    categories: [],
    loading: false,
    error: null,

    fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(API_URL, getAuthHeader());
            set({ categories: res.data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchCategoryById: async (id) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${API_URL}/${id}`, getAuthHeader());
            set((state) => ({
                categories: [
                    ...state.categories.filter((c) => c.id !== res.data.id),
                    res.data,
                ],
                loading: false,
            }));
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    createCategory: async (name) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.post(API_URL, { name }, getAuthHeader());
            set((state) => ({
                categories: [...state.categories, res.data],
                loading: false,
            }));
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    updateCategory: async (id, name) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.put(`${API_URL}/${id}`, { name }, getAuthHeader());
            set((state) => ({
                categories: state.categories.map((c) =>
                    c.id === id ? res.data : c
                ),
                loading: false,
            }));
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    deleteCategory: async (id) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`${API_URL}/${id}`, getAuthHeader());
            set((state) => ({
                categories: state.categories.filter((c) => c.id !== id),
                loading: false,
            }));
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    // Route publique pour les catégories
    fetchPublicCategories: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${API_URL}/public`);
            set({ categories: res.data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
}));
