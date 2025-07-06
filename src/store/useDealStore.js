import { create } from 'zustand';
import axios from 'axios';

export const useDealStore = create((set) => ({
    deals: [],
    loading: false,
    error: null,

    fetchDeals: async (token) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get('http://localhost:3004/deals', {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({ deals: res.data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchDealById: async (id, token) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`http://localhost:3004/deals/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set((state) => ({
                deals: [
                    ...state.deals.filter((d) => d.id !== res.data.id),
                    res.data,
                ],
                loading: false,
            }));
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    createDeal: async (deal, token) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.post('http://localhost:3004/deals', deal, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set((state) => ({
                deals: [...state.deals, res.data],
                loading: false,
            }));
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    updateDeal: async (id, deal, token) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.put(`http://localhost:3004/deals/${id}`, deal, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set((state) => ({
                deals: state.deals.map((d) => (d.id === id ? res.data : d)),
                loading: false,
            }));
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    deleteDeal: async (id, token) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`http://localhost:3004/deals/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set((state) => ({
                deals: state.deals.filter((d) => d.id !== id),
                loading: false,
            }));
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
}));
