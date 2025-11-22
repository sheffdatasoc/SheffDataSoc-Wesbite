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
  ChevronDown,
  Menu, // Import Menu icon
  X     // Import X icon
} from 'lucide-react';
import './NavBar.css';

function NavBar() {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  
  // State for the hamburger menu
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          <div className="logo-icon">SDS</div>
          <div className="logo-text">
            <h1>SheffDataSoc</h1>
            <p>Sheffield Data Science Society</p>
          </div>
        </Link>

        {/* Hamburger Icon (Visible only on mobile via CSS) */}
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>

        {/* Navigation Links */}
        {/* We add the 'active' class if isOpen is true */}
        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
          <li>
            <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
              <Home size={18} />
              <span>Home</span>
            </Link>
          </li>

          <li>
            <Link to="/events" className="nav-link" onClick={() => setIsOpen(false)}>
              <Calendar size={18} />
              <span>Events</span>
            </Link>
          </li>

          <li>
            <Link to="/blog" className="nav-link" onClick={() => setIsOpen(false)}>
              <BookOpen size={18} />
              <span>The Blog</span>
            </Link>
          </li>

          <li>
            <Link to="/sandbox" className="nav-link" onClick={() => setIsOpen(false)}>
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
                <li><Link to="/guides" onClick={() => setIsOpen(false)}>Guides</Link></li>
                <li><Link to="/glossary" onClick={() => setIsOpen(false)}>Glossary</Link></li>
                <li><Link to="/resources" onClick={() => setIsOpen(false)}>Resources</Link></li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/gallery" className="nav-link" onClick={() => setIsOpen(false)}>
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
                <li><Link to="/about" onClick={() => setIsOpen(false)}>About Us</Link></li>
                <li><Link to="/timeline" onClick={() => setIsOpen(false)}>Timeline</Link></li>
                <li><Link to="/members" onClick={() => setIsOpen(false)}>Our Team</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;