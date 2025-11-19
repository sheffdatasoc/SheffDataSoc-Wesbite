/* ========================================
   /pages/Timeline.jsx
   ======================================== */


import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import { getTimelineEvents } from '../lib/supabase';
import './Timeline.css';


function Timeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);


  // Filter state
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


  // Get unique values for drop-downs
  const years = Array.from(new Set(events.map(e => new Date(e.event_date).getFullYear())));
  const terms = Array.from(new Set(events.map(e => e.term).filter(Boolean)));
  const tags = Array.from(new Set(events.flatMap(e => e.tags || [])));
  const icons = Array.from(new Set(events.map(e => e.icon).filter(Boolean)));


  // Apply filters
  const filteredEvents = events.filter(event => {
    const eventYear = new Date(event.event_date).getFullYear();
    const yearMatch = yearFilter ? eventYear === parseInt(yearFilter) : true;
    const termMatch = termFilter ? event.term === termFilter : true;
    const tagMatch = tagFilter ? event.tags?.includes(tagFilter) : true;
    const iconMatch = iconFilter ? event.icon === iconFilter : true;
    return yearMatch && termMatch && tagMatch && iconMatch;
  });


  // Group events by year and month
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    if (!event.event_date) return acc;
    const date = new Date(event.event_date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 1-12


    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];


    acc[year][month].push(event);
    return acc;
  }, {});


  const monthName = (month) =>
    new Date(0, month - 1).toLocaleString('default', { month: 'long' });


  return (
    <div className="timeline-page">
      <Hero
        title="Our Journey"
        subtitle="Explore our journey and milestones over the years"
        showButtons={false}
        showStats={false}
        showBadge={true}
        badgeText="Est. 2024"
      />


      {/* Filter Bar */}
      <div className="timeline-filters">
        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
          <option value="">All Years</option>
          {years.sort((a,b)=>b-a).map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>


        <select value={termFilter} onChange={(e) => setTermFilter(e.target.value)}>
          <option value="">All Terms</option>
          {terms.map((term) => (
            <option key={term} value={term}>{term}</option>
          ))}
        </select>


        <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>


        <select value={iconFilter} onChange={(e) => setIconFilter(e.target.value)}>
          <option value="">All Icons</option>
          {icons.map((icon) => (
            <option key={icon} value={icon}>{icon}</option>
          ))}
        </select>
      </div>


      <div className="timeline-content">
        {loading ? (
          <p>Loading timeline...</p>
        ) : (
          <div className="timeline">
            {Object.keys(groupedEvents)
              .sort((a, b) => b - a) // latest year first
              .map((year) => (
                <div key={year} className="timeline-year-section">
                  <h2 className="timeline-year-header">{year}</h2>


                  {Object.keys(groupedEvents[year])
                    .sort((a, b) => a - b) // Jan → Dec
                    .map((month) => (
                      <div key={month} className="timeline-month-section">
                        <h3 className="timeline-month-header">{monthName(month)}</h3>


                        {groupedEvents[year][month].map((event) => (
                          <div key={event.notion_id} className="timeline-item">
                            <div className="timeline-icon">{event.icon || '📌'}</div>
                            <div className="timeline-event-content">
                              <h4>{event.title}</h4>
                              <p>{event.description}</p>
                              {event.term && <p><strong>Term:</strong> {event.term}</p>}
                              {event.tags?.length > 0 && <p><strong>Tags:</strong> {event.tags.join(', ')}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}


export default Timeline;