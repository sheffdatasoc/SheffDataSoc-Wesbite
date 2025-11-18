import React from 'react';
import { Analytics } from "@vercel/analytics/react";
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import './App.css';

function App({ children }) {
  return (
    <div className="app">
      <NavBar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      <Analytics />
    </div>
  );
}

export default App;