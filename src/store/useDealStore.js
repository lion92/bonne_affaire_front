import {create} from 'zustand';
import axios from 'axios';
import lien from "../components/lien.js";

const BASE_URL = lien?.url;

export const useDealStore = create((set) => ({
    deals: [],
    loading: false,
    error: null,

    fetchActiveDeals: async (token) => {
        set({loading: true, error: null});
        try {
            const res = await axios.get(`${BASE_URL}/deals/active`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            set({deals: res.data, loading: false});
        } catch (err) {
            set({error: err.message, loading: false});
        }
    },

    fetchDeals: async (token) => {
        set({loading: true, error: null});
        try {
            const res = await axios.get(`${BASE_URL}/deals`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            set({deals: res.data, loading: false});
        } catch (err) {
            set({error: err.message, loading: false});
        }
    },
    fetchDealById: async (id, token) => {
        set({loading: true, error: null});
        try {
            const res = await axios.get(`${BASE_URL}/deals/${id}`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            set((state) => ({
                deals: [
                    ...state.deals.filter((d) => d.id !== res.data.id),
                    res.data,
                ],
                loading: false,
            }));
        } catch (err) {
            set({error: err.message, loading: false});
        }
    },

    createDeal: async (deal, token) => {
        set({loading: true, error: null});
        try {
            const res = await axios.post(`${BASE_URL}/deals`, deal, {
                headers: {Authorization: `Bearer ${token}`},
            });
            set((state) => ({
                deals: [...state.deals, res.data],
                loading: false,
            }));
        } catch (err) {
            set({error: err.message, loading: false});
        }
    },

    deleteDeal: async (id, token) => {
        set({loading: true, error: null});
        try {
            await axios.delete(`${BASE_URL}/deals/${id}`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            set((state) => ({
                deals: state.deals.filter((d) => d.id !== id),
                loading: false,
            }));
        } catch (err) {
            set({error: err.message, loading: false});
        }
    },
    updateDeal: async (id, updatedData, token) => {
        try {
            const response = await fetch(`${BASE_URL}/deals/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) throw new Error('Erreur lors de la mise à jour');

            const updatedDeal = await response.json();

            set((state) => ({
                deals: state.deals.map((deal) =>
                    deal.id === id ? updatedDeal : deal
                ),
            }));
        } catch (error) {
            console.error("Erreur updateDeal:", error);
        }
    },
}));
