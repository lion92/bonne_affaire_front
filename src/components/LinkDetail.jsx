import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLinkStore } from '../store/useLinkStore.js';
import '../css/detail.css';
import Layout from "./Layout.jsx";

export default function LinkDetail() {
    const { id } = useParams();
    const { links, fetchLinkById, loading, error } = useLinkStore();

    const link = links.find((l) => String(l.id) === String(id));

    useEffect(() => {
        if (!link) {
            const token = localStorage.getItem("jwt");
            if (token) {
                fetchLinkById(id, token);
            }
        }
    }, [id, link, fetchLinkById]);

    if (loading) {
        return (
            <main className="container">
                <Layout/>
                <p>Chargement...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="container">
                <Layout/>
                <h1>Erreur</h1>
                <p>{error}</p>
                <Link to="/home" className="button">⬅ Retour</Link>
            </main>
        );
    }

    if (!link) {
        return (
            <main className="container">
                <Layout/>
                <h1>Lien introuvable</h1>
                <Link to="/home" className="button">⬅ Retour</Link>
            </main>
        );
    }

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case 'YouTube': return '🎥';
            case 'LinkedIn': return '💼';
            default: return '🔗';
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Lien copié !');
    };

    return (
        <main className="container">

            {link.imageUrl && (
                <img src={link.imageUrl} alt={link.title} className="detail-img" />
            )}

            <div className="link-header">
                <h1>{link.title}</h1>
                {link.platform && (
                    <span className="platform-badge large">
                        {getPlatformIcon(link.platform)} {link.platform}
                    </span>
                )}
            </div>

            <p>{link.description || "Pas de description."}</p>

            <p>
                Statut :{" "}
                <strong>{link.isActive ? "Actif ✅" : "Inactif ❌"}</strong>
            </p>

            <p>
                Partagé le :{" "}
                {link.createdAt
                    ? new Date(link.createdAt).toLocaleDateString()
                    : "Date inconnue"}
            </p>

            {link.category && (
                <p>
                    Plateforme : <strong>{link.category.name}</strong>
                </p>
            )}

            {link.linkUrl && (
                <p>
                    <a
                        href={link.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button"
                    >
                        🔗 Ouvrir le lien
                    </a>
                </p>
            )}

            <div className="button-group">
                <button onClick={handleCopy} className="button secondary">
                    Copier le lien de partage
                </button>
                <Link to="/home" className="button">
                    ⬅ Retour
                </Link>
            </div>
        </main>
    );
}
