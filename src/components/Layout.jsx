import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../css/layout.css';

export default function Layout() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('jwt') !== null;

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        navigate('/');
    };

    return (
        <>
            <nav className="menu">
                <ul>
                    {isAuthenticated && (
                        <>
                            <li><Link to="/home">🏠 Accueil</Link></li>
                            <li><Link to="/add">➕ Ajouter une affaire</Link></li>
                            <li><Link to="/category">➕ Ajouter une categorie</Link></li>
                            <li><Link to="/profile"> Profile</Link></li>
                        </>
                    )}
                    {!isAuthenticated && (
                        <>
                            <li><Link to="/">🔑 Connexion</Link></li>
                            <li><Link to="/inscription">📝 Inscription</Link></li>
                        </>
                    )}
                </ul>
                {isAuthenticated && (
                    <button onClick={handleLogout} className="logout-button">
                        🚪 Déconnexion
                    </button>
                )}
            </nav>
            <Outlet />
        </>
    );
}
