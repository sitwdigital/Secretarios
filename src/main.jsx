import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Print from './containers/Print'; // ou './Print' se estiver fora de containers

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/print" element={<Print />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
