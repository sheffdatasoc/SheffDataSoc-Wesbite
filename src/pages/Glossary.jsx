/* ========================================
   /pages/Glossary.jsx
   ======================================== */

import React, { useState } from 'react';
import Hero from '../components/Hero';
import { Search } from 'lucide-react';
import './Glossary.css';

function Glossary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample glossary terms - replace with Supabase data when ready
  const terms = [
    {
      term: 'API',
      definition: 'Application Programming Interface - A set of protocols and tools for building software applications.',
      category: 'Programming',
      example: 'REST APIs allow different applications to communicate with each other.'
    },
    {
      term: 'Machine Learning',
      definition: 'A subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.',
      category: 'AI/ML',
      example: 'Recommendation systems use machine learning to suggest products based on user behavior.'
    },
    {
      term: 'Data Visualization',
      definition: 'The graphical representation of information and data using visual elements like charts, graphs, and maps.',
      category: 'Data Science',
      example: 'A bar chart showing sales trends over time is a form of data visualization.'
    },
    {
      term: 'Python',
      definition: 'A high-level, interpreted programming language known for its simplicity and readability.',
      category: 'Programming',
      example: 'Python is widely used in data science for its powerful libraries like Pandas and NumPy.'
    },
    {
      term: 'Neural Network',
      definition: 'A series of algorithms that attempt to recognize underlying relationships in data through a process that mimics the human brain.',
      category: 'AI/ML',
      example: 'Deep learning uses neural networks with multiple layers to process complex patterns.'
    }
  ];

  const categories = ['all', ...new Set(terms.map(t => t.category))];

  const filteredTerms = terms.filter(term => {
    const matchesSearch = 
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by first letter
  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const firstLetter = term.term[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(term);
    return acc;
  }, {});

  const letters = Object.keys(groupedTerms).sort();

  return (
    <div className="glossary-page">
      <Hero 
        title="Data Science Glossary"
        subtitle="Your comprehensive guide to data science terminology"
        showButtons={false}
        showStats={false}
      />

      <div className="glossary-content">
        {/* Search and Filter */}
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

          <div className="filter-group">
            <label>Category:</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
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
                    <div key={index} className="term-card">
                      <div className="term-header">
                        <h3 className="term-title">{term.term}</h3>
                        <span className="category-badge">{term.category}</span>
                      </div>
                      <p className="term-definition">{term.definition}</p>
                      {term.example && (
                        <div className="term-example">
                          <strong>Example:</strong> {term.example}
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