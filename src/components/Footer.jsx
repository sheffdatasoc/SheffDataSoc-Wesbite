import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Company Info Section */}
        <div className="footer-section">
          <div className="footer-logo">
            <div className="logo-icon">SDS</div>
            <h3>SheffDataSoc</h3>
            <p>Data Science Society</p>
          </div>
          <p className="footer-description">
            Empowering students through data science, AI, and community at the
            University of Sheffield.
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/events">Events</Link>
            </li>
            <li>
              <Link to="/blog">The Blog</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
          </ul>
        </div>

        {/* Resources Section */}
        <div className="footer-section">
          <h4>Resources</h4>
          <ul className="footer-links">
            <li>
              <Link to="/guides">Guides</Link>
            </li>
            <li>
              <Link to="/glossary">Glossary</Link>
            </li>
            <li>
              <Link to="/resources">Resources</Link>
            </li>
            <li>
              <Link to="/sandbox">The Sandbox</Link>
            </li>
            <li>
              <Link to="/gallery">Gallery</Link>
            </li>
          </ul>
        </div>

        {/* Connect Section */}
        <div className="footer-section">
          <h4>Connect</h4>
          <p className="connect-text">
            Stay updated with our latest news and events. Follow us on social
            media!
          </p>
          <button
            className="join-community-btn"
            onClick={() => {
              // Placeholder - replace with actual community link
              window.open("#", "_blank");
            }}
          >
            Join Our Community
          </button>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>&copy; 2024 SheffDataSoc. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
