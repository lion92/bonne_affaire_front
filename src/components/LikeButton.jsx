import { useUserProfileStore } from "../store/userProfilStore.js";

export default function LikeButton({ dealId }) {
    const token = localStorage.getItem("jwt");
    const { toggleLike, fetchLikeCount } = useUserProfileStore();

    const handleLike = async () => {
        await toggleLike(dealId, token);
        await fetchLikeCount(dealId); // <-- mettre à jour après le like
    };

    return (
        <button onClick={handleLike} className="button small">
            👍 J’aime
        </button>
    );
}
