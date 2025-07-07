// src/components/AddDeal.jsx
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDealStore} from "../store/useDealStore.js";
import {useCategoryStore} from "../store/useCategoryStore.js";
import "../css/addDeal.css";
import AddCategory from "./AddCategory.jsx";

export default function AddDeal() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dealUrl, setDealUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const navigate = useNavigate();
    const createDeal = useDealStore((s) => s.createDeal);
    const {categories, fetchCategories, loading, error} = useCategoryStore();

    // Charger les catégories au montage si vide
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token && categories.length === 0) {
            fetchCategories(token);
        }
    }, [categories.length, fetchCategories]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation basique
        if (!dealUrl.startsWith("http")) {
            alert("Le lien doit commencer par http ou https.");
            return;
        }
        if (!imageUrl.startsWith("http")) {
            alert("L'URL de l'image doit commencer par http ou https.");
            return;
        }
        if (price && isNaN(parseFloat(price))) {
            alert("Le prix doit être un nombre.");
            return;
        }
        if (!categoryId) {
            alert("Veuillez sélectionner une catégorie.");
            return;
        }

        const token = localStorage.getItem("jwt");
        if (!token) {
            alert("Vous devez être connecté pour ajouter une affaire.");
            return;
        }

        const newDeal = {
            title: title.trim(),
            description: description.trim(),
            dealUrl: dealUrl.trim(),
            imageUrl: imageUrl.trim(),
            price: parseFloat(price),
            isActive: true,
            categoryId: parseInt(categoryId, 10),
        };

        try {
            await createDeal(newDeal, token);
            alert("Affaire ajoutée avec succès !");
            // Nettoyage du formulaire
            setTitle("");
            setDescription("");
            setDealUrl("");
            setImageUrl("");
            setPrice("");
            setCategoryId("");
            navigate("/home");
        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue lors de l'ajout.");
        }
    };

    return (
        <div>
            <main className="container">

                <div>
                    <h1>Ajouter une bonne affaire</h1>
                    <form onSubmit={handleSubmit} className="form">
                        <input
                            type="text"
                            placeholder="Titre"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        <input
                            type="url"
                            placeholder="Lien vers l'offre (https://...)"
                            value={dealUrl}
                            onChange={(e) => setDealUrl(e.target.value)}
                            required
                        />
                        <input
                            type="url"
                            placeholder="URL de l'image (https://...)"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Prix (€)"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />

                        {loading ? (
                            <p>Chargement des catégories...</p>
                        ) : error ? (
                            <p className="error">{error}</p>
                        ) : (
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                            >
                                <option value="">-- Choisir une catégorie --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        )}

                        <button type="submit" className="button">
                            Ajouter
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
