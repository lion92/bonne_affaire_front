import React, { useState } from "react";
import lien from "../components/lien.js";
import "../css/connexion.css";

const ResetPasswordForm = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const token = new URLSearchParams(window.location.search).get("token");

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setSuccess(false);

        const pwdErrors = validatePassword(newPassword);
        if (pwdErrors.length > 0) {
            setMessage(`Le mot de passe doit contenir : ${pwdErrors.join(", ")}`);
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("Les mots de passe ne correspondent pas");
            return;
        }

        try {
            const response = await fetch(lien.url + "/connection/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json().catch(() => ({})); // pour éviter erreur si pas un JSON

            if (!response.ok) {
                setMessage(data.message || `Erreur serveur: ${response.status}`);
                return;
            }

            setMessage(data.message || "Mot de passe réinitialisé");
            if (data.success) {
                setSuccess(true);
            }

        } catch {
            setMessage("Erreur lors de la réinitialisation");
        }
    };

    return (
        <div className="container2">
            <h2>Réinitialisation du mot de passe</h2>
            {success ? (
                <p className="success">{message}</p>
            ) : (
                <form onSubmit={handleSubmit} className="reset-form">
                    <input
                        type="password"
                        placeholder="Nouveau mot de passe"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <div className="password-requirements">
                        <small>
                            Le mot de passe doit contenir :
                            <ul>
                                <li className={newPassword.length >= 12 ? 'valid' : 'invalid'}>
                                    Au moins 12 caractères
                                </li>
                                <li className={/(?=.*[a-z])/.test(newPassword) ? 'valid' : 'invalid'}>
                                    Une lettre minuscule
                                </li>
                                <li className={/(?=.*[A-Z])/.test(newPassword) ? 'valid' : 'invalid'}>
                                    Une lettre majuscule
                                </li>
                                <li className={/(?=.*\d)/.test(newPassword) ? 'valid' : 'invalid'}>
                                    Un chiffre
                                </li>
                                <li className={/(?=.*[@$!%*?&])/.test(newPassword) ? 'valid' : 'invalid'}>
                                    Un caractère spécial (@$!%*?&)
                                </li>
                            </ul>
                        </small>
                    </div>
                    <input
                        type="password"
                        placeholder="Confirmez le mot de passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit">Réinitialiser</button>
                    {message && (
                        <p className={success ? "success" : "error"}>{message}</p>
                    )}
                </form>
            )}
        </div>
    );
};

export default ResetPasswordForm;
