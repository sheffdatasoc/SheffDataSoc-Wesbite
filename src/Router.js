import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Members from './pages/Members';
import About from './pages/About';
import Timeline from './pages/Timeline';
import Guides from './pages/Guides';
import GuideDetail from './pages/GuideDetail';
import Glossary from './pages/Glossary';
import Gallery from './pages/Gallery';
import Resources from './pages/Resources';
import Sandbox from './pages/Sandbox';

function AppRouter() {
  return (
    <Router>
      <App>
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
      </App>
    </Router>
  );
}

export default AppRouter;