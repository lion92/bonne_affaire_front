import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLinkStore } from '../store/useLinkStore.js';
import { useCategoryStore } from '../store/useCategoryStore.js';
import '../css/home.css';
import {jwtDecode} from "jwt-decode";
import MessageBox from "./messageBox.jsx";
import EditableLinkCard from "./EditableLinkCard.jsx";
export default function Home() {
    const { links, fetchActiveLinks, deleteLink } = useLinkStore();
    const { categories, fetchCategories } = useCategoryStore();

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
    // 🟢 Récupère les liens et catégories au chargement
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            fetchActiveLinks(token);
            if (categories.length === 0) fetchCategories(token);
        }
    }, [fetchActiveLinks, fetchCategories, categories.length]);

    const filteredAndSortedLinks = useMemo(() => {
        let filtered = links.filter(link => {
            const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (link.description && link.description.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory = selectedCategory === '' ||
                (link.category && link.category.id.toString() === selectedCategory);

            return matchesSearch && matchesCategory;
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

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce lien ?")) {
            try {
                const token = localStorage.getItem("jwt");
                await deleteLink(id, token);
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
                <h1>Partage YouTube & LinkedIn</h1>
                <p>Découvre et partage exclusivement les meilleurs contenus YouTube et LinkedIn !</p>
                <div className="supported-platforms">
                    <span className="platform-tag youtube">YouTube</span>
                    <span className="platform-tag linkedin">LinkedIn</span>
                </div>
                <Link to="/add" className="button large">
                    + Partager un lien YouTube/LinkedIn
                </Link>
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

                {filteredAndSortedLinks.length === 0 ? (
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
                                    <Link to="/add" className="button">
                                        Partager le premier lien YouTube/LinkedIn
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid">
                        {filteredAndSortedLinks.map((link) => (
                            <EditableLinkCard
                                key={link.id}
                                link={link}
                                isAdmin={userRoles.includes('admin')}
                            />
                        ))}
                    </div>
                )}
            </section>

        </main>
    );
}
