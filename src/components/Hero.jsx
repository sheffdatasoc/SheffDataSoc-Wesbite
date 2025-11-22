import React, { useState, useEffect } from 'react';
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
  fallbackImage 
}) => {
  
  // --- FIX: Force the array to always have at least 3 items ---
  const getDisplayImages = () => {
    if (!images || images.length === 0) {
      // 0 Images: Use 3 fallbacks
      return [fallbackImage, fallbackImage, fallbackImage];
    }
    if (images.length === 1) {
      // 1 Image: Repeat it 3 times (Left, Center, Right)
      return [images[0], images[0], images[0]];
    }
    if (images.length === 2) {
      // 2 Images: Duplicate the first one to fill the 3rd slot
      return [images[0], images[1], images[0]];
    }
    // 3+ Images: We are good to go
    return images;
  };

  const displayImages = getDisplayImages();
  // -----------------------------------------------------------

  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate timer
  useEffect(() => {
    // Only rotate if we have more than 1 *unique* image origin
    // (Optional: remove this check if you want it to "breathe" even with 1 image)
    if (images.length < 2) return; 

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % displayImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images, displayImages.length]);

  // Determine class logic
  const getCardClass = (index) => {
    const total = displayImages.length;
    
    // Calculate circular indices
    const prevIndex = (activeIndex - 1 + total) % total;
    const nextIndex = (activeIndex + 1) % total;

    if (index === activeIndex) return 'card-center';
    if (index === prevIndex)   return 'card-left';
    if (index === nextIndex)   return 'card-right';
    
    return 'card-hidden';
  };

  const handleCardClick = (index) => {
    setActiveIndex(index);
  };

  const renderTitle = () => {
    if (!highlightWord) return title;
    const parts = title.split(highlightWord);
    return <>{parts[0]}<span className="highlight">{highlightWord}</span>{parts[1]}</>;
  };

  return (
    <section className="hero-modern">
      {/* Left Column */}
      <div className="hero-text-content">
        {showBadge && <div className="hero-badge">✨ {badgeText}</div>}
        <h1>{renderTitle()}</h1>
        <p className="hero-subtitle">{subtitle}</p>

        {showButtons && (
          <div className="hero-buttons">
            <button className="btn-primary">Explore Events &rarr;</button>
            <button className="btn-secondary">Learn More</button>
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

      {/* Right Column: Carousel */}
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
    </section>
  );
};

export default Hero;