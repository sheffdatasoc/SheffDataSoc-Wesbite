import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  BookOpen, 
  Code, 
  Book, 
  Image as ImageIcon, 
  Info,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import logoImg from '../assets/datasoc-logo.png'; 
import './NavBar.css';

function NavBar() {
  // -- State Management --
  const [activeDropdown, setActiveDropdown] = useState(null); // 'learning' | 'about' | null
  const [isOpen, setIsOpen] = useState(false); // Mobile Menu State
  const location = useLocation();

  // Close mobile menu automatically when route changes
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null); // Also close any open dropdown
  }, [location]);

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Toggle dropdown (click)
  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(prev => (prev === dropdownName ? null : dropdownName));
  };

  // Close dropdown after clicking a child link
  const handleChildClick = () => {
    setActiveDropdown(null);
    if (isOpen) setIsOpen(false);
  };

  // Helper to set active class for standard links
  const getLinkClass = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  // Helper to set active class for Dropdown parents
  const getDropdownClass = (paths) => {
    return paths.some(path => location.pathname.startsWith(path)) 
      ? "nav-link dropdown-toggle active" 
      : "nav-link dropdown-toggle";
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* --- LOGO SECTION --- */}
        <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          <img src={logoImg} alt="SheffDataSoc Logo" className="navbar-logo-img" />
          <div className="logo-text">
            <h1>SheffDataSoc</h1>
            <p>Sheffield Data Science Society</p>
          </div>
        </Link>

        {/* Hamburger Icon */}
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>

        {/* Navigation Links */}
        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>

          <li>
            <Link to="/" className={getLinkClass('/')} onClick={handleChildClick}>
              <Home size={18} />
              <span>Home</span>
            </Link>
          </li>

          <li>
            <Link to="/events" className={getLinkClass('/events')} onClick={handleChildClick}>
              <Calendar size={18} />
              <span>Events</span>
            </Link>
          </li>

          <li>
            <Link to="/blog" className={getLinkClass('/blog')} onClick={handleChildClick}>
              <BookOpen size={18} />
              <span>The Blog</span>
            </Link>
          </li>

          <li>
            <Link to="/sandbox" className={getLinkClass('/sandbox')} onClick={handleChildClick}>
              <Code size={18} />
              <span>The Sandbox</span>
            </Link>
          </li>

          {/* Learning Dropdown */}
          <li className="dropdown">
            <button 
              className={getDropdownClass(['/guides', '/glossary', '/resources'])}
              onClick={() => toggleDropdown('learning')}
            >
              <Book size={18} />
              <span>Learning</span>
              <ChevronDown size={16} />
            </button>

            {/* FIX: Only show if this specific section is open */}
            {activeDropdown === 'learning' && (
              <ul className={`dropdown-menu ${isOpen ? 'mobile-expanded' : ''}`}>
                <li>
                  <Link to="/guides" onClick={handleChildClick}>Guides</Link>
                </li>
                <li>
                  <Link to="/glossary" onClick={handleChildClick}>Glossary</Link>
                </li>
                <li>
                  <Link to="/resources" onClick={handleChildClick}>Resources</Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/gallery" className={getLinkClass('/gallery')} onClick={handleChildClick}>
              <ImageIcon size={18} />
              <span>Gallery</span>
            </Link>
          </li>

          {/* About Dropdown */}
          <li className="dropdown">
            <button
              className={getDropdownClass(['/about', '/timeline', '/members'])}
              onClick={() => toggleDropdown('about')}
            >
              <Info size={18} />
              <span>About</span>
              <ChevronDown size={16} />
            </button>

            {/* FIX: Only show if this specific section is open */}
            {activeDropdown === 'about' && (
              <ul className={`dropdown-menu ${isOpen ? 'mobile-expanded' : ''}`}>
                <li>
                  <Link to="/about" onClick={handleChildClick}>About Us</Link>
                </li>
                <li>
                  <Link to="/timeline" onClick={handleChildClick}>Timeline</Link>
                </li>
                <li>
                  <Link to="/members" onClick={handleChildClick}>Our Team</Link>
                </li>
              </ul>
            )}
          </li>

        </ul>
      </div>
    </nav>
  );
}

export default NavBar;