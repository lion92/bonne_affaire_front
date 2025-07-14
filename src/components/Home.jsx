import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDealStore } from '../store/useDealStore.js';
import { useCategoryStore } from '../store/useCategoryStore.js';
import { useUserProfileStore } from "../store/userProfilStore.js";
import LikeButton from "./LikeButton.jsx";
import '../css/home.css';
import {jwtDecode} from "jwt-decode";
import MessageBox from "./messageBox.jsx";
import EditableDealCard from "./EditableDealCard.jsx";
export default function Home() {
    const { deals, fetchActiveDeals, deleteDeal } = useDealStore();
    const { categories, fetchCategories } = useCategoryStore();
    const { likeCounts, fetchLikeCount } = useUserProfileStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('newest');

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
    // 🟢 Récupère les deals et catégories au chargement
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            fetchActiveDeals(token);
            if (categories.length === 0) fetchCategories(token);
        }
    }, []);

    // 🟢 Récupère les likes dès qu'on a les deals
    useEffect(() => {
        deals.forEach((deal) => {
            fetchLikeCount(deal.id);
        });
    }, [deals]);

    const filteredAndSortedDeals = useMemo(() => {
        let filtered = deals.filter(deal => {
            const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (deal.description && deal.description.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory = selectedCategory === '' ||
                (deal.category && deal.category.id.toString() === selectedCategory);

            return matchesSearch && matchesCategory;
        });

        switch (sortBy) {
            case 'oldest':
                return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'price-low':
                return filtered.sort((a, b) => a.price - b.price);
            case 'price-high':
                return filtered.sort((a, b) => b.price - a.price);
            default:
                return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    }, [deals, searchTerm, selectedCategory, sortBy]);

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cette affaire ?")) {
            try {
                const token = localStorage.getItem("jwt");
                await deleteDeal(id, token);
            } catch (error) {
                alert("Erreur lors de la suppression");
                console.error(error);
            }
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSortBy('newest');
    };

    const activeFiltersCount = [
        searchTerm !== '',
        selectedCategory !== '',
        sortBy !== 'newest'
    ].filter(Boolean).length;

    return (
        <main className="home-container">
            <section className="hero">
                <h1>🔥 Bonnes affaires à partager</h1>
                <p>Découvre et propose les meilleures offres du moment !</p>
                <Link to="/add" className="button large">
                    + Proposer une affaire
                </Link>
            </section>

            <section className="filters-section">
                <div className="filters-container">
                    <div className="filters-header">
                        <h3>Filtrer les offres</h3>
                        {activeFiltersCount > 0 && (
                            <button onClick={clearFilters} className="button clear-filters">
                                Effacer les filtres ({activeFiltersCount})
                            </button>
                        )}
                    </div>

                    <div className="filters-grid">
                        <div className="filter-group">
                            <label htmlFor="search">🔍 Rechercher</label>
                            <input
                                id="search"
                                type="text"
                                placeholder="Rechercher par titre ou description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="filter-input"
                            />
                        </div>

                        <div className="filter-group">
                            <label htmlFor="category">🏷️ Catégorie</label>
                            <select
                                id="category"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Toutes les catégories</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="sort">↕️ Trier par</label>
                            <select
                                id="sort"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="filter-select"
                            >
                                <option value="newest">Plus récents</option>
                                <option value="oldest">Plus anciens</option>
                                <option value="price-low">Prix croissant</option>
                                <option value="price-high">Prix décroissant</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            <section className="deals">
                <div className="deals-header">
                    <h2>Les bonnes affaires</h2>
                    <div className="results-info">
                        {filteredAndSortedDeals.length} offre{filteredAndSortedDeals.length > 1 ? 's' : ''}
                        {activeFiltersCount > 0 && ' (filtrées)'}
                    </div>
                </div>

                {filteredAndSortedDeals.length === 0 ? (
                    <div className="no-results">
                        <div className="no-results-content">
                            <p>😔 Aucune offre ne correspond à vos critères</p>
                            {activeFiltersCount > 0 ? (
                                <button onClick={clearFilters} className="button">
                                    Voir toutes les offres
                                </button>
                            ) : (
                                <Link to="/add" className="button">
                                    Proposer la première offre
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid">
                        {filteredAndSortedDeals.map((deal) => (
                            <EditableDealCard
                                key={deal.id}
                                deal={deal}
                                likeCount={likeCounts[deal.id]}
                                isAdmin={userRoles.includes('admin')}
                            />
                        ))}
                    </div>
                )}
            </section>

        </main>
    );
}
