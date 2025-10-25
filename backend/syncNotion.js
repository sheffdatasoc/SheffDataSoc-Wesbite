require('dotenv').config();
const { Client } = require('@notionhq/client');
const { createClient } = require('@supabase/supabase-js');

// Initialize clients
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Database IDs from Notion
const DATABASES = {
  events: process.env.NOTION_EVENTS_DB_ID,
  blog: process.env.NOTION_BLOG_DB_ID,
  projects: process.env.NOTION_PROJECTS_DB_ID,
  guides: process.env.NOTION_GUIDES_DB_ID,
  members: process.env.NOTION_MEMBERS_DB_ID
};

// Helper function to extract text from Notion rich text
function extractText(richText) {
  if (!richText || richText.length === 0) return '';
  return richText.map(t => t.plain_text).join('');
}

// Helper function to extract date
function extractDate(dateObj) {
  if (!dateObj) return null;
  return dateObj.start;
}

// Sync Events
async function syncEvents() {
  try {
    console.log('Syncing events...');
    const response = await notion.databases.query({
      database_id: DATABASES.events,
    });

    const events = response.results.map(page => ({
      notion_id: page.id,
      title: extractText(page.properties.Name?.title),
      date: extractDate(page.properties.Date?.date),
      location: extractText(page.properties.Location?.rich_text),
      description: extractText(page.properties.Description?.rich_text),
      status: page.properties.Status?.select?.name || 'upcoming',
      created_at: page.created_time,
      updated_at: page.last_edited_time
    }));

    // Upsert to Supabase
    const { data, error } = await supabase
      .from('events')
      .upsert(events, { onConflict: 'notion_id' });

    if (error) throw error;
    console.log(`Synced ${events.length} events`);
    return events;
  } catch (error) {
    console.error('Error syncing events:', error);
    throw error;
  }
}

// Sync Blog Posts
async function syncBlogPosts() {
  try {
    console.log('Syncing blog posts...');
    const response = await notion.databases.query({
      database_id: DATABASES.blog,
    });

    const posts = response.results.map(page => ({
      notion_id: page.id,
      title: extractText(page.properties.Name?.title),
      author: extractText(page.properties.Author?.rich_text),
      published_date: extractDate(page.properties.Date?.date),
      excerpt: extractText(page.properties.Excerpt?.rich_text),
      status: page.properties.Status?.select?.name || 'draft',
      created_at: page.created_time,
      updated_at: page.last_edited_time
    }));

    const { data, error } = await supabase
      .from('blog_posts')
      .upsert(posts, { onConflict: 'notion_id' });

    if (error) throw error;
    console.log(`Synced ${posts.length} blog posts`);
    return posts;
  } catch (error) {
    console.error('Error syncing blog posts:', error);
    throw error;
  }
}

// Sync Projects
async function syncProjects() {
  try {
    console.log('Syncing projects...');
    const response = await notion.databases.query({
      database_id: DATABASES.projects,
    });

    const projects = response.results.map(page => ({
      notion_id: page.id,
      title: extractText(page.properties.Name?.title),
      description: extractText(page.properties.Description?.rich_text),
      github_url: extractText(page.properties.GitHub?.url),
      status: page.properties.Status?.select?.name || 'active',
      created_at: page.created_time,
      updated_at: page.last_edited_time
    }));

    const { data, error } = await supabase
      .from('projects')
      .upsert(projects, { onConflict: 'notion_id' });

    if (error) throw error;
    console.log(`Synced ${projects.length} projects`);
    return projects;
  } catch (error) {
    console.error('Error syncing projects:', error);
    throw error;
  }
}

// Main sync function
async function syncAllData() {
  console.log('Starting full sync...');
  const results = {
    events: null,
    blogPosts: null,
    projects: null
  };

  try {
    if (DATABASES.events) results.events = await syncEvents();
    if (DATABASES.blog) results.blogPosts = await syncBlogPosts();
    if (DATABASES.projects) results.projects = await syncProjects();
    
    console.log('Full sync completed successfully');
    return results;
  } catch (error) {
    console.error('Full sync failed:', error);
    throw error;
  }
}

// Export for use in server
module.exports = { syncAllData, syncEvents, syncBlogPosts, syncProjects };

// Run if called directly
if (require.main === module) {
  syncAllData()
    .then(() => {
      console.log('Sync complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Sync failed:', error);
      process.exit(1);
    });
}