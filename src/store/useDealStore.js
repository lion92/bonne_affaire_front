import { create } from 'zustand';
import axios from 'axios';
import lien from "../components/lien.js";
const BASE_URL = lien?.url;

export const useDealStore = create((set) => ({
    deals: [],
    loading: false,
    error: null,

    fetchActiveDeals: async (token) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${BASE_URL}/deals/active`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ deals: res.data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchDeals: async (token) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${BASE_URL}/deals`, {
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
            const res = await axios.get(`${BASE_URL}/deals/${id}`, {
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
            const res = await axios.post(`${BASE_URL}/deals`, deal, {
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
            const res = await axios.put(`${BASE_URL}/deals/${id}`, deal, {
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
            await axios.delete(`${BASE_URL}/deals/${id}`, {
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
