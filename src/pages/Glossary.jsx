import React, { useState } from 'react';
import { useGlossary } from '../hooks/useSupabase';

function Glossary() {
  const { terms, loading, error } = useGlossary();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'ml', 'statistics', 'programming', 'data-engineering'];

  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by first letter
  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const firstLetter = term.term[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(term);
    return acc;
  }, {});

  const letters = Object.keys(groupedTerms).sort();

  if (loading) {
    return (
      <div className="page">
        <h1>Glossary</h1>
        <p>Loading terms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Glossary</h1>
        <p>Error loading terms: {error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="glossary-header">
        <h1>📖 Data Science Glossary</h1>
        <p>Quick reference for key terms and concepts</p>
      </div>

      {/* Search and Filters */}
      <div className="glossary-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search terms or definitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Category:</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      {searchQuery && (
        <div className="results-info">
          Found {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Alphabetical navigation */}
      {letters.length > 0 && !searchQuery && (
        <div className="letter-nav">
          {letters.map(letter => (
            <a key={letter} href={`#letter-${letter}`} className="letter-link">
              {letter}
            </a>
          ))}
        </div>
      )}

      {/* Terms grouped by letter */}
      {letters.length > 0 ? (
        <div className="glossary-content">
          {letters.map(letter => (
            <section key={letter} id={`letter-${letter}`} className="letter-section">
              <h2 className="letter-heading">{letter}</h2>
              <div className="terms-list">
                {groupedTerms[letter].map(term => (
                  <TermCard key={term.id} term={term} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No terms found matching your criteria</p>
        </div>
      )}
    </div>
  );
}

function TermCard({ term }) {
  const categoryColors = {
    ml: '#06d6a0',
    statistics: '#ffd166',
    programming: '#118ab2',
    'data-engineering': '#f72585'
  };

  const categoryLabels = {
    ml: 'Machine Learning',
    statistics: 'Statistics',
    programming: 'Programming',
    'data-engineering': 'Data Engineering'
  };

  return (
    <div className="term-card">
      <div className="term-header">
        <h3 className="term-title">{term.term}</h3>
        <span 
          className="category-badge"
          style={{ backgroundColor: categoryColors[term.category] }}
        >
          {categoryLabels[term.category] || term.category}
        </span>
      </div>
      <p className="term-definition">{term.definition}</p>
      {term.example && (
        <div className="term-example">
          <strong>Example:</strong> {term.example}
        </div>
      )}
      {term.related_terms && term.related_terms.length > 0 && (
        <div className="related-terms">
          <strong>Related:</strong> {term.related_terms.join(', ')}
        </div>
      )}
    </div>
  );
}

export default Glossary;