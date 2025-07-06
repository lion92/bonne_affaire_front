// src/components/AddDeal.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDealStore } from "../store/store.js";
import '../css/addDeal.css'
export default function AddDeal() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [image, setImage] = useState("");
    const addDeal = useDealStore((s) => s.addDeal);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation basique
        if (!link.startsWith("http")) {
            alert("Le lien doit commencer par http ou https.");
            return;
        }
        if (!image.startsWith("http")) {
            alert("L'URL de l'image doit commencer par http ou https.");
            return;
        }

        // Création d'un id unique
        const newDeal = {
            id: Date.now().toString(),
            title: title.trim(),
            description: description.trim(),
            link: link.trim(),
            image: image.trim(),
        };

        addDeal(newDeal);
        alert("Affaire ajoutée avec succès !");
        // Nettoyage du formulaire
        setTitle("");
        setDescription("");
        setLink("");
        setImage("");
        navigate("/home");
    };

    return (
        <main className="container">
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
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                />
                <input
                    type="url"
                    placeholder="URL de l'image (https://...)"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                />
                <button type="submit" className="button">
                    Ajouter
                </button>
            </form>
        </main>
    );
}
