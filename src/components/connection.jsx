import React, { useCallback, useEffect, useState } from 'react';
import lien from '../components/lien.js';
import '../css/connexion.css';
import Home from "./Home.jsx";
import Layout from "./Layout.jsx";
import { jwtDecode } from "jwt-decode"; // ✅ Import correct pour jwt-decode v4

const Connection = () => {
    const [messageLog, setMessageLog] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [mailError, setEmailError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [probleme, setProbleme] = useState("non connecte");
    const [notification, setNotification] = useState({
        show: false,
        type: "error",
        message: "",
    });

    const [showForgotForm, setShowForgotForm] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotMessage, setForgotMessage] = useState("");

    const isEmailValid = email.length > 0 && mailError === "";
    const isPasswordValid = password.length >= 3 && passwordError === "";

    useEffect(() => {
        fetchUserToken();
    }, []);

    useEffect(() => {
        if (mailError || passwordError) {
            const timer = setTimeout(() => {
                setEmailError("");
                setPasswordError("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [mailError, passwordError]);

    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
        }, 5000);
    };

    const ValidateEmail = (mail) => {
        const valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
        if (!valid) {
            setEmailError("Adresse email invalide");
            showNotification("error", "Adresse email invalide");
        } else {
            setEmailError("");
        }
        return valid;
    };

    const fetchUserToken = useCallback(async () => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt || jwt === "null" || jwt === "undefined") {
            setMessageLog("Aucun token trouvé, veuillez vous connecter");
            return;
        }

        try {
            // ✅ Vérifie si le token est expiré
            const decoded = jwtDecode(jwt);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem("jwt");
                setMessageLog("Session expirée");
                showNotification("warning", "Session expirée - Veuillez vous reconnecter");
                return;
            }

            const response = await fetch(lien.url + "/connection/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jwt })
            });

            if (!response.ok) {
                setMessageLog(`Erreur du serveur: ${response.status}`);
                showNotification("error", `Erreur du serveur: ${response.status}`);
                return;
            }

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                setMessageLog("Réponse invalide du serveur");
                showNotification("error", "Réponse invalide du serveur");
                return;
            }

            if (!isNaN(data?.id)) {
                localStorage.setItem("utilisateur", data.id);
                setMessageLog("Connexion réussie");
                setProbleme("connecte");
                showNotification("success", "Connexion réussie");
            } else {
                setMessageLog("Déconnecté - Token invalide");
                setProbleme("non connecte");
                showNotification("warning", "Session expirée - Veuillez vous reconnecter");
            }
        } catch (err) {
            console.error("Erreur de décodage du JWT ou connexion :", err);
            setMessageLog("Erreur de connexion au serveur");
            showNotification("error", "Erreur de connexion au serveur");
        }
    }, []);

    const fetchConnection = useCallback(async (e) => {
        e.preventDefault();
        setPasswordError("");

        if (!ValidateEmail(email)) return;
        if (password.length < 3) {
            setPasswordError("Mot de passe trop court");
            showNotification("error", "Mot de passe trop court");
            return;
        }

        try {
            const response = await fetch(lien.url + '/connection/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                setMessageLog(`Erreur serveur: ${response.status}`);
                showNotification("error", `Erreur serveur: ${response.status}`);
                return;
            }

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                setMessageLog("Réponse invalide");
                showNotification("error", "Réponse invalide du serveur");
                return;
            }

            if (data.message && !data.success) {
                setMessageLog(data.message);
                showNotification(
                    data.message.includes("email") ? "warning" : "error",
                    data.message
                );
                return;
            }

            if (!data.jwt) {
                setMessageLog("JWT manquant dans la réponse");
                showNotification("error", "JWT manquant dans la réponse");
                return;
            }

            if (!isNaN(data?.id)) {
                localStorage.setItem("utilisateur", data.id);
                localStorage.setItem("jwt", data.jwt);
                setMessageLog("Connexion réussie");
                setProbleme("connecte");
                showNotification("success", "Connexion réussie");
                window.location.reload();
            } else {
                setMessageLog("Identifiants incorrects");
                showNotification("error", "Identifiants incorrects");
            }
        } catch {
            setMessageLog("Erreur de connexion");
            showNotification("error", "Erreur de connexion au serveur");
        }
    }, [email, password]);

    const fetchForgotPassword = async (e) => {
        e.preventDefault();

        if (!ValidateEmail(forgotEmail)) return;

        try {
            const response = await fetch(lien.url + '/connection/forgot-password', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotEmail })
            });

            if (!response.ok) {
                setForgotMessage(`Erreur serveur: ${response.status}`);
                showNotification("error", `Erreur serveur: ${response.status}`);
                return;
            }

            setForgotMessage("Vérifie tes mails");
            showNotification("info", "Vérifie tes mails");

        } catch {
            setForgotMessage("Erreur lors de l'envoi de la demande");
            showNotification("error", "Erreur lors de l'envoi de la demande");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("utilisateur");
        setProbleme("non connecte");
        setEmail("");
        setPassword("");
        showNotification("info", "Déconnecté");
        window.location.reload();
    };

    return (
        <div>
            <Layout />
            {notification.show && (
                <div className={`notification ${notification.type}`}>
                    <div className="notification-content">
                        <span>{notification.message}</span>
                        <button
                            onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}

            {probleme === "connecte" ? (
                <div>
                    <button onClick={handleLogout} className="logout-button">
                        Déconnexion
                    </button>
                    <Home />
                </div>
            ) : (
                <div className="container2">
                    <h2>Connexion</h2>
                    <p>Veuillez saisir vos identifiants pour vous connecter.</p>
                    <div className="status-indicator">
                        {messageLog || "Non connecté"}
                    </div>

                    <input
                        id="email"
                        value={email}
                        placeholder="email"
                        onChange={e => setEmail(e.target.value)}
                        type="text"
                        className={mailError ? "input-error" : isEmailValid ? "input-success" : ""}
                    />
                    <p className="error">{mailError}</p>

                    <input
                        id="password"
                        value={password}
                        placeholder="password"
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        className={passwordError ? "input-error" : isPasswordValid ? "input-success" : ""}
                    />
                    <p className="error">{passwordError}</p>

                    <button onClick={fetchConnection} id="btnLogin">LOGIN</button>

                    <button
                        onClick={() => setShowForgotForm(!showForgotForm)}
                        className="forgot-button"
                    >
                        {showForgotForm ? "Annuler" : "Mot de passe oublié ?"}
                    </button>

                    {showForgotForm && (
                        <div className="forgot-container">
                            <input
                                type="email"
                                placeholder="Votre email"
                                value={forgotEmail}
                                onChange={e => setForgotEmail(e.target.value)}
                                className={mailError ? "input-error" : ""}
                            />
                            <button onClick={fetchForgotPassword}>Envoyer</button>
                            {forgotMessage && <p className="info">{forgotMessage}</p>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Connection;
