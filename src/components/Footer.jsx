import React from "react";
import Logo from "../assets/datasoc-logo.png";
import { FaInstagram, FaLinkedin, FaGithub, FaTwitter, FaFacebook } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content-wrapper">

        {/* Brand Side */}
        <div className="footer-col footer-brand">
          <img src={Logo} alt="Datasoc Logo" className="footer-logo" />
          <h2 className="footer-title">SheffDatasoc</h2>
          <p className="footer-description">
            Empowering students through data, community, and real-world projects.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h3 className="footer-heading">Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/blog">The Blog</a></li>
            <li><a href="/about">About Us</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-col">
          <h3 className="footer-heading">Resources</h3>
          <ul>
            <li><a href="/guides">Guides</a></li>
            <li><a href="/glossary">Glossary</a></li>
            <li><a href="/sandbox">The Sandbox</a></li>
            <li><a href="/gallery">Gallery</a></li>
          </ul>
        </div>

        {/* Contact / Socials */}
        <div className="footer-col">
          <h3 className="footer-heading">Follow Us</h3>
          <ul className="footer-socials">
            <li>
              <a href="https://instagram.com/sheffdatasoc" target="_blank" rel="noopener noreferrer">
                <FaInstagram /> Instagram
              </a>
            </li>
            <li>
              <a href="https://linkedin.com/company/university-of-sheffield-data-science-society" target="_blank" rel="noopener noreferrer">
                <FaLinkedin /> LinkedIn
              </a>
            </li>
            <li>
              <a href="https://github.com/sheffdatasoc" target="_blank" rel="noopener noreferrer">
                <FaGithub /> GitHub
              </a>
            </li>
            <li>
              <a href="https://x.com/SheffDatasoc" target="_blank" rel="noopener noreferrer">
                <FaTwitter /> Twitter
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/sheffdatasoc" target="_blank" rel="noopener noreferrer">
                <FaFacebook /> Facebook
              </a>
            </li>
          </ul>
        </div>

        {/* Join */}
        <div className="footer-col footer-join">
          <h3 className="footer-heading">Join the Community</h3>
          <a
            className="footer-join-btn"
            href="https://su.sheffield.ac.uk/activities/view/data-science-society?activity=541"
            target="_blank"
            rel="noopener noreferrer"
          >
            Become a Member
          </a>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} SheffDatasoc. All rights reserved.
      </div>
    </footer>
  );
}
