require('dotenv').config();
const { Client } = require('@notionhq/client');
const { createClient } = require('@supabase/supabase-js');

// Initialize clients
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Debug the client
//console.log('Notion client keys:', Object.keys(notion));
//console.log('Has databases?', 'databases' in notion);
//console.log('Databases type:', typeof notion.databases);
//console.log('Token length:', process.env.NOTION_TOKEN?.length);
//console.log('Token starts with:', process.env.NOTION_TOKEN?.substring(0, 4));
//console.log('Available database methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(notion.databases)));

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

// Helper function to extract URL
function extractUrl(urlObj) {
  if (!urlObj) return null;
  return urlObj;
}

// Sync Events
async function syncEvents() {
  try {
    console.log('Syncing events...');
    // V2 syntax: pass database_id as first parameter
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

    const { data, error } = await supabase
      .from('events')
      .upsert(events, { onConflict: 'notion_id' });

    if (error) throw error;
    console.log(`✓ Synced ${events.length} events`);
    return { count: events.length, data };
  } catch (error) {
    console.error('✗ Error syncing events:', error.message);
    return { count: 0, error: error.message };
  }
}

// Sync Blog Posts
async function syncBlogPosts() {
  try {
    console.log('Syncing blog posts...');
    const response = await notion.databases.query({
      database_id: DATABASES.blog,
    });

    const posts = response.results.map(page => {
      // Extract image URL from files property
      const imageFiles = page.properties.Image?.files || [];
      const imageUrl = imageFiles.length > 0 
        ? (imageFiles[0].type === 'external' 
            ? imageFiles[0].external.url 
            : imageFiles[0].file.url)
        : null;

      return {
        notion_id: page.id,
        title: extractText(page.properties.Title?.title),
        author: extractText(page.properties.Author?.rich_text),
        published_date: extractDate(page.properties['Published Date']?.date), // FIXED
        excerpt: extractText(page.properties.Excerpt?.rich_text),
        status: page.properties.Status?.select?.name || 'draft',
        image: imageUrl,
        slug: extractText(page.properties.Slug?.rich_text) || page.id,
        created_at: page.created_time,
        updated_at: page.last_edited_time
      };
    });

    const { data, error } = await supabase
      .from('blog_posts')
      .upsert(posts, { onConflict: 'notion_id' });

    if (error) throw error;
    console.log(`✓ Synced ${posts.length} blog posts`);
    return { count: posts.length, data };
  } catch (error) {
    console.error('✗ Error syncing blog posts:', error.message);
    return { count: 0, error: error.message };
  }
}

// Sync Projects
async function syncProjects() {
  try {
    console.log('Syncing projects...');
    // V2 syntax
    const response = await notion.databases.query({
      database_id: DATABASES.projects,
    });

    const projects = response.results.map(page => ({
      notion_id: page.id,
      title: extractText(page.properties.Name?.title),
      description: extractText(page.properties.Description?.rich_text),
      github_url: extractUrl(page.properties.GitHub?.url),
      status: page.properties.Status?.select?.name || 'active',
      created_at: page.created_time,
      updated_at: page.last_edited_time
    }));

    const { data, error } = await supabase
      .from('projects')
      .upsert(projects, { onConflict: 'notion_id' });

    if (error) throw error;
    console.log(`✓ Synced ${projects.length} projects`);
    return { count: projects.length, data };
  } catch (error) {
    console.error('✗ Error syncing projects:', error.message);
    return { count: 0, error: error.message };
  }
}

// Sync Guides
async function syncGuides() {
  try {
    console.log('Syncing guides...');
    // V2 syntax
    const response = await notion.databases.query({
      database_id: DATABASES.guides,
    });

    const guides = response.results.map(page => ({
      notion_id: page.id,
      title: extractText(page.properties.Name?.title),
      description: extractText(page.properties.Description?.rich_text),
      content: extractText(page.properties.Content?.rich_text),
      category: page.properties.Category?.select?.name,
      difficulty: page.properties.Difficulty?.select?.name || 'beginner',
      tags: page.properties.Tags?.multi_select?.map(t => t.name) || [],
      author: extractText(page.properties.Author?.rich_text),
      read_time: page.properties['Read Time']?.number,
      github_url: page.properties.GitHub?.url,
      featured: page.properties.Featured?.checkbox || false,
      created_at: page.created_time,
      updated_at: page.last_edited_time
    }));

    const { data, error } = await supabase
      .from('guides')
      .upsert(guides, { onConflict: 'notion_id' });

    if (error) throw error;
    console.log(`✓ Synced ${guides.length} guides`);
    return { count: guides.length, data };
  } catch (error) {
    console.error('✗ Error syncing guides:', error.message);
    return { count: 0, error: error.message };
  }
}

// Sync Members
async function syncMembers() {
  try {
    console.log('Syncing members...');
    // V2 syntax
    const response = await notion.databases.query({
      database_id: DATABASES.members,
    });

    const members = response.results.map(page => ({
      notion_id: page.id,
      name: extractText(page.properties.Name?.title),
      role: page.properties.Role?.select?.name,
      bio: extractText(page.properties.Bio?.rich_text),
      major: page.properties.major?.select?.name
        || extractText(page.properties.major?.rich_text)
        || null,
      image_url: page.properties['Image URL']?.url,
      github_url: page.properties['GitHub URL']?.url,
      linkedin_url: page.properties['LinkedIn URL']?.url,
      created_at: page.created_time,
      interests: page.properties.Interests?.multi_select
        ? page.properties.Interests.multi_select.map(t => t.name)
        : extractText(page.properties.Interests?.rich_text)
            .split(',')
            .map(s => s.trim())
            .filter(Boolean),
      academic_year: page.properties.academic_year?.select?.name
        || extractText(page.properties.academic_year?.rich_text)
        || null
    }));

    // Debug step
    console.log('Members to upsert:', members.map(m => ({
      name: m.name,
      academic_year: m.academic_year,
      major: m.major,
      interests: m.interests
    })));

    const { data, error } = await supabase
      .from('members')
      .upsert(members, { onConflict: 'notion_id' });

    if (error) throw error;
    console.log(`✓ Synced ${members.length} members`);
    return { count: members.length, data };
  } catch (error) {
    console.error('✗ Error syncing members:', error.message);
    return { count: 0, error: error.message };
  }
}

// Main sync function
async function syncAllData() {
  console.log('\n🔄 Starting full sync...\n');
  const startTime = Date.now();
  
  const results = {
    events: null,
    blogPosts: null,
    projects: null,
    guides: null,
    members: null,
    timestamp: new Date().toISOString()
  };

  try {
    // Sync each database if it's configured
    if (DATABASES.events) results.events = await syncEvents();
    if (DATABASES.blog) results.blogPosts = await syncBlogPosts();
    if (DATABASES.projects) results.projects = await syncProjects();
    if (DATABASES.guides) results.guides = await syncGuides();
    if (DATABASES.members) results.members = await syncMembers();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ Full sync completed in ${duration}s`);
    
    // Log summary
    const totalSynced = Object.values(results)
      .filter(r => r && typeof r === 'object')
      .reduce((sum, r) => sum + (r.count || 0), 0);
    
    console.log(`📊 Total records synced: ${totalSynced}\n`);
    
    return results;
  } catch (error) {
    console.error('\n❌ Full sync failed:', error);
    throw error;
  }
}

// Export for use in server
module.exports = { 
  syncAllData, 
  syncEvents, 
  syncBlogPosts, 
  syncProjects,
  syncGuides,
  syncMembers
};

// Run if called directly
if (require.main === module) {
  syncAllData()
    .then(() => {
      console.log('✓ Sync complete\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('✗ Sync failed:', error);
      process.exit(1);
    });
}