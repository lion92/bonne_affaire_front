// src/components/DealDetail.jsx
import { useParams, Link } from 'react-router-dom';
import { useDealStore } from '../store/store.js';
import '../css/detail.css';

export default function DealDetail() {
    const { id } = useParams();
    const deal = useDealStore((s) =>
        s.deals.find((d) => String(d.id) === String(id))
    );

    if (!deal) {
        return (
            <main className="container">
                <h1>Affaire introuvable</h1>
                <Link to="/" className="button">⬅ Retour</Link>
            </main>
        );
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Lien copié !");
    };

    return (
        <main className="container">
            <img src={deal.image} alt={deal.title} className="detail-img" />
            <h1>{deal.title}</h1>
            <p>{deal.description}</p>

            {deal.oldPrice && (
                <p className="old-price">
                    Ancien prix : <s>{deal.oldPrice}</s>
                </p>
            )}
            {deal.price && (
                <p className="price">
                    Prix actuel : <strong>{deal.price}</strong>
                </p>
            )}
            {deal.location && (
                <p>
                    <strong>Lieu :</strong> {deal.location}
                </p>
            )}
            {deal.seller && (
                <p>
                    <strong>Vendeur :</strong> {deal.seller}
                </p>
            )}
            {deal.postedDate && (
                <p>
                    <strong>Publié le :</strong> {deal.postedDate}
                </p>
            )}

            <div className="button-group">
                <a
                    href={deal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button"
                >
                    Voir l'offre
                </a>
                <button onClick={handleCopy} className="button secondary">
                    Copier le lien
                </button>
                <Link to="/" className="button">
                    ⬅ Retour
                </Link>
            </div>
        </main>
    );
}
