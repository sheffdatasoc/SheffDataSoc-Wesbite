-- ============================================
-- SHEFFIELD DATA SOCIETY - COMPLETE SCHEMA
-- Fresh Install Script (Run on new Supabase project)
-- ============================================
-- WARNING: This will DROP existing tables and DATA
-- Only use for fresh installations or full resets
-- ============================================

-- ============================================
-- 0. DROP EVERYTHING (Clean slate)
-- ============================================
DROP TABLE IF EXISTS timeline_events CASCADE;
DROP TABLE IF EXISTS gallery_items CASCADE;
DROP TABLE IF EXISTS glossary CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS guides CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;

-- ============================================
-- 1. ENABLE EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. HELPER FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 3. BLOG POSTS TABLE
-- ============================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  published_date DATE,
  excerpt TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  image TEXT,
  slug TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_blog_posts_set_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_date ON blog_posts(published_date DESC);
CREATE UNIQUE INDEX idx_blog_posts_slug ON blog_posts(slug) WHERE slug IS NOT NULL;
CREATE INDEX idx_blog_posts_with_image ON blog_posts(id) WHERE image IS NOT NULL;

-- ============================================
-- 4. EVENTS TABLE
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  attendees INTEGER DEFAULT 0 CHECK (attendees >= 0),
  max_attendees INTEGER CHECK (max_attendees IS NULL OR max_attendees > 0),
  image_url TEXT,
  category TEXT,
  registration_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT events_capacity_check CHECK (max_attendees IS NULL OR attendees <= max_attendees),
  CONSTRAINT events_date_order CHECK (end_date IS NULL OR end_date >= date)
);

CREATE TRIGGER trg_events_set_updated_at
BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_status_date ON events(status, date);
CREATE INDEX idx_events_featured ON events(is_featured) WHERE is_featured = true;

-- ============================================
-- 5. PROJECTS TABLE
-- ============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  github_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived', 'on-hold')),
  members INTEGER DEFAULT 0 CHECK (members >= 0),
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

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_type_status ON projects(type, status);
CREATE INDEX idx_projects_tags_gin ON projects USING GIN(tags);

-- ============================================
-- 6. MEMBERS TABLE
-- ============================================
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  major TEXT,
  image_url TEXT,
  github_url TEXT CHECK (github_url IS NULL OR github_url ~* '^https?://github\.com/'),
  linkedin_url TEXT CHECK (linkedin_url IS NULL OR linkedin_url ~* '^https?://(www\.)?linkedin\.com/'),
  interests TEXT[],
  academic_year TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_members_academic_year ON members(academic_year);
CREATE INDEX idx_members_interests_gin ON members USING GIN(interests);

-- ============================================
-- 7. GUIDES TABLE
-- ============================================
CREATE TABLE guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  category TEXT,
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  tags TEXT[],
  author TEXT,
  read_time INTEGER CHECK (read_time IS NULL OR read_time > 0),
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_guides_set_updated_at
BEFORE UPDATE ON guides
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_guides_category ON guides(category);
CREATE INDEX idx_guides_difficulty ON guides(difficulty);
CREATE INDEX idx_guides_featured ON guides(featured);
CREATE INDEX idx_guides_tags_gin ON guides USING GIN(tags);

-- ============================================
-- 8. RESOURCES TABLE
-- ============================================
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL CHECK (url ~* '^https?://'),
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

CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_featured ON resources(featured);
CREATE INDEX idx_resources_tags_gin ON resources USING GIN(tags);

-- ============================================
-- 9. GLOSSARY TABLE
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

CREATE INDEX idx_glossary_term ON glossary(term);
CREATE UNIQUE INDEX idx_glossary_term_unique ON glossary(LOWER(term));
CREATE INDEX idx_glossary_related_terms_gin ON glossary USING GIN(related_terms);

-- ============================================
-- 10. GALLERY TABLE
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

CREATE INDEX idx_gallery_tags_gin ON gallery_items USING GIN(tags);

-- ============================================
-- 11. TIMELINE TABLE
-- ============================================
CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  event_year INTEGER NOT NULL CHECK (event_year >= 2020 AND event_year <= 2100),
  event_month INTEGER CHECK (event_month IS NULL OR (event_month >= 1 AND event_month <= 12)),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_timeline_event_year ON timeline_events(event_year DESC);

-- ============================================
-- 12. ROW LEVEL SECURITY
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
-- 13. PUBLIC READ POLICIES
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
-- 14. SAMPLE DATA
-- ============================================
INSERT INTO events (notion_id, title, date, location, description, status, attendees, max_attendees) VALUES
  ('event-1', 'Intro to ML Workshop', '2024-11-15 18:00:00+00', 'Diamond Building, Lecture Theatre 1', 'Hands-on workshop covering fundamentals of ML', 'upcoming', 45, 50),
  ('event-2', 'Data Science Career Panel', '2024-11-20 17:30:00+00', 'Students'' Union, Conference Room', 'Hear from data science professionals', 'upcoming', 67, 80),
  ('event-3', 'Kaggle Competition Night', '2024-11-10 19:00:00+00', 'The Diamond, Computer Room 4', 'Team up and tackle real-world data science problems', 'completed', 32, 40)
ON CONFLICT (notion_id) DO NOTHING;

INSERT INTO timeline_events (notion_id, event_year, event_month, title, description, icon, category) VALUES
  ('timeline-1', 2024, 10, 'Website Launch', 'Launched our new website', '🚀', 'milestone'),
  ('timeline-2', 2024, 9, 'Partnership with DataCamp', 'Free premium access for members', '🤝', 'partnership'),
  ('timeline-3', 2024, 3, 'Won National Competition', '1st place at UK Data Science Challenge', '🏆', 'achievement')
ON CONFLICT (notion_id) DO NOTHING;

-- ============================================
-- 15. VERIFICATION
-- ============================================
-- Uncomment to verify tables were created correctly:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'events' ORDER BY ordinal_position;

-- ============================================
-- DONE - Ready to use!
-- ============================================