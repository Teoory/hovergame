import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CoinProvider from './hooks/coinContext';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CoinProvider>
      <App />
    </CoinProvider>
  </React.StrictMode>
);

reportWebVitals();