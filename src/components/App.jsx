import {Link, useNavigate} from 'react-router-dom';
import { useDealStore } from '../store/store.js';
import '../css/index.css'
export default function App() {
    const { deals } = useDealStore();
    const navigate = useNavigate();

    return (
        <main className="container">
            <header>
                <h1>🔥 Bonnes affaires</h1>
                <Link to="/add" className="button">+ Proposer une affaire</Link>
            </header>
            <div className="grid">
                {deals.map((deal) => (
                    <Link key={deal.id} to={`/deal/${deal.id}`} className="card">
                        <img src={deal.image} alt={deal.title} />
                        <h2>{deal.title}</h2>
                    </Link>
                ))}
            </div>
        </main>
    );
}
