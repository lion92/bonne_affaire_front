import {create} from 'zustand';
import axios from 'axios';
import lien from "../components/lien.js";

const BASE_URL = lien?.url;

export const useLinkStore = create((set) => ({
    links: [],
    loading: false,
    error: null,

    fetchActiveLinks: async (token) => {
        set({loading: true, error: null});
        try {
            const res = await axios.get(`${BASE_URL}/links/active`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            set({links: res.data, loading: false});
        } catch (err) {
            set({error: err.message, loading: false});
        }
    },

    fetchLinks: async (token) => {
        set({loading: true, error: null});
        try {
            const res = await axios.get(`${BASE_URL}/links`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            set({links: res.data, loading: false});
        } catch (err) {
            set({error: err.message, loading: false});
        }
    },

    fetchLinkById: async (id, token) => {
        set({loading: true, error: null});
        try {
            const res = await axios.get(`${BASE_URL}/links/${id}`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            set((state) => ({
                links: [
                    ...state.links.filter((l) => l.id !== res.data.id),
                    res.data,
                ],
                loading: false,
            }));
        } catch (err) {
            set({error: err.message, loading: false});
        }
    },

    createLink: async (link, token) => {
        set({loading: true, error: null});
        try {
            const res = await axios.post(`${BASE_URL}/links`, link, {
                headers: {Authorization: `Bearer ${token}`},
            });
            set((state) => ({
                links: [...state.links, res.data],
                loading: false,
            }));
        } catch (err) {
            set({error: err.message, loading: false});
        }
    },

    deleteLink: async (id, token) => {
        set({loading: true, error: null});
        try {
            await axios.delete(`${BASE_URL}/links/${id}`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            set((state) => ({
                links: state.links.filter((l) => l.id !== id),
                loading: false,
            }));
        } catch (err) {
            set({error: err.message, loading: false});
        }
    },

    // Routes publiques - sans token
    fetchPublicLinks: async () => {
        set({loading: true, error: null});
        try {
            const res = await axios.get(`${BASE_URL}/links/public`);
            set({links: res.data, loading: false});
        } catch (err) {
            set({error: err.message, loading: false});
        }
    },

    updateLink: async (id, updatedData, token) => {
        try {
            const response = await fetch(`${BASE_URL}/links/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) throw new Error('Erreur lors de la mise à jour');

            const updatedLink = await response.json();

            set((state) => ({
                links: state.links.map((link) =>
                    link.id === id ? updatedLink : link
                ),
            }));
        } catch (error) {
            console.error("Erreur updateLink:", error);
        }
    },

    // Mise à jour optimiste de la validation
    updateLinkValidation: (linkId, role, validated) => {
        set((state) => ({
            links: state.links.map((link) => {
                if (link.id === linkId) {
                    const updatedLink = { ...link };
                    if (role === 'manager') {
                        updatedLink.managerValidated = validated;
                    } else if (role === 'admin') {
                        updatedLink.adminValidated = validated;
                    }
                    return updatedLink;
                }
                return link;
            }),
        }));
    },
}));
