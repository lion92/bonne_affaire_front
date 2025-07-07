import {useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {useDealStore} from '../store/useDealStore.js';
import {useCategoryStore} from '../store/useCategoryStore.js';
import '../css/home.css';

export default function Home() {
    const { deals, fetchDeals, deleteDeal } = useDealStore();
    const { categories, fetchCategories } = useCategoryStore();

    // États pour les filtres
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'price-low', 'price-high'

    useEffect(() => {
        fetchDeals();
        const token = localStorage.getItem("jwt");
        if (token && categories.length === 0) {
            fetchCategories(token);
        }
    }, [fetchDeals, fetchCategories, categories.length]);

    // Fonction de filtrage et tri des deals
    const filteredAndSortedDeals = useMemo(() => {
        let filtered = deals.filter(deal => {
            // Filtre par recherche textuelle
            const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (deal.description && deal.description.toLowerCase().includes(searchTerm.toLowerCase()));

            // Filtre par catégorie
            const matchesCategory = selectedCategory === '' ||
                (deal.category && deal.category.id.toString() === selectedCategory);

            // Filtre par statut
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && deal.isActive) ||
                (statusFilter === 'inactive' && !deal.isActive);

            return matchesSearch && matchesCategory && matchesStatus;
        });

        // Tri des résultats
        switch (sortBy) {
            case 'oldest':
                return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'price-low':
                return filtered.sort((a, b) => a.price - b.price);
            case 'price-high':
                return filtered.sort((a, b) => b.price - a.price);
            case 'newest':
            default:
                return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    }, [deals, searchTerm, selectedCategory, statusFilter, sortBy]);

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cette affaire ?")) {
            try {
                await deleteDeal(id);
            } catch (error) {
                alert("Erreur lors de la suppression");
                console.error(error);
            }
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setStatusFilter('all');
        setSortBy('newest');
    };

    const activeFiltersCount = [
        searchTerm !== '',
        selectedCategory !== '',
        statusFilter !== 'all',
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
                            <button
                                onClick={clearFilters}
                                className="button clear-filters"
                            >
                                Effacer les filtres ({activeFiltersCount})
                            </button>
                        )}
                    </div>

                    <div className="filters-grid">
                        {/* Recherche textuelle */}
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

                        {/* Filtre par catégorie */}
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
                            <div key={deal.id} className="card">
                                {deal.imageUrl && (
                                    <img src={deal.imageUrl} alt={deal.title} />
                                )}
                                <div className="card-content">
                                    <h3>{deal.title}</h3>
                                    <p>{deal.description || "Pas de description."}</p>
                                    <p><strong>Prix :</strong> {deal.price} €</p>
                                    {deal.dealUrl && (
                                        <p>
                                            <a
                                                href={deal.dealUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                🔗 Voir l'offre
                                            </a>
                                        </p>
                                    )}
                                    <p>
                                        <strong>Statut :</strong>{" "}
                                        {deal.isActive ? "Actif ✅" : "Inactif ❌"}
                                    </p>
                                    <p>
                                        <strong>Créé le :</strong>{" "}
                                        {new Date(deal.createdAt).toLocaleDateString()}
                                    </p>
                                    {deal.category && (
                                        <p><strong>Catégorie :</strong> {deal.category.name}</p>
                                    )}

                                    <div className="buttons">
                                        <Link to={`/deal/${deal.id}`} className="button small">
                                            Voir détail
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(deal.id)}
                                            className="button small danger"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}