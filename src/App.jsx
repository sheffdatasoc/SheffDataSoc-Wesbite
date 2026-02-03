import React from 'react';
import { Analytics } from "@vercel/analytics/react";
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ChatBot from './components/ChatBot';
import './App.css';
import { useLocation } from 'react-router-dom'; // Kept from Julia's branch

function App({ children }) {

  // Kept from Julia's branch (needed for the footer logic below)
  const location = useLocation();

  return (
    <div className="app">
      <NavBar />
      <main className="main-content">
        {children}
      </main>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* SDS ChatBot Assistant */}
      <ChatBot />

      {/* Julia's Change: Only show footer if NOT on home page */}
      {location.pathname !== '/' && <Footer />}

      {/* Main's Change: Keep the analytics */}
      <Analytics />
    </div>
  );
}

export default App;