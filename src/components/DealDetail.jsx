import { useParams, Link } from 'react-router-dom';
import {useDealStore} from "../store/store.js";
import '../css/detail.css'
export default function DealDetail() {
    const { id } = useParams();
    const deal = useDealStore((s) => s.deals.find((d) => d.id === id));

    if (!deal) {
        return (
            <main className="container">
                <h1>Affaire introuvable</h1>
                <Link to="/">Retour</Link>
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
            <a href={deal.link} target="_blank" rel="noopener noreferrer" className="button">
                Voir l'offre
            </a>
            <button onClick={handleCopy} className="button secondary">
                Copier le lien
            </button>
            <Link to="/" className="button">⬅ Retour</Link>
        </main>
    );
}
