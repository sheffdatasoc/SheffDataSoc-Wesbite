/* ========================================
   EventCard.jsx - Modern Design Update
   ======================================== */

import React from 'react';
import './EventCard.css';

function EventCard({ 
  title, 
  date,
  endDate,
  time,
  location, 
  description, 
  status, 
  type,
  attendees, 
  maxAttendees,
  imageUrl,
  onRegister 
}) {
  // Format date range intelligently
  const formatDateRange = (startDate, endDate) => {
    if (!startDate) return 'TBA';
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    // Check if it's a multi-day event
    if (end && start.toDateString() !== end.toDateString()) {
      const startDay = start.getDate();
      const endDay = end.getDate();
      const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
      const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
      const year = start.getFullYear();
      
      // Same month: "Nov 4-6, 2025"
      if (startMonth === endMonth) {
        return `${startMonth} ${startDay}-${endDay}, ${year}`;
      }
      // Different months: "Nov 30 - Dec 2, 2025"
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    }
    
    // Single day event
    return start.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Format time range
  const formatTimeRange = (startDate, endDate) => {
    if (!startDate) return null;
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    // Check if times are meaningful (not midnight)
    const startHasMeaningfulTime = start.getHours() !== 0 || start.getMinutes() !== 0;
    const endHasMeaningfulTime = end && (end.getHours() !== 0 || end.getMinutes() !== 0);
    
    if (!startHasMeaningfulTime && !endHasMeaningfulTime) {
      return null; // No time info available
    }
    
    const formatTime = (date) => {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    };
    
    // Same day event with start and end times
    if (end && start.toDateString() === end.toDateString() && endHasMeaningfulTime) {
      return `${formatTime(start)} - ${formatTime(end)}`;
    }
    
    // Just start time
    if (startHasMeaningfulTime) {
      return formatTime(start);
    }
    
    return null;
  };

  const formattedDate = formatDateRange(date, endDate);
  const formattedTime = time || formatTimeRange(date, endDate);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'upcoming': return '#4cc9f0';
      case 'ongoing': return '#667eea';
      case 'completed': return '#9ca3af';
      case 'cancelled': return '#ef4444';
      default: return '#667eea';
    }
  };

  const getTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'volunteering': return '#10b981';
      case 'workshop': return '#3b82f6';
      case 'social': return '#f59e0b';
      case 'competition': return '#ef4444';
      case 'networking': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getTypeLabel = (type) => {
    if (!type) return 'workshop';
    return type.toLowerCase();
  };

  const isFull = maxAttendees && attendees >= maxAttendees;
  const isCompleted = status?.toLowerCase() === 'completed';
  const spotsLeft = maxAttendees ? maxAttendees - attendees : null;

  return (
    <div className="event-card">
      {/* Image Section with Badges */}
      <div className="event-image">
        {imageUrl ? (
          <img src={imageUrl} alt={title} />
        ) : (
          <div className="event-image-placeholder">
            <span>📅</span>
          </div>
        )}
        
        {/* Type Badge - Top Right */}
        <span 
          className="event-type-badge" 
          style={{ backgroundColor: getTypeColor(type) }}
        >
          {getTypeLabel(type)}
        </span>

        {/* Status Badge - Top Left */}
        <span 
          className="event-status-badge" 
          style={{ backgroundColor: getStatusColor(status) }}
        >
          {status || 'upcoming'}
        </span>
      </div>

      <div className="event-content">
        <h3 className="event-title">{title}</h3>
        <p className="event-description">{description}</p>

        <div className="event-details">
          <div className="event-detail-item">
            <svg className="event-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{formattedDate}</span>
          </div>
          {formattedTime && (
            <div className="event-detail-item">
              <svg className="event-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{formattedTime}</span>
            </div>
          )}
          <div className="event-detail-item">
            <svg className="event-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{location}</span>
          </div>
          <div className="event-detail-item">
            <svg className="event-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>{attendees}{maxAttendees ? ` / ${maxAttendees}` : ''} registered</span>
          </div>
        </div>

        <div className="event-footer">
          <button 
            className={`btn-register ${(isFull || isCompleted) ? 'btn-disabled' : ''}`}
            onClick={onRegister}
            disabled={isFull || isCompleted}
          >
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {isCompleted ? 'Event Ended' : isFull ? 'Event Full' : 'Register Now'}
          </button>
          {spotsLeft !== null && spotsLeft > 0 && spotsLeft <= 10 && !isCompleted && (
            <span className="event-spots-left">
              {spotsLeft} spots left!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventCard;