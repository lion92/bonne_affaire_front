import { useState } from "react";
import { Link } from "react-router-dom";
import { useDealStore } from "../store/useDealStore";
import { useCategoryStore } from "../store/useCategoryStore";
import LikeButton from "./LikeButton.jsx";
import '../css/editDeal.css'

export default function EditableDealCard({ deal, likeCount, isAdmin }) {
    const { updateDeal, deleteDeal } = useDealStore();
    const { categories } = useCategoryStore();

    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: deal.title,
        description: deal.description || '',
        price: deal.price,
        dealUrl: deal.dealUrl || '',
        categoryId: deal.category?.id || '',
    });

    const handleSave = async () => {
        const token = localStorage.getItem("jwt");
        if (!token) return;

        await updateDeal(deal.id, {
            ...formData,
            price: parseFloat(formData.price),
            categoryId: parseInt(formData.categoryId),
        }, token);
        setEditing(false);
    };

    const handleDelete = async () => {
        if (window.confirm("Supprimer cette affaire ?")) {
            const token = localStorage.getItem("jwt");
            await deleteDeal(deal.id, token);
        }
    };

    return (
        <div className="card">
            {deal.imageUrl && (
                <img src={deal.imageUrl} alt={deal.title} />
            )}

            <div className="card-content">
                {editing ? (
                    <>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                        <input
                            type="text"
                            value={formData.dealUrl}
                            onChange={(e) => setFormData({ ...formData, dealUrl: e.target.value })}
                        />
                        <select
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        >
                            <option value="">Choisir une catégorie</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>

                        <div className="buttons">
                            <button onClick={handleSave} className="button small">💾 Enregistrer</button>
                            <button onClick={() => setEditing(false)} className="button small">❌ Annuler</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3>{deal.title}</h3>
                        <p>{deal.description || "Pas de description."}</p>
                        <p><strong>Prix :</strong> {deal.price} €</p>
                        {deal.dealUrl && (
                            <p><a href={deal.dealUrl} target="_blank" rel="noopener noreferrer">🔗 Voir l'offre</a></p>
                        )}
                        <p><strong>Créé le :</strong> {new Date(deal.createdAt).toLocaleDateString()}</p>
                        {deal.category && (
                            <p><strong>Catégorie :</strong> {deal.category.name}</p>
                        )}
                        <div className="buttons">
                            <Link to={`/deal/${deal.id}`} className="button small">Voir détail</Link>
                            <LikeButton dealId={deal.id} />
                            <span>{likeCount || 0} 👍</span>
                            {isAdmin && (
                                <>
                                    <button onClick={() => setEditing(true)} className="button small">✏️ Modifier</button>
                                    <button onClick={handleDelete} className="button small danger">🗑️ Supprimer</button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
