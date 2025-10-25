import React from 'react';

function Hero() {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Sheffield Data Science Society</h1>
        <p>Learn. Build. Connect.</p>
        <div className="hero-buttons">
          <a href="/events" className="btn btn-primary">Upcoming Events</a>
          <a href="/about" className="btn btn-secondary">Learn More</a>
        </div>
      </div>
    </div>
  );
}

export default Hero;