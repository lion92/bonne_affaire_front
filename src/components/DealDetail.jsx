import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDealStore } from '../store/useDealStore.js';
import '../css/detail.css';
import Layout from "./Layout.jsx";

export default function DealDetail() {
    const { id } = useParams();
    const { deals, fetchDealById, loading, error } = useDealStore();

    const deal = deals.find((d) => String(d.id) === String(id));

    useEffect(() => {
        if (!deal) {
            const token = localStorage.getItem("jwt");
            if (token) {
                fetchDealById(id, token);
            }
        }
    }, [id, deal, fetchDealById]);

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

    if (!deal) {
        return (
            <main className="container">
                <Layout/>
                <h1>Affaire introuvable</h1>
                <Link to="/home" className="button">⬅ Retour</Link>
            </main>
        );
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Lien copié !');
    };

    return (
        <main className="container">

            {deal.imageUrl && (
                <img src={deal.imageUrl} alt={deal.title} className="detail-img" />
            )}

            <h1>{deal.title}</h1>

            <p>{deal.description || "Pas de description."}</p>

            {deal.price !== undefined && (
                <p className="price">
                    Prix : <strong>{deal.price} €</strong>
                </p>
            )}

            <p>
                Statut :{" "}
                <strong>{deal.isActive ? "Actif ✅" : "Inactif ❌"}</strong>
            </p>

            <p>
                Créé le :{" "}
                {deal.createdAt
                    ? new Date(deal.createdAt).toLocaleDateString()
                    : "Date inconnue"}
            </p>

            {deal.category && (
                <p>
                    Catégorie : <strong>{deal.category.name}</strong>
                </p>
            )}

            {deal.dealUrl && (
                <p>
                    <a
                        href={deal.dealUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button"
                    >
                        🔗 Voir l'offre
                    </a>
                </p>
            )}

            <div className="button-group">
                <button onClick={handleCopy} className="button secondary">
                    Copier le lien
                </button>
                <Link to="/home" className="button">
                    ⬅ Retour
                </Link>
            </div>
        </main>
    );
}
