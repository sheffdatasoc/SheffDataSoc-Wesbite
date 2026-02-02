import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = ({
  title,
  subtitle,
  showButtons,
  showStats,
  stats,
  showBadge,
  badgeText,
  highlightWord,
  images = [],
  fallbackImage,
  partners = [] // Add partners prop
}) => {

  // --- IMAGE CAROUSEL LOGIC ---
  const getDisplayImages = () => {
    if (!images || images.length === 0) {
      return [fallbackImage, fallbackImage, fallbackImage];
    }
    if (images.length === 1) {
      return [images[0], images[0], images[0]];
    }
    if (images.length === 2) {
      return [images[0], images[1], images[0]];
    }
    return images;
  };

  const displayImages = getDisplayImages();
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate timer for images
  useEffect(() => {
    if (images.length < 2) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % displayImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images, displayImages.length]);

  const getCardClass = (index) => {
    const total = displayImages.length;
    const prevIndex = (activeIndex - 1 + total) % total;
    const nextIndex = (activeIndex + 1) % total;

    if (index === activeIndex) return 'card-center';
    if (index === prevIndex) return 'card-left';
    if (index === nextIndex) return 'card-right';

    return 'card-hidden';
  };

  const handleCardClick = (index) => {
    setActiveIndex(index);
  };

  // --- PARTNER CAROUSEL LOGIC ---
  const [offset, setOffset] = useState(0);
  const [brokenLogos, setBrokenLogos] = useState(new Set());

  // Keep all partners with logos, don't filter out broken ones from the array
  const partnersWithLogos = partners.filter(p => p.logo);
  const extendedPartners = partnersWithLogos.length > 0
    ? [...partnersWithLogos, ...partnersWithLogos, ...partnersWithLogos]
    : [];

  const handleLogoError = (partnerId) => {
    setBrokenLogos(prev => new Set([...prev, partnerId]));
  };

  useEffect(() => {
    if (partnersWithLogos.length === 0) return;

    const interval = setInterval(() => {
      setOffset((prevOffset) => {
        const cardWidth = 220; // Updated to match new card width (200px) + gap (20px)
        const newOffset = prevOffset + 1;

        if (newOffset >= cardWidth * partnersWithLogos.length) {
          return 0;
        }
        return newOffset;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [partnersWithLogos.length]);

  const renderTitle = () => {
    if (!highlightWord) return title;
    const parts = title.split(highlightWord);
    return <>{parts[0]}<span className="highlight">{highlightWord}</span>{parts[1]}</>;
  };

  return (
    <section className="hero-modern">
      <div className="hero-content-wrapper">
        {/* Left Column */}
        <div className="hero-text-content">
          {showBadge && <div className="hero-badge">{badgeText}</div>}

          <h1>{renderTitle()}</h1>
          <p className="hero-subtitle">{subtitle}</p>

          {showButtons && (
            <div className="hero-buttons">
              <Link to="/events" className="btn-primary">
                Explore Events &rarr;
              </Link>

              <Link to="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>
          )}

          {showStats && stats && (
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <h3>{stat.value}</h3>
                  <p>{stat.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Image Carousel */}
        <div className="hero-image-container">
          <div className="carousel-stage">
            {displayImages.map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                className={`carousel-card ${getCardClass(index)}`}
                alt={`Gallery ${index}`}
                onError={(e) => e.target.src = fallbackImage}
                onClick={() => handleCardClick(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Partner Logo Carousel - Full Width Below Both Columns */}
      {partnersWithLogos.length > 0 && (
        <div className="hero-partner-carousel">
          <p className="partner-carousel-label" style={{ marginBottom: '30px' }}>Our Trusted Partners</p>

          <div className="partner-carousel-wrapper">
            <div
              className="partner-carousel-track"
              style={{ transform: `translateX(-${offset}px)` }}
            >
              {extendedPartners.map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className={`partner-logo-card ${partner.tier?.toLowerCase() === 'platinum' ? 'platinum-nudge' : ''}`}
                >
                  {partner.tier?.toLowerCase() === 'platinum' && (
                    <span className="platinum-badge-nudge">Spotlight</span>
                  )}
                  {brokenLogos.has(partner.id) ? (
                    <span className="partner-name-fallback">{partner.name}</span>
                  ) : (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="partner-logo-img"
                      onError={() => handleLogoError(partner.id)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;