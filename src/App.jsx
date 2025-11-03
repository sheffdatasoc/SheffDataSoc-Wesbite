import React from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import './App.css';  // ← Now imports App.css (was Layout.css)

function App({ children }) {
  return (
    <div className="app">
      <NavBar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default App;