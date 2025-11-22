/* ========================================
   GuideCard.jsx (FIXED)
   ======================================== */

import React from 'react';
import { Clock } from 'lucide-react';
import './GuideCard.css';

function GuideCard({ guide, onReadMore }) {
  // --- Match BlogCard’s formatted date ---
  const formattedDate = guide.published_date
    ? new Date(guide.published_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className="guide-card">

      {/* Image */}
      <div className="image-wrapper">
        {guide.image ? (
          <img src={guide.image} alt={guide.title} className="guide-image" />
        ) : (
          <div className="guide-image placeholder" />
        )}

        {guide.difficulty && (
          <span className="guide-tag">{guide.difficulty}</span>
        )}
      </div>

      {/* Content */}
      <div className="guide-content">
        <h3 className="guide-title">{guide.title}</h3>
        <p className="guide-excerpt">{guide.description}</p>

        {onReadMore && (
          <div className="read-more-wrapper">
            <button className="btn btn-read-more" onClick={onReadMore}>
              Read Guide
            </button>
          </div>
        )}
      </div>

      {/* Footer - structured like BlogCard */}
      <div className="guide-footer">
        <div className="guide-meta">

          {/* Author */}
          {guide.author && (
            <span className="guide-author">{guide.author}</span>
          )}

          {/* Date - same style as BlogCard */}
          {formattedDate && (
            <div className="guide-date-wrapper">
              <Clock size={16} className="clock-icon" />
              <span className="guide-date">{formattedDate}</span>
            </div>
          )}

          {/* Read time */}
          {guide.read_time && (
            <div className="guide-readtime">
              <Clock size={16} className="clock-icon" />
              <span>{guide.read_time} min</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default GuideCard;
