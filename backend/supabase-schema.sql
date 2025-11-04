-- ============================================
-- FULL CLEAN DEPLOY: SheffDataSoc Schema (Supabase)
-- WARNING: This will DROP existing tables and DATA
-- ============================================

-- 1) Drop everything
DROP TABLE IF EXISTS timeline_events CASCADE;
DROP TABLE IF EXISTS gallery_items CASCADE;
DROP TABLE IF EXISTS glossary CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS guides CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;

-- 2) Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3) Helper: updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- BLOG POSTS TABLE
-- ============================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  published_date DATE,
  excerpt TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_blog_posts_set_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  description TEXT,
  status TEXT DEFAULT 'upcoming',
  attendees INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_events_set_updated_at
BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  github_url TEXT,
  status TEXT DEFAULT 'active',
  members INTEGER DEFAULT 0,
  type TEXT DEFAULT 'project',
  tags TEXT[],
  demo_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_projects_set_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================
-- MEMBERS TABLE
-- ============================================
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  major TEXT,                     -- NEW COLUMN
  image_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  interests TEXT[],
  academic_year TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- GUIDES TABLE
-- ============================================
CREATE TABLE guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  category TEXT,
  difficulty TEXT DEFAULT 'beginner',
  tags TEXT[],
  author TEXT,
  read_time INTEGER,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_guides_set_updated_at
BEFORE UPDATE ON guides
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================
-- RESOURCES TABLE
-- ============================================
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT,
  description TEXT,
  tags TEXT[],
  category TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_resources_set_updated_at
BEFORE UPDATE ON resources
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================
-- GLOSSARY TABLE
-- ============================================
CREATE TABLE glossary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  category TEXT,
  examples TEXT,
  related_terms TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_glossary_set_updated_at
BEFORE UPDATE ON glossary
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================
-- GALLERY TABLE
-- ============================================
CREATE TABLE gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  event_name TEXT,
  event_date DATE,
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TIMELINE TABLE
-- ============================================
CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  event_year INTEGER NOT NULL,
  event_month INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_date ON blog_posts(published_date DESC);

CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_projects_featured ON projects(featured);

CREATE INDEX idx_guides_category ON guides(category);
CREATE INDEX idx_guides_difficulty ON guides(difficulty);
CREATE INDEX idx_guides_featured ON guides(featured);

CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_featured ON resources(featured);

CREATE INDEX idx_glossary_term ON glossary(term);

CREATE INDEX idx_timeline_event_year ON timeline_events(event_year DESC);

CREATE INDEX idx_members_academic_year ON members(academic_year);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE glossary ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PUBLIC READ POLICIES (allow SELECT)
-- ============================================
CREATE POLICY "Allow public read on blog_posts" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read on events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public read on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read on members" ON members FOR SELECT USING (true);
CREATE POLICY "Allow public read on guides" ON guides FOR SELECT USING (true);
CREATE POLICY "Allow public read on resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Allow public read on glossary" ON glossary FOR SELECT USING (true);
CREATE POLICY "Allow public read on gallery_items" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "Allow public read on timeline_events" ON timeline_events FOR SELECT USING (true);

-- ============================================
-- SAMPLE DATA
-- ============================================
INSERT INTO events (notion_id, title, event_date, location, description, status, attendees) VALUES
  ('event-1', 'Intro to ML Workshop', '2024-11-15 18:00:00+00', 'Diamond Building, Lecture Theatre 1', 'Hands-on workshop covering fundamentals of ML', 'upcoming', 45),
  ('event-2', 'Data Science Career Panel', '2024-11-20 17:30:00+00', 'Students'' Union, Conference Room', 'Hear from data science professionals', 'upcoming', 67),
  ('event-3', 'Kaggle Competition Night', '2024-11-10 19:00:00+00', 'The Diamond, Computer Room 4', 'Team up and tackle real-world data science problems', 'completed', 32)
ON CONFLICT (notion_id) DO NOTHING;

INSERT INTO timeline_events (notion_id, event_year, event_month, title, description, icon, category) VALUES
  ('timeline-1', 2024, 10, 'Website Launch', 'Launched our new website', '🚀', 'milestone'),
  ('timeline-2', 2024, 9, 'Partnership with DataCamp', 'Free premium access for members', '🤝', 'partnership'),
  ('timeline-3', 2024, 3, 'Won National Competition', '1st place at UK Data Science Challenge', '🏆', 'achievement')
ON CONFLICT (notion_id) DO NOTHING;

-- ============================================
-- Done
-- ============================================
