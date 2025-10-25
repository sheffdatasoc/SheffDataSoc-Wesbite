import React from 'react';

function BlogCard({ post }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="blog-card">
      {post.image && (
        <div 
          className="blog-image"
          style={{ backgroundImage: `url(${post.image})` }}
        />
      )}
      
      <div className="blog-content">
        <div className="blog-meta">
          <span className="blog-author">✍️ {post.author}</span>
          <span className="blog-date">📅 {formatDate(post.published_date)}</span>
        </div>

        <h3 className="blog-title">{post.title}</h3>
        <p className="blog-excerpt">{post.excerpt}</p>

        <div className="blog-footer">
          <button className="btn-read-more">Read More →</button>
          {post.readTime && (
            <span className="blog-read-time">⏱️ {post.readTime} min read</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogCard;