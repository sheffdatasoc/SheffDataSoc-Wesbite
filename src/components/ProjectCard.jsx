/* ========================================
   ProjectCard.jsx
   ======================================== */

import React from 'react';
import './ProjectCard.css';

function ProjectCard({ 
  title, 
  description, 
  status, 
  tags = [], 
  members, 
  githubUrl, 
  demoUrl 
}) {
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return '#4cc9f0';
      case 'completed': return '#667eea';
      case 'planning': return '#ffd166';
      case 'on hold': return '#999';
      default: return '#667eea';
    }
  };

  return (
    <div className="project-card">
      <div className="project-card-header">
        <span 
          className="project-status" 
          style={{ backgroundColor: getStatusColor(status) }}
        >
          {status}
        </span>
      </div>
      <h3 className="project-title">{title}</h3>
      <p className="project-description">{description}</p>
      {tags.length > 0 && (
        <div className="project-tags">
          {tags.map((tag, index) => (
            <span key={index} className="project-tag">{tag}</span>
          ))}
        </div>
      )}
      <div className="project-footer">
        <div className="project-buttons">
          {githubUrl && (
            <a href={githubUrl} className="btn-github" target="_blank" rel="noopener noreferrer">
              GitHub →
            </a>
          )}
          {demoUrl && (
            <a href={demoUrl} className="btn-demo" target="_blank" rel="noopener noreferrer">
              Live Demo
            </a>
          )}
        </div>
        {members && (
          <p className="project-members">👥 {members} members</p>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;