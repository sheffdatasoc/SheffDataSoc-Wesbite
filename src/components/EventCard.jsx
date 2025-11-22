import React from 'react';
import './EventCard.css';
import { Calendar, Clock, MapPin, Users, Check } from 'lucide-react';

function EventCard({ 
  // We accept the raw database row props here
  title, 
  description, 
  status, // <--- We need this to check if it's 'past'
  
  // Handle Date
  event_date, 
  date, 
  
  // Handle Time
  time, 
  
  // Handle Location
  location, 
  
  // Handle Type
  category,
  type,
  
  // Handle Attendees
  attendees, 
  
  // Handle Max Attendees
  max_attendees, 
  maxAttendees,
  
  // Handle Image URL
  image_url, 
  imageUrl,
  
  onRegister 
}) {
  
  // --- 1. NORMALIZE DATA ---
  const effectiveDate = event_date || date;
  const effectiveImage = image_url || imageUrl;
  const effectiveMaxAttendees = max_attendees || maxAttendees;
  const effectiveType = category || type || 'Event'; 

  // --- 2. LOGIC: CHECK IF EVENT IS PAST ---
  // We check for 'past' because that is the new rule we added to your database
  const isCompleted = status?.toLowerCase() === 'past';

  // --- 3. FORMATTING HELPERS ---
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  const getBadgeClass = (eventType) => {
    switch (eventType?.toLowerCase()) {
      case 'volunteering': return 'badge-green';
      case 'competition': return 'badge-orange';
      case 'networking': return 'badge-purple';
      case 'workshop': return 'badge-blue';
      default: return 'badge-gray';
    }
  };

  return (
    <div className="photo-event-card">
      {/* 1. Image Header */}
      <div className="card-image-container">
        {effectiveImage ? (
          <img src={effectiveImage} alt={title} className="card-img" />
        ) : (
          <div className="card-img-placeholder" />
        )}
        
        {/* Type Badge */}
        <span className={`card-badge ${getBadgeClass(effectiveType)}`}>
          {effectiveType}
        </span>
      </div>

      {/* 2. Content Body */}
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-desc">{description}</p>

        {/* Metadata List */}
        <div className="card-meta-list">
          <div className="meta-row">
            <Calendar className="meta-icon" size={18} />
            <span>{formatDate(effectiveDate)}</span>
          </div>
          
          <div className="meta-row">
            <Clock className="meta-icon" size={18} />
            <span>{time || 'Time TBA'}</span>
          </div>
          
          <div className="meta-row">
            <MapPin className="meta-icon" size={18} />
            <span>{location || 'Location TBA'}</span>
          </div>
          
          <div className="meta-row">
            <Users className="meta-icon" size={18} />
            <span>{attendees || 0} / {effectiveMaxAttendees || '∞'} registered</span>
          </div>
        </div>

        {/* 3. Register Button (Updated Logic) */}
        <button 
          className={`card-btn ${isCompleted ? 'btn-disabled' : ''}`} 
          onClick={!isCompleted ? onRegister : undefined}
          disabled={isCompleted}
        >
          {isCompleted ? (
            'Event Ended'
          ) : (
            <>
              <Check size={18} strokeWidth={3} /> Register Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default EventCard;