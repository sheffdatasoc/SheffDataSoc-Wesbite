import React from 'react';
import Hero from '../components/Hero';
import './Home.css';

function Home() {
  const stats = [
    { value: '300+', title: 'Members' },
    { value: '40+', title: 'Events/Year' },
    { value: '15+', title: 'Partners' }
  ];

  return (
    <div className="home-page">
      <Hero 
        title="Sheffield's Data Science Community"
        subtitle="Join SheffDataSoc - where students passionate about data, AI, and analytics come together to learn, build, and grow."
        showButtons={true}
        showStats={true}
        stats={stats}
        showBadge={true}
        badgeText="University of Sheffield"
        highlightWord="Data Science"
      />

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