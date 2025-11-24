import React from 'react';
import { Users, Target, Heart } from 'lucide-react';
import './AboutSection.css';

function AboutSection() {
  const features = [
    {
      icon: <Users size={40} />,
      title: "Connect",
      description: "Meet like-minded students, build lasting friendships, and expand your professional network."
    },
    {
      icon: <Target size={40} />,
      title: "Learn",
      description: "Access workshops, tutorials, and resources to develop your data science and AI skills."
    },
    {
      icon: <Heart size={40} />,
      title: "Grow",
      description: "Work on real projects, participate in competitions, and build your portfolio."
    }
  ];

  return (
    <section className="about-section">
      <div className="about-container">
        <h2 className="about-title">Why Join SheffDataSoc?</h2>
        <p className="about-subtitle">
          Whether you're a complete beginner or an experienced data scientist, there's a place for you in our community.
        </p>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="about-buttons">
          <a 
            href="https://su.sheffield.ac.uk/activities/view/data-science-society" 
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join Now →
          </a>
          <a href="/about" className="btn btn-secondary">Learn More About Us</a>
        </div>

        <div className="about-footer-text">
          <p>Membership is available to purchase on the Student's Union website.</p>
          <p>Not a University of Sheffield student? Contact us for more information.</p>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;