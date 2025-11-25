import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuides } from '../hooks/useSupabase';
import GuideCard from '../components/GuideCard';
import { Search } from 'lucide-react';
import './Guides.css';

function Guides() {
  const { guides, loading, error } = useGuides();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'technical', label: 'Technical' },
    { value: 'career', label: 'Career' },
    { value: 'society', label: 'Society' },
    { value: 'all', label: 'All' }
  ];

  // Filter guides by category + search query only
  const filteredGuides = guides.filter(guide => {
    const categoryMatch =
      selectedCategory === 'all' || guide.category === selectedCategory;

    const searchMatch =
      searchQuery === '' ||
      guide.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && searchMatch;
  });

  const featuredGuides = filteredGuides.filter(g => g.featured);
  const regularGuides = filteredGuides.filter(g => !g.featured);

  if (loading) {
    return (
      <div className="guides-page">
        <div className="guides-header">
          <h1>Learning Guides</h1>
          <p>Loading guides...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="guides-page">
        <div className="guides-header">
          <h1>Learning Guides</h1>
          <p className="error-message">Error loading guides: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="guides-page">
      <div className="guides-header">
        <h1>Learning Guides</h1>
        <p>Step-by-step tutorials to help you grow as a data scientist</p>
      </div>

      {/* Search Bar */}
      <div className="guides-search">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Category Slider */}
      <div className="slider-background">
        <div className="slider-container">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`slider-button ${selectedCategory === cat.value ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
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
          <p>
            {searchQuery
              ? `No guides found matching "${searchQuery}"`
              : 'No guides found for the selected category.'}
          </p>
        </div>
      )}
    </div>
  );
}

export default Guides;

