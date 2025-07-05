import { Link } from 'react-router-dom';
import { useDealStore } from '../store/store.js';

export default function Home() {
    const { deals } = useDealStore();

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
                            <img src={deal.image} alt={deal.title} />
                            <div className="card-content">
                                <h3>{deal.title}</h3>
                                <p>{deal.description.slice(0, 80)}...</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
