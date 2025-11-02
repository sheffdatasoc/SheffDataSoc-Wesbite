/* ========================================
   BlogCard.jsx
   ======================================== */

import React from 'react';
import './BlogCard.css';

function BlogCard({ title, excerpt, author, date, readTime, image, onReadMore }) {
  return (
    <div className="blog-card">
      <div 
        className="blog-image" 
        style={{ backgroundImage: image ? `url(${image})` : 'none' }}
      />
      <div className="blog-content">
        <div className="blog-meta">
          <span>By {author}</span>
          <span>•</span>
          <span>{date}</span>
        </div>
        <h3 className="blog-title">{title}</h3>
        <p className="blog-excerpt">{excerpt}</p>
        <div className="blog-footer">
          <button className="btn-read-more" onClick={onReadMore}>
            Read More
          </button>
          <span className="blog-read-time">{readTime} min read</span>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;