import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
