import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import './CommentForm.css';

function CommentForm({ onCommentAdded }) {
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.author_name.trim() || !formData.content.trim()) {
      setError('Name and comment are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onCommentAdded(formData);
      
      // Reset form
      setFormData({
        author_name: '',
        author_email: '',
        content: ''
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to post comment. Please try again.');
      console.error('Error posting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-form-container">
      <h3 className="comment-form-title">
        <MessageCircle size={24} />
        Leave a Comment
      </h3>

      {success && (
        <div className="comment-success">
          Comment posted successfully! ✓
        </div>
      )}

      {error && (
        <div className="comment-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="author_name">Name *</label>
            <input
              type="text"
              id="author_name"
              name="author_name"
              value={formData.author_name}
              onChange={handleChange}
              placeholder="Your name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="author_email">Email (optional)</label>
            <input
              type="email"
              id="author_email"
              name="author_email"
              value={formData.author_email}
              onChange={handleChange}
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="content">Comment *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Share your thoughts..."
            rows="5"
            required
            disabled={isSubmitting}
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
}

export default CommentForm;