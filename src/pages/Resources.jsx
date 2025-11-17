/* ========================================
   /pages/Resources.jsx
   ======================================== */

import React, { useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import './Resources.css';

function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Sample resources - replace with Supabase data
  const resources = [
    {
      id: 1,
      title: 'Python for Data Science Handbook',
      description: 'Comprehensive guide to using Python for data analysis and visualization.',
      type: 'book',
      url: 'https://jakevdp.github.io/PythonDataScienceHandbook/',
      tags: ['python', 'data-analysis']
    },
    {
      id: 2,
      title: 'Kaggle Learn',
      description: 'Free micro-courses covering machine learning, Python, and data visualization.',
      type: 'course',
      url: 'https://www.kaggle.com/learn',
      tags: ['ml', 'python', 'free']
    },
    {
      id: 3,
      title: 'Fast.ai',
      description: 'Practical deep learning course for coders.',
      type: 'course',
      url: 'https://www.fast.ai/',
      tags: ['deep-learning', 'free']
    },
    {
      id: 4,
      title: 'Scikit-learn Documentation',
      description: 'Official documentation for the most popular ML library in Python.',
      type: 'documentation',
      url: 'https://scikit-learn.org/stable/',
      tags: ['ml', 'python', 'documentation']
    },
    {
      id: 5,
      title: 'Towards Data Science',
      description: 'Medium publication with thousands of data science articles.',
      type: 'blog',
      url: 'https://towardsdatascience.com/',
      tags: ['articles', 'tutorials']
    },
    {
      id: 6,
      title: 'Kaggle Datasets',
      description: 'Find and publish datasets for your data science projects.',
      type: 'dataset',
      url: 'https://www.kaggle.com/datasets',
      tags: ['datasets', 'projects']
    }
  ];

  const types = ['all', ...new Set(resources.map(r => r.type))];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type) => {
    const colors = {
      book: '#667eea',
      course: '#06d6a0',
      documentation: '#ffd166',
      blog: '#f72585',
      dataset: '#4cc9f0',
      tool: '#7209b7'
    };
    return colors[type] || '#667eea';
  };

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
              {types.map(type => (
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
            {filteredResources.map(resource => (
              <div key={resource.id} className="resource-card">
                <div className="resource-header">
                  <span 
                    className="resource-type"
                    style={{ backgroundColor: getTypeColor(resource.type) }}
                  >
                    {resource.type}
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

                <div className="resource-footer">
                  <a 
                    href={resource.url} 
                    className="resource-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Resource <ExternalLink size={16} />
                  </a>
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