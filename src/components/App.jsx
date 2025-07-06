import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDealStore } from '../store/useDealStore.js';
import '../css/index.css';
import Layout from "./Layout.jsx";

export default function App() {
    const { deals, fetchDeals, loading, error } = useDealStore();

    // Charger les deals au premier montage
    useEffect(() => {
        if (deals.length === 0) {
            const token = localStorage.getItem("jwt");
            if (token) {
                fetchDeals(token);
            }
        }
    }, [deals.length, fetchDeals]);

    return (
        <main className="container">
            <Layout/>
            <header>
                <h1>🔥 Bonnes affaires</h1>
                <Link to="/add" className="button">+ Proposer une affaire</Link>
            </header>

            {loading && <p>Chargement...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && deals.length === 0 && (
                <p>Aucune affaire disponible pour le moment.</p>
            )}

            <div className="grid">
                {deals.map((deal) => (
                    <Link key={deal.id} to={`/deal/${deal.id}`} className="card">
                        {deal.imageUrl && (
                            <img src={deal.imageUrl} alt={`Image de ${deal.title}`} />
                        )}
                        <h2>{deal.title}</h2>
                    </Link>
                ))}
            </div>
        </main>
    );
}
