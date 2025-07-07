import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../css/layout.css';

export default function Layout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        navigate('/');
    };

    return (
        <>
            <nav className="menu">
                <ul>
                    <li><Link to="/home">🏠 Accueil</Link></li>
                    <li><Link to="/add">➕ Ajouter une affaire</Link></li>
                    <li><Link to="/">🔑 Connexion</Link></li>
                    <li><Link to="/inscription">📝 Inscription</Link></li>
                    <li><Link to="/category">📝 Category</Link></li>
                </ul>
                <button onClick={handleLogout} className="logout-button">
                    🚪 Déconnexion
                </button>
            </nav>
            <Outlet />
        </>
    );
}
