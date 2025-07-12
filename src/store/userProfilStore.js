import {create} from 'zustand';
import axios from 'axios';
import lien from "../components/lien.js";
const API = lien?.url;

export const useUserProfileStore = create((set) => ({
    user: null,
    allUsers: [],
    allRoles: [],
    allPermissions: [],
    loading: false,
    error: null,
    likeCounts: {}, // { [dealId]: number }


    // 🔐 Récupérer le profil de l'utilisateur connecté
    fetchProfile: async (token) => {
        set({loading: true, error: null});
        try {
            const res = await axios.get(API+'/user-profile/me', {
                headers: {Authorization: `Bearer ${token}`},
            });
            set({user: res.data, loading: false});
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
            const res = await axios.get(API+'/user-profile', {
                headers: {Authorization: `Bearer ${token}`},
            });
            set({allUsers: res.data});
        } catch (err) {
            set({
                error: err.response?.data?.message || err.message,
            });
        }
    },

    // 🔁 Récupérer tous les rôles
    fetchAllRoles: async (token) => {
        try {
            const res = await axios.get(API+'/roles', {
                headers: {Authorization: `Bearer ${token}`},
            });
            set({allRoles: res.data});
        } catch (err) {
            set({error: err.response?.data?.message || err.message});
        }
    },

    // 🔁 Récupérer toutes les permissions
    fetchAllPermissions: async (token) => {
        try {
            const res = await axios.get(API+'/permission', {
                headers: {Authorization: `Bearer ${token}`},
            });
            set({allPermissions: res.data});
        } catch (err) {
            set({error: err.response?.data?.message || err.message});
        }
    },

    // ✏️ Mettre à jour les rôles d’un utilisateur (admin)
    updateRoles: async (userId, roleIds, token) => {
        try {
            await axios.put(API+'/user-profile/${userId}/roles', {roleIds}, {
                headers: {Authorization: `Bearer ${token}`},
            });
        } catch (err) {
            set({error: err.response?.data?.message || err.message});
        }
    },

    // ➕ Créer une nouvelle permission (admin)
    createPermission: async (permissionName, token) => {
        try {
            // ✅ Correction : envoyer { name: ... } au lieu de { permission: ... }
            await axios.post(API+'/permission', {name: permissionName}, {
                headers: {Authorization: `Bearer ${token}`},
            });

            // ✅ Recharge la liste après création
            const res = await axios.get(API+'/permission', {
                headers: {Authorization: `Bearer ${token}`},
            });
            set({allPermissions: res.data});
        } catch (err) {
            set({error: err.response?.data?.message || err.message});
        }
    },
    assignPermissionsToRole: async (roleId, permissionIds, token) => {
        console.log(permissionIds);
        try {
            await fetch(API+'/roles/${roleId}/permission', {
                method: 'POST', // ou PATCH selon ce que tu choisis
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ permissionIds })
            });
        } catch (error) {
            set({ error: "Erreur lors de l'attribution des permissions" });
        }
    },
    fetchLikeCount: async (dealId) => {
        try {
            const res = await fetch(`${API}/likes/count/${dealId}`); // ✅ Pas besoin de token ici
            const data = await res.json();
            set((state) => ({
                likeCounts: {
                    ...state.likeCounts,
                    [dealId]: data.count || 0,
                },
            }));
        } catch (err) {
            console.error("Erreur fetchLikeCount:", err);
        }
    },

    toggleLike: async (dealId, token) => {
        try {
            const res = await fetch(`${API}/likes/${dealId}/like`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            // ✅ Ajout : on rafraîchit le compteur après le like
            const resCount = await fetch(`${API}/likes/count/${dealId}`);
            const dataCount = await resCount.json();

            set((state) => ({
                likeCounts: {
                    ...state.likeCounts,
                    [dealId]: dataCount.count || 0,
                },
            }));
        } catch (err) {
            console.error("Erreur toggleLike:", err);
        }
    }



}));
