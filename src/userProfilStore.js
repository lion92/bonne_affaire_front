import { create } from 'zustand';
import axios from 'axios';

const API = 'http://localhost:3004';

export const useUserProfileStore = create((set) => ({
    user: null,
    allUsers: [],
    allRoles: [],
    allPermissions: [],
    loading: false,
    error: null,

    // 🔐 Récupérer le profil de l'utilisateur connecté
    fetchProfile: async (token) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${API}/user-profile/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({ user: res.data, loading: false });
        } catch (err) {
            set({
                error: err.response?.data?.message || err.message,
                loading: false,
            });
        }
    },

    // 👥 Récupérer tous les utilisateurs (admin uniquement)
    fetchAllUsers: async (token) => {
        try {
            const res = await axios.get(`${API}/user-profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({ allUsers: res.data });
        } catch (err) {
            set({
                error: err.response?.data?.message || err.message,
            });
        }
    },

    // 🔁 Récupérer tous les rôles
    fetchAllRoles: async (token) => {
        try {
            const res = await axios.get(`${API}/roles`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({ allRoles: res.data });
        } catch (err) {
            set({ error: err.response?.data?.message || err.message });
        }
    },

    // 🔁 Récupérer toutes les permissions
    fetchAllPermissions: async (token) => {
        try {
            const res = await axios.get(`${API}/permission`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({ allPermissions: res.data });
        } catch (err) {
            set({ error: err.response?.data?.message || err.message });
        }
    },

    // ✏️ Mettre à jour les rôles d’un utilisateur (admin)
    updateRoles: async (userId, roleIds, token) => {
        try {
            await axios.put(`${API}/user-profile/${userId}/roles`, { roleIds }, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (err) {
            set({ error: err.response?.data?.message || err.message });
        }
    },

    // ➕ Créer une nouvelle permission (admin)
    createPermission: async (permissionName, token) => {
        try {
            // ✅ Correction : envoyer { name: ... } au lieu de { permission: ... }
            await axios.post(`${API}/permission`, { name: permissionName }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // ✅ Recharge la liste après création
            const res = await axios.get(`${API}/permission`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({ allPermissions: res.data });
        } catch (err) {
            set({ error: err.response?.data?.message || err.message });
        }
    },

}));
