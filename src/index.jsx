import React from 'react';
import ReactDOM from 'react-dom/client';

// Global CSS
import './styles/variables.css';
import './styles/global.css';
import './styles/components.css';
import './styles/responsive.css';

// Import the router
import AppRouter from './Router';  // ← Matches the export

// ✅ Fix mobile 100vh issue
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Run once when app loads
setViewportHeight();

// Update on window resize
window.addEventListener('resize', setViewportHeight);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRouter />  {/* ← Use AppRouter */}
  </React.StrictMode>
);