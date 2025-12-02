import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowUp } from 'lucide-react';
import Hero from '../components/Hero';
import Footer from '../components/Footer'; 
import AboutSection from '../components/AboutSection';
import HomeProjects from '../components/HomeProjects';
import HomeEvents from '../components/HomeEvents';
import HomeSocial from '../components/HomeSocial';
import NewsletterSignup from '../components/NewsletterSignup';
import HomeContact from '../components/HomeContact';
import './Home.css';
import useSectionFadeIn from '../hooks/useSectionFadeIn';

// Initialize Supabase
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const TEST_IMAGES = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop"
];
const FALLBACK_IMAGE = TEST_IMAGES[0];

function Home() {
  useSectionFadeIn();
  
  const [heroImages, setHeroImages] = useState(TEST_IMAGES);
  const [partners, setPartners] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll listener with mobile/desktop detection
  useEffect(() => {
    const homePageElement = document.querySelector('.home-page');
    const isMobile = window.matchMedia("(max-width: 1024px)").matches;

    const handleScroll = () => {
      const scrollTop = isMobile
        ? window.pageYOffset
        : homePageElement?.scrollTop || 0;

      setShowScrollTop(scrollTop > 400);
    };

    const target = isMobile ? window : homePageElement;

    if (target) {
      target.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
    }

    return () => {
      if (target) target.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const homePageElement = document.querySelector('.home-page');
    const isMobile = window.matchMedia("(max-width: 1024px)").matches;

    if (!isMobile && homePageElement) {
      homePageElement.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Fetch data
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

          while (combinedImages.length < 3) {
            combinedImages.push(TEST_IMAGES[combinedImages.length % TEST_IMAGES.length]);
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
        if (data) setPartners(data);
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
      {/* Scroll to Top Button */}
      <button
        className={`scroll-to-top-btn ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} />
      </button>

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

      {/* 3. PROJECTS SECTION */}
      <HomeProjects />

      {/* 4. EVENTS PREVIEW */}
      <HomeEvents />

      {/* 5. SOCIAL PREVIEW */}
      <HomeSocial />

      {/* 5. NEWSLETTER SIGNUP */}
      <NewsletterSignup />

      {/* 6. CONTACT + FOOTER */}
      <HomeContact />

      <div className="footer-content">
        <Footer />
      </div>
    </div>
  );
}

export default Home;
