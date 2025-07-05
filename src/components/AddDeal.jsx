import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useDealStore} from "../store/store.js";

export default function AddDeal() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [image, setImage] = useState('');
    const addDeal = useDealStore((s) => s.addDeal);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        addDeal({ title, description, link, image });
        navigate('/');
    };

    return (
        <main className="container">
            <h1>Ajouter une bonne affaire</h1>
            <form onSubmit={handleSubmit} className="form">
                <input
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
                    placeholder="Lien vers l'offre"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                />
                <input
                    placeholder="URL de l'image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                />
                <button type="submit" className="button">Ajouter</button>
            </form>
        </main>
    );
}
