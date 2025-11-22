import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Hero from '../components/Hero';
import Footer from '../components/Footer'; 
import AboutSection from '../components/AboutSection';
import './Home.css';

// Initialize Supabase
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// --- DISTINCT TEST IMAGES ---
const TEST_IMAGES = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop", // Group/Collab
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop", // Data/Code
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop"  // Workshop/Uni
];

const FALLBACK_IMAGE = TEST_IMAGES[0];

function Home() {
  // --- HERO IMAGE LOGIC ---
  const [heroImages, setHeroImages] = useState(TEST_IMAGES);

  useEffect(() => {
    async function fetchHeroImages() {
      try {
        const { data, error } = await supabase
          .from('gallery_items')
          .select('image_url') 
          .order('event_date', { ascending: false })
          .limit(5);

        if (error) throw error;

        // Smart Merge: Ensure we always have at least 3 distinct images
        if (data) {
          const dbImages = data.map(item => item.image_url);
          const combinedImages = [...dbImages];
          
          // Fill gaps with Test Images if DB has fewer than 3
          let i = 0;
          while (combinedImages.length < 3) {
            combinedImages.push(TEST_IMAGES[i % TEST_IMAGES.length]);
            i++;
          }
          setHeroImages(combinedImages);
        }
      } catch (err) {
        console.error("Error fetching images:", err.message);
      }
    }
    fetchHeroImages();
  }, []);

  const stats = [
    { value: '300+', title: 'Members' },
    { value: '40+', title: 'Events/Year' },
    { value: '15+', title: 'Partners' }
  ];

  return (
    <div className="home-page">
      
      {/* 1. HERO SECTION (Updated with Carousel Logic) */}
      <Hero 
        title="Sheffield's Data Science Community"
        subtitle="Join SheffDataSoc - where students passionate about data, AI, and analytics come together to learn, build, and grow."
        showButtons={true}
        showStats={true}
        stats={stats}
        showBadge={true}
        badgeText="University of Sheffield"
        highlightWord="Data Science"
        images={heroImages} 
        fallbackImage={FALLBACK_IMAGE}
      />

      {/* 2. ABOUT SECTION (Component) */}
      <AboutSection />

      {/* 3. PROJECTS PREVIEW (Restored from old commit) */}
      <section className="projects-preview">
        <h2>Our Projects</h2>
        <p>Check out some of the data science projects our members are working on.</p>
      </section>

      {/* 4. EVENTS PREVIEW (Restored from old commit) */}
      <section className="events-preview">
        <h2>Upcoming Events</h2>
        <p>Workshops, talks, and networking events happening soon.</p>
      </section>

      {/* 5. SOCIAL PREVIEW (Restored from old commit) */}
      <section className="social-preview">
        <h2>Follow Us on Social Media</h2>
        <p>Stay connected and see what we’re up to!</p>
      </section>

      {/* 6. CONTACT & FOOTER (Restored Split Layout) */}
      <section className="contact-preview">
        <div className="contact-content">
          <h2>Contact Us</h2>
          <p>Reach out if you want to join or collaborate!</p>
        </div>
        <div className="footer-content">
          <Footer />
        </div>
      </section>

    </div>
  );
}

export default Home;