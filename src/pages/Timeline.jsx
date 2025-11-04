/* ========================================
   /pages/Timeline.jsx
   ======================================== */

import React from 'react';
import Hero from '../components/Hero';
import './Timeline.css';

function Timeline() {
  const milestones = [
    {
      year: '2019',
      title: 'Society Founded',
      description: 'Sheffield Data Science Society was established by a group of passionate students.',
      icon: '🎉'
    },
    {
      year: '2020',
      title: 'First Workshop Series',
      description: 'Launched our first comprehensive Python and Data Science workshop series.',
      icon: '📚'
    },
    {
      year: '2021',
      title: '100+ Members',
      description: 'Reached our first major milestone with over 100 active members.',
      icon: '🎯'
    },
    {
      year: '2022',
      title: 'Industry Partnerships',
      description: 'Established partnerships with leading tech companies for talks and internships.',
      icon: '🤝'
    },
    {
      year: '2023',
      title: 'Hackathon Launch',
      description: 'Organized our first data science hackathon with 50+ participants.',
      icon: '💻'
    },
    {
      year: '2024',
      title: 'National Recognition',
      description: 'Won "Best STEM Society" award at the National Student Society Awards.',
      icon: '🏆'
    },
    {
      year: '2025',
      title: 'Looking Forward',
      description: 'Continuing to grow and empower the next generation of data scientists.',
      icon: '🚀'
    }
  ];

  return (
    <div className="timeline-page">
      <Hero 
        title="Our Journey"
        subtitle="Explore our journey and milestones over the years"
        showButtons={false}
        showStats={false}
        showBadge={true}
        badgeText="Est. 2019"
      />

      <div className="timeline-content">
        <div className="timeline">
          {milestones.map((milestone, index) => (
            <div 
              key={index} 
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
            >
              <div className="timeline-content-card">
                <div className="timeline-icon">{milestone.icon}</div>
                <div className="timeline-year">{milestone.year}</div>
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Timeline;