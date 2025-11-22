import React, { useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import WorkshopCard from '../components/WorkshopCard';
import { useProjects, useWorkshops } from '../hooks/useSupabase';
import { Search, GitBranch, Code2 } from 'lucide-react';
import './Sandbox.css';

function TheSandbox() {
  const { projects, loading: loadingProjects } = useProjects();
  const { workshops, loading: loadingWorkshops } = useWorkshops();
  const [activeTab, setActiveTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');

  // Sort workshops by date descending (most recent first)
  const sortedWorkshops = (workshops || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  // Filter based on search
  const filterItems = (items) => {
    if (!searchQuery) return items;
    return items.filter(item =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const displayItems = activeTab === 'projects'
    ? filterItems(projects || [])
    : filterItems(sortedWorkshops);

  const featuredItems = activeTab === 'projects'
    ? filterItems((projects || []).filter(p => p.featured))
    : filterItems(sortedWorkshops.filter(w => w.featured));

  const loading = activeTab === 'projects' ? loadingProjects : loadingWorkshops;

  if (loading) {
    return (
      <div className="sandbox-page">
        <div className="sandbox-hero">
          <span className="hero-badge">💻 Learn by Building</span>
          <h1>The Sandbox</h1>
          <p>Loading {activeTab}...</p>
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
            {featuredItems.map(item =>
              activeTab === 'projects' ? 
                <ProjectCard key={item.id} project={item} featured={true} isSandbox={true} /> :
                <WorkshopCard key={item.id} workshop={item} featured={true} isSandbox={true} />
            )}
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
            {displayItems.map(item =>
              activeTab === 'projects' ? 
                <ProjectCard key={item.id} project={item} /> :
                <WorkshopCard key={item.id} workshop={item} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TheSandbox;


