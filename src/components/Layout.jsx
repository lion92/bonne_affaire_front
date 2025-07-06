import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <>
            <nav className="menu">
                <ul>
                    <li><Link to="/home">🏠 Accueil</Link></li>
                    <li><Link to="/add">➕ Ajouter une affaire</Link></li>
                    <li><Link to="/">🔑 Connexion</Link></li>
                    <li><Link to="/inscription">📝 Inscription</Link></li>
                </ul>
            </nav>
                <Outlet />
        </>
    );
}
