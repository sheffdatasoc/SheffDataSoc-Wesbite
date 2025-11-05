/* ========================================
   /pages/Events.jsx - Match Sandbox Hero
   ======================================== */

import React, { useState } from 'react';
import { useEvents } from '../hooks/useSupabase';
import EventCard from '../components/EventCard';
import './Events.css';

function Events() {
  const { events, loading } = useEvents();
  const [filter, setFilter] = useState('all');

  const upcomingEvents = events.filter(event =>
    event.status?.toLowerCase() === 'upcoming' ||
    event.status?.toLowerCase() === 'ongoing'
  );
  const pastEvents = events.filter(event =>
    event.status?.toLowerCase() === 'completed'
  );

  const displayEvents =
    filter === 'all'
      ? events
      : filter === 'upcoming'
      ? upcomingEvents
      : pastEvents;

  return (
    <div className="events-page">
      
      {/* ✅ Sandbox-style Hero */}
      <div className="sandbox-hero">
        <span className="hero-badge">📅 Data Science Society</span>
        <h1>Events & Workshops</h1>
        <p>
          Join us for exciting tech talks, hackathons, and networking sessions —
          all year round.
        </p>
      </div>

      <div className="events-content">
        <div className="events-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Events ({events.length})
          </button>
          <button
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming ({upcomingEvents.length})
          </button>
          <button
            className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Past ({pastEvents.length})
          </button>
        </div>

        {displayEvents.length > 0 ? (
          <div className="events-grid">
            {displayEvents.map(event => (
              <EventCard
                key={event.id}
                {...event}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No events found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;
