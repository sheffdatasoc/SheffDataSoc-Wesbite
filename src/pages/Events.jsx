/* ========================================
   /pages/Events.jsx - Updated with End Date
   ======================================== */

import React, { useState } from 'react';
import { useEvents } from '../hooks/useSupabase';
import EventCard from '../components/EventCard';
import Hero from '../components/Hero';
import './Events.css';

function Events() {
  const { events, loading } = useEvents();
  const [filter, setFilter] = useState('all');

  // Registration handler
  const handleRegister = (event) => {
    if (event.registration_url) {
      window.open(event.registration_url, '_blank');
    } else {
      alert(`Registration for "${event.title}" coming soon!`);
    }
  };

  // Filter events by status (more reliable than date comparison)
  const upcomingEvents = events.filter(event => 
    event.status?.toLowerCase() === 'upcoming' || 
    event.status?.toLowerCase() === 'ongoing'
  );
  
  const pastEvents = events.filter(event => 
    event.status?.toLowerCase() === 'completed'
  );

  const displayEvents = filter === 'all' 
    ? events 
    : filter === 'upcoming' 
    ? upcomingEvents 
    : pastEvents;

  if (loading) {
    return (
      <div className="events-page">
        <Hero 
          title="Events"
          subtitle="Loading events..."
          showButtons={false}
          showStats={false}
        />
      </div>
    );
  }

  return (
    <div className="events-page">
      <Hero 
        title="Upcoming Events"
        subtitle="Join us for workshops, talks, and networking opportunities"
        showButtons={false}
        showStats={false}
      />

      <div className="events-content">
        {/* Filter Tabs */}
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

        {/* Events Grid */}
        {displayEvents.length > 0 ? (
          <div className="events-grid">
            {displayEvents.map(event => (
              <EventCard 
                key={event.id}
                title={event.title}
                date={event.date}
                endDate={event.end_date}
                location={event.location}
                description={event.description}
                status={event.status}
                type={event.type}
                attendees={event.attendees || 0}
                maxAttendees={event.max_attendees}
                imageUrl={event.image_url}
                onRegister={() => handleRegister(event)}
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