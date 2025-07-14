import { create } from 'zustand';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import lien from "../components/lien.js"; // ✅ Correct pour Vite + jwt-decode v4

export const useMessageStore = create((set, get) => ({
    messages: [],
    token: '',
    currentUserId: null,

    // ✅ Définir le token et extraire l'ID utilisateur du JWT
    setToken: (token) => {
        try {
            const decoded = jwtDecode(token);
            const userId = decoded.id || decoded.sub || decoded.userId; // 🔁 adaptatif
            if (!userId) throw new Error("Champ d'identifiant introuvable dans le token");

            localStorage.setItem('jwt', token);
            set({ token, currentUserId: userId });
        } catch (err) {
            console.error('❌ Erreur de décodage du JWT dans setToken :', err);
            localStorage.removeItem('jwt');
            set({ token: '', currentUserId: null });
        }
    },

    // ✅ Récupérer l'utilisateur connecté depuis le back
    fetchCurrentUser: async () => {
        const { token } = get();
        if (!token) return;

        try {
            const res = await axios.get(lien.url+'/connection/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({ currentUserId: res.data.id });
        } catch (err) {
            console.error('❌ Erreur récupération user connecté :', err);
            localStorage.removeItem('jwt');
            set({ token: '', currentUserId: null });
        }
    },

    // ✅ Envoie un message
    sendMessage: async (receiverId, content) => {
        const { token, currentUserId } = get();
        try {
            await axios.post(
                lien.url+'/messages/send',
                { senderId: currentUserId, receiverId, content },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } catch (err) {
            console.error('❌ Erreur send message:', err);
        }
    },

    // ✅ Récupère tous les messages
    fetchAllMessages: async () => {
        const { token } = get();
        try {
            const res = await axios.get(lien.url+'/messages/all', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Cache-Control': 'no-cache',
                },
            });
            set({ messages: res.data });
        } catch (err) {
            console.error('❌ Erreur fetch all messages:', err);
        }
    },
}));

// ✅ Initialisation du token au chargement (si déjà en localStorage)
(() => {
    const storedToken = localStorage.getItem('jwt');
    if (storedToken) {
        useMessageStore.getState().setToken(storedToken); // 🔁 Réutilisation propre
    }
})();
