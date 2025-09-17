import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLinkStore } from '../store/useLinkStore.js';
import { useCategoryStore } from '../store/useCategoryStore.js';
import PublicLinkCard from "./PublicLinkCard.jsx";
import '../css/home.css';

export default function PublicHome() {
    const { links, fetchPublicLinks, loading, error } = useLinkStore();
    const { categories, fetchPublicCategories } = useCategoryStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Récupère les liens publics (sans token)
    useEffect(() => {
        fetchPublicLinks();
        fetchPublicCategories();
    }, []);

    const filteredAndSortedLinks = useMemo(() => {
        let filtered = links.filter(link => {
            // Ne montrer que les liens validés par les managers ET les admins
            const isValidated = link.managerValidated && link.adminValidated;

            const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (link.description && link.description.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory = selectedCategory === '' ||
                (link.category && link.category.id.toString() === selectedCategory);

            return isValidated && matchesSearch && matchesCategory;
        });

        switch (sortBy) {
            case 'oldest':
                return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'platform-az':
                return filtered.sort((a, b) => (a.platform || '').localeCompare(b.platform || ''));
            case 'platform-za':
                return filtered.sort((a, b) => (b.platform || '').localeCompare(a.platform || ''));
            default:
                return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    }, [links, searchTerm, selectedCategory, sortBy]);

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
            {/* Header publique */}
            <header className="public-header">
                <div className="header-content">
                    <h1>Liens YouTube & LinkedIn</h1>
                    <div className="auth-buttons">
                        <Link to="/login" className="button small">Connexion</Link>
                        <Link to="/inscription" className="button small">S'inscrire</Link>
                    </div>
                </div>
            </header>

            <section className="hero">
                <h1>Découvrez les meilleurs liens</h1>
                <p>Explorez une collection de contenus YouTube et LinkedIn partagés par la communauté !</p>
                <div className="supported-platforms">
                    <span className="platform-tag youtube">YouTube</span>
                    <span className="platform-tag linkedin">LinkedIn</span>
                </div>
                <div className="public-cta">
                    <Link to="/login" className="button large">
                        Connectez-vous pour partager
                    </Link>
                </div>
            </section>

            <section className="filters-section">
                <div className="filters-container">
                    <div className="filters-header">
                        <h3>Filtrer les liens</h3>
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
                            <label htmlFor="category">📱 Plateforme</label>
                            <select
                                id="category"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">YouTube & LinkedIn</option>
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
                                <option value="platform-az">Plateforme A-Z</option>
                                <option value="platform-za">Plateforme Z-A</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            <section className="links">
                <div className="links-header">
                    <h2>Les liens partagés</h2>
                    <div className="results-info">
                        {filteredAndSortedLinks.length} lien{filteredAndSortedLinks.length > 1 ? 's' : ''}
                        {activeFiltersCount > 0 && ' (filtrés)'}
                    </div>
                </div>

                {loading && (
                    <div className="loading-message">
                        <p>Chargement des liens...</p>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        <p>Erreur lors du chargement des liens: {error}</p>
                    </div>
                )}

                {!loading && !error && filteredAndSortedLinks.length === 0 ? (
                    <div className="no-results">
                        <div className="no-results-content">
                            <p>😔 Aucun lien YouTube ou LinkedIn ne correspond à vos critères</p>
                            {activeFiltersCount > 0 ? (
                                <button onClick={clearFilters} className="button">
                                    Voir tous les liens
                                </button>
                            ) : (
                                <div>
                                    <p>Seuls les liens <strong>YouTube</strong> et <strong>LinkedIn</strong> sont acceptés</p>
                                    <Link to="/login" className="button">
                                        Connectez-vous pour partager un lien
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid">
                        {filteredAndSortedLinks.map((link) => (
                            <PublicLinkCard
                                key={link.id}
                                link={link}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}