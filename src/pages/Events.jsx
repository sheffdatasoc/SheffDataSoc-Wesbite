import React, { useState } from 'react';
import { useEvents } from '../hooks/useSupabase';
import EventCard from '../components/EventCard';
import './Events.css';

function Events() {
  // 1. We extract 'loading' here
  const { events, loading } = useEvents();
  const [filter, setFilter] = useState('all');

  const upcomingEvents = events.filter(e => e.status?.toLowerCase() === 'upcoming' || e.status?.toLowerCase() === 'ongoing');
  const pastEvents = events.filter(e => e.status?.toLowerCase() === 'completed');

  const displayEvents = filter === 'all' ? events : filter === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className="events-page">
      <div className="sandbox-hero">
        <span className="hero-badge">📅 Data Science Society</span>
        <h1>Discover Events</h1>
        <p>Discover workshops, social gatherings, networking opportunities, and more</p>
      </div>

      <div className="events-content">
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

        {/* 2. FIX: We USE the loading variable here */}
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
            <p>No events found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;