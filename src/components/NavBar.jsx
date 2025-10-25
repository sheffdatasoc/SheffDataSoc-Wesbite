import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <div className="logo-icon">SDS</div>
          <div className="logo-text">
            <h1>SheffDataSoc</h1>
            <p>Sheffield Data Science Society</p>
          </div>
        </Link>
        
        <ul className="nav-menu">
          <li><Link to="/">🏠 Home</Link></li>
          <li><Link to="/events">📅 Events</Link></li>
          <li><Link to="/blog">📰 The Blog</Link></li>
          <li><Link to="/sandbox">💻 The Sandbox</Link></li>
          
          <li 
            className="dropdown"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button className="dropdown-toggle">
              📚 Resources ▾
            </button>
            {resourcesOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/guides">Guides</Link></li>
                <li><Link to="/glossary">Glossary</Link></li>
                <li><Link to="/resources">Resources</Link></li>
              </ul>
            )}
          </li>

          <li><Link to="/gallery">🖼️ Gallery</Link></li>
          
          <li 
            className="dropdown"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <button className="dropdown-toggle">
              ℹ️ About ▾
            </button>
            {aboutOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/members">Members</Link></li>
                <li><Link to="/timeline">Timeline</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;