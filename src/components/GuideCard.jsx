import React from 'react';
import { Clock } from 'lucide-react';
import './GuideCard.css';

function GuideCard({ guide, onReadMore }) {
  const formattedDate = guide.published_date
    ? new Date(guide.published_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

  const contributorCount = guide.author
    ? guide.author.split(',').map(a => a.trim()).filter(a => a.length > 0).length
    : 0;

  // Difficulty color function
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return '#10b981';
      case 'intermediate':
        return '#f59e0b';
      case 'advanced':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="guide-card">

      {/* Image with floating difficulty badge */}
      <div className="image-wrapper">
        {guide.image ? (
          <img src={guide.image} alt={guide.title} className="guide-image" />
        ) : (
          <div className="guide-image placeholder" />
        )}

        {guide.difficulty && (
          <span
            className="guide-difficulty-badge"
            style={{ backgroundColor: getDifficultyColor(guide.difficulty) }}
          >
            {guide.difficulty.toLowerCase()}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="guide-content">
        <h3 className="guide-title">{guide.title}</h3>
        <p className="guide-excerpt">{guide.description}</p>

        {onReadMore && (
          <div className="read-more-wrapper">
            <button className="btn-read-more" onClick={onReadMore}>
              Read Guide
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="guide-footer">
        <div className="guide-meta">
          {contributorCount > 0 && (
            <div className="guide-contributors">
              <span className="contributor-count">
                {contributorCount} {contributorCount === 1 ? 'Catalyst' : 'Catalysts'}
              </span>
            </div>
          )}

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
