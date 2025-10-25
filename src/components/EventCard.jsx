import React from 'react';

function EventCard({ event }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return '#4cc9f0';
      case 'ongoing': return '#f72585';
      case 'completed': return '#7209b7';
      default: return '#666';
    }
  };

  return (
    <div className="event-card">
      <div className="event-header">
        <span 
          className="event-status" 
          style={{ backgroundColor: getStatusColor(event.status) }}
        >
          {event.status}
        </span>
        <span className="event-date">📅 {formatDate(event.date)}</span>
      </div>
      
      <h3 className="event-title">{event.title}</h3>
      <p className="event-location">📍 {event.location}</p>
      <p className="event-description">{event.description}</p>
      
      <div className="event-footer">
        <button className="btn-register">Register</button>
        <span className="event-attendees">
          👥 {event.attendees || 0} attending
        </span>
      </div>
    </div>
  );
}

export default EventCard;