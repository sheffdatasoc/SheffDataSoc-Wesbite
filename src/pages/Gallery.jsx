/* ========================================
   /pages/Gallery.jsx
   ======================================== */

import React, { useState, useEffect } from 'react';
// Removed Hero import
import { createClient } from '@supabase/supabase-js';
import './Gallery.css';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch gallery items from Supabase
  useEffect(() => {
    async function fetchGallery() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('gallery_items')
          .select('*')
          .order('event_date', { ascending: false });
        if (error) throw error;
        setGalleryItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  // Extract unique categories from items
  const categories = [
    'all',
    ...Array.from(new Set(galleryItems.map(item => item.category))).filter(Boolean)
  ];

  // Filter items by selected category
  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  if (loading) return <p className="gallery-loading">Loading gallery…</p>;
  if (error) return <p className="gallery-error">Error: {error}</p>;

  return (
    <div className="gallery-page">
      {/* --- NEW HERO SECTION (Matches Timeline Page) --- */}
      <div className="gallery-hero">
        <span className="hero-badge">📸 Captured Moments</span>
        <h1>Gallery</h1>
        <p>Memories from our events, workshops, and community gatherings</p>
      </div>

      {/* Content Wrapper to center grid and filters */}
      <div className="gallery-content">
        {/* Category Filter */}
        <div className="gallery-filters">
          {categories.map(cat => {
            // Capitalize first letter and pluralize
            let label = cat.charAt(0).toUpperCase() + cat.slice(1);
            if (cat !== 'all' && !label.endsWith('s')) {
              label += 's';
            }

            return (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length > 0 ? (
          <div className="gallery-grid">
            {filteredItems.map(item => (
              <div key={item.notion_id} className="gallery-item">
                <div className="gallery-image">
                  <img src={item.image_url} alt={item.title} />
                </div>
                <div className="gallery-info">
                  <h3>{item.title}</h3>
                  {item.event_date && (
                    <p className="gallery-date">
                      {new Date(item.event_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                  {item.description && (
                    <p className="gallery-description">{item.description}</p>
                  )}
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