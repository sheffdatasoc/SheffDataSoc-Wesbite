/* ========================================
   /pages/Gallery.jsx
   ======================================== */

import React, { useState } from 'react';
import Hero from '../components/Hero';
import './Gallery.css';

function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample gallery items - replace with actual data/Supabase
  const galleryItems = [
    {
      id: 1,
      title: 'Annual Data Science Hackathon 2024',
      category: 'events',
      imageUrl: 'https://via.placeholder.com/400x300?text=Hackathon+2024',
      date: '2024-03-15'
    },
    {
      id: 2,
      title: 'Python Workshop Series',
      category: 'workshops',
      imageUrl: 'https://via.placeholder.com/400x300?text=Python+Workshop',
      date: '2024-02-10'
    },
    {
      id: 3,
      title: 'Industry Panel Discussion',
      category: 'talks',
      imageUrl: 'https://via.placeholder.com/400x300?text=Panel+Discussion',
      date: '2024-01-20'
    },
    {
      id: 4,
      title: 'Team Social Event',
      category: 'social',
      imageUrl: 'https://via.placeholder.com/400x300?text=Social+Event',
      date: '2024-04-05'
    },
    {
      id: 5,
      title: 'ML Model Deployment Workshop',
      category: 'workshops',
      imageUrl: 'https://via.placeholder.com/400x300?text=ML+Workshop',
      date: '2024-03-01'
    },
    {
      id: 6,
      title: 'Data Visualization Competition',
      category: 'events',
      imageUrl: 'https://via.placeholder.com/400x300?text=Viz+Competition',
      date: '2024-02-28'
    }
  ];

  const categories = ['all', 'events', 'workshops', 'talks', 'social'];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="gallery-page">
      <Hero 
        title="Gallery"
        subtitle="Memories from our events, workshops, and community gatherings"
        showButtons={false}
        showStats={false}
      />

      <div className="gallery-content">
        {/* Category Filter */}
        <div className="gallery-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length > 0 ? (
          <div className="gallery-grid">
            {filteredItems.map(item => (
              <div key={item.id} className="gallery-item">
                <div className="gallery-image">
                  <img src={item.imageUrl} alt={item.title} />
                  <div className="gallery-overlay">
                    <h3>{item.title}</h3>
                    <p>{new Date(item.date).toLocaleDateString('en-GB', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No images found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;