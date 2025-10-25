import React from 'react';
import EventCard from '../components/EventCard';
import { useEvents } from '../hooks/useSupabase';

function Events() {
  const { events, loading, error } = useEvents();

  // Mock data as fallback
  const mockEvents = [
    {
      id: 1,
      title: "Introduction to Machine Learning Workshop",
      date: "2024-11-15T18:00:00",
      location: "Diamond Building, Lecture Theatre 1",
      description: "Join us for a hands-on workshop covering the fundamentals of machine learning. We'll explore supervised and unsupervised learning with practical Python examples.",
      status: "upcoming",
      attendees: 45
    },
    {
      id: 2,
      title: "Data Science Career Panel",
      date: "2024-11-20T17:30:00",
      location: "Students' Union, Conference Room",
      description: "Hear from data science professionals working at top companies. Learn about career paths, interview tips, and industry insights.",
      status: "upcoming",
      attendees: 67
    },
    {
      id: 3,
      title: "Kaggle Competition Night",
      date: "2024-11-10T19:00:00",
      location: "The Diamond, Computer Room 4",
      description: "Team up and tackle real-world data science problems! Pizza and prizes for the winning teams.",
      status: "completed",
      attendees: 32
    }
  ];

  // Use Supabase data if available, otherwise use mock data
  const displayEvents = events.length > 0 ? events : mockEvents;

  if (loading) {
    return (
      <div className="page">
        <h1>Events</h1>
        <p>Loading events...</p>
        <div className="loading-spinner">⏳</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Events</h1>
        <div className="error-message">
          <p>❌ Error loading events: {error}</p>
          <p>Showing sample data instead.</p>
        </div>
        <div className="events-grid">
          {mockEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Upcoming Events</h1>
      <p>Join our workshops, talks, and competitions to level up your data science skills!</p>
      
      {events.length === 0 && (
        <div className="info-message">
          <p>💡 No events found in database. Showing sample data.</p>
        </div>
      )}

      <div className="events-grid">
        {displayEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

export default Events;