import React from 'react';
import ReactDOM from 'react-dom/client';

// Global CSS
import './styles/variables.css';
import './styles/global.css';
import './styles/components.css';
import './styles/responsive.css';

// Import the router
import AppRouter from './Router';  // ← Matches the export

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRouter />  {/* ← Use AppRouter */}
  </React.StrictMode>
);