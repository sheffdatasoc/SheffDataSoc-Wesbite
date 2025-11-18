/* ========================================
   /pages/Glossary.jsx
   ======================================== */

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useGlossary } from '../hooks/useSupabase';
import './Glossary.css';
import { useGlossary } from '../hooks/useSupabase';

function Glossary() {
  const [searchQuery, setSearchQuery] = useState('');
  const { terms, loading, error } = useGlossary();

  const filteredTerms = terms.filter(term => {
    const matchesSearch =
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Group by first letter
  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const firstLetter = term.term[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(term);
    return acc;
  }, {});

  const letters = Object.keys(groupedTerms).sort();

  if (loading) {
    return (
      <div className="glossary-page">
        <div className="glossary-hero">
          <span className="hero-badge">📚 Learn the Language</span>
          <h1>Data Science Glossary</h1>
          <p>Your comprehensive guide to data science terminology</p>
        </div>
        <div className="glossary-content">
          <p className="results-info">Loading glossary terms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glossary-page">
        <div className="glossary-hero">
          <span className="hero-badge">📚 Learn the Language</span>
          <h1>Data Science Glossary</h1>
          <p>Your comprehensive guide to data science terminology</p>
        </div>
        <div className="glossary-content">
          <p className="results-info error-message">Error loading glossary: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glossary-page">
      {/* Hero Section */}
      <div className="glossary-hero">
        <span className="hero-badge">📚 Learn the Language</span>
        <h1>Data Science Glossary</h1>
        <p>Your comprehensive guide to data science terminology</p>
      </div>

      <div className="glossary-content">
        {/* Search */}
        <div className="glossary-controls">
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <p className="results-info">
          {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''} found
        </p>

        {/* Letter Navigation */}
        {letters.length > 0 && (
          <div className="letter-nav">
            {letters.map(letter => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="letter-link"
              >
                {letter}
              </a>
            ))}
          </div>
        )}

        {/* Terms by Letter */}
        <div className="glossary-terms">
          {letters.length > 0 ? (
            letters.map(letter => (
              <section key={letter} id={`letter-${letter}`} className="letter-section">
                <h2 className="letter-heading">{letter}</h2>
                <div className="terms-list">
                  {groupedTerms[letter].map((term, index) => (
                    <div key={term.id || index} className="term-card">
                      <div className="term-header">
                        <h3 className="term-title">{term.term}</h3>
                        {term.category && (
                          <span className="category-badge">{term.category}</span>
                        )}
                      </div>
                      <p className="term-definition">{term.definition}</p>
                      {term.examples && (
                        <div className="term-example">
                          <strong>Example:</strong> {term.examples}
                        </div>
                      )}
                      {term.related_terms && term.related_terms.length > 0 && (
                        <div className="term-example">
                          <strong>Related Term(s): </strong> {term.related_terms.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="empty-state">
              <p>No terms found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Glossary;
