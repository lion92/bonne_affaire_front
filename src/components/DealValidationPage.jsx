import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDealStore } from '../store/useDealStore';
import { jwtDecode } from 'jwt-decode';
import lien from "./lien.js";

const API_URL = lien.url;

const DealValidationPage = () => {
    const token = localStorage.getItem('jwt');
    const { deals, fetchDeals } = useDealStore();
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
        if (token) fetchDeals(token);
    }, [fetchDeals, token]);

    // Nouvelle fonction qui prend un paramètre pour valider ou dévalider
    const validateDeal = async (dealId, role, shouldValidate) => {
        if (!userRoles.includes(role)) return;

        try {
            await axios.post(`${API_URL}/deals/${dealId}/validate`,
                { role, validated: shouldValidate },  // envoyer aussi validated
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchDeals(token);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message);
        }
    };

    const dealsToValidate = deals;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Validation des affaires</h2>

            {dealsToValidate.length === 0 ? (
                <p>Aucune affaire à valider.</p>
            ) : (
                dealsToValidate.map(deal => (
                    <div
                        key={deal.id}
                        style={{
                            border: '1px solid #ccc',
                            padding: '1rem',
                            marginBottom: '1rem',
                            backgroundColor: deal.managerValidated && deal.adminValidated ? '#e0ffe0' : '#fff8e1',
                        }}
                    >
                        <h3>{deal.title}</h3>
                        <p>{deal.description}</p>
                        <p><strong>Prix :</strong> {deal.price} €</p>

                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={deal.managerValidated}
                                    disabled={!userRoles.includes('manager')}
                                    onChange={(e) => {
                                        validateDeal(deal.id, 'manager', e.target.checked);
                                    }}
                                />
                                Valider comme Manager
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={deal.adminValidated}
                                    disabled={!userRoles.includes('admin')}
                                    onChange={(e) => {
                                        validateDeal(deal.id, 'admin', e.target.checked);
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

export default DealValidationPage;
