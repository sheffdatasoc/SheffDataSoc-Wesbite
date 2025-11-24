import React from 'react';
import './EventCard.css';
import { Calendar, Clock, MapPin, Users, Check } from 'lucide-react';

function EventCard({
  title,
  description,
  status,
  date,
  end_date,
  location,
  type,
  attendees,
  max_attendees,
  is_featured,
  image_url,
  registration_url
}) {
  const effectiveMaxAttendees = max_attendees || '∞';
  const isCompleted = status?.toLowerCase() === 'past';

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString('en-GB', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : 'TBA';

  const formatTime = (dateStr) => {
    if (!dateStr || dateStr.length === 10) return null;
    const d = new Date(dateStr);
    if (d.getHours() === 0 && d.getMinutes() === 0) return null;
    return d.toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getTimeRange = (start, end) => {
    const startTime = formatTime(start);
    const endTime = formatTime(end);

    if (!startTime && !endTime) return "Time TBA";
    if (startTime && endTime) return `${startTime} – ${endTime}`;
    if (startTime && !endTime) return `${startTime} – TBA`;
    if (!startTime && endTime) return `TBA – ${endTime}`;
  };

  const getBadgeClass = (eventType) => {
    switch (eventType?.toLowerCase()) {
      case 'talk': return 'badge-red';
      case 'competition': return 'badge-orange';
      case 'networking': return 'badge-purple';
      case 'workshop': return 'badge-blue';
      case 'social': return 'badge-yellow';
      default: return 'badge-gray';
    }
  };

  return (
    <div className={`photo-event-card ${is_featured ? 'featured-card' : ''}`}>

      {/* IMAGE */}
      <div className="event-card-image">
        {image_url ? (
          <img src={image_url} alt={title} className="card-img" />
        ) : (
          <div className="event-card-img-placeholder" />
        )}

        <span className={`card-badge ${getBadgeClass(type)}`}>{type}</span>
      </div>

      {/* CARD BODY */}
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-desc">{description}</p>

        <div className="card-meta-list">
          <div className="meta-row">
            <Calendar className="meta-icon" size={18} />
            <span>{formatDate(date)}</span>
          </div>

          <div className="meta-row">
            <Clock className="meta-icon" size={18} />
            <span>{getTimeRange(date, end_date)}</span>
          </div>

          <div className="meta-row">
            <MapPin className="meta-icon" size={18} />
            <span>{location || 'Location TBA'}</span>
          </div>

          <div className="meta-row">
            <Users className="meta-icon" size={18} />
            <span>{attendees || 0} / {effectiveMaxAttendees} registered</span>
          </div>
        </div>

        <button
          className={`card-btn ${isCompleted ? 'btn-disabled' : ''}`}
          onClick={() => !isCompleted && registration_url && window.open(registration_url, '_blank')}
          disabled={isCompleted || !registration_url}
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