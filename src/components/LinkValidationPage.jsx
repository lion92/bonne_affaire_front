import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLinkStore } from '../store/useLinkStore';
import { jwtDecode } from 'jwt-decode';
import lien from "./lien.js";

const API_URL = lien.url;

const LinkValidationPage = () => {
    const token = localStorage.getItem('jwt');
    const { links, fetchLinks } = useLinkStore();
    const [error, setError] = useState(null);
    const [userRoles, setUserRoles] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Token décodé :", decoded);let roles = decoded?.roles || [];
                const roleNames = roles.map(r => typeof r === 'string' ? r : r.name);
                setUserRoles(roleNames);
            } catch (err) {
                console.error('Erreur lors du décodage du token :', err);
                setUserRoles([]);
            }
        }
    }, []);

    useEffect(() => {
        if (token) fetchLinks(token);
    }, [fetchLinks, token]);

    // Nouvelle fonction qui prend un paramètre pour valider ou dévalider
    const validateLink = async (linkId, role, shouldValidate) => {
        if (!userRoles.includes(role)) return;

        // Mise à jour optimiste de l'état local
        const { updateLinkValidation } = useLinkStore.getState();
        updateLinkValidation(linkId, role, shouldValidate);

        try {
            await axios.post(`${API_URL}/links/${linkId}/validate`,
                { role, validated: shouldValidate },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Rechargement pour s'assurer de la synchronisation
            await fetchLinks(token);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message);
            // En cas d'erreur, recharger pour restaurer l'état correct
            await fetchLinks(token);
        }
    };

    const linksToValidate = links.filter(link => !link.managerValidated || !link.adminValidated);

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case 'YouTube': return '🎥';
            case 'LinkedIn': return '💼';
            default: return '🔗';
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Validation des liens YouTube & LinkedIn</h2>
            <div style={{
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.1)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'center'
            }}>
                <p style={{ margin: 0, fontWeight: '600', color: '#374151' }}>
                    🎥 Seuls les liens YouTube et LinkedIn sont acceptés 💼
                </p>
            </div>

            {linksToValidate.length === 0 ? (
                <p>Aucun lien YouTube/LinkedIn à valider.</p>
            ) : (
                linksToValidate.map(link => (
                    <div
                        key={link.id}
                        style={{
                            border: '1px solid #ccc',
                            padding: '1rem',
                            marginBottom: '1rem',
                            backgroundColor: link.managerValidated && link.adminValidated ? '#e0ffe0' : '#fff8e1',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <h3>{link.title}</h3>
                            {link.platform && (
                                <span style={{ fontSize: '0.9em', opacity: 0.7 }}>
                                    {getPlatformIcon(link.platform)} {link.platform}
                                </span>
                            )}
                        </div>
                        <p>{link.description || 'Pas de description'}</p>
                        {link.url && (
                            <div style={{
                                backgroundColor: '#f8fafc',
                                border: '2px solid #e2e8f0',
                                borderRadius: '8px',
                                padding: '12px',
                                margin: '10px 0',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                                    🔗 Lien à valider :
                                </div>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: '#3b82f6',
                                        textDecoration: 'none',
                                        fontSize: '16px',
                                        fontWeight: '500',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 12px',
                                        backgroundColor: '#eff6ff',
                                        borderRadius: '6px',
                                        border: '1px solid #bfdbfe',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#dbeafe';
                                        e.target.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = '#eff6ff';
                                        e.target.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {link.platform === 'YouTube' ? '🎥' : link.platform === 'LinkedIn' ? '💼' : '🔗'}
                                    Ouvrir le lien {link.platform}
                                </a>
                            </div>
                        )}

                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={link.managerValidated}
                                    disabled={!userRoles.includes('manager')}
                                    onChange={(e) => {
                                        validateLink(link.id, 'manager', e.target.checked);
                                    }}
                                />
                                Valider comme Manager
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={link.adminValidated}
                                    disabled={!userRoles.includes('admin')}
                                    onChange={(e) => {
                                        validateLink(link.id, 'admin', e.target.checked);
                                    }}
                                />
                                Valider comme Admin
                            </label>
                        </div>
                    </div>
                ))
            )}

            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default LinkValidationPage;
