/* ========================================
   EventCard.jsx
   ======================================== */

import React from 'react';
import './EventCard.css';

function EventCard({ title, date, location, description, status, attendees, onRegister }) {
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'upcoming': return '#4cc9f0';
      case 'ongoing': return '#667eea';
      case 'completed': return '#999';
      default: return '#667eea';
    }
  };

  return (
    <div className="event-card">
      <div className="event-header">
        <span 
          className="event-status" 
          style={{ backgroundColor: getStatusColor(status) }}
        >
          {status}
        </span>
        <span className="event-date">{date}</span>
      </div>
      <h3 className="event-title">{title}</h3>
      <p className="event-location">📍 {location}</p>
      <p className="event-description">{description}</p>
      <div className="event-footer">
        <button className="btn-register" onClick={onRegister}>
          Register Now
        </button>
        <span className="event-attendees">{attendees} attending</span>
      </div>
    </div>
  );
}

export default EventCard;