import { create } from 'zustand';
import lien from "../components/lien.js";

const BASE_LIKE_API = lien?.url + '/likes';

export const useLikeStore = create((set, get) => ({
    likes: {}, // { [dealId]: { liked: bool, count: number } }

    fetchLikeStatus: async (dealId, token) => {
        try {
            const [countRes, likedRes] = await Promise.all([
                fetch(`${BASE_LIKE_API}/count/${dealId}`),
                fetch(`${BASE_LIKE_API}/has-liked/${dealId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            const { count } = await countRes.json();
            const { liked } = await likedRes.json();

            set(state => ({
                likes: {
                    ...state.likes,
                    [dealId]: { liked, count },
                }
            }));
        } catch (error) {
            console.error("Erreur lors de la récupération des likes :", error);
        }
    },

    toggleLike: async (dealId, token) => {
        try {
            const res = await fetch(`${BASE_LIKE_API}/${dealId}/like`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });

            const { liked, count } = await res.json(); // ✅ récupère les deux

            set(state => ({
                likes: {
                    ...state.likes,
                    [dealId]: { liked, count },
                }
            }));
        } catch (error) {
            console.error("Erreur lors du toggle like :", error);
        }
    }
}));
