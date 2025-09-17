import { useState } from "react";
import { Link } from "react-router-dom";
import { useLinkStore } from "../store/useLinkStore";
import { useCategoryStore } from "../store/useCategoryStore";
import '../css/editDeal.css'

export default function EditableLinkCard({ link, isAdmin }) {
    const { updateLink, deleteLink } = useLinkStore();
    const { categories } = useCategoryStore();

    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: link.title,
        description: link.description || '',
        platform: link.platform || '',
        url: link.url || '',
        categoryId: link.category?.id || '',
    });

    const handleSave = async () => {
        const token = localStorage.getItem("jwt");
        if (!token) return;

        await updateLink(link.id, {
            ...formData,
            categoryId: parseInt(formData.categoryId),
        }, token);
        setEditing(false);
    };

    const handleDelete = async () => {
        if (window.confirm("Supprimer ce lien ?")) {
            const token = localStorage.getItem("jwt");
            await deleteLink(link.id, token);
        }
    };

    const getPlatformIcon = (platform) => {
        return '🔗';
    };

    return (
        <div className="card">
            {link.imageUrl && (
                <img src={link.imageUrl} alt={link.title} />
            )}

            <div className="card-content">
                {editing ? (
                    <>
                        <input
                            type="text"
                            placeholder="Titre du lien"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Plateforme"
                            value={formData.platform}
                            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                        />
                        <input
                            type="url"
                            placeholder="Lien YouTube ou LinkedIn uniquement"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        />
                        <select
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        >
                            <option value="">Choisir une plateforme</option>
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
                        <div className="link-header">
                            <h3>{link.title}</h3>
                            {link.platform && (
                                <span className="platform-badge">
                                    {link.platform}
                                </span>
                            )}
                        </div>
                        <p>{link.description || "Pas de description."}</p>
                        {link.url && (
                            <p><a href={link.url} target="_blank" rel="noopener noreferrer">Ouvrir le lien</a></p>
                        )}
                        <p><strong>Partagé le :</strong> {new Date(link.createdAt).toLocaleDateString()}</p>
                        {link.category && (
                            <p><strong>Plateforme :</strong> {link.category.name}</p>
                        )}
                        <div className="buttons">
                            <Link to={`/link/${link.id}`} className="button small">Voir détail</Link>
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