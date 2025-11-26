import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './HomeEvents.css';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

function EventPreviewCard({ event, isOngoing, showDescription }) {
  const startDate = new Date(event.date);
  const endDate = event.end_date ? new Date(event.end_date) : null;

  const formatDate = (date) =>
    new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);

  const formatTime = (date) => {
    if (!date) return null;
    if (date.getHours() === 0 && date.getMinutes() === 0) return null;
    return new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    }).format(date);
  };

  let displayDate = formatDate(startDate);

  if (!endDate || startDate.toDateString() === endDate.toDateString()) {
    const startTime = formatTime(startDate);
    const endTime = formatTime(endDate || startDate);
    displayDate += ' | ' + ([startTime, endTime].filter(Boolean).join(' – ') || 'Time TBA');
  } else {
    displayDate += ` – ${formatDate(endDate)}`;
  }

  return (
    <div className={`preview-card ${!isOngoing ? 'past-card' : ''}`}>
      {event.image_url && (
        <div className="preview-image-container">
          <img
            src={event.image_url}
            alt={event.title}
            className={`preview-image ${!isOngoing ? 'past-image' : ''}`}
          />
        </div>
      )}

      <h3 className="preview-title">{event.title}</h3>

      <p className="preview-date-time">{displayDate}</p>

      {showDescription && (
        <p className="preview-description">{event.description}</p>
      )}

      {isOngoing && (
        <span className="preview-tag" style={{ background: '#FFAA33', color: '#1A1A1A' }}>
          Ongoing
        </span>
      )}

      {event.tags && event.tags.length > 0 && (
        <div className="preview-tags">
          {event.tags.map((tag, index) => (
            <span key={index} className="preview-tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function HomeEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="home-events">
        <div className="events-container">
          <h2 className="events-title">Our Events</h2>
          <p className="events-subtitle">Loading...</p>
        </div>
      </section>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAndOngoing = [];
  const past = [];

  events.forEach(event => {
    const startDate = new Date(event.date);
    const endDate = event.end_date ? new Date(event.end_date) : startDate;

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (endDate >= today) {
      upcomingAndOngoing.push(event);
    } else if (endDate < today) {
      past.push(event);
    }
  });

  past.sort((a, b) => new Date(b.end_date || b.date) - new Date(a.end_date || a.date));
  const recentPast = past.slice(0, 3);

  const hasContent = events.length > 0;

  return (
    <section className="home-events">
      <div className="events-container">
        <h2 className="events-title">Our Events</h2>
        <p className="events-subtitle">
          Discover exciting workshops, inspiring talks, and social networking events the society has brought to you!
        </p>

        {!hasContent ? (
          <div className="empty-state">
            <p>No events available yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {upcomingAndOngoing.length > 0 && (
              <div className="content-section">
                <h3 className="section-subtitle">Ongoing & Upcoming Events</h3>
                <div className="events-grid">
                  {upcomingAndOngoing.map(event => {
                    const startDate = new Date(event.date);
                    const endDate = event.end_date ? new Date(event.end_date) : startDate;
                    const isOngoing = startDate <= today && today <= endDate;
                    return (
                      <EventPreviewCard
                        key={event.id}
                        event={event}
                        isOngoing={isOngoing}
                        showDescription={true} // Show description only for ongoing/upcoming
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {recentPast.length > 0 && (
              <div className="content-section">
                <h3 className="section-subtitle">Past Events</h3>
                <div className="past-events-grid">
                  {recentPast.map(event => (
                    <EventPreviewCard
                      key={event.id}
                      event={event}
                      isOngoing={false}
                      showDescription={false} // Hide description for past
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="events-buttons">
          <a href="/events" className="btn btn-primary">View All Events →</a>
        </div>

        <div className="events-footer-text">
          <p>Our events are designed to bring members together to learn, connect, and have fun.</p>
          <p>Check back often - you never know what's coming next!</p>
        </div>
      </div>
    </section>
  );
}

export default HomeEvents;








