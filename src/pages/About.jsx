// /pages/About.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { 
  Target, Eye, Heart, Clock, Users, ArrowRight,
  Mail, MapPin, Phone
} from 'lucide-react';

import PartnerCard from '../components/PartnerCard';
import { getPartners } from '../lib/supabase';   // <-- Correct path
import './About.css';

function About() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getPartners();
      setPartners(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="about-page">

      {/* HERO */}
      <div className="about-hero">
        <span className="hero-badge">About Us</span>
        <h1>Who We Are</h1>
        <p>
          We're a passionate community of students dedicated to fostering growth,
          connection, and unforgettable experiences on campus.
        </p>
      </div>

      {/* NAVIGATION */}
      <div className="about-nav-cards">
        <Link to="/timeline" className="nav-card">
          <div className="nav-icon-box gradient-purple">
            <Clock size={24} />
          </div>
          <div className="nav-card-content">
            <h3>Our Timeline</h3>
            <p>Journey through our history</p>
          </div>
          <ArrowRight size={20} className="nav-arrow" />
        </Link>

        <Link to="/team" className="nav-card">
          <div className="nav-icon-box gradient-blue">
            <Users size={24} />
          </div>
          <div className="nav-card-content">
            <h3>Meet The Team</h3>
            <p>Get to know our members</p>
          </div>
          <ArrowRight size={20} className="nav-arrow" />
        </Link>
      </div>

      {/* MISSION / VALUES */}
      <div className="about-cards-grid">

        <div className="clean-card">
          <div className="card-icon-box gradient-indigo">
            <Target size={28} />
          </div>
          <h2>Our Mission</h2>
          <p>
            To empower students through data science education, fostering a
            community of learners and innovators who will shape the future of technology.
          </p>
        </div>

        <div className="clean-card">
          <div className="card-icon-box gradient-cyan">
            <Eye size={28} />
          </div>
          <h2>Our Vision</h2>
          <p>
            To be the leading student organization in data science, creating
            opportunities for growth, collaboration, and real-world impact.
          </p>
        </div>

        <div className="clean-card">
          <div className="card-icon-box gradient-pink">
            <Heart size={28} />
          </div>
          <h2>Our Values</h2>
          <p>
            Innovation, collaboration, inclusivity, and continuous learning drive
            everything we do as a community.
          </p>
        </div>

      </div>

      {/* WHAT WE DO */}
      <section className="what-we-do">
        <div className="what-we-do-header">
          <h2>What We Do</h2>
          <p>Discover the activities and opportunities that make our community thrive</p>
        </div>

        <div className="activities-grid">
          <div className="activity-card">
            <div className="activity-icon-box color-purple"><span>🎓</span></div>
            <h3>Workshops & Training</h3>
            <p>
              Hands-on workshops covering Python, ML, data viz and more.
            </p>
          </div>

          <div className="activity-card">
            <div className="activity-icon-box color-blue"><span>🏆</span></div>
            <h3>Competitions</h3>
            <p>
              Join hackathons and solve real-world problems.
            </p>
          </div>

          <div className="activity-card">
            <div className="activity-icon-box color-pink"><span>🤝</span></div>
            <h3>Networking Events</h3>
            <p>
              Meet professionals, alumni and build connections.
            </p>
          </div>

          <div className="activity-card">
            <div className="activity-icon-box color-yellow"><span>💻</span></div>
            <h3>Projects</h3>
            <p>
              Build your portfolio by working on real-world data science projects.
            </p>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="partners-section">

        <div className="partners-header">
          <span className="partners-badge">🏆 Proudly Supported By</span>
          <h2>Our Partners</h2>
          <p>We’re grateful to work with industry-leading organizations who support our mission.</p>
        </div>

        <div className="partners-grid">
          {loading && <p>Loading partners...</p>}

          {!loading && partners.length === 0 && (
            <p>No partners found.</p>
          )}

          {!loading && partners.length > 0 && partners.map((partner) => (
            <PartnerCard
              key={partner.id}
              name={partner.name}
              description={partner.description}
              tier={partner.tier}
              logo={partner.logo}
              website={partner.website}
            />
          ))}
        </div>

        <div className="partners-cta">
          <p>Interested in partnering with us?</p>
          <a href="mailto:sheffdatasoc@sheffield.ac.uk" className="btn-partner-inquiry">
            Become a Partner
          </a>
        </div>

      </section>

      {/* CONTACT */}
      <section className="get-in-touch">
        <div className="get-in-touch-header">
          <h2>Get In Touch</h2>
          <p>Have questions? Want to get involved? We'd love to hear from you!</p>
        </div>

        <div className="contact-info-card">
          <div className="contact-grid">

            <div className="contact-item">
              <div className="contact-icon-box icon-purple"><Mail size={24} /></div>
              <h3>Email</h3>
              <p>sheffdatasoc@sheffield.ac.uk</p>
            </div>

            <div className="contact-item">
              <div className="contact-icon-box icon-blue"><MapPin size={24} /></div>
              <h3>Location</h3>
              <p>The Diamond<br />University of Sheffield</p>
            </div>

            <div className="contact-item">
              <div className="contact-icon-box icon-pink"><Phone size={24} /></div>
              <h3>Phone</h3>
              <p>(555) 123-4567</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

export default About;
