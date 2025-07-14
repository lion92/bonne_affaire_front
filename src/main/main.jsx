import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import '../css/index.css';
import AddDeal from "../components/AddDeal.jsx";
import DealDetail from "../components/DealDetail.jsx";
import Home from "../components/Home.jsx";
import Connection from "../components/Connection.jsx";
import Inscription from "../components/Inscription.jsx";
import Layout from "../components/Layout.jsx";
import AddCategory from "../components/AddCategory.jsx";
import UserProfile from "../components/userProfile.jsx";
import DealValidationPage from "../components/DealValidationPage.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import ResetPasswordForm from "../components/ResetPasswordForm.jsx";
import MessageBoxWrapper from "../components/MessageBoxWrapper.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                {/* Routes sans layout */}
                <Route path="/" element={<Connection />} />
                <Route path="/inscription" element={<Inscription />} />
                <Route path="/reset-password" element={<ResetPasswordForm />} />

                {/* Routes avec menu */}
                <Route element={<Layout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/add" element={<AddDeal />} />
                    <Route path="/deal/:id" element={<DealDetail />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/messages/:receiverId" element={<MessageBoxWrapper />} />

                    {/* 🛡️ Routes protégées : admin ou manager */}
                    <Route element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
                        <Route path="/category" element={<AddCategory />} />
                        <Route path="/validation" element={<DealValidationPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
