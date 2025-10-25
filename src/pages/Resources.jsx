import React, { useState } from 'react';
import { useResources } from '../hooks/useSupabase';

function Resources() {
  const { resources, loading, error } = useResources();
  const [selectedType, setSelectedType] = useState('all');

  const types = ['all', 'dataset', 'tool', 'course', 'book', 'article', 'video'];

  const filteredResources = selectedType === 'all' 
    ? resources 
    : resources.filter(r => r.type === selectedType);

  const featuredResources = filteredResources.filter(r => r.featured);
  const regularResources = filteredResources.filter(r => !r.featured);

  if (loading) {
    return (
      <div className="page">
        <h1>Resources</h1>
        <p>Loading resources...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="resources-header">
        <h1>🔗 Resources</h1>
        <p>Curated collection of datasets, tools, courses, and learning materials</p>
      </div>

      {/* Type Filter */}
      <div className="resource-types">
        {types.map(type => (
          <button
            key={type}
            className={`type-button ${selectedType === type ? 'active' : ''}`}
            onClick={() => setSelectedType(type)}
          >
            {getTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Featured Resources */}
      {featuredResources.length > 0 && (
        <section className="featured-resources">
          <h2>⭐ Featured Resources</h2>
          <div className="resources-grid">
            {featuredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} featured={true} />
            ))}
          </div>
        </section>
      )}

      {/* All Resources */}
      {regularResources.length > 0 && (
        <section>
          <h2>All Resources</h2>
          <div className="resources-grid">
            {regularResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>
      )}

      {filteredResources.length === 0 && (
        <div className="empty-state">
          <p>No {selectedType} resources found</p>
        </div>
      )}
    </div>
  );
}

function getTypeIcon(type) {
  const icons = {
    all: '🔗',
    dataset: '📊',
    tool: '🛠️',
    course: '🎓',
    book: '📚',
    article: '📰',
    video: '🎥'
  };
  return icons[type] || '🔗';
}

function ResourceCard({ resource, featured = false }) {
  return (
    <div className={`resource-card ${featured ? 'featured-card' : ''}`}>
      <div className="resource-header">
        <span className="resource-type">
          {getTypeIcon(resource.type)} {resource.type}
        </span>
      </div>

      <h3>{resource.title}</h3>
      <p className="resource-description">{resource.description}</p>

      {resource.tags && (
        <div className="resource-tags">
          {resource.tags.map((tag, i) => (
            <span key={i} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <a 
        href={resource.url} 
        className="resource-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit Resource →
      </a>
    </div>
  );
}

export default Resources;