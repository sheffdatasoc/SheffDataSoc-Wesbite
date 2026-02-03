import { FaInstagram, FaLinkedin, FaGithub, FaTwitter, FaFacebook } from "react-icons/fa";
import "./HomeSocial.css";

export default function HomeSocial() {
  return (
    <section className="home-social">
      <div className="top-content">
        <h2>Follow Us on Social Media</h2>
        <p>Stay connected and see what we're up to!</p>
      </div>

      <div className="social-icons">
        <a href="https://www.instagram.com/sheffdatasoc" target="_blank" rel="noopener noreferrer" className="instagram">
          <FaInstagram className="filled-icon" />
        </a>
        <a href="https://www.linkedin.com/company/university-of-sheffield-data-science-society/" target="_blank" rel="noopener noreferrer" className="linkedin">
          <FaLinkedin className="filled-icon" />
        </a>
        <a href="https://github.com/sheffdatasoc" target="_blank" rel="noopener noreferrer" className="github">
          <FaGithub className="filled-icon" />
        </a>
        <a href="https://x.com/SheffDatasoc" target="_blank" rel="noopener noreferrer" className="twitter">
          <FaTwitter className="filled-icon" />
        </a>
        <a href="https://www.facebook.com/sheffdatasoc" target="_blank" rel="noopener noreferrer" className="facebook">
          <FaFacebook className="filled-icon" />
        </a>
      </div>
    </section>
  );
}