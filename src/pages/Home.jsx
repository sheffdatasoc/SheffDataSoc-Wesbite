import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Hero from '../components/Hero';
import Footer from '../components/Footer'; 
import AboutSection from '../components/AboutSection';
import HomeProjects from '../components/HomeProjects';
import './Home.css';

// Initialize Supabase
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// --- DISTINCT TEST IMAGES ---
const TEST_IMAGES = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop"
];

const FALLBACK_IMAGE = TEST_IMAGES[0];

function Home() {
  // --- HERO IMAGE LOGIC ---
  const [heroImages, setHeroImages] = useState(TEST_IMAGES);

  // --- PARTNERS LOGIC ---
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    async function fetchHeroImages() {
      try {
        const { data, error } = await supabase
          .from('gallery_items')
          .select('image_url')
          .order('event_date', { ascending: false })
          .limit(5);

        if (error) throw error;

        if (data) {
          const dbImages = data.map(item => item.image_url);
          const combinedImages = [...dbImages];

          // Ensure at least 3 images
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

    async function fetchPartners() {
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .eq('active', true)
          .order('tier', { ascending: true });

        if (error) throw error;

        if (data) {
          setPartners(data);
        }
      } catch (err) {
        console.error("Error fetching partners:", err.message);
      }
    }

    fetchHeroImages();
    fetchPartners();
  }, []);

  const stats = [
    { value: '100+', title: 'Members' },
    { value: '20+', title: 'Events/Year' },
    { value: '5+', title: 'Partners' }
  ];

  return (
    <div className="home-page">

      {/* 1. HERO SECTION */}
      <Hero 
        title="Sheffield's Data Science Community"
        subtitle="Join SheffDataSoc - where students passionate about data, AI, and analytics come together to learn, build, and grow."
        showButtons={true}
        showStats={true}
        stats={stats}
        showBadge={true}
        badgeText="The University of Sheffield"
        highlightWord="Data Science"
        images={heroImages}
        fallbackImage={FALLBACK_IMAGE}
        partners={partners}
      />

      {/* 2. ABOUT SECTION */}
      <AboutSection />

      {/* 3 PROJECTS SECTION*/}
      <HomeProjects />

      {/* 4. EVENTS PREVIEW */}
      <section className="events-preview">
        <h2>Upcoming Events</h2>
        <p>Workshops, talks, and networking events happening soon.</p>
      </section>

      {/* 5. SOCIAL PREVIEW */}
      <section className="social-preview">
        <h2>Follow Us on Social Media</h2>
        <p>Stay connected and see what we're up to!</p>
      </section>

      {/* 6. CONTACT + FOOTER */}
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