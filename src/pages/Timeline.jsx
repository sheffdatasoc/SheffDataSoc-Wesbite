/* ========================================
   /pages/Timeline.jsx
   ======================================== */

import React, { useEffect, useState, useMemo } from 'react';
import { getTimelineEvents } from '../lib/supabase';
import './Timeline.css';

function Timeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [yearFilter, setYearFilter] = useState('');
  const [termFilter, setTermFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [iconFilter, setIconFilter] = useState('');

  // Modal state
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    async function fetchTimeline() {
      setLoading(true);
      const data = await getTimelineEvents();
      setEvents(data || []);
      setLoading(false);
    }
    fetchTimeline();
  }, []);

  // Dynamic Filter Options
  const filterOptions = useMemo(() => {
    const filteredEvents = events.filter(event => {
      const eventYear = new Date(event.event_date).getFullYear();
      return (
        (!yearFilter || eventYear === parseInt(yearFilter)) &&
        (!termFilter || event.term === termFilter) &&
        (!tagFilter || event.tags?.includes(tagFilter)) &&
        (!iconFilter || event.icon === iconFilter)
      );
    });

    return {
      years: Array.from(new Set(events.map(e => new Date(e.event_date).getFullYear()))).sort((a,b)=>a-b), // ascending
      terms: Array.from(new Set(filteredEvents.map(e => e.term).filter(Boolean))),
      tags: Array.from(new Set(filteredEvents.flatMap(e => e.tags || []))),
      icons: Array.from(new Set(filteredEvents.map(e => e.icon).filter(Boolean))),
    };
  }, [events, yearFilter, termFilter, tagFilter, iconFilter]);

  // Group events for timeline
  const groupedTimeline = useMemo(() => {
    const filtered = events.filter(event => {
      const eventYear = new Date(event.event_date).getFullYear();
      return (
        (!yearFilter || eventYear === parseInt(yearFilter)) &&
        (!termFilter || event.term === termFilter) &&
        (!tagFilter || event.tags?.includes(tagFilter)) &&
        (!iconFilter || event.icon === iconFilter)
      );
    });

    const grouped = filtered.reduce((acc, event) => {
      if (!event.event_date) return acc;
      const d = new Date(event.event_date);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;

      if (!acc[year]) acc[year] = {};
      if (!acc[year][month]) acc[year][month] = [];
      acc[year][month].push(event);
      return acc;
    }, {});

    return grouped;
  }, [events, yearFilter, termFilter, tagFilter, iconFilter]);

  const monthName = (month) =>
    new Date(0, month - 1).toLocaleString('default', { month: 'long' });

  // Modal handlers
  const openModal = (imageUrl) => setModalImage(imageUrl);
  const closeModal = () => setModalImage(null);

  // Clear all filters
  const clearAllFilters = () => {
    setYearFilter('');
    setTermFilter('');
    setTagFilter('');
    setIconFilter('');
  };

  return (
    <div className="timeline-page">
      {/* HERO SECTION */}
      <div className="timeline-hero">
        <span className="hero-badge">📅 Est. 2024</span>
        <h1>Our Journey</h1>
        <p>Explore our journey and milestones over the years</p>
      </div>

      {/* FILTERS */}
      <div className="timeline-filters">
        <div className="filter-wrapper">
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
            <option value="">All Years</option>
            {filterOptions.years.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>

        <div className="filter-wrapper">
          <select value={termFilter} onChange={e => setTermFilter(e.target.value)}>
            <option value="">All Terms</option>
            {filterOptions.terms.map(term => <option key={term} value={term}>{term}</option>)}
          </select>
        </div>

        <div className="filter-wrapper">
          <select value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
            <option value="">All Tags</option>
            {filterOptions.tags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
          </select>
        </div>

        <div className="filter-wrapper">
          <select value={iconFilter} onChange={e => setIconFilter(e.target.value)}>
            <option value="">All Icons</option>
            {filterOptions.icons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
          </select>
        </div>

        {/* Clear All Filters Button */}
        <button className="clear-all-btn" onClick={clearAllFilters}>Clear All Filters</button>
      </div>

      {/* TIMELINE */}
      <div className="timeline">
        {loading ? (
          <p style={{textAlign:'center'}}>Loading timeline...</p>
        ) : (
          Object.keys(groupedTimeline).sort((a,b)=>a-b).map(year => ( // years ascending
            <div key={year} className="timeline-year-section">
              <h2 className="timeline-year-header">{year}</h2>

              {Object.keys(groupedTimeline[year]).sort((a,b)=>a-b).map(month => ( // months ascending
                <div key={month} className="timeline-month-section">
                  <h3 className="timeline-month-header">{monthName(month)}</h3>

                  {groupedTimeline[year][month]
                    .sort((e1, e2) => new Date(e1.event_date) - new Date(e2.event_date)) // events ascending
                    .map((event, index) => {
                      const isLeft = index % 2 === 0;
                      return (
                        <div key={event.notion_id} className={`timeline-item ${isLeft ? 'left' : 'right'}`}>
                          <div className="timeline-marker"/>
                          <div className="timeline-connector"/>
                          <div className={`timeline-icon ${isLeft ? 'left-icon' : 'right-icon'}`}>
                            {event.icon || '📌'}
                          </div>

                          <div className="timeline-event-card">
                            <div className="card-text">
                              <h4>{event.title}</h4>
                              <p>{event.description}</p>
                              {event.term && <p><strong>Term:</strong> {event.term}</p>}
                              {event.tags?.length > 0 && (
                                <div className="tags-container">
                                  {event.tags.map(tag => (
                                    <span key={tag} className="tag-badge">{tag}</span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {event.image_url && (
                              <div className="card-image-container" onClick={() => openModal(event.image_url)}>
                                <img className="card-image" src={event.image_url} alt={event.title}/>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                  })}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* IMAGE MODAL */}
      {modalImage && (
        <div className="image-modal" onClick={closeModal}>
          <img src={modalImage} alt="Full view"/>
        </div>
      )}
    </div>
  );
}

export default Timeline;


