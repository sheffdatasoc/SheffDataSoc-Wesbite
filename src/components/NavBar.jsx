import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'learning' | 'about' | null

  const location = useLocation();

  const learningActive = ["/resources", "/guides", "/glossary"].some(path =>
    location.pathname.startsWith(path)
  );

  const aboutActive = ["/about", "/timeline", "/members"].some(path =>
    location.pathname.startsWith(path)
  );

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest('.dropdown')) {
      setActiveDropdown(null);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle parent dropdown click
  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(prev => (prev === dropdownName ? null : dropdownName));
  };

  // Handle child click
  const handleChildClick = () => {
    setActiveDropdown(null); // Close dropdown after clicking child
    if (menuOpen) setMenuOpen(false); // Close mobile menu if open
  };

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

        {/* Hamburger */}
        <button 
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <ul className={`nav-menu ${menuOpen ? "open" : ""}`}>

          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <Home size={18} />
              <span>Home</span>
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/events" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <Calendar size={18} />
              <span>Events</span>
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/blog" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <BookOpen size={18} />
              <span>The Blog</span>
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/sandbox" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <Code size={18} />
              <span>The Sandbox</span>
            </NavLink>
          </li>

          {/* Learning dropdown */}
          <li className="dropdown">
            <button
              className={`nav-link dropdown-toggle ${learningActive ? "active" : ""}`}
              onClick={() => toggleDropdown('learning')}
            >
              <Book size={18} />
              <span>Learning</span>
              <ChevronDown size={16} />
            </button>

            {(activeDropdown === 'learning' || menuOpen) && (
              <ul className={`dropdown-menu ${menuOpen ? 'mobile-expanded' : ''}`}>
                <li>
                  <NavLink to="/guides" className={({ isActive }) => isActive ? "active" : ""} onClick={handleChildClick}>
                    Guides
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/glossary" className={({ isActive }) => isActive ? "active" : ""} onClick={handleChildClick}>
                    Glossary
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/resources" className={({ isActive }) => isActive ? "active" : ""} onClick={handleChildClick}>
                    Resources
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          <li>
            <NavLink 
              to="/gallery" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <ImageIcon size={18} />
              <span>Gallery</span>
            </NavLink>
          </li>

          {/* About dropdown */}
          <li className="dropdown">
            <button
              className={`nav-link dropdown-toggle ${aboutActive ? "active" : ""}`}
              onClick={() => toggleDropdown('about')}
            >
              <Info size={18} />
              <span>About</span>
              <ChevronDown size={16} />
            </button>

            {(activeDropdown === 'about' || menuOpen) && (
              <ul className={`dropdown-menu ${menuOpen ? 'mobile-expanded' : ''}`}>
                <li>
                  <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""} onClick={handleChildClick}>
                    About Us
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/timeline" className={({ isActive }) => isActive ? "active" : ""} onClick={handleChildClick}>
                    Timeline
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/members" className={({ isActive }) => isActive ? "active" : ""} onClick={handleChildClick}>
                    Our Team
                  </NavLink>
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





