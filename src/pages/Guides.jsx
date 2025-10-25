import React, { useState } from 'react';
import { useGuides } from '../hooks/useSupabase';

function Guides() {
  const { guides, loading, error } = useGuides();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const categories = ['all', 'python', 'ml', 'data-viz', 'statistics', 'tools'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredGuides = guides.filter(guide => {
    const categoryMatch = selectedCategory === 'all' || guide.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || guide.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const featuredGuides = filteredGuides.filter(g => g.featured);
  const regularGuides = filteredGuides.filter(g => !g.featured);

  if (loading) {
    return (
      <div className="page">
        <h1>Guides</h1>
        <p>Loading guides...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="guides-header">
        <h1>📚 Learning Guides</h1>
        <p>Step-by-step tutorials and resources to boost your data science skills</p>
      </div>

      {/* Filters */}
      <div className="guides-filters">
        <div className="filter-group">
          <label>Category:</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Difficulty:</label>
          <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Featured Guides */}
      {featuredGuides.length > 0 && (
        <section className="featured-guides">
          <h2>⭐ Featured Guides</h2>
          <div className="guides-grid">
            {featuredGuides.map(guide => (
              <GuideCard key={guide.id} guide={guide} featured={true} />
            ))}
          </div>
        </section>
      )}

      {/* All Guides */}
      {regularGuides.length > 0 && (
        <section>
          <h2>All Guides</h2>
          <div className="guides-grid">
            {regularGuides.map(guide => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </section>
      )}

      {filteredGuides.length === 0 && (
        <div className="empty-state">
          <p>No guides found for selected filters</p>
        </div>
      )}
    </div>
  );
}

function GuideCard({ guide, featured = false }) {
  const difficultyColors = {
    beginner: '#06d6a0',
    intermediate: '#ffd166',
    advanced: '#f72585'
  };

  return (
    <div className={`guide-card ${featured ? 'featured-card' : ''}`}>
      <div className="guide-header">
        <span 
          className="difficulty-badge"
          style={{ backgroundColor: difficultyColors[guide.difficulty] }}
        >
          {guide.difficulty}
        </span>
        {guide.read_time && (
          <span className="read-time">⏱️ {guide.read_time} min</span>
        )}
      </div>

      <h3>{guide.title}</h3>
      <p className="guide-description">{guide.description}</p>

      {guide.tags && (
        <div className="guide-tags">
          {guide.tags.map((tag, i) => (
            <span key={i} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="guide-footer">
        {guide.author && <span className="author">By {guide.author}</span>}
        {guide.github_url && (
          <a href={guide.github_url} className="guide-link" target="_blank" rel="noopener noreferrer">
            View Guide →
          </a>
        )}
      </div>
    </div>
  );
}

export default Guides;