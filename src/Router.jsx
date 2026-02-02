import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Members = lazy(() => import('./pages/Members'));
const About = lazy(() => import('./pages/About'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Guides = lazy(() => import('./pages/Guides'));
const GuideDetail = lazy(() => import('./pages/GuideDetail'));
const Glossary = lazy(() => import('./pages/Glossary'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Resources = lazy(() => import('./pages/Resources'));
const Sandbox = lazy(() => import('./pages/Sandbox'));

// Simple loading component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    fontSize: '1.2rem',
    color: '#666'
  }}>
    Loading...
  </div>
);

function AppRouter() {
  return (
    <Router>
      <App>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/guides/:id" element={<GuideDetail />} />
            <Route path="/members" element={<Members />} />
            <Route path="/about" element={<About />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/sandbox" element={<Sandbox />} />
          </Routes>
        </Suspense>
      </App>
    </Router>
  );
}

export default AppRouter;