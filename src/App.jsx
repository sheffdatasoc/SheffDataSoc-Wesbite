import React from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import './App.css';  // ← Now imports App.css (was Layout.css)
import { useLocation } from 'react-router-dom';

function App({ children }) {

  const location = useLocation();
  
  return (
    <div className="app">
      <NavBar />
      <main className="main-content">
        {children}
      </main>
      {/* <Footer /> */}
      {location.pathname !== '/' && <Footer />}
    </div>
  );
}

export default App;