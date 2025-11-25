/* ========================================
   /pages/About.jsx - With PartnerCard Component
   ======================================== */

import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart, Clock, Users, ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import PartnerCard from '../components/PartnerCard';
import './About.css';

function About() {
  // Partners data
  const partners = [
    {
      name: 'Microsoft',
      description: 'Cloud computing and AI platform partner',
      tier: 'Platinum',
      logo: '/images/partners/microsoft.png',
      website: 'https://www.microsoft.com'
    },
    {
      name: 'Google',
      description: 'Technology and innovation partner',
      tier: 'Platinum',
      logo: '/images/partners/google.png',
      website: 'https://www.google.com'
    },
    {
      name: 'Amazon Web Services',
      description: 'Cloud infrastructure partner',
      tier: 'Gold',
      logo: '/images/partners/aws.png',
      website: 'https://aws.amazon.com'
    },
    {
      name: 'IBM',
      description: 'Enterprise AI solutions partner',
      tier: 'Gold',
      logo: '/images/partners/ibm.png',
      website: 'https://www.ibm.com'
    },
    {
      name: 'DataCamp',
      description: 'Educational platform partner',
      tier: 'Silver',
      logo: '/images/partners/datacamp.png',
      website: 'https://www.datacamp.com'
    },
    {
      name: 'Kaggle',
      description: 'Data science competition platform',
      tier: 'Silver',
      logo: '/images/partners/kaggle.png',
      website: 'https://www.kaggle.com'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <span className="hero-badge">👋 Who We Are</span>
        <h1>About Us</h1>
        <p>We're a passionate community of students dedicated to fostering growth, connection, and unforgettable experiences on campus.</p>
      </div>

      {/* Navigation Cards */}
      <div className="about-nav-cards">
        <Link to="/timeline" className="nav-card">
          <div className="nav-icon-box gradient-purple">
            <Clock size={24} color="white" strokeWidth={2.5} />
          </div>
          <div className="nav-card-content">
            <h3>Our Timeline</h3>
            <p>Explore our journey and milestones</p>
          </div>
          <div className="nav-arrow">
            <ArrowRight size={20} />
          </div>
        </Link>

        <Link to="/members" className="nav-card">
          <div className="nav-icon-box gradient-blue">
            <Users size={24} color="white" strokeWidth={2.5} />
          </div>
          <div className="nav-card-content">
            <h3>Our Members</h3>
            <p>Meet our amazing community</p>
          </div>
          <div className="nav-arrow">
            <ArrowRight size={20} />
          </div>
        </Link>
      </div>

      {/* Mission Cards */}
      <div className="about-cards-grid">
        <div className="clean-card">
          <div className="card-icon-box gradient-indigo">
            <Target size={28} color="white" strokeWidth={2} />
          </div>
          <h2>Our Mission</h2>
          <p>
            To create an inclusive environment where students can develop 
            leadership skills, build meaningful connections, and contribute 
            positively to campus life.
          </p>
        </div>

        <div className="clean-card">
          <div className="card-icon-box gradient-cyan">
            <Eye size={28} color="white" strokeWidth={2} />
          </div>
          <h2>Our Vision</h2>
          <p>
            To be the leading student society that empowers individuals to 
            reach their full potential through collaboration, innovation, 
            and community engagement.
          </p>
        </div>

        <div className="clean-card">
          <div className="card-icon-box gradient-pink">
            <Heart size={28} color="white" strokeWidth={2} />
          </div>
          <h2>Our Values</h2>
          <p>
            Integrity, inclusivity, innovation, and impact. We believe in 
            creating opportunities that inspire and empower every member 
            of our community.
          </p>
        </div>
      </div>

      {/* What We Do Section */}
      <section className="what-we-do">
        <div className="what-we-do-header">
          <h2>What We Do</h2>
          <p>From workshops to social events, we offer diverse opportunities for growth and connection</p>
        </div>

        <div className="activities-grid">
          <div className="activity-card">
            <div className="activity-icon-box color-purple"><span>🎓</span></div>
            <h3>Workshops & Learning</h3>
            <p>Regular workshops on professional development, technical skills, and personal growth led by industry experts and experienced peers.</p>
          </div>
          <div className="activity-card">
            <div className="activity-icon-box color-blue"><span>🤝</span></div>
            <h3>Networking Events</h3>
            <p>Connect with like-minded students, alumni, and professionals through our regular networking sessions and career fairs.</p>
          </div>
          <div className="activity-card">
            <div className="activity-icon-box color-pink"><span>🎉</span></div>
            <h3>Social Activities</h3>
            <p>From game nights to cultural celebrations, our social events create lasting friendships and memorable experiences.</p>
          </div>
          <div className="activity-card">
            <div className="activity-icon-box color-yellow"><span>🌟</span></div>
            <h3>Community Service</h3>
            <p>Give back to the community through volunteer opportunities, fundraisers, and social impact initiatives.</p>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section">
        <div className="partners-header">
          <span className="partners-badge">🏆 Proudly Supported By</span>
          <h2>Our Partners</h2>
          <p>We're grateful to work with industry-leading organizations who support our mission</p>
        </div>

        <div className="partners-grid">
          {partners.map((partner, index) => (
            <PartnerCard 
              key={index}
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

      {/* Get In Touch Section */}
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