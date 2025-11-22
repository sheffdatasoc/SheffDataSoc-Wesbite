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
import './NavBar.css';

function NavBar() {
  // -- State Management --
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Mobile Menu State
  
  // Track active pages for gradient styling
  const location = useLocation();

  // Close mobile menu automatically when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Helper to set active class for standard links
  const getLinkClass = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  // Helper to set active class for Dropdown parents
  const getDropdownClass = (paths) => {
    return paths.some(path => location.pathname.startsWith(path)) 
      ? "nav-link dropdown-toggle active" 
      : "nav-link dropdown-toggle";
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

        {/* Hamburger Icon */}
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>

        {/* Navigation Links */}
        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
          
          <li>
            <Link to="/" className={getLinkClass('/')}>
              <Home size={18} />
              <span>Home</span>
            </Link>
          </li>

          <li>
            <Link to="/events" className={getLinkClass('/events')}>
              <Calendar size={18} />
              <span>Events</span>
            </Link>
          </li>

          <li>
            <Link to="/blog" className={getLinkClass('/blog')}>
              <BookOpen size={18} />
              <span>The Blog</span>
            </Link>
          </li>

          <li>
            <Link to="/sandbox" className={getLinkClass('/sandbox')}>
              <Code size={18} />
              <span>The Sandbox</span>
            </Link>
          </li>

          {/* Learning Dropdown */}
          <li 
            className="dropdown"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button className={getDropdownClass(['/guides', '/glossary', '/resources'])}>
              <Book size={18} />
              <span>Learning</span> {/* Parent renamed */}
              <ChevronDown size={16} />
            </button>
            
            {resourcesOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/guides">Guides</Link></li>
                <li><Link to="/glossary">Glossary</Link></li>
                <li><Link to="/resources">Resources</Link></li> {/* Child stays */}
              </ul>
            )}
          </li>

          <li>
            <Link to="/gallery" className={getLinkClass('/gallery')}>
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
            <button className={getDropdownClass(['/about', '/timeline', '/members'])}>
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
