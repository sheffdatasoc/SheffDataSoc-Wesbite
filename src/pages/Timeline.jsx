/* ========================================
   /pages/Timeline.jsx
   ======================================== */

import React, { useEffect, useState, useMemo } from 'react';
import { getTimelineEvents } from '../lib/supabase';
// Ya no necesitamos importar Hero porque lo haremos custom como en Sandbox
import './Timeline.css';

function Timeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [yearFilter, setYearFilter] = useState('');
  const [termFilter, setTermFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [iconFilter, setIconFilter] = useState('');

  useEffect(() => {
    async function fetchTimeline() {
      setLoading(true);
      const data = await getTimelineEvents();
      setEvents(data || []);
      setLoading(false);
    }
    fetchTimeline();
  }, []);

  // Filter Options Logic
  const filterOptions = useMemo(() => {
    return {
      years: Array.from(new Set(events.map(e => new Date(e.event_date).getFullYear()))),
      terms: Array.from(new Set(events.map(e => e.term).filter(Boolean))),
      tags: Array.from(new Set(events.flatMap(e => e.tags || []))),
      icons: Array.from(new Set(events.map(e => e.icon).filter(Boolean)))
    };
  }, [events]);

  // Grouping Logic
  const groupedTimeline = useMemo(() => {
    // 1. Filter
    const filtered = events.filter(event => {
      const eventYear = new Date(event.event_date).getFullYear();
      const yearMatch = yearFilter ? eventYear === parseInt(yearFilter) : true;
      const termMatch = termFilter ? event.term === termFilter : true;
      const tagMatch = tagFilter ? event.tags?.includes(tagFilter) : true;
      const iconMatch = iconFilter ? event.icon === iconFilter : true;
      return yearMatch && termMatch && tagMatch && iconMatch;
    });

    // 2. Group
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

  return (
    <div className="timeline-page">
      {/* --- NEW HERO SECTION (Sandbox Style) --- */}
      <div className="timeline-hero">
        <span className="hero-badge">📅 Est. 2024</span>
        <h1>Our Journey</h1>
        <p>Explore our journey and milestones over the years</p>
      </div>

      {/* Filters */}
      <div className="timeline-filters">
        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
          <option value="">All Years</option>
          {filterOptions.years.sort((a,b) => b - a).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select value={termFilter} onChange={(e) => setTermFilter(e.target.value)}>
          <option value="">All Terms</option>
          {filterOptions.terms.map(term => (
            <option key={term} value={term}>{term}</option>
          ))}
        </select>

        <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
          <option value="">All Tags</option>
          {filterOptions.tags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        <select value={iconFilter} onChange={(e) => setIconFilter(e.target.value)}>
          <option value="">All Icons</option>
          {filterOptions.icons.map(icon => (
            <option key={icon} value={icon}>{icon}</option>
          ))}
        </select>
      </div>

      {/* Timeline Container */}
      <div className="timeline">
        {loading ? (
          <p style={{textAlign: 'center'}}>Loading timeline...</p>
        ) : (
          <>
            {Object.keys(groupedTimeline)
              .sort((a, b) => b - a)
              .map((year) => (
                <div key={year} className="timeline-year-section">
                  <h2 className="timeline-year-header">{year}</h2>

                  {Object.keys(groupedTimeline[year])
                    .sort((a, b) => a - b)
                    .map((month) => (
                      <div key={month} className="timeline-month-section">
                        <h3 className="timeline-month-header">{monthName(month)}</h3>

                        {groupedTimeline[year][month].map((event, index) => {
                          const isLeft = index % 2 === 0;

                          return (
                            <div
                              key={event.notion_id}
                              className={`timeline-item ${isLeft ? "left" : "right"}`}
                            >
                              <div className="timeline-marker" />
                              <div className="timeline-connector" />
                              <div className={`timeline-icon ${isLeft ? "left-icon" : "right-icon"}`}>
                                {event.icon || "📌"}
                              </div>
                              <div className="timeline-event-card">
                                <div className="card-text">
                                  <h4>{event.title}</h4>
                                  <p>{event.description}</p>
                                  {event.term && <p><strong>Term:</strong> {event.term}</p>}
                                  
                                  {/* Tags as Badges */}
                                  {event.tags?.length > 0 && (
                                    <div className="tags-container">
                                      {event.tags.map(tag => (
                                        <span key={tag} className="tag-badge">{tag}</span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                {event.image_url && (
                                  <img
                                    className="card-image"
                                    src={event.image_url}
                                    alt={event.title}
                                  />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Timeline;