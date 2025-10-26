-- ============================================
-- SheffDataSoc Complete Database Schema
-- For Supabase PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- BLOG POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
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

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  description TEXT,
  status TEXT DEFAULT 'upcoming',
  attendees INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PROJECTS TABLE (includes workshops)
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  github_url TEXT,
  status TEXT DEFAULT 'active',
  members INTEGER DEFAULT 0,
  type TEXT DEFAULT 'project', -- 'project' or 'workshop'
  tags TEXT[],
  demo_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  image_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- GUIDES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  category TEXT, -- 'python', 'ml', 'data-viz', 'statistics', 'tools'
  difficulty TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  tags TEXT[],
  author TEXT,
  read_time INTEGER, -- in minutes
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- RESOURCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT, -- 'dataset', 'tool', 'course', 'book', 'article', 'video'
  description TEXT,
  tags TEXT[],
  category TEXT, -- 'learning', 'tools', 'datasets', 'research'
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- GLOSSARY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS glossary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  category TEXT, -- 'ml', 'statistics', 'programming', 'data-engineering'
  examples TEXT,
  related_terms TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- GALLERY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  event_name TEXT,
  date DATE,
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TIMELINE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id TEXT UNIQUE NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- emoji or icon name
  category TEXT, -- 'milestone', 'event', 'achievement', 'partnership'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_date ON blog_posts(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_guides_category ON guides(category);
CREATE INDEX IF NOT EXISTS idx_guides_difficulty ON guides(difficulty);
CREATE INDEX IF NOT EXISTS idx_guides_featured ON guides(featured);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_featured ON resources(featured);
CREATE INDEX IF NOT EXISTS idx_glossary_term ON glossary(term);
CREATE INDEX IF NOT EXISTS idx_timeline_year ON timeline_events(year DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
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
-- PUBLIC READ ACCESS POLICIES
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
-- SAMPLE DATA - BLOG POSTS
-- ============================================
INSERT INTO blog_posts (notion_id, title, author, published_date, excerpt, status) VALUES
  ('blog-1', 'How Our Members Won the National Data Science Challenge', 'Sarah Chen', '2024-11-05', 'Read about how our team developed an innovative solution for predicting housing prices using ensemble methods and feature engineering techniques.', 'published'),
  ('blog-2', 'Getting Started with Natural Language Processing', 'James Wilson', '2024-10-28', 'A beginner''s guide to NLP covering tokenization, sentiment analysis, and building your first chatbot with Python.', 'published'),
  ('blog-3', 'Welcome to SheffDataSoc 2024/25!', 'Committee Team', '2024-10-15', 'Meet your new committee and discover what we have planned for this academic year. Exciting workshops, competitions, and networking events await!', 'published')
ON CONFLICT (notion_id) DO NOTHING;

-- ============================================
-- SAMPLE DATA - EVENTS
-- ============================================
INSERT INTO events (notion_id, title, date, location, description, status, attendees) VALUES
  ('event-1', 'Introduction to Machine Learning Workshop', '2024-11-15 18:00:00+00', 'Diamond Building, Lecture Theatre 1', 'Join us for a hands-on workshop covering the fundamentals of machine learning. We''ll explore supervised and unsupervised learning with practical Python examples.', 'upcoming', 45),
  ('event-2', 'Data Science Career Panel', '2024-11-20 17:30:00+00', 'Students'' Union, Conference Room', 'Hear from data science professionals working at top companies. Learn about career paths, interview tips, and industry insights.', 'upcoming', 67),
  ('event-3', 'Kaggle Competition Night', '2024-11-10 19:00:00+00', 'The Diamond, Computer Room 4', 'Team up and tackle real-world data science problems! Pizza and prizes for the winning teams.', 'completed', 32)
ON CONFLICT (notion_id) DO NOTHING;

-- ============================================
-- SAMPLE DATA - PROJECTS & WORKSHOPS
-- ============================================
INSERT INTO projects (notion_id, title, description, github_url, status, members, type, tags, demo_url, featured) VALUES
  ('project-1', 'Sheffield Crime Analysis Dashboard', 'Interactive dashboard analyzing crime patterns across Sheffield using police API data. Built with Python, Plotly, and Streamlit.', 'https://github.com/sheffdatasoc/crime-analysis', 'active', 5, 'project', ARRAY['Python', 'Plotly', 'API'], NULL, false),
  ('project-2', 'Student Sentiment Analysis Tool', 'NLP project that analyzes student feedback and reviews to identify common themes and sentiment trends.', 'https://github.com/sheffdatasoc/sentiment-tool', 'completed', 3, 'project', ARRAY['NLP', 'BERT', 'Flask'], NULL, false),
  ('project-3', 'ML Model Deployment Pipeline', 'End-to-end MLOps pipeline for training, versioning, and deploying machine learning models to production.', 'https://github.com/sheffdatasoc/ml-pipeline', 'active', 7, 'project', ARRAY['MLOps', 'Docker', 'FastAPI'], NULL, false),
  ('workshop-1', 'Society Website', 'Our open-source society website built with modern web technologies. Contributions welcome!', 'https://github.com/sheffdatasoc/website', 'active', 8, 'workshop', ARRAY['React', 'Node.js', 'Supabase'], 'https://sheffdatasoc.com', true),
  ('workshop-2', 'Data Analytics Dashboard', 'Interactive dashboard for analyzing society event attendance and engagement metrics', 'https://github.com/sheffdatasoc/analytics', 'completed', 5, 'workshop', ARRAY['Python', 'Pandas', 'Plotly', 'Streamlit'], NULL, true),
  ('workshop-3', 'Introduction to Pandas', 'Beginner-friendly workshop materials for learning data manipulation with Pandas', 'https://github.com/sheffdatasoc/pandas-workshop', 'completed', 3, 'workshop', ARRAY['Python', 'Pandas', 'Jupyter'], NULL, false)
ON CONFLICT (notion_id) DO NOTHING;

-- ============================================
-- SAMPLE DATA - MEMBERS
-- ============================================
INSERT INTO members (notion_id, name, role, bio) VALUES
  ('member-1', 'Sarah Chen', 'President', 'Final year Computer Science student passionate about ML and AI.'),
  ('member-2', 'James Wilson', 'Vice President', 'Loves data visualization and building interactive dashboards.'),
  ('member-3', 'Emily Foster', 'Events Coordinator', 'Organizing amazing workshops and networking events!')
ON CONFLICT (notion_id) DO NOTHING;

-- ============================================
-- SAMPLE DATA - GUIDES
-- ============================================
INSERT INTO guides (notion_id, title, description, content, category, difficulty, tags, author, read_time, featured) VALUES
  ('guide-1', 'Getting Started with Pandas', 'Learn the basics of data manipulation with Pandas library', 'Introduction to DataFrames, Series, and basic operations...', 'python', 'beginner', ARRAY['pandas', 'python', 'data-analysis'], 'Sarah Chen', 15, true),
  ('guide-2', 'Machine Learning Model Deployment', 'Deploy your ML models to production with FastAPI', 'Step-by-step guide to deploying models...', 'ml', 'advanced', ARRAY['mlops', 'fastapi', 'deployment'], 'James Wilson', 30, true),
  ('guide-3', 'Data Visualization with Plotly', 'Create interactive visualizations for your projects', 'Learn to build dashboards and charts...', 'data-viz', 'intermediate', ARRAY['plotly', 'visualization', 'python'], 'Emily Foster', 20, false),
  ('guide-4', 'SQL for Data Scientists', 'Master SQL queries for data analysis', 'Essential SQL techniques and best practices...', 'tools', 'beginner', ARRAY['sql', 'databases', 'querying'], 'Alex Kumar', 25, false)
ON CONFLICT (notion_id) DO NOTHING;

-- ============================================
-- SAMPLE DATA - RESOURCES
-- ============================================
INSERT INTO resources (notion_id, title, url, type, description, category, tags, featured) VALUES
  ('resource-1', 'Kaggle Datasets', 'https://www.kaggle.com/datasets', 'dataset', 'Thousands of free datasets for practice and competitions', 'datasets', ARRAY['datasets', 'kaggle', 'practice'], true),
  ('resource-2', 'Fast.ai Course', 'https://course.fast.ai/', 'course', 'Practical deep learning for coders - completely free', 'learning', ARRAY['deep-learning', 'course', 'free'], true),
  ('resource-3', 'Python Data Science Handbook', 'https://jakevdp.github.io/PythonDataScienceHandbook/', 'book', 'Comprehensive guide to data science in Python', 'learning', ARRAY['python', 'book', 'reference'], true),
  ('resource-4', 'Google Colab', 'https://colab.research.google.com/', 'tool', 'Free Jupyter notebooks with GPU support', 'tools', ARRAY['jupyter', 'gpu', 'cloud'], false),
  ('resource-5', 'Papers with Code', 'https://paperswithcode.com/', 'article', 'Latest ML research papers with implementation code', 'research', ARRAY['research', 'papers', 'code'], false),
  ('resource-6', 'Hugging Face', 'https://huggingface.co/', 'tool', 'Pre-trained models and datasets for NLP and ML', 'tools', ARRAY['nlp', 'models', 'transformers'], false)
ON CONFLICT (notion_id) DO NOTHING;

-- ============================================
-- SAMPLE DATA - GLOSSARY
-- ============================================
INSERT INTO glossary (notion_id, term, definition, category, examples, related_terms) VALUES
  ('glossary-1', 'Neural Network', 'A computational model inspired by biological neural networks, consisting of interconnected nodes (neurons) organized in layers that process information.', 'ml', 'Common architectures: CNN (Convolutional Neural Network), RNN (Recurrent Neural Network), Transformer', ARRAY['Deep Learning', 'Backpropagation', 'Activation Function']),
  ('glossary-2', 'Overfitting', 'When a model learns the training data too well, including noise and outliers, resulting in poor performance on new, unseen data.', 'ml', 'A model with 100% training accuracy but 60% test accuracy is likely overfitting', ARRAY['Underfitting', 'Regularization', 'Cross-Validation']),
  ('glossary-3', 'DataFrame', 'A two-dimensional labeled data structure in pandas, similar to a spreadsheet or SQL table, with rows and columns.', 'programming', 'df = pd.DataFrame({''A'': [1, 2, 3], ''B'': [4, 5, 6]})', ARRAY['Pandas', 'Series', 'NumPy']),
  ('glossary-4', 'Gradient Descent', 'An optimization algorithm that iteratively adjusts model parameters to minimize a loss function by moving in the direction of steepest descent.', 'ml', 'Used to train neural networks by updating weights based on the gradient of the loss', ARRAY['Backpropagation', 'Learning Rate', 'Optimization']),
  ('glossary-5', 'P-value', 'The probability of obtaining results at least as extreme as observed, assuming the null hypothesis is true. Used in hypothesis testing.', 'statistics', 'p < 0.05 typically indicates statistical significance', ARRAY['Hypothesis Testing', 'Significance Level', 'Null Hypothesis'])
ON CONFLICT (notion_id) DO NOTHING;

-- ============================================
-- SAMPLE DATA - GALLERY
-- ============================================
INSERT INTO gallery_items (notion_id, title, image_url, event_name, date, description, tags) VALUES
  ('gallery-1', 'Hackathon 2024 Winners', 'https://via.placeholder.com/800x600/667eea/ffffff?text=Hackathon+Winners', 'Annual Data Science Hackathon', '2024-03-15', 'Our winning team with their innovative healthcare prediction model', ARRAY['hackathon', 'competition', 'team']),
  ('gallery-2', 'ML Workshop Series', 'https://via.placeholder.com/800x600/764ba2/ffffff?text=ML+Workshop', 'Introduction to Machine Learning', '2024-02-20', 'Packed lecture theatre for our beginner-friendly ML workshop', ARRAY['workshop', 'learning', 'ml']),
  ('gallery-3', 'Industry Visit to DeepMind', 'https://via.placeholder.com/800x600/06d6a0/ffffff?text=DeepMind+Visit', 'Company Visit', '2024-01-10', 'Members visiting DeepMind offices in London', ARRAY['industry', 'visit', 'networking']),
  ('gallery-4', 'Data Viz Competition', 'https://via.placeholder.com/800x600/ffd166/ffffff?text=Data+Viz', 'Best Visualization Contest', '2023-12-05', 'Creative and beautiful data visualizations from our members', ARRAY['visualization', 'competition', 'creative'])
ON CONFLICT (notion_id) DO NOTHING;

-- ============================================
-- SAMPLE DATA - TIMELINE
-- ============================================
INSERT INTO timeline_events (notion_id, year, month, title, description, icon, category) VALUES
  ('timeline-1', 2024, 10, 'Website Launch', 'Launched our new website with Notion CMS integration', '🚀', 'milestone'),
  ('timeline-2', 2024, 9, 'Partnership with DataCamp', 'Secured partnership providing free premium access to all members', '🤝', 'partnership'),
  ('timeline-3', 2024, 3, 'Won National Competition', 'First place at UK Data Science Challenge with healthcare ML project', '🏆', 'achievement'),
  ('timeline-4', 2023, 10, 'Society Relaunch', 'Relaunched the society with 150+ founding members', '🎉', 'milestone'),
  ('timeline-5', 2023, 1, 'First Workshop', 'Inaugural Python for Data Science workshop with 50 attendees', '📚', 'event'),
  ('timeline-6', 2022, 9, 'Society Founded', 'Sheffield Data Science Society officially founded', '⭐', 'milestone')
ON CONFLICT (notion_id) DO NOTHING;

-- ============================================
-- COMPLETE!
-- ============================================
-- Schema created successfully
-- Run this script in Supabase SQL Editor
-- All tables, indexes, RLS policies, and sample data included