import React from 'react';
import { MessageSquare, User } from 'lucide-react';
import './CommentsList.css';

function CommentsList({ comments, loading }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const minutes = Math.floor(diffInMs / (1000 * 60));
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      }
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }

    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="comments-list-container">
        <h3 className="comments-title">
          <MessageSquare size={24} />
          Comments
        </h3>
        <div className="comments-loading">Loading comments...</div>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="comments-list-container">
        <h3 className="comments-title">
          <MessageSquare size={24} />
          Comments ({comments?.length || 0})
        </h3>
        <div className="no-comments">
          <MessageSquare size={48} />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="comments-list-container">
      <h3 className="comments-title">
        <MessageSquare size={24} />
        Comments ({comments.length})
      </h3>

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-card">
            <div className="comment-header">
              <div className="comment-author">
                <div className="author-avatar">
                  <User size={20} />
                </div>
                <div className="author-info">
                  <span className="author-name">{comment.author_name}</span>
                  <span className="comment-date">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
              </div>
            </div>
            <div className="comment-content">
              {comment.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentsList;