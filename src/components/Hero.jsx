/* ========================================
   Hero.jsx - Upgraded Version
   ======================================== */

import React from 'react';
import { Users, Calendar, Sparkles } from 'lucide-react';
import './Hero.css';

function Hero({ 
  title, 
  subtitle, 
  showButtons = true, 
  showStats = false, 
  stats = [],
  showBadge = false,
  badgeText = "University of Sheffield",
  highlightWord = "" // Word to highlight in yellow
}) {
  
  // Split title to highlight specific word
  const renderTitle = () => {
    if (!highlightWord || !title) return <h1 className="hero-title">{title}</h1>;
    
    const parts = title.split(highlightWord);
    return (
      <h1 className="hero-title">
        {parts[0]}
        <span className="hero-title-highlight">{highlightWord}</span>
        {parts[1]}
      </h1>
    );
  };

  // Icon mapping
  const getIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('member')) return <Users size={28} />;
    if (lowerTitle.includes('event')) return <Calendar size={28} />;
    if (lowerTitle.includes('partner')) return <Sparkles size={28} />;
    return <Sparkles size={28} />;
  };

  return (
    <section className="hero-modern">
      <div className="hero-content">
        {/* Badge */}
        {showBadge && (
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>{badgeText}</span>
          </div>
        )}

        {/* Title with highlight */}
        {renderTitle()}

        {/* Subtitle */}
        <p className="hero-subtitle">{subtitle}</p>

        {/* Buttons */}
        {showButtons && (
          <div className="hero-buttons">
            <a href="/events" className="btn btn-primary">
              Explore Events →
            </a>
            <a href="/about" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        )}

        {/* Stats embedded in hero */}
        {showStats && stats.length > 0 && (
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="hero-stat-card">
                <div className="stat-icon">{getIcon(stat.title)}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Optional: Visual side for dashboard graphic */}
      <div className="hero-visual">
        {/* You can add dashboard image here */}
      </div>
    </section>
  );
}

export default Hero;