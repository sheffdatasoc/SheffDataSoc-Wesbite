/* ========================================
   WorkshopCard.jsx - Updated with flex button container
   ======================================== */

import React from 'react';
import './WorkshopCard.css';

function WorkshopCard({ workshop, featured }) {
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
        return '#10b981';
      case 'intermediate':
        return '#f59e0b';
      case 'advanced':
        return '#ef4444';
      default:
        return '#6b7280';
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

      {/* Footer */}
      <footer className="workshop-footer">
        {date && <p className="workshop-date">📅 {formatDate(date)}</p>}
        {duration_minutes && (
          <p className="workshop-duration">⏱ {formatDuration(duration_minutes)}</p>
        )}
        {host && (
          <p className="workshop-host" style={{ marginBottom: '0.75rem' }}>
            👤 {host}
          </p>
        )}

        {/* Button container - NEW */}
        {materials_url && (
          <div className="workshop-buttons">
            <a
              href={materials_url}
              className="btn-materials"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        )}
      </footer>
    </article>
  );
}

export default WorkshopCard;





