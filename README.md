# Sheffield Data Science Society — Website

The official website for Sheffield Data Science Society. Built with React, backed by Supabase, and content-managed through Notion with an automated sync pipeline deployed on Render.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Image Storage | Supabase Storage |
| CMS | Notion |
| Backend / Sync | Node.js, Express |
| Deployment | Render |
| AI Chatbot | IBM watsonx |

---

## Architecture

Content flows from Notion through a Node.js sync service into Supabase, which the React frontend queries directly.

```
Notion (CMS)
  - Blog posts, events, guides, members, gallery
  - Edited by committee members
        |
        |  backend/syncNotion.js
        |  Runs every 5 minutes via cron
        v
Supabase (PostgreSQL + Storage)
  - Tables: blog_posts, events, guides, members,
            gallery_items, partners, timeline_events,
            projects, workshops, glossary
  - Storage: public-images bucket (permanent image mirror)
        |
        |  src/lib/supabase.js
        v
React Hooks  (src/hooks/useSupabase.js)
  - useBlogPosts(), useEvents(), useGuides() ...
  - Handles loading states and errors
        |
        v
Pages  (News.jsx, Events.jsx, TheSandbox.jsx ...)
  - Receives data from hooks
  - Maps data to card components
        |
        v
Cards  (BlogCard, EventCard, ProjectCard ...)
  - Displays individual items
  - No data fetching logic
```

### Image Mirroring

Notion uploads images to AWS S3 with signed URLs that expire after approximately one hour. During each sync, the backend downloads any Notion-hosted images and stores them permanently in the `public-images` Supabase Storage bucket under `notion-images/<pageId>.<ext>`. Subsequent syncs skip re-uploading if the file already exists.

---

## Project Structure

```
/
|-- src/
|   |-- components/       Reusable UI components
|   |-- pages/            Full page views (one per route)
|   |-- hooks/            Custom React hooks for data fetching
|   |-- lib/              Third-party client setup (Supabase, etc.)
|   |-- entities/         Data model helpers
|
|-- backend/
|   |-- server.js         Express server and sync API endpoints
|   |-- syncNotion.js     Notion-to-Supabase sync logic
|
|-- supabase-schema.sql   Full database schema
```

---

## Local Development

### Prerequisites

- Node.js 18+
- A Supabase project
- A Notion integration token

### 1. Clone and install

```bash
git clone https://github.com/sheffdatasoc/SheffDataSoc-Wesbite.git
cd SheffDataSoc-Wesbite
npm install
cd backend && npm install && cd ..
```

### 2. Configure environment variables

**Frontend** — create `.env.local` in the project root:

```bash
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_BACKEND_URL=http://localhost:10000
```

**Backend** — create `backend/.env`:

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

NOTION_TOKEN=secret_xxxxx
NOTION_BLOG_DB_ID=xxxxx
NOTION_EVENTS_DB_ID=xxxxx
NOTION_PROJECTS_DB_ID=xxxxx
NOTION_GUIDES_DB_ID=xxxxx
NOTION_MEMBERS_DB_ID=xxxxx
NOTION_GALLERY_DB_ID=xxxxx
NOTION_PARTNERS_DB_ID=xxxxx
NOTION_TIMELINE_DB_ID=xxxxx
NOTION_GLOSSARY_DB_ID=xxxxx
NOTION_WORKSHOPS_DB_ID=xxxxx

SYNC_SECRET=your-secret-key
WATSONX_PROJECT_ID=xxxxx
WATSONX_SERVICE_URL=https://...
```

### 3. Set up the database

1. Open your Supabase project and go to **SQL Editor**
2. Paste the contents of `supabase-schema.sql` and run it
3. In **Storage**, create a public bucket named `public-images`

### 4. Run locally

```bash
# Start the backend (in one terminal)
cd backend && npm start

# Start the frontend (in another terminal)
npm start
```

The frontend runs on `http://localhost:3000` and the backend on `http://localhost:10000`.

---

## Triggering a Manual Sync

Send a POST request to the sync endpoint with your secret:

```bash
curl -X POST https://sheffdatasoc-website.onrender.com/api/sync \
  -H "Content-Type: application/json" \
  -d '{"secret": "YOUR_SYNC_SECRET", "full": true}'
```

Set `"full": true` to sync all records, or omit it for an incremental sync (last 15 minutes of changes only).

---

## Deployment

The site is hosted on Render. Pushes to `main` trigger an automatic redeploy. Environment variables are managed through the Render dashboard.

---

## Contributing

Each committee member works on their own named branch and opens a pull request to `main` for review before merging.

```bash
git checkout joaquin       # switch to your branch
git pull origin main       # stay up to date
# make changes...
git push origin joaquin
# open a pull request on GitHub
```
