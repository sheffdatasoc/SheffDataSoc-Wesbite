/* ========================================
   BlogCard.jsx - FIXED
   ======================================== */
import React from 'react';
import { Clock } from 'lucide-react';
import './BlogCard.css';

function BlogCard({ title, excerpt, author, date, image, category, onReadMore }) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className="blog-card">
      <div className="image-wrapper">
        {image && <img src={image} alt={title} className="blog-image" />}
        {category && <span className="blog-tag">{category}</span>}
      </div>

      <div className="blog-content">
        <h3 className="blog-title">{title}</h3>
        <p className="blog-excerpt">{excerpt}</p>

        {onReadMore && (
          <div className="read-more-wrapper">
            {/* ✅ FIXED: Removed "btn" class that was applying purple styles */}
            <button className="btn-read-more" onClick={onReadMore}>
              Read More
            </button>
          </div>
        )}

        <div className="blog-footer">
          <div className="blog-meta">
            <div className="blog-author-wrapper">
              <span className="blog-author">{author}</span>
            </div>
            {formattedDate && (
              <div className="blog-date-wrapper">
                <Clock size={16} className="clock-icon" />
                <span className="blog-date">{formattedDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;