/* ========================================
   /pages/Blog.jsx
======================================== */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlogPosts } from "../hooks/useSupabase";
import BlogCard from "../components/BlogCard";
import BlogCTA from "../components/BlogCTA";
import { Search } from "lucide-react";
import "./Blog.css";

function Blog() {
  const navigate = useNavigate();
  const { posts, loading } = useBlogPosts();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) =>
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
      {/* Header */}
      <div className="blog-header">
        <h1>The Blog</h1>
        <p>Stay informed about our latest activities, achievements, and announcements</p>
      </div>

      {/* Search Bar */}
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

      {/* Blog List */}
      {filteredPosts.length > 0 ? (
        <>
          <div className="blog-grid">
            {filteredPosts.map((post) => (
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

          {/* CTA below blog list */}
          <BlogCTA />
        </>
      ) : (
        <div className="empty-state">
          <p>No articles found matching "{searchQuery}"</p>
          <BlogCTA />
        </div>
      )}
    </div>
  );
}

export default Blog;
