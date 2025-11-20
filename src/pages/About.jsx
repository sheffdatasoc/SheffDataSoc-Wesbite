/* ========================================
   About.jsx - Updated Hero Style
   ======================================== */

import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart, Clock, Users, ArrowRight } from 'lucide-react';
import './About.css';

function About() {
  return (
    <div className="about-page">
      {/* Hero Section (Updated to match Sandbox/Timeline) */}
      <div className="about-hero">
        <span className="hero-badge">👋 Who We Are</span>
        <h1>About Us</h1>
        <p>We're a passionate community of students dedicated to fostering growth, connection, and unforgettable experiences on campus.</p>
      </div>

      {/* Navigation Cards */}
      <div className="about-nav-cards">
        <Link to="/timeline" className="nav-card">
          <div className="nav-card-icon timeline-icon">
            <Clock size={32} />
          </div>
          <div className="nav-card-content">
            <h3>Our Timeline</h3>
            <p>Explore our journey and milestones</p>
          </div>
          <ArrowRight className="nav-card-arrow" size={24} />
        </Link>

        <Link to="/members" className="nav-card">
          <div className="nav-card-icon members-icon">
            <Users size={32} />
          </div>
          <div className="nav-card-content">
            <h3>Our Members</h3>
            <p>Meet our amazing community</p>
          </div>
          <ArrowRight className="nav-card-arrow" size={24} />
        </Link>
      </div>

      {/* Mission, Vision, Values Cards */}
      <div className="about-cards">
        <div className="about-card">
          <div className="card-icon mission-icon">
            <Target size={40} />
          </div>
          <h2>Our Mission</h2>
          <p>
            To create an inclusive environment where students can develop 
            leadership skills, build meaningful connections, and contribute 
            positively to campus life through data science and analytics.
          </p>
        </div>

        <div className="about-card">
          <div className="card-icon vision-icon">
            <Eye size={40} />
          </div>
          <h2>Our Vision</h2>
          <p>
            To be the leading student society that empowers individuals to 
            reach their full potential through collaboration, innovation, 
            and community engagement in the field of data science.
          </p>
        </div>

        <div className="about-card">
          <div className="card-icon values-icon">
            <Heart size={40} />
          </div>
          <h2>Our Values</h2>
          <p>
            Integrity, inclusivity, innovation, and impact. We believe in 
            creating opportunities that inspire and empower every member 
            of our community to grow and succeed.
          </p>
        </div>
      </div>

      {/* What We Do Section */}
      <section className="what-we-do">
        <h2>What We Do</h2>
        <div className="activities-grid">
          <div className="activity-item">
            <h3>📚 Workshops & Tutorials</h3>
            <p>Regular hands-on sessions covering Python, machine learning, data visualization, and more.</p>
          </div>
          <div className="activity-item">
            <h3>💼 Industry Talks</h3>
            <p>Connect with data professionals and learn about careers in data science and analytics.</p>
          </div>
          <div className="activity-item">
            <h3>🚀 Projects</h3>
            <p>Collaborate on real-world data science projects and build your portfolio.</p>
          </div>
          <div className="activity-item">
            <h3>🤝 Networking</h3>
            <p>Meet like-minded students, build friendships, and expand your professional network.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="join-cta">
        <h2>Ready to Join?</h2>
        <p>Become part of Sheffield's most vibrant data science community</p>
        <div className="cta-buttons">
          <a href="/events" className="btn btn-primary">View Events</a>
          <a href="/contact" className="btn btn-secondary">Get in Touch</a>
        </div>
      </section>
    </div>
  );
}

export default About;