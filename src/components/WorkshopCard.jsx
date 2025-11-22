/* ========================================
   WorkshopCard.jsx - Updated with status right
   ======================================== */

import React from 'react';
import './WorkshopCard.css';

function WorkshopCard({ workshop, featured, isSandbox }) {
  const {
    title = 'Untitled Workshop',
    description = 'No description provided',
    status,
    tags = [],
    materials_url,
    date,
    duration_minutes,
    host = 'Unknown Host'
  } = workshop || {};

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'beginner':
        return '#10b981'; // green
      case 'intermediate':
        return '#f59e0b'; // amber
      case 'advanced':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins === 0) return `${hours}hr`;
    return hours > 0 ? `${hours}hr ${mins}min` : `${mins}min`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <article className={`workshop-card ${featured ? 'featured-card' : ''}`}>
      {/* Title + Status */}
      <header className="workshop-card-header">
        <h3 className="workshop-title">{title}</h3>
        {status && (
          <span
            className="workshop-status"
            style={{ backgroundColor: getStatusColor(status) }}
          >
            {status?.toLowerCase()}
          </span>
        )}
      </header>

      {/* Description */}
      <p className="workshop-description">{description}</p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="workshop-tags">
          {tags.map((tag, index) => (
            <span key={index} className="workshop-tag">{tag}</span>
          ))}
        </div>
      )}

      {/* Footer: date → duration → host */}
      <footer className="workshop-footer">
        {date && <p className="workshop-date">📅 {formatDate(date)}</p>}
        {duration_minutes && <p className="workshop-duration">⏱ {formatDuration(duration_minutes)}</p>}
        {host && <p className="workshop-host" style={{ marginBottom: '0.75rem' }}>👤 {host}</p>}

        {/* Materials button */}
        {materials_url && (
          <a
            href={materials_url}
            className="btn-materials full-width"
            target="_blank"
            rel="noopener noreferrer"
          >
            📄 Materials
          </a>
        )}
      </footer>
    </article>
  );
}

export default WorkshopCard;



