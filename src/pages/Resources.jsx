/* ========================================
   /pages/Resources.jsx
   ======================================== */

import React, { useState } from 'react';
import { useResources } from '../hooks/useSupabase';
import { ExternalLink, Search } from 'lucide-react'; // Removed Filter icon, not needed for slider
import './Resources.css';

function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const { resources, loading, error } = useResources();

  // Extract unique types
  const types = ['all', ...new Set(resources.map(r => r.type).filter(Boolean))];

  // Filter logic
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

  // Color mapping
  const getTypeColor = (type) => {
    const colors = {
      book: '#667eea',
      course: '#06d6a0',
      documentation: '#ffd166',
      blog: '#f72585',
      dataset: '#4cc9f0',
      tool: '#7209b7'
    };
    return colors[type.toLowerCase()] || '#999999';
  };

  if (loading) {
    return (
      <div className="resources-page">
        <div className="resources-hero">
          <span className="hero-badge">📚 Curated Learning</span>
          <h1>Learning Resources</h1>
          <p>Loading library...</p>
        </div>
      </div>
    );
  }

  if (error) return <p>Error loading resources: {error}</p>;

  return (
    <div className="resources-page">
      
      {/* 1. HERO */}
      <div className="resources-hero">
        <span className="hero-badge">📚 Curated Learning</span>
        <h1>Learning Resources</h1>
        <p>Curated collection of books, courses, and tools for data science</p>
      </div>

      {/* 2. SEARCH (Floating) */}
      <div className="resources-search">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search books, courses, tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* 3. CONTENT */}
      <div className="resources-content">
        
        {/* NEW: SLIDER FILTER (Replaces the old dropdown toolbar) */}
        <div className="filter-container">
          <div className="resources-filters-control">
            {types.map((type) => (
              <button
                key={type}
                className={`filter-tab-btn ${selectedType === type ? 'active' : ''}`}
                onClick={() => setSelectedType(type)}
              >
                {type === 'all' ? 'All Resources' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* GRID */}
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