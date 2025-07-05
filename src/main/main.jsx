import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import '../css/index.css';
import App from "../components/App.jsx";
import AddDeal from "../components/AddDeal.jsx";
import DealDetail from "../components/DealDetail.jsx";
import Home from "../components/Home.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add" element={<AddDeal />} />
                <Route path="/deal/:id" element={<DealDetail />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
