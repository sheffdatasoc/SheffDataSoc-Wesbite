import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './HomeProjects.css';

// Simple preview card for projects
function ProjectPreviewCard({ project }) {
  return (
    <div className="preview-card">
      <h3 className="preview-title">{project.title}</h3>
      <p className="preview-description">{project.description}</p>
      {project.tags && project.tags.length > 0 && (
        <div className="preview-tags">
          {project.tags.map((tag, index) => (
            <span key={index} className="preview-tag">{tag}</span>
          ))}
        </div>
      )}
      {project.technologies && project.technologies.length > 0 && !project.tags && (
        <div className="preview-tags">
          {project.technologies.map((tag, index) => (
            <span key={index} className="preview-tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// Simple preview card for workshops
function WorkshopPreviewCard({ workshop }) {
  return (
    <div className="preview-card">
      <h3 className="preview-title">{workshop.title}</h3>
      <p className="preview-description">{workshop.description}</p>
      {workshop.tags && workshop.tags.length > 0 && (
        <div className="preview-tags">
          {workshop.tags.map((tag, index) => (
            <span key={index} className="preview-tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function HomeProjects() {
  const [projects, setProjects] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        // Fetch latest 3 projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (projectsError) throw projectsError;

        // Fetch latest 3 workshops
        const { data: workshopsData, error: workshopsError } = await supabase
          .from('workshops')
          .select('*')
          .order('date', { ascending: false })
          .limit(3);

        if (workshopsError) throw workshopsError;

        setProjects(projectsData || []);
        setWorkshops(workshopsData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="home-projects">
        <div className="projects-container">
          <h2 className="projects-title">Our Projects & Workshops</h2>
          <p className="projects-subtitle">Loading...</p>
        </div>
      </section>
    );
  }

  const hasContent = projects.length > 0 || workshops.length > 0;

  return (
    <section className="home-projects">
      <div className="projects-container">
        <h2 className="projects-title">Our Projects & Workshops</h2>
        <p className="projects-subtitle">
          Check out the latest data science projects and workshops our members are working on.
        </p>

        {!hasContent ? (
          <div className="empty-state">
            <p>No projects or workshops available yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Projects Section */}
            {projects.length > 0 && (
              <div className="content-section">
                <h3 className="section-subtitle">Latest Projects</h3>
                <div className="projects-grid">
                  {projects.map((project) => (
                    <ProjectPreviewCard
                      key={project.id}
                      project={project}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Workshops Section */}
            {workshops.length > 0 && (
              <div className="content-section">
                <h3 className="section-subtitle">Latest Workshops</h3>
                <div className="projects-grid">
                  {workshops.map((workshop) => (
                    <WorkshopPreviewCard
                      key={workshop.id}
                      workshop={workshop}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="projects-buttons">
          <a
            href="/sandbox"
            className="btn btn-primary"
          >
            View All Projects & Workshops →
          </a>
          <a href="/sandbox#propose-idea" className="btn btn-secondary">Submit your idea</a>
        </div>

        <div className="projects-footer-text">
          <p>New projects and workshops are launched each semester based on member interests.</p>
          <p>Have an idea? We'd love to hear from you!</p>
        </div>
      </div>
    </section>
  );
}

export default HomeProjects;