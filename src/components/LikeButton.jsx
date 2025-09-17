import { useUserProfileStore } from "../store/userProfilStore.js";

export default function LikeButton({ linkId, dealId }) {
    const token = localStorage.getItem("jwt");
    const { toggleLike, fetchLikeCount } = useUserProfileStore();

    const id = linkId || dealId; // Support both props for backward compatibility

    const handleLike = async () => {
        await toggleLike(id, token);
        await fetchLikeCount(id); // <-- mettre à jour après le like
    };

    return (
        <button onClick={handleLike} className="button small">
            👍 J’aime
        </button>
    );
}
