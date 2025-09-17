import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLinkStore } from "../store/useLinkStore.js";
import { useCategoryStore } from "../store/useCategoryStore.js";
import "../css/addDeal.css";

export default function AddLink() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const navigate = useNavigate();
    const createLink = useLinkStore((s) => s.createLink);
    const { categories, fetchCategories, loading, error } = useCategoryStore();

    // Charger les catégories une seule fois
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token && categories.length === 0) {
            fetchCategories(token);
        }
    }, [categories.length, fetchCategories]);

    const detectPlatform = (url) => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return 'YouTube';
        } else if (url.includes('linkedin.com')) {
            return 'LinkedIn';
        }
        return null; // Retourne null pour les plateformes non supportées
    };

    const isValidPlatform = (url) => {
        const youtubePatterns = [
            /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)/i,
        ];
        const linkedinPatterns = [
            /^https?:\/\/(www\.)?linkedin\.com\/(posts|feed|pulse|in)\/.*$/i,
            /^https?:\/\/(www\.)?linkedin\.com\/company\/.*$/i,
            /^https?:\/\/(www\.)?linkedin\.com\/showcase\/.*$/i
        ];

        return youtubePatterns.some(pattern => pattern.test(url)) || 
               linkedinPatterns.some(pattern => pattern.test(url));
    };

    const extractThumbnail = (url) => {
        if (url.includes('youtube.com/watch')) {
            const videoId = url.split('v=')[1]?.split('&')[0];
            return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
        } else if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1]?.split('?')[0];
            return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
        }
        return imageUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation des champs
        const urlRegex = /^https?:\/\//;
        if (!urlRegex.test(url)) {
            alert("Le lien doit commencer par http ou https.");
            return;
        }

        // Validation de la plateforme
        if (!isValidPlatform(url)) {
            alert("Seuls les liens YouTube et LinkedIn sont acceptés.\n\nExemples valides :\n• YouTube: https://www.youtube.com/watch?v=...\n• LinkedIn: https://www.linkedin.com/posts/...");
            return;
        }

        if (!categoryId) {
            alert("Veuillez sélectionner une plateforme.");
            return;
        }

        const token = localStorage.getItem("jwt");
        if (!token) {
            alert("Vous devez être connecté pour partager un lien.");
            return;
        }

        const platform = detectPlatform(url);
        const thumbnail = extractThumbnail(url);

        const newLink = {
            title: title.trim(),
            description: description.trim(),
            url: url.trim(),
            imageUrl: thumbnail || imageUrl.trim(),
            platform: platform,
            isActive: false,
            categoryId: parseInt(categoryId, 10),
        };

        try {
            await createLink(newLink, token);
            alert("Lien partagé avec succès !");
            setTitle("");
            setDescription("");
            setUrl("");
            setImageUrl("");
            setCategoryId("");
            navigate("/home");
        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue lors du partage.");
        }
    };

    return (
        <main className="container">
            <h1>Partager un lien YouTube ou LinkedIn</h1>
            <div className="platform-info">
                <p><strong>Plateformes acceptées uniquement :</strong></p>
                <div className="platform-examples">
                    <div className="platform-example">
                        <span className="platform-icon">🎥</span>
                        <div>
                            <strong>YouTube</strong>
                            <small>https://www.youtube.com/watch?v=...</small>
                        </div>
                    </div>
                    <div className="platform-example">
                        <span className="platform-icon">💼</span>
                        <div>
                            <strong>LinkedIn</strong>
                            <small>https://www.linkedin.com/posts/...</small>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    placeholder="Titre du contenu"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description (optionnelle)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="url-input-group">
                    <input
                        type="url"
                        placeholder="Lien YouTube ou LinkedIn uniquement"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className={url && !isValidPlatform(url) ? 'error' : ''}
                        required
                    />
                    {url && !isValidPlatform(url) && (
                        <div className="validation-error">
                            ❌ Seuls les liens YouTube et LinkedIn sont acceptés
                        </div>
                    )}
                    {url && isValidPlatform(url) && (
                        <div className="validation-success">
                            ✅ {detectPlatform(url)} - Lien valide !
                        </div>
                    )}
                </div>
                <input
                    type="url"
                    placeholder="URL de l'image (optionnelle - auto-détectée pour YouTube)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />

                {loading ? (
                    <p>Chargement des plateformes...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        <option value="">-- Choisir une plateforme --</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                )}

                <button type="submit" className="button">Partager</button>
            </form>
        </main>
    );
}