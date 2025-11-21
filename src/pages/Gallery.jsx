/* ========================================
   /pages/Gallery.jsx
   ======================================== */

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
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
  
  // State for the Expanded View (Modal)
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  // Fetch gallery items
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

  // Filter logic
  const categories = [
    'all',
    ...Array.from(new Set(galleryItems.map(item => item.category))).filter(Boolean)
  ];

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  // --- MODAL LOGIC ---

  const openModal = (index) => {
    setSelectedItemIndex(index);
    document.body.style.overflow = 'hidden'; // Lock scroll
  };

  const closeModal = useCallback(() => {
    setSelectedItemIndex(null);
    document.body.style.overflow = 'unset'; // Unlock scroll
  }, []);

  const navigateModal = useCallback((direction) => {
    if (selectedItemIndex === null) return;
    let newIndex = selectedItemIndex + direction;
    const totalItems = filteredItems.length;

    // Loop logic
    if (newIndex < 0) newIndex = totalItems - 1;
    else if (newIndex >= totalItems) newIndex = 0;

    setSelectedItemIndex(newIndex);
  }, [selectedItemIndex, filteredItems.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedItemIndex === null) return;
      switch (e.key) {
        case 'Escape': closeModal(); break;
        case 'ArrowLeft': navigateModal(-1); break;
        case 'ArrowRight': navigateModal(1); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemIndex, closeModal, navigateModal]);

  const activeItem = selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null;

  if (loading) return <p className="gallery-loading">Loading gallery…</p>;
  if (error) return <p className="gallery-error">Error: {error}</p>;

  return (
    <>
      {/* --- MAIN PAGE CONTENT --- */}
      <div className="gallery-page">
        <div className="gallery-hero">
          <span className="hero-badge">📸 Captured Moments</span>
          <h1>Gallery</h1>
          <p>Memories from our events, workshops, and community gatherings</p>
        </div>

        <div className="gallery-content">
          {/* Filters */}
          <div className="gallery-filters">
            {categories.map(cat => {
              let label = cat.charAt(0).toUpperCase() + cat.slice(1);
              if (cat !== 'all' && !label.endsWith('s')) label += 's';
              return (
                <button
                  key={cat}
                  className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedItemIndex(null);
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {filteredItems.length > 0 ? (
            <div className="gallery-grid">
              {filteredItems.map((item, index) => (
                <div 
                  key={item.notion_id} 
                  className="gallery-item"
                  onClick={() => openModal(index)} // Opens the modal
                >
                  <img src={item.image_url} alt={item.title} className="card-bg-img" />
                  <div className="gallery-overlay">
                    <div className="gallery-text-content">
                      <h3>{item.title}</h3>
                      {item.event_date && (
                        <p className="gallery-date">
                          {new Date(item.event_date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                        </p>
                      )}
                      {/* --- TAGS IN GRID (KEPT) --- */}
                      {item.category && (
                        <div className="gallery-tags">
                          <span className="gallery-tag">{item.category}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No images found.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL OVERLAY (Outside main div) --- */}
      {activeItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            {/* Close Button */}
            <button className="modal-close-btn" onClick={closeModal}>
              <X size={24} />
            </button>

            {/* Navigation Arrows */}
            {filteredItems.length > 1 && (
              <>
                <button className="modal-nav-btn nav-left" onClick={(e) => { e.stopPropagation(); navigateModal(-1); }}>
                  <ChevronLeft size={32} />
                </button>
                <button className="modal-nav-btn nav-right" onClick={(e) => { e.stopPropagation(); navigateModal(1); }}>
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            {/* Image Container */}
            <div className="modal-image-container">
              <img src={activeItem.image_url} alt={activeItem.title} />
            </div>

            {/* Details Container */}
            <div className="modal-details">
              <h2>{activeItem.title}</h2>
              
              {/* Purple Subtitle (Category) - KEPT */}
              {activeItem.category && (
                <h4 className="modal-subtitle">
                  {activeItem.category.charAt(0).toUpperCase() + activeItem.category.slice(1)}
                </h4>
              )}
              
              {activeItem.event_date && (
                <p className="modal-date">
                  {new Date(activeItem.event_date).toLocaleDateString('en-GB', { 
                    day: 'numeric', month: 'long', year: 'numeric' 
                  })}
                </p>
              )}
              
              {activeItem.description && (
                <p className="modal-description">{activeItem.description}</p>
              )}
              
              {/* TAGS REMOVED FROM HERE */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Gallery;