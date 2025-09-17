import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import '../css/index.css';
import AddLink from "../components/AddLink.jsx";
import LinkDetail from "../components/LinkDetail.jsx";
import Home from "../components/Home.jsx";
import Connection from "../components/Connection.jsx";
import Inscription from "../components/Inscription.jsx";
import Layout from "../components/Layout.jsx";
import PublicHome from "../components/PublicHome.jsx";
import AddCategory from "../components/AddCategory.jsx";
import UserProfile from "../components/userProfile.jsx";
import LinkValidationPage from "../components/LinkValidationPage.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import ResetPasswordForm from "../components/ResetPasswordForm.jsx";
import MessageBoxWrapper from "../components/MessageBoxWrapper.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                {/* Route publique - accueil visible sans connexion */}
                <Route path="/" element={<PublicHome />} />

                {/* Routes d'authentification */}
                <Route path="/login" element={<Connection />} />
                <Route path="/inscription" element={<Inscription />} />
                <Route path="/reset-password" element={<ResetPasswordForm />} />

                {/* Routes protégées avec menu */}
                <Route element={<Layout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/add" element={<AddLink />} />
                    <Route path="/link/:id" element={<LinkDetail />} />
                    <Route path="/profile" element={<UserProfile />} />

                    {/* 🛡️ Routes admin/manager */}
                    <Route element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
                        <Route path="/category" element={<AddCategory />} />
                        <Route path="/validation" element={<LinkValidationPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
