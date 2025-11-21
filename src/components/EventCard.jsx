import React from 'react';
import './EventCard.css';
import { Calendar, Clock, MapPin, Users, Check } from 'lucide-react';

function EventCard({ 
  // We accept the raw database row props here
  title, 
  description, 
  status,
  
  // Handle Date: Supabase usually sends 'event_date' or 'date'
  event_date, 
  date, 
  
  // Handle Time: Supabase usually sends 'time' or it's part of the date
  time, 
  
  // Handle Location
  location, 
  
  // Handle Type: 'category' or 'type'
  category,
  type,
  
  // Handle Attendees: 'attendees' (current count)
  attendees, 
  
  // FIX 1: Handle Max Attendees (snake_case from DB)
  max_attendees, 
  maxAttendees,
  
  // FIX 2: Handle Image URL (snake_case from DB)
  image_url, 
  imageUrl,
  
  onRegister 
}) {
  
  // --- 1. NORMALIZE DATA ---
  // This ensures we use the correct value regardless of what Supabase sends
  const effectiveDate = event_date || date;
  const effectiveImage = image_url || imageUrl;
  const effectiveMaxAttendees = max_attendees || maxAttendees;
  const effectiveType = category || type || 'Event'; 

  // --- 2. FORMATTING HELPERS ---
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    // Handle potential date parsing errors safely
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

        {/* 3. Register Button */}
        <button className="card-btn" onClick={onRegister}>
          <Check size={18} strokeWidth={3} /> Register Now
        </button>
      </div>
    </div>
  );
}

export default EventCard;