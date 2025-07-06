import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import '../css/index.css';
import App from "../components/App.jsx";
import AddDeal from "../components/AddDeal.jsx";
import DealDetail from "../components/DealDetail.jsx";
import Home from "../components/Home.jsx";
import Connection from "../components/Connection.jsx";
import Inscription from "../components/Inscription.jsx";
import Layout from "../components/Layout.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                {/* Routes sans layout */}
                <Route path="/" element={<Connection />} />
                <Route path="/inscription" element={<Inscription />} />

                {/* Routes avec menu */}
                <Route element={<Layout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/add" element={<AddDeal />} />
                    <Route path="/deal/:id" element={<DealDetail />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
