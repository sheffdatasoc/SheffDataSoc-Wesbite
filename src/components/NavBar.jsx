import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  BookOpen, 
  Code, 
  Book, 
  Image as ImageIcon, 
  Info,
  ChevronDown 
} from 'lucide-react';
import './NavBar.css';

function NavBar() {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <div className="logo-icon">SDS</div>
          <div className="logo-text">
            <h1>SheffDataSoc</h1>
            <p>Sheffield Data Science Society</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <ul className="nav-menu">
          <li>
            <Link to="/" className="nav-link">
              <Home size={18} />
              <span>Home</span>
            </Link>
          </li>

          <li>
            <Link to="/events" className="nav-link">
              <Calendar size={18} />
              <span>Events</span>
            </Link>
          </li>

          <li>
            <Link to="/blog" className="nav-link">
              <BookOpen size={18} />
              <span>The Blog</span>
            </Link>
          </li>

          <li>
            <Link to="/sandbox" className="nav-link">
              <Code size={18} />
              <span>The Sandbox</span>
            </Link>
          </li>

          {/* Resources Dropdown */}
          <li 
            className="dropdown"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button className="nav-link dropdown-toggle">
              <Book size={18} />
              <span>Resources</span>
              <ChevronDown size={16} />
            </button>
            {resourcesOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/guides">Guides</Link></li>
                <li><Link to="/glossary">Glossary</Link></li>
                <li><Link to="/resources">Resources</Link></li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/gallery" className="nav-link">
              <ImageIcon size={18} />
              <span>Gallery</span>
            </Link>
          </li>

          {/* About Dropdown */}
          <li 
            className="dropdown"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <button className="nav-link dropdown-toggle">
              <Info size={18} />
              <span>About</span>
              <ChevronDown size={16} />
            </button>
            {aboutOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/timeline">Timeline</Link></li>
                <li><Link to="/members">Our Team</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;