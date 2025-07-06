import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDealStore } from '../store/useDealStore.js';
import Layout from "./Layout.jsx";

export default function Home() {
    const { deals, fetchDeals } = useDealStore();

    useEffect(() => {
        fetchDeals();
    }, []);

    return (
        <main className="home-container">
            <section className="hero">
                <h1>🔥 Bonnes affaires à partager</h1>
                <p>Découvre et propose les meilleures offres du moment !</p>
                <Link to="/add" className="button large">+ Proposer une affaire</Link>
            </section>

            <section className="deals">
                <h2>Les dernières bonnes affaires</h2>
                <div className="grid">
                    {deals.map((deal) => (
                        <Link to={`/deal/${deal.id}`} key={deal.id} className="card">
                            {deal.imageUrl && (
                                <img src={deal.imageUrl} alt={deal.title} />
                            )}
                            <div className="card-content">
                                <h3>{deal.title}</h3>
                                <p>{deal.description || "Pas de description."}</p>
                                <p><strong>Prix :</strong> {deal.price} €</p>
                                {deal.dealUrl && (
                                    <p>
                                        <a href={deal.dealUrl} target="_blank" rel="noopener noreferrer">
                                            🔗 Voir l'offre
                                        </a>
                                    </p>
                                )}
                                <p><strong>Statut :</strong> {deal.isActive ? "Actif" : "Inactif"}</p>
                                <p><strong>Créé le :</strong> {new Date(deal.createdAt).toLocaleDateString()}</p>
                                {deal.category && (
                                    <p><strong>Catégorie :</strong> {deal.category.name}</p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
