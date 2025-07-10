import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRoute({ allowedRoles = [] }) {
    const token = localStorage.getItem('jwt');

    // Redirige vers la page de connexion si non connecté
    if (!token) {

        return <Navigate to="/" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        let roles = decoded?.roles || decoded?.role || [];

        // Si role est une string, convertis-le en tableau
        if (typeof roles === 'string') {
            roles = [roles];
        }

        // Si aucun rôle spécifique requis, l'accès est autorisé
        if (allowedRoles.length === 0) {
            return <Outlet />;
        }

        // Vérifie que l'utilisateur possède au moins un des rôles autorisés
        const hasAccess = allowedRoles.some(role => roles.includes(role));

        // Redirige si l'utilisateur n'a pas les bons rôles
        if (!hasAccess) {
            return <Navigate to="/home" replace />;
        }

        return <Outlet />;
    } catch (error) {
        console.error("Erreur lors du décodage du token :", error);
        return <Navigate to="/" replace />;
    }
}
