import { create } from 'zustand';
import axios from 'axios';

export const useDealStore = create((set) => ({
    deals: [],
    categories: [],
    loading: false,
    error: null,

    fetchDeals: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get('/api/deals');
            set({ deals: res.data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get('/api/categories');
            set({ categories: res.data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    createDeal: async (deal) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.post('/api/deals', deal);
            set((state) => ({
                deals: [...state.deals, res.data],
                loading: false,
            }));
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    updateDeal: async (id, deal) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.put(`/api/deals/${id}`, deal);
            set((state) => ({
                deals: state.deals.map((d) => (d.id === id ? res.data : d)),
                loading: false,
            }));
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    deleteDeal: async (id) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`/api/deals/${id}`);
            set((state) => ({
                deals: state.deals.filter((d) => d.id !== id),
                loading: false,
            }));
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
}));
