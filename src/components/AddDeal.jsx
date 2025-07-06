// src/components/AddDeal.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDealStore } from "../store/useDealStore.js";
import "../css/addDeal.css";
import Layout from "./Layout.jsx";

export default function AddDeal() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dealUrl, setDealUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [price, setPrice] = useState("");
    const createDeal = useDealStore((s) => s.createDeal);
    const navigate = useNavigate();

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

        const newDeal = {
            title: title.trim(),
            description: description.trim(),
            dealUrl: dealUrl.trim(),
            imageUrl: imageUrl.trim(),
            price: parseFloat(price),
            isActive: true,
        };

        try {
            await createDeal(newDeal);
            alert("Affaire ajoutée avec succès !");
            // Nettoyage du formulaire
            setTitle("");
            setDescription("");
            setDealUrl("");
            setImageUrl("");
            setPrice("");
            navigate("/home");
        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue lors de l'ajout.");
        }
    };

    return (
        <main className="container">
            <Layout/>
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
                <button type="submit" className="button">
                    Ajouter
                </button>
            </form>
        </main>
    );
}
