import { Link } from "react-router-dom";
import '../css/editDeal.css'

export default function PublicLinkCard({ link }) {
    const getPlatformIcon = (platform) => {
        return '🔗';
    };

    const getPlatformColor = (platform) => {
        switch (platform) {
            case 'YouTube': return '#ff0000';
            case 'LinkedIn': return '#0077b5';
            default: return '#6b7280';
        }
    };

    return (
        <div className="card">
            {link.imageUrl && (
                <img src={link.imageUrl} alt={link.title} />
            )}

            <div className="card-content">
                <div className="link-header">
                    <h3>{link.title}</h3>
                    {link.platform && (
                        <span
                            className="platform-badge"
                            style={{ backgroundColor: getPlatformColor(link.platform) }}
                        >
                            {link.platform}
                        </span>
                    )}
                </div>

                <p>{link.description || "Pas de description."}</p>

                {link.url && (
                    <p>
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-button"
                        >
                            Ouvrir le lien
                        </a>
                    </p>
                )}

                <p><strong>Partagé le :</strong> {new Date(link.createdAt).toLocaleDateString()}</p>

                {link.category && (
                    <p><strong>Plateforme :</strong> {link.category.name}</p>
                )}

                <div className="buttons">
                    <div className="public-notice">
                        <small>
                            <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                                Connectez-vous
                            </Link> pour interagir avec ce contenu
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}