import { create } from 'zustand';
import axios from 'axios';

export const useCategoryStore = create((set) => ({
    categories: [],
    loading: false,
    error: null,

    // Récupérer toutes les catégories
    fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get('http://localhost:3004/categories');
            set({ categories: res.data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    // Récupérer une catégorie par ID
    fetchCategoryById: async (id) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`http://localhost:3004/categories/${id}`);
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

    // Créer une catégorie
    createCategory: async (name) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.post('http://localhost:3004/categories', { name });
            set((state) => ({
                categories: [...state.categories, res.data],
                loading: false,
            }));
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    // Mettre à jour une catégorie
    updateCategory: async (id, name) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.put(`http://localhost:3004/categories/${id}`, { name });
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

    // Supprimer une catégorie
    deleteCategory: async (id) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`http://localhost:3004/categories/${id}`);
            set((state) => ({
                categories: state.categories.filter((c) => c.id !== id),
                loading: false,
            }));
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
}));
