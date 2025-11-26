/* ========================================
   /pages/Blog.jsx
   ======================================== */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlogPosts } from '../hooks/useSupabase';
import BlogCard from '../components/BlogCard';
import { Search, ArrowUp } from 'lucide-react';
import './Blog.css';

function Blog() {
  const navigate = useNavigate();
  const { posts, loading } = useBlogPosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 400;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const footer = document.querySelector('footer');
      const footerHeight = footer ? footer.offsetHeight : 0;
      
      // Calculate if we're near the footer
      const distanceFromBottom = documentHeight - (window.scrollY + windowHeight);
      const footerOffset = distanceFromBottom < footerHeight ? footerHeight - distanceFromBottom : 0;
      
      // Set CSS variable for footer offset
      document.documentElement.style.setProperty('--footer-offset', `${footerOffset}px`);
      
      setShowScrollTop(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReadMore = (id) => {
    navigate(`/blog/${id}`);
  };

  if (loading) {
    return (
      <div className="blog-page">
        <div className="blog-header">
          <h1>The Blog</h1>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      {/* Scroll to Top Button */}
      <button
        className={`scroll-to-top-btn ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} />
      </button>

      {/* Page Header */}
      <div className="blog-header">
        <h1>The Blog</h1>
        <p>Stay informed about our latest activities, achievements, and announcements</p>
      </div>

      {/* Search Bar - Sandbox Style */}
      <div className="blog-search">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Find a post..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Blog Grid */}
      {filteredPosts.length > 0 ? (
        <div className="blog-grid">
          {filteredPosts.map(post => (
            <BlogCard
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              author={post.author}
              date={post.published_date}
              image={post.image}
              category={post.category}
              onReadMore={() => handleReadMore(post.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No articles found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}

export default Blog;