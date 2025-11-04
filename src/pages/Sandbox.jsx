// ========================================
// /pages/Sandbox.jsx - FIXED VERSION
// ========================================

import React, { useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { useProjects } from '../hooks/useSupabase';
import { Search, GitBranch, Code2 } from 'lucide-react';
import './Sandbox.css';

function TheSandbox() {
  const { projects, loading } = useProjects();
  const [activeTab, setActiveTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');

  // Separate projects and workshops with proper null checks
  const allProjects = projects?.filter(p => p.type === 'project') || [];
  const allWorkshops = projects?.filter(p => p.type === 'workshop') || [];
  const featuredProjects = projects?.filter(p => p.featured && p.type === 'project') || [];
  const featuredWorkshops = projects?.filter(p => p.featured && p.type === 'workshop') || [];

  // Filter based on search
  const filterItems = (items) => {
    if (!searchQuery) return items;
    return items.filter(item =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const displayItems = activeTab === 'projects'
    ? filterItems(allProjects)
    : filterItems(allWorkshops);

  const featuredItems = activeTab === 'projects'
    ? filterItems(featuredProjects)
    : filterItems(featuredWorkshops);

  if (loading) {
    return (
      <div className="sandbox-page">
        <div className="sandbox-hero">
          <span className="hero-badge">💻 Learn by Building</span>
          <h1>The Sandbox</h1>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sandbox-page">
      {/* Hero Section */}
      <div className="sandbox-hero">
        <span className="hero-badge">💻 Learn by Building</span>
        <h1>The Sandbox</h1>
        <p>Explore our community projects and workshop materials – all open source and connected to GitHub</p>
      </div>

      {/* Search Bar */}
      <div className="sandbox-search">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search projects and workshops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Featured Section */}
      {featuredItems.length > 0 && !searchQuery && (
        <section className="sandbox-featured-section">
          <h2 className="sandbox-featured-title">
            ⭐ Featured {activeTab === 'projects' ? 'Projects' : 'Workshops'}
          </h2>
          <div className="featured-grid">
            {featuredItems.map(item => (
              <ProjectCard key={item.id} project={item} featured={true} isSandbox={true} />
            ))}
          </div>
        </section>
      )}

      {/* Tabs */}
      <div className="sandbox-tabs">
        <div className="sandbox-tabs-container">
          <button
            className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <GitBranch size={20} />
            Projects
          </button>
          <button
            className={`tab-button ${activeTab === 'workshops' ? 'active' : ''}`}
            onClick={() => setActiveTab('workshops')}
          >
            <Code2 size={20} />
            Workshops
          </button>
        </div>
      </div>

      {/* Items Grid */}
      <div className="sandbox-content">
        {displayItems.length === 0 ? (
          <div className="empty-state">
            <p>No {activeTab} found {searchQuery && `matching "${searchQuery}"`}</p>
          </div>
        ) : (
          <div className="projects-grid">
            {displayItems.map(item => (
              <ProjectCard key={item.id} project={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TheSandbox;