import React from 'react';
import NavBar from './components/NavBar';

function Layout({ children }) {
  return (
    <div className="app">
      <NavBar />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>&copy; 2024 Sheffield Data Science Society. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Layout;