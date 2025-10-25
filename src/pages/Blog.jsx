import React from 'react';
import BlogCard from '../components/BlogCard.jsx';
import { useBlogPosts } from '../hooks/useSupabase';

function Blog() {
  const { posts, loading, error } = useBlogPosts();

  // Mock data as fallback when Supabase is not configured
  const mockPosts = [
    {
      id: 1,
      title: "How Our Members Won the National Data Science Challenge",
      author: "Sarah Chen",
      published_date: "2024-11-05",
      excerpt: "Read about how our team developed an innovative solution for predicting housing prices using ensemble methods and feature engineering techniques.",
      readTime: 5,
      image: null
    },
    {
      id: 2,
      title: "Getting Started with Natural Language Processing",
      author: "James Wilson",
      published_date: "2024-10-28",
      excerpt: "A beginner's guide to NLP covering tokenization, sentiment analysis, and building your first chatbot with Python.",
      readTime: 8,
      image: null
    },
    {
      id: 3,
      title: "Welcome to SheffDataSoc 2024/25!",
      author: "Committee Team",
      published_date: "2024-10-15",
      excerpt: "Meet your new committee and discover what we have planned for this academic year. Exciting workshops, competitions, and networking events await!",
      readTime: 3,
      image: null
    }
  ];

  // Use Supabase data if available, otherwise use mock data
  const displayPosts = posts.length > 0 ? posts : mockPosts;

  if (loading) {
    return (
      <div className="page">
        <h1>The Blog</h1>
        <p>Loading posts...</p>
        <div className="loading-spinner">⏳</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>The Blog</h1>
        <div className="error-message">
          <p>❌ Error loading posts: {error}</p>
          <p>Showing sample data instead.</p>
        </div>
        <div className="blog-grid">
          {mockPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>The Blog</h1>
      <p>Stories, tutorials, and insights from the SheffDataSoc community.</p>
      
      {posts.length === 0 && (
        <div className="info-message">
          <p>💡 No posts found in database. Showing sample data.</p>
        </div>
      )}

      <div className="blog-grid">
        {displayPosts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Blog;