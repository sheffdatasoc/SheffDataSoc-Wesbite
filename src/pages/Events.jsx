import React, { useState } from 'react';
import { useEvents } from '../hooks/useSupabase';
import EventCard from '../components/EventCard';
import './Events.css';

function Events() {
  const { events, loading } = useEvents();
  // 1. Set initial state to 'upcoming' to show them first on load
  const [filter, setFilter] = useState('upcoming');

  // --- Sorting function ---
  const sortEvents = (eventsList) => {
    return [...eventsList].sort((a, b) => {
      // 1. Featured first
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;

      // 2. Status order: upcoming -> ongoing -> past
      const statusOrder = { upcoming: 0, ongoing: 1, past: 2 };
      const aStatus = statusOrder[a.status?.toLowerCase()] ?? 3;
      const bStatus = statusOrder[b.status?.toLowerCase()] ?? 3;
      if (aStatus !== bStatus) return aStatus - bStatus;

      // 3. Sort by date descending (most recent first)
      const aDate = new Date(a.date || a.start_date);
      const bDate = new Date(b.date || b.start_date);
      return bDate - aDate;
    });
  };

  const filteredEvents = filter === 'all'
    ? events
    : events.filter(e => e.status?.toLowerCase() === filter);

  const displayEvents = sortEvents(filteredEvents);

  return (
    <div className="events-page">
      {/* Hero Section */}
      <div className="sandbox-hero">
        <span className="hero-badge">📅 Data Science Society</span>
        <h1>Discover Events</h1>
        <p>Discover workshops, social gatherings, networking opportunities, and more</p>
      </div>

      <div className="events-content">
        {/* Filters */}
        <div className="filter-container">
          <div className="events-filters-control">
            {['upcoming', 'ongoing', 'past', 'all'].map(f => (
              <button
                key={f}
                className={`filter-tab-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading events...</p>
          </div>
        ) : displayEvents.length > 0 ? (
          <div className="events-grid">
            {displayEvents.map(event => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No {filter} events found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;


