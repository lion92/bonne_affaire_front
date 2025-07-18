import React, {useCallback, useState} from 'react';
import lien from './lien';
import '../css/inscription.css'
import Layout from "./Layout.jsx";

const Inscription = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [nomError, setNomError] = useState("");
    const [prenomError, setPrenomError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inscriptionMessage, setInscriptionMessage] = useState("");

    const validateEmail = (mail) => {
        const valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
        setEmailError(valid ? "" : "Adresse email invalide");
        return valid;
    };

    const validateForm = () => {
        let valid = true;
        if (!nom) {
            setNomError("Le nom est obligatoire");
            valid = false;
        } else setNomError("");
        if (!prenom) {
            setPrenomError("Le prénom est obligatoire");
            valid = false;
        } else setPrenomError("");
        if (!validateEmail(email)) valid = false;
        if (password.length < 3) {
            setPasswordError("Le mot de passe doit comporter au moins 3 caractères");
            valid = false;
        } else setPasswordError("");
        return valid;
    };

    const fetchInscription = useCallback(async (e) => {
        e.preventDefault();
        setIsSuccess(false);
        setInscriptionMessage("");

        if (!validateForm()) return;
        setIsLoading(true);

        try {
            const response = await fetch(`${lien.url}/connection/signup`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({nom, prenom, email, password})
            });

            const data = await response.json().catch(() => ({}));
            if (response.ok) {
                setIsSuccess(true);
                setInscriptionMessage("Inscription réussie ! Vérifiez votre email pour activer votre compte.");
                setNom("");
                setPrenom("");
                setEmail("");
                setPassword("");
            } else {
                setIsSuccess(false);
                setInscriptionMessage(data.message || "Une erreur est survenue. Veuillez réessayer.");
            }
        } catch (error) {
            console.error("Erreur inscription :", error);
            setInscriptionMessage("Erreur de connexion au serveur.");
        } finally {
            setIsLoading(false);
        }
    }, [nom, prenom, email, password]);

    return (
        <>
            <Layout></Layout>
            <div className="containerInscription">
                <div className="form-card">
                    <h2>Inscription</h2>

                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Nom"
                            value={nom}
                            onChange={e => setNom(e.target.value)}
                            className={nomError ? 'error' : ''}
                        />
                        <label>Nom</label>
                        {nomError && <p className="error">{nomError}</p>}
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Prénom"
                            value={prenom}
                            onChange={e => setPrenom(e.target.value)}
                            className={prenomError ? 'error' : ''}
                        />
                        <label>Prénom</label>
                        {prenomError && <p className="error">{prenomError}</p>}
                    </div>

                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className={emailError ? 'error' : ''}
                        />
                        <label>Email</label>
                        {emailError && <p className="error">{emailError}</p>}
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className={passwordError ? 'error' : ''}
                        />
                        <label>Mot de passe</label>
                        {passwordError && <p className="error">{passwordError}</p>}
                    </div>

                    {inscriptionMessage && (
                        <p className={isSuccess ? "success-message" : "error-message"}>
                            {inscriptionMessage}
                        </p>
                    )}

                    <button
                        onClick={fetchInscription}
                        disabled={isLoading}
                        className={isLoading ? 'loading' : ''}
                    >
                        {isLoading ? "Inscription en cours..." : "S'inscrire"}
                    </button>

                    <p className="info-message">
                        Vous recevrez un email pour activer votre compte.
                    </p>
                </div>
            </div>
        </>
    );
};

export default Inscription;