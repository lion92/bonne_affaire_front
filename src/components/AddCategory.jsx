// src/components/AddCategory.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategoryStore } from "../store/useCategoryStore.js";
import Layout from "./Layout.jsx";

export default function AddCategory() {
    const [name, setName] = useState("");
    const createCategory = useCategoryStore((s) => s.createCategory);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Le nom de la catégorie est obligatoire.");
            return;
        }

        const token = localStorage.getItem("jwt");
        if (!token) {
            alert("Vous devez être connecté pour ajouter une catégorie.");
            return;
        }

        try {
            await createCategory(name.trim(), token);
            alert("Catégorie ajoutée avec succès !");
            setName("");
            navigate("/home"); // tu peux rediriger ailleurs si besoin
        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue lors de l'ajout.");
        }
    };

    return (
        <main className="container">
            <h1>Ajouter une catégorie</h1>
            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    placeholder="Nom de la catégorie"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button type="submit" className="button">
                    Ajouter
                </button>
            </form>
        </main>
    );
}
