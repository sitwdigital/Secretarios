import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';


const isLocal = window.location.hostname.includes("localhost");
const basename = isLocal ? "/" : "/secretarios";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
