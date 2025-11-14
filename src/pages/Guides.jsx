/* ========================================
   /pages/Guides.jsx
   ======================================== */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuides } from '../hooks/useSupabase';
import GuideCard from '../components/GuideCard';
import './Guides.css';

function Guides() {
  const { guides, loading, error } = useGuides();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const categories = ['all', 'python', 'ml', 'data-viz', 'statistics', 'tools'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredGuides = guides.filter(guide => {
    const categoryMatch =
      selectedCategory === 'all' || guide.category === selectedCategory;
    const difficultyMatch =
      selectedDifficulty === 'all' || guide.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const featuredGuides = filteredGuides.filter(g => g.featured);
  const regularGuides = filteredGuides.filter(g => !g.featured);

  if (loading) {
    return (
      <div className="guides-page">
        <div className="guides-header">
          <h1>📚 Learning Guides</h1>
          <p>Loading guides...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="guides-page">
        <div className="guides-header">
          <h1>📚 Learning Guides</h1>
          <p className="error-message">Error loading guides: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="guides-page">
      <div className="guides-header">
        <h1>📚 Learning Guides</h1>
        <p>Step-by-step tutorials to help you grow as a data scientist</p>
      </div>

      {/* Filters */}
      <div className="guides-filters">
        <div className="filter-group">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Difficulty:</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="filter-select"
          >
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
              <GuideCard
                key={guide.id}
                guide={guide}
                onReadMore={() => navigate(`/guides/${guide.id}`)}
              />
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
              <GuideCard
                key={guide.id}
                guide={guide}
                onReadMore={() => navigate(`/guides/${guide.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {filteredGuides.length === 0 && (
        <div className="empty-state">
          <p>No guides found for the selected filters.</p>
        </div>
      )}
    </div>
  );
}

export default Guides;
