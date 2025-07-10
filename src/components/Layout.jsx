import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../css/layout.css';
import { jwtDecode } from "jwt-decode";





export default function Layout() {
    const navigate = useNavigate();
    const token = localStorage.getItem('jwt');
    const isAuthenticated = token !== null;

    let roles = [];
    if (isAuthenticated) {
        try {
            const decoded = jwtDecode(token);
            console.log("Token décodé :", decoded);
            roles = decoded?.roles || [];

        } catch (e) {
            console.error('Erreur de décodage du token', e);
        }
    }


    const isAdminOrManager = roles.includes('admin') || roles.includes('manager');

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
                            {isAdminOrManager && (
                                <>
                                    <li><Link to="/category">➕ Ajouter une catégorie</Link></li>
                                    <li><Link to="/validation">✔️ Validation</Link></li>
                                </>
                            )}
                            <li><Link to="/profile">👤 Profil</Link></li>
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
