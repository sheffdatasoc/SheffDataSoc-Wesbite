/* ========================================
   /pages/Resources.jsx
   ======================================== */

import React, { useState } from 'react';
import { useResources } from '../hooks/useSupabase';
import { ExternalLink, Search } from 'lucide-react';
import './Resources.css';

function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const { resources, loading, error } = useResources();

  // Extract unique types from resources for filter dropdown
  const types = ['all', ...new Set(resources.map(r => r.type).filter(Boolean))];

  // Filter resources based on search query and type
  const filteredResources = resources.filter(resource => {
    const name = resource.name || '';
    const description = resource.description || '';
    const tags = resource.tags || [];
    const type = resource.type || '';

    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      selectedType === 'all' || type.toLowerCase() === selectedType.toLowerCase();

    return matchesSearch && matchesType;
  });

  // Map resource type to a color
  const getTypeColor = (type) => {
    const colors = {
      book: '#667eea',
      course: '#06d6a0',
      documentation: '#ffd166',
      blog: '#f72585',
      dataset: '#4cc9f0',
      tool: '#7209b7'
    };
    return colors[type.toLowerCase()] || '#999999'; // gray default
  };

  if (loading) return <p>Loading resources...</p>;
  if (error) return <p>Error loading resources: {error}</p>;

  return (
    <div className="resources-page">
      {/* Hero Section */}
      <div className="resources-hero">
        <span className="hero-badge">📚 Curated Learning</span>
        <h1>Learning Resources</h1>
        <p>Curated collection of books, courses, and tools for data science</p>
      </div>

      <div className="resources-content">
        {/* Search and Filter */}
        <div className="resources-controls">
          <div className="resources-search">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label>Type:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="filter-select"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="resources-grid">
            {filteredResources.map((resource) => (
              <div key={resource.notion_id} className="resource-card">
                <div className="resource-header">
                  <span
                    className="resource-type"
                    style={{ backgroundColor: getTypeColor(resource.type) }}
                  >
                    {resource.type}
                  </span>
                </div>

                <h3>{resource.name}</h3>
                <p className="resource-description">{resource.description}</p>

                {resource.tags && resource.tags.length > 0 && (
                  <div className="resource-tags">
                    {resource.tags.map((tag, i) => (
                      <span key={i} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="resource-footer">
                  {resource.resource_url && (
                    <a
                      href={resource.resource_url}
                      className="resource-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Resource <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No resources found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Resources;
