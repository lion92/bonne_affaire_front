import { create } from 'zustand';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import lien from "../components/lien.js"; // ✅ Correct pour Vite + jwt-decode v4

export const useMessageStore = create((set, get) => ({
    messages: [],
    token: '',
    currentUserId: null,
    lastFetch: 0,
    isLoading: false,

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

    // ✅ Récupère tous les messages avec cache et déduplication
    fetchAllMessages: async (force = false) => {
        const { token, lastFetch, isLoading, messages } = get();

        // Cache : éviter les appels trop fréquents (< 3 secondes)
        const now = Date.now();
        if (!force && (now - lastFetch < 3000) && messages.length > 0) {
            return; // Skip si récent
        }

        // Éviter les appels concurrents
        if (isLoading) return;

        set({ isLoading: true });

        try {
            const res = await axios.get(lien.url+'/messages/all', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Cache-Control': 'no-cache',
                },
            });

            // Déduplication des messages par ID
            const newMessages = res.data || [];
            const uniqueMessages = newMessages.filter((msg, index, arr) =>
                arr.findIndex(m => m.id === msg.id) === index
            );

            set({
                messages: uniqueMessages,
                lastFetch: now,
                isLoading: false
            });
        } catch (err) {
            console.error('❌ Erreur fetch all messages:', err);
            set({ isLoading: false });
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
