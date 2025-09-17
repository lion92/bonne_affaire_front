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

    const validatePassword = (pwd) => {
        const errors = [];

        if (pwd.length < 12) {
            errors.push("Au moins 12 caractères");
        }
        if (!/(?=.*[a-z])/.test(pwd)) {
            errors.push("Au moins une lettre minuscule");
        }
        if (!/(?=.*[A-Z])/.test(pwd)) {
            errors.push("Au moins une lettre majuscule");
        }
        if (!/(?=.*\d)/.test(pwd)) {
            errors.push("Au moins un chiffre");
        }
        if (!/(?=.*[@$!%*?&])/.test(pwd)) {
            errors.push("Au moins un caractère spécial (@$!%*?&)");
        }

        return errors;
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

        const pwdErrors = validatePassword(password);
        if (pwdErrors.length > 0) {
            setPasswordError(`Le mot de passe doit contenir : ${pwdErrors.join(", ")}`);
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
                        <div className="password-requirements">
                            <small>
                                Le mot de passe doit contenir :
                                <ul>
                                    <li className={password.length >= 12 ? 'valid' : 'invalid'}>
                                        Au moins 12 caractères
                                    </li>
                                    <li className={/(?=.*[a-z])/.test(password) ? 'valid' : 'invalid'}>
                                        Une lettre minuscule
                                    </li>
                                    <li className={/(?=.*[A-Z])/.test(password) ? 'valid' : 'invalid'}>
                                        Une lettre majuscule
                                    </li>
                                    <li className={/(?=.*\d)/.test(password) ? 'valid' : 'invalid'}>
                                        Un chiffre
                                    </li>
                                    <li className={/(?=.*[@$!%*?&])/.test(password) ? 'valid' : 'invalid'}>
                                        Un caractère spécial (@$!%*?&)
                                    </li>
                                </ul>
                            </small>
                        </div>
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