/* ========================================
   GuideDetail.jsx (FIXED - with description)
   ======================================== */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypePrism from 'rehype-prism-plus';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme for code
import { supabase } from '../lib/supabase';
import './GuideDetail.css';

function GuideDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGuide() {
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) setGuide(data);
      setLoading(false);
    }
    fetchGuide();
  }, [id]);

  if (loading) {
    return <div className="guide-detail-page">Loading...</div>;
  }

  if (!guide) {
    return (
      <div className="guide-detail-page">
        <p>Guide not found.</p>
        <button onClick={() => navigate('/guides')} className="back-button">
          <ArrowLeft size={20} /> Back to Guides
        </button>
      </div>
    );
  }

  return (
    <div className="guide-detail-page">
      <button onClick={() => navigate('/guides')} className="back-button">
        <ArrowLeft size={20} /> Back to Guides
      </button>

      <article className="guide-detail-container">
        {/* Title */}
        <h1 className="guide-title">{guide.title}</h1>

        {/* Author / Difficulty / Read Time */}
        <div className="guide-meta">
          {guide.author && (
            <span className="guide-author">{guide.author}</span>
          )}

          {guide.difficulty && (
            <span className="guide-difficulty">{guide.difficulty}</span>
          )}

          {guide.read_time && (
            <span className="guide-readtime">
              <Clock size={16} /> {guide.read_time} min read
            </span>
          )}
        </div>

        {/* Category */}
        {guide.category && (
          <div className="guide-category">
            <Tag size={16} />
            <span>{guide.category}</span>
          </div>
        )}

        {/* Description - ADDED THIS SECTION */}
        {guide.description && (
          <div className="guide-description">
            {guide.description}
          </div>
        )}
        
        {/* Markdown Content */}
        <div className="guide-content markdown-body">
          <ReactMarkdown
            children={guide.content}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypePrism]}
          />
        </div>
      </article>
    </div>
  );
}

export default GuideDetail;