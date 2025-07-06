import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import '../css/index.css';
import App from "../components/App.jsx";
import AddDeal from "../components/AddDeal.jsx";
import DealDetail from "../components/DealDetail.jsx";
import Home from "../components/Home.jsx";
import Connection from "../components/connection.jsx";
import Inscription from "../components/Inscription.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/add" element={<AddDeal />} />
                <Route path="/deal/:id" element={<DealDetail />} />
                <Route path="/" element={<Connection/>}/>
                <Route path="/inscription" element={<Inscription/>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
