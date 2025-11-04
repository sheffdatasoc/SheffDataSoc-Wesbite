/* ========================================
   /pages/BlogDetail.jsx
   ======================================== */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft } from 'lucide-react';
import { getBlogPostById } from '../lib/supabase';
import './BlogDetail.css';

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        const data = await getBlogPostById(id);
        setPost(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  const formattedDate = post?.published_date
    ? new Date(post.published_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null;

  if (loading) {
    return (
      <div className="blog-detail-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-detail-page">
        <div className="error">
          {error ? `Error: ${error}` : 'Blog post not found'}
        </div>
        <button onClick={() => navigate('/blog')} className="back-button">
          <ArrowLeft size={20} />
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <button onClick={() => navigate('/blog')} className="back-button">
        <ArrowLeft size={20} />
        Back to Blog
      </button>

      <article className="blog-detail-container">
        {post.category && (
          <span className="blog-detail-tag">{post.category}</span>
        )}

        <h1 className="blog-detail-title">{post.title}</h1>

        <div className="blog-detail-meta">
          <span className="blog-detail-author">{post.author}</span>
          {formattedDate && (
            <div className="blog-detail-date">
              <Clock size={16} />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        {post.image && (
          <div className="blog-detail-image-wrapper">
            <img src={post.image} alt={post.title} className="blog-detail-image" />
          </div>
        )}

        <div className="blog-detail-content">
          <p className="blog-detail-excerpt">{post.excerpt}</p>
          {/* Add more content here when you have full blog post content */}
        </div>
      </article>
    </div>
  );
}

export default BlogDetail;