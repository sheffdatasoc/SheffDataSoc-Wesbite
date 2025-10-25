import React from 'react';

function ProjectCard({ project, featured = false }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': 
      case 'in progress': 
        return '#4cc9f0';
      case 'completed': return '#06d6a0';
      case 'planning': return '#ffd166';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    if (status === 'active') return 'in progress';
    return status;
  };

  return (
    <div className={`project-card ${featured ? 'featured-card' : ''}`}>
      <div className="project-card-header">
        <span 
          className="project-status"
          style={{ backgroundColor: getStatusColor(project.status) }}
        >
          {getStatusText(project.status)}
        </span>
      </div>

      <h3 className="project-title">{project.title}</h3>
      <p className="project-description">{project.description}</p>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="project-tags">
          {project.tags.map((tag, index) => (
            <span key={index} className="project-tag">{tag}</span>
          ))}
        </div>
      )}

      {/* Footer with buttons */}
      <div className="project-footer">
        <div className="project-buttons">
          {project.github_url && (
            <a 
              href={project.github_url} 
              className="btn-github"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>💻</span> View on GitHub
            </a>
          )}
          {project.demo_url && (
            <a 
              href={project.demo_url} 
              className="btn-demo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>🚀</span> Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;