import React from 'react';
import Hero from '../components/Hero';
import StatCard from '../components/StatCard';

function Home() {
  return (
    <div className="home-page">
      <Hero />
      
      <section className="stats-section">
        <h2>Our Impact</h2>
        <div className="stats-grid">
          <StatCard title="Members" value="150+" />
          <StatCard title="Events" value="30+" />
          <StatCard title="Projects" value="20+" />
          <StatCard title="Partners" value="10+" />
        </div>
      </section>

      <section className="about-preview">
        <h2>Welcome to Sheffield Data Science Society</h2>
        <p>
          We're a community of students passionate about data science, machine learning, 
          and artificial intelligence. Join us for workshops, projects, and networking events!
        </p>
      </section>
    </div>
  );
}

export default Home;