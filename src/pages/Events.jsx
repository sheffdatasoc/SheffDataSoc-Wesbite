import React, { useState } from 'react';
import { useEvents } from '../hooks/useSupabase';
import EventCard from '../components/EventCard';
import './Events.css';

function Events() {
  const { events, loading } = useEvents();
  const [filter, setFilter] = useState('all');

  // 1. Create separate buckets for each status
  const upcomingEvents = events.filter(e => e.status?.toLowerCase() === 'upcoming');
  const ongoingEvents = events.filter(e => e.status?.toLowerCase() === 'ongoing');
  const pastEvents = events.filter(e => e.status?.toLowerCase() === 'past');

  // 2. Updated Logic: Handle all 4 distinct cases
  let displayEvents = events;
  if (filter === 'upcoming') {
    displayEvents = upcomingEvents;
  } else if (filter === 'ongoing') {
    displayEvents = ongoingEvents;
  } else if (filter === 'past') {
    displayEvents = pastEvents;
  }

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
            <button className={`filter-tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              All
            </button>
            <button className={`filter-tab-btn ${filter === 'upcoming' ? 'active' : ''}`} onClick={() => setFilter('upcoming')}>
              Upcoming
            </button>
            <button className={`filter-tab-btn ${filter === 'ongoing' ? 'active' : ''}`} onClick={() => setFilter('ongoing')}>
              Ongoing
            </button>
            <button className={`filter-tab-btn ${filter === 'past' ? 'active' : ''}`} onClick={() => setFilter('past')}>
              Past
            </button>
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