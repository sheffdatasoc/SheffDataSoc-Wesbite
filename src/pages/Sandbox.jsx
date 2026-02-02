// /pages/Sandbox.jsx
import React, { useState, useEffect } from 'react'; // 1. Import useEffect
import { useLocation } from 'react-router-dom';     // 2. Import useLocation
import ProjectCard from '../components/ProjectCard';
import WorkshopCard from '../components/WorkshopCard';
import { useProjects, useWorkshops } from '../hooks/useSupabase';
import { Search, GitBranch, Code2 } from 'lucide-react';
import SandboxCTA from "../components/SandboxCTA";
import './Sandbox.css';

function TheSandbox() {
  const { projects, loading: loadingProjects } = useProjects();
  const { workshops, loading: loadingWorkshops } = useWorkshops();
  
  // 3. Get the location hook
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');

  // Determine overall loading state
  const loading = activeTab === 'projects' ? loadingProjects : loadingWorkshops;

  // ---------------------------------------------------------
  // 4. THE MAGIC SCROLL FIX
  // This waits for 'loading' to finish, then checks for the #hash
  // ---------------------------------------------------------
  useEffect(() => {
    // Only run this if we are done loading AND there is a hash (like #propose-idea)
    if (!loading && location.hash) {
      const id = location.hash.replace('#', '');
      
      // We use a small timeout to ensure the DOM has fully painted
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300); // 300ms delay is usually safe
    }
  }, [loading, location]); // Run whenever loading finishes or URL changes


  const filterItems = (items) => {
    if (!searchQuery) return items;
    return items.filter(item =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const sortItems = (items) => {
    return [...items].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.date && b.date) {
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });
  };

  const baseItems = activeTab === 'projects' ? (projects || []) : (workshops || []);
  const filtered = filterItems(baseItems);
  const sorted = sortItems(filtered);

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
      {/* HERO */}
      <div className="sandbox-hero">
        <span className="hero-badge">💻 Learn by Building</span>
        <h1>The Sandbox</h1>
        <p>
          Explore our community projects and workshop materials – all open source and connected to GitHub
        </p>
      </div>

      {/* SEARCH BAR */}
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

      {/* TABS */}
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

      {/* CONTENT */}
      <div className="sandbox-content">
        {sorted.length === 0 ? (
          <div className="empty-state">
            <p>No {activeTab} found {searchQuery && `matching "${searchQuery}"`}</p>
          </div>
        ) : activeTab === 'projects' ? (
          <div className="projects-grid">
            {sorted.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                featured={project.featured}
                isSandbox={true}
              />
            ))}
          </div>
        ) : (
          <div className="workshops-grid">
            {sorted.map(workshop => (
              <WorkshopCard
                key={workshop.id}
                workshop={workshop}
                featured={workshop.featured}
                isSandbox={true}
              />
            ))}
          </div>
        )}

        {/* 
        
        */}
        <div className="sandbox-cta-wrapper">
          <SandboxCTA />
        </div>
        
      </div>
    </div>
  );
}

export default TheSandbox;