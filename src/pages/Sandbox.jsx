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


  const filterItems = (items) => {
    if (!searchQuery) return items;
    return items.filter(item =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };


  const sortItems = (items) => {
    return [...items].sort((a, b) => {
      // 1️⃣ Featured items first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      // 2️⃣ Workshops (or any item with dates): newest → oldest
      if (a.date && b.date) {
        return new Date(b.date) - new Date(a.date);
      }

      // 3️⃣ No date → leave original order
      return 0;
    });
  };


  // Apply filter + sort to either projects or workshops
  const baseItems = activeTab === 'projects' ? (projects || []) : (workshops || []);
  const filtered = filterItems(baseItems);
  const sorted = sortItems(filtered);


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


      {/* UNIFIED LIST — FEATURED FIRST */}
      <div className="sandbox-content">
        {sorted.length === 0 ? (
          <div className="empty-state">
            <p>No {activeTab} found {searchQuery && `matching "${searchQuery}"`}</p>
          </div>
        ) : (
          <div className="projects-grid">
            {sorted.map(item =>
              activeTab === 'projects' ? (
                <ProjectCard
                  key={item.id}
                  project={item}
                  featured={item.featured}
                  isSandbox={true}
                />
              ) : (
                <WorkshopCard
                  key={item.id}
                  workshop={item}
                  featured={item.featured}
                  isSandbox={true}
                />
              )
            )}
          </div>
        )}
      </div>


    </div>
  );
}


export default TheSandbox;



