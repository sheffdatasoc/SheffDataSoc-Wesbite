/* ========================================
   /pages/Gallery.jsx
   ======================================== */

import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
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

  // Map of category key -> display label (pluralized)
  const categoryLabels = {
    all: 'All',
    events: 'Events',
    workshops: 'Workshops',
    talks: 'Talks',
    social: 'Socials',
  };

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
              {categoryLabels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
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
