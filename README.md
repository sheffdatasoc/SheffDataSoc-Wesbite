<<<<<<< HEAD
# SheffDataSoc Wesbite

## 📋 Understanding the Architecture

```
┌─────────────────────────────────────────────────┐
│  NOTION (The CMS)                              │
│  - Blog posts, events, projects                 │
│  - Edited by committee members                  │
└─────────────────┬───────────────────────────────┘
                  │
                  │ backend/syncNotion.js
                  │ (Syncs data every hour)
                  ▼
┌─────────────────────────────────────────────────┐
│  SUPABASE (PostgreSQL Database)                 │
│  - Tables: blog_posts, events, projects         │
│  - Persistent data storage                      │
└─────────────────┬───────────────────────────────┘
                  │
                  │ src/lib/supabase.js
                  │ (Connection & helpers)
                  ▼
┌─────────────────────────────────────────────────┐
│  REACT HOOKS (src/hooks/useSupabase.js)         │
│  - useBlogPosts(), useEvents(), useProjects()   │
│  - Handles loading states & errors              │
└─────────────────┬───────────────────────────────┘
                  │
                  │ Returns data to pages
                  ▼
┌─────────────────────────────────────────────────┐
│  PAGES (News.jsx, Events.jsx, TheSandbox.jsx)   │
│  - Receives data from hooks                     │
│  - Maps data to card components                 │
└─────────────────┬───────────────────────────────┘
                  │
                  │ Passes individual items
                  ▼
┌─────────────────────────────────────────────────┐
│  CARDS (BlogCard, EventCard, ProjectCard)       │
│  - Displays individual items                    │
│  - No data fetching logic                       │
└─────────────────────────────────────────────────┘
```

## 🚀 Step-by-Step Setup

### 1. Create Supabase Account
1. Go to https://supabase.com
2. Sign up with GitHub
3. Click "New Project"
4. Choose organization and project name: `sheffdatasoc`
5. Set database password (save this!)
6. Choose region: `Europe West (London)`
7. Wait 2-3 minutes for project to spin up

### 2. Run SQL Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire content from `supabase-schema.sql`
4. Paste and click **Run**
5. You should see "Success. No rows returned"

### 3. Verify Tables Created
1. Go to **Table Editor** in sidebar
2. You should see three tables:
   - `blog_posts` (with 3 sample rows)
   - `events` (with 3 sample rows)
   - `projects` (with 3 sample rows)

### 4. Get API Keys
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (for backend only)

### 5. Configure Environment Variables

**Frontend (.env.local):**
```bash
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Backend (.env):**
```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Notion (for later)
NOTION_TOKEN=secret_xxxxx
NOTION_BLOG_DB_ID=xxxxx
NOTION_EVENTS_DB_ID=xxxxx
NOTION_PROJECTS_DB_ID=xxxxx
```

### 6. Test Connection
```powershell
# Start your React app
npm start

# Visit http://localhost:3000/news
# You should see 3 blog posts from Supabase!
```

## 🎯 How Each Folder Works

### `src/lib/` - Third-party Integrations
**Purpose:** Connect to external services
- `supabase.js` - Supabase client + helper functions
- Think of it as your "database connection file"

**Example:**
```javascript
import { getBlogPosts } from '../lib/supabase';
const posts = await getBlogPosts(); // Fetches from database
```

### `src/hooks/` - Custom React Hooks
**Purpose:** Reusable data fetching logic with loading states
- `useSupabase.js` - Hooks for fetching data
- Handles loading, errors, and state management

**Example:**
```javascript
const { posts, loading, error } = useBlogPosts();
if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
return <div>{posts.map(...)}</div>;
```

### `src/entities/` - Data Models (Optional)
**Purpose:** Define structure and behavior of your data
- `BlogPost.js`, `Event.js`, `Project.js`
- Add validation, formatting, calculated fields
- Like TypeScript interfaces but in JavaScript

**Example:**
```javascript
const post = new BlogPost(data);
post.isPublished(); // true/false
post.getFormattedDate(); // "5 November 2024"
```

## 📊 Data Flow Example

### Without Supabase (Current Mock Data):
```javascript
// News.jsx
const mockPosts = [{...}, {...}]; // Hard-coded
return <BlogCard post={post} />;
```

### With Supabase (Real Database):
```javascript
// News.jsx
const { posts, loading, error } = useBlogPosts(); // From database!
if (loading) return <div>Loading...</div>;
return posts.map(post => <BlogCard post={post} />);
```

## 🔄 Complete Flow in Action

1. **Committee edits blog post in Notion**
2. **Backend sync runs** (every hour via `syncNotion.js`)
   - Fetches from Notion API
   - Writes to Supabase database
3. **User visits website**
4. **React app loads** (`News.jsx`)
5. **Custom hook fetches data** (`useBlogPosts()`)
   - Calls `getBlogPosts()` from `lib/supabase.js`
   - Returns data + loading state
6. **Component renders** with real data
7. **Cards display** the blog posts

## 🛠️ Testing Your Setup

```powershell
# 1. Check environment variables are loaded
npm start
# Open browser console, check for Supabase warnings

# 2. Test Supabase connection
# Visit http://localhost:3000/news
# Open browser console, check for errors

# 3. Verify data is from database
# Go to Supabase dashboard
# Edit a blog post title
# Refresh your website - title should update!
```

## 🐛 Troubleshooting

### "Supabase not configured, returning empty array"
- Check `.env.local` exists and has correct keys
- Restart `npm start` after editing `.env.local`

### "Error fetching blog posts: Failed to fetch"
- Check Supabase project is running (not paused)
- Verify URL and API key are correct
- Check browser console for CORS errors

### No data showing
- Check tables have data in Supabase dashboard
- Verify RLS policies are set (should be done by schema)

## 🎉 Next Steps

Once Supabase is working:
1. Set up Notion integration
2. Run `npm run sync` to sync from Notion
3. Add more fields to tables (images, tags, etc.)
4. Build individual post/event detail pages
=======
# 2025-26
The Repository for the DataSoc activities through the academic year 2025/2026.
>>>>>>> d74d675b3f7983b5a0e648146626bccd1eaaacc7
