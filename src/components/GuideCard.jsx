/* ========================================
   GuideCard.jsx (FIXED - Removed "btn" class)
   ======================================== */

import React from 'react';
import { Clock } from 'lucide-react';
import './GuideCard.css';

function GuideCard({ guide, onReadMore }) {
  // --- Match BlogCard's formatted date ---
  const formattedDate = guide.published_date
    ? new Date(guide.published_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

  // Count contributors from comma-separated author field
  const contributorCount = guide.author 
    ? guide.author.split(',').map(a => a.trim()).filter(a => a.length > 0).length 
    : 0;

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
            {/* ✅ FIXED: Removed "btn" class */}
            <button className="btn-read-more" onClick={onReadMore}>
              Read Guide
            </button>
          </div>
        )}
      </div>

      {/* Footer - Horizontal layout with contributor count */}
      <div className="guide-footer">
        <div className="guide-meta">

          {/* Contributor Count */}
          {contributorCount > 0 && (
            <div className="guide-contributors">
              <span className="contributor-count">
                {contributorCount} {contributorCount === 1 ? 'Catalyst' : 'Catalysts'}
              </span>
            </div>
          )}

          {/* Date and Read Time - Side by Side */}
          <div className="guide-meta-right">
            {formattedDate && (
              <div className="guide-date-wrapper">
                <Clock size={16} className="clock-icon" />
                <span className="guide-date">{formattedDate}</span>
              </div>
            )}

            {guide.read_time && (
              <div className="guide-readtime">
                <Clock size={16} className="clock-icon" />
                <span>{guide.read_time} min</span>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default GuideCard;