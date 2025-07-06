// src/components/DealDetail.jsx
import { useParams, Link } from 'react-router-dom';
import { useDealStore } from '../store/useDealStore.js';
import '../css/detail.css';
import Layout from "./Layout.jsx";

export default function DealDetail() {
    const { id } = useParams();
    const deal = useDealStore((s) =>
        s.deals.find((d) => String(d.id) === String(id))
    );

    if (!deal) {
        return (
            <main className="container">
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
            <Layout/>
            {deal.imageUrl && (
                <img src={deal.imageUrl} alt={deal.title} className="detail-img" />
            )}
            <h1>{deal.title}</h1>
            <p>{deal.description}</p>
            {deal.price && (
                <p className="price">
                    Prix : <strong>{deal.price} €</strong>
                </p>
            )}

            <div className="button-group">
                {deal.dealUrl && (
                    <a
                        href={deal.dealUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button"
                    >
                        Voir l'offre
                    </a>
                )}
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
