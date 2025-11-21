require('dotenv').config();
const { Client } = require('@notionhq/client');
const { createClient } = require('@supabase/supabase-js');
const { NotionToMarkdown } = require("notion-to-md");


// Initialize clients
const notion = new Client({ auth: process.env.NOTION_TOKEN });


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);


// Initialize markdown converter
const n2m = new NotionToMarkdown({ notionClient: notion });


// Database IDs from Notion
const DATABASES = {
  events: process.env.NOTION_EVENTS_DB_ID,
  blog: process.env.NOTION_BLOG_DB_ID,
  projects: process.env.NOTION_PROJECTS_DB_ID,
  guides: process.env.NOTION_GUIDES_DB_ID,
  members: process.env.NOTION_MEMBERS_DB_ID,
  glossary: process.env.NOTION_GLOSSARY_DB_ID,
  resources: process.env.NOTION_RESOURCES_DB_ID,
  timeline: process.env.NOTION_TIMELINE_DB_ID,
  gallery: process.env.NOTION_GALLERY_DB_ID
};


// Configuration
const RATE_LIMIT_DELAY = 350; // ~3 requests per second for Notion API
const DEBUG = process.env.DEBUG === 'true';


// Helper functions
function extractText(richText) {
  if (!richText || richText.length === 0) return '';
  return richText.map(t => t.plain_text).join('');
}


function extractDate(dateObj) {
  if (!dateObj) return null;
  return dateObj.start;
}


function extractUrl(urlObj) {
  return urlObj || null;
}


function extractImageUrl(imageProperty) {
  const files = imageProperty?.files || [];
  if (files.length === 0) return null;
  return files[0].type === 'external'
    ? files[0].external.url
    : files[0].file.url;
}


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function debugLog(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}


// Get all pages from a database with pagination
async function getAllPages(databaseId) {
  let results = [];
  let hasMore = true;
  let startCursor = undefined;
 
  while (hasMore) {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: startCursor,
    });
   
    results.push(...response.results);
    hasMore = response.has_more;
    startCursor = response.next_cursor;
   
    if (hasMore) {
      await delay(RATE_LIMIT_DELAY);
    }
  }
 
  return results;
}


// Sync Events
async function syncEvents() {
  try {
    console.log('Syncing events...');
    const pages = await getAllPages(DATABASES.events);


    const events = pages
      .map(page => ({
        notion_id: page.id,
        title: extractText(page.properties.Title?.title),
        date: extractDate(page.properties.Date?.date),
        end_date: page.properties['End Date']?.date?.start || null,
        location: extractText(page.properties.Location?.rich_text),
        description: extractText(page.properties.Description?.rich_text),
        status: extractText(page.properties.status?.rich_text) || 'upcoming',
        type: extractText(page.properties.Type?.rich_text)?.toLowerCase() || 'workshop',
        attendees: page.properties.Attendees?.number || 0,
        max_attendees: page.properties['Max Attendees']?.number || null,
        image_url: extractImageUrl(page.properties.Image),
        registration_url: page.properties['Registration URL']?.url || null,
        created_at: page.created_time,
        updated_at: page.last_edited_time
      }))
      .filter(event => event.title); // Skip events without titles


    if (events.length === 0) {
      console.log('⚠️  No valid events found');
      return { count: 0, data: null };
    }


    // Upsert events
    const { data, error } = await supabase
      .from('events')
      .upsert(events, {
        onConflict: 'notion_id',
        ignoreDuplicates: false
      });


    if (error) throw error;
    console.log(`✓ Synced ${events.length} events`);
    return { count: events.length, data };
  } catch (error) {
    console.error('Error syncing events:', error.message);
    return { count: 0, error: error.message };
  }
}


// Sync Blog Posts
async function syncBlogPosts() {
  try {
    console.log('Syncing blog posts...');
    const pages = await getAllPages(DATABASES.blog);


    const posts = [];
    const errors = [];
   
    for (const page of pages) {
      try {
        const mdBlocks = await n2m.pageToMarkdown(page.id);
        const mdString = n2m.toMarkdownString(mdBlocks);
       
        // Map Notion status to appropriate status value
        // Status is stored as rich_text, not select
        const notionStatus = extractText(page.properties.Status?.rich_text) || 'draft';
        let status = 'draft'; // default
       
        const statusLower = notionStatus.toLowerCase();
        if (statusLower === 'published') {
          status = 'published';
        } else if (statusLower === 'completed') {
          status = 'in_review';
        }
       
        const post = {
          notion_id: page.id,
          title: extractText(page.properties.Title?.title),
          author: extractText(page.properties.Author?.rich_text),
          published_date: extractDate(page.properties['Published Date']?.date),
          excerpt: extractText(page.properties.Excerpt?.rich_text),
          status: status,
          image: extractImageUrl(page.properties.Image),
          content: mdString.parent,
          slug: extractText(page.properties.Slug?.rich_text) || page.id,
          created_at: page.created_time,
          updated_at: page.last_edited_time
        };


        if (post.title) {
          posts.push(post);
        }
       
        await delay(RATE_LIMIT_DELAY);
      } catch (err) {
        errors.push({
          pageId: page.id,
          title: extractText(page.properties.Title?.title),
          error: err.message
        });
        debugLog(`Failed to process blog post ${page.id}:`, err.message);
      }
    }


    if (errors.length > 0) {
      console.warn(`⚠️  ${errors.length} blog posts failed to sync`);
    }


    if (posts.length === 0) {
      console.log('⚠️  No valid blog posts found');
      return { count: 0, data: null, errors };
    }


    // Upsert blog posts
    const { data, error } = await supabase
      .from('blog_posts')
      .upsert(posts, {
        onConflict: 'notion_id',
        ignoreDuplicates: false
      });


    if (error) throw error;
    console.log(`✓ Synced ${posts.length} blog posts`);
    return { count: posts.length, data, errors };
  } catch (error) {
    console.error('Error syncing blog posts:', error.message);
    return { count: 0, error: error.message };
  }
}


// Sync Projects
async function syncProjects() {
  try {
    console.log('Syncing projects...');
    const pages = await getAllPages(DATABASES.projects);


    const projects = pages
      .map(page => ({
        notion_id: page.id,
        title: extractText(page.properties.Name?.title),
        description: extractText(page.properties.Description?.rich_text),
        github_url: extractUrl(page.properties.GitHub?.url),
        status: page.properties.Status?.select?.name || 'active',
        created_at: page.created_time,
        updated_at: page.last_edited_time
      }))
      .filter(project => project.title); // Skip projects without titles


    if (projects.length === 0) {
      console.log('⚠️  No valid projects found');
      return { count: 0, data: null };
    }


    // Upsert projects
    const { data, error } = await supabase
      .from('projects')
      .upsert(projects, {
        onConflict: 'notion_id',
        ignoreDuplicates: false
      });


    if (error) throw error;
    console.log(`✓ Synced ${projects.length} projects`);
    return { count: projects.length, data };
  } catch (error) {
    console.error('Error syncing projects:', error.message);
    return { count: 0, error: error.message };
  }
}


// Sync Guides
async function syncGuides() {
  try {
    console.log('Syncing guides...');
    const pages = await getAllPages(DATABASES.guides);


    const guides = [];
    const errors = [];


    for (const page of pages) {
      try {
        const mdBlocks = await n2m.pageToMarkdown(page.id);
        const mdString = n2m.toMarkdownString(mdBlocks);


        const guide = {
          notion_id: page.id,
          title: extractText(page.properties.Name?.title),
          description: extractText(page.properties.Description?.rich_text),
          content: mdString.parent,
          published_date: extractDate(page.properties['Published Date']?.date),
          category: page.properties.Category?.select?.name || null,
          difficulty: page.properties.Difficulty?.select?.name || 'beginner',
          tags: page.properties.Tags?.multi_select?.map(t => t.name) || [],
          author: extractText(page.properties.Author?.rich_text),
          read_time: page.properties['Read Time']?.number,
          github_url: page.properties.GitHub?.url,
          image: extractImageUrl(page.properties.Image),
          featured: page.properties.Featured?.checkbox || false,
          created_at: page.created_time,
          updated_at: page.last_edited_time
        };


        if (guide.title) {
          guides.push(guide);
        }
       
        await delay(RATE_LIMIT_DELAY);
      } catch (err) {
        errors.push({
          pageId: page.id,
          title: extractText(page.properties.Name?.title),
          error: err.message
        });
        debugLog(`Failed to process guide ${page.id}:`, err.message);
      }
    }


    if (errors.length > 0) {
      console.warn(`⚠️  ${errors.length} guides failed to sync`);
    }


    if (guides.length === 0) {
      console.log('⚠️  No valid guides found');
      return { count: 0, data: null, errors };
    }


    // Upsert guides
    const { data, error } = await supabase
      .from('guides')
      .upsert(guides, {
        onConflict: 'notion_id',
        ignoreDuplicates: false
      });


    if (error) throw error;
    console.log(`✓ Synced ${guides.length} guides`);
    return { count: guides.length, data, errors };
  } catch (error) {
    console.error('Error syncing guides:', error.message);
    return { count: 0, error: error.message };
  }
}


// Sync Members
async function syncMembers() {
  try {
    console.log('Syncing members...');
    const pages = await getAllPages(DATABASES.members);


    const members = pages
      .map(page => ({
        notion_id: page.id,
        name: extractText(page.properties.Name?.title),
        role: page.properties.Role?.select?.name,
        bio: extractText(page.properties.Bio?.rich_text),
        major:
          page.properties.major?.select?.name ||
          extractText(page.properties.major?.rich_text) ||
          null,
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
        academic_year:
          page.properties.academic_year?.select?.name ||
          extractText(page.properties.academic_year?.rich_text) ||
          null
      }))
      .filter(member => member.name); // Skip members without names


    if (members.length === 0) {
      console.log('⚠️  No valid members found');
      return { count: 0, data: null };
    }


    // Upsert members
    const { data, error } = await supabase
      .from('members')
      .upsert(members, {
        onConflict: 'notion_id',
        ignoreDuplicates: false
      });


    if (error) throw error;
    console.log(`✓ Synced ${members.length} members`);
    return { count: members.length, data };
  } catch (error) {
    console.error('Error syncing members:', error.message);
    return { count: 0, error: error.message };
  }
}


// Sync Glossary
async function syncGlossary() {
  try {
    console.log('Syncing glossary...');
    const pages = await getAllPages(DATABASES.glossary);


    const glossaryTerms = pages
      .map(page => {
        const term = extractText(page.properties.Term?.title);
       
        debugLog(`\nTerm: "${term}"`);
        debugLog('Related Terms property:', page.properties['Related Terms']);
       
        return {
          notion_id: page.id,
          term: term,
          definition: extractText(page.properties.Definition?.rich_text),
          category: extractText(page.properties.Category?.rich_text),
          examples: extractText(page.properties.Examples?.rich_text),
          related_terms: page.properties['Related Terms']?.multi_select
            ? page.properties['Related Terms'].multi_select.map(item => item.name)
            : [],
          created_at: page.created_time,
          updated_at: page.last_edited_time
        };
      })
      .filter(item => item.term && item.term.trim() !== ''); // Remove empty terms


    // Remove duplicates - keep first occurrence only
    const uniqueTerms = Array.from(
      new Map(glossaryTerms.map(item => [item.term, item])).values()
    );


    if (glossaryTerms.length !== uniqueTerms.length) {
      const duplicateCount = glossaryTerms.length - uniqueTerms.length;
      console.log(`⚠️  Removed ${duplicateCount} duplicate terms`);
    }


    if (uniqueTerms.length === 0) {
      console.log('⚠️  No valid glossary terms found');
      return { count: 0, data: null };
    }


    // Upsert glossary terms
    const { data, error } = await supabase
      .from('glossary')
      .upsert(uniqueTerms, {
        onConflict: 'notion_id',
        ignoreDuplicates: false
      });


    if (error) throw error;
    console.log(`✓ Synced ${uniqueTerms.length} glossary terms`);
    return { count: uniqueTerms.length, data };
  } catch (error) {
    console.error('Error syncing glossary:', error.message);
    return { count: 0, error: error.message };
  }
}


// Sync Resources
async function syncResources() {
  try {
    console.log('Syncing resources...');
   
    const pages = await getAllPages(DATABASES.resources); // Fetch all Notion pages for resources
    const resources = [];
    const errors = [];


    for (const page of pages) {
      try {
        // Map Notion properties to Supabase format
        const resource = {
          notion_id: page.id,
          name: extractText(page.properties.Name?.title),
          resource_url: extractUrl(page.properties['Resource url']?.url),
          type: extractText(page.properties.Type?.rich_text),
          description: extractText(page.properties.Description?.rich_text),
          category: extractText(page.properties.Category?.rich_text),
          tags: page.properties.Tags?.multi_select?.map(tag => tag.name) || [],
          featured: page.properties.Featured?.checkbox || false,
          created_at: page.created_time,
          updated_at: page.last_edited_time
        };


        // Only push resources with a title
        if (resource.name) {
          resources.push(resource);
        }


        await delay(RATE_LIMIT_DELAY); // Respect rate limits
      } catch (err) {
        // Handle per-page errors without stopping the loop
        errors.push({
          pageId: page.id,
          title: extractText(page.properties.Title?.title),
          error: err.message
        });
        debugLog(`Failed to process resource ${page.id}:`, err.message);
      }
    }


    if (errors.length > 0) {
      console.warn(`⚠️  ${errors.length} resources failed to sync`);
    }


    if (resources.length === 0) {
      console.log('⚠️  No valid resources found');
      return { count: 0, data: null, errors };
    }


    // Upsert resources into Supabase
    const { data, error } = await supabase
      .from('resources')
      .upsert(resources, {
        onConflict: 'notion_id',
        ignoreDuplicates: false
      });


    if (error) throw error;


    console.log(`✓ Synced ${resources.length} resources`);
    return { count: resources.length, data, errors };
  } catch (error) {
    console.error('Error syncing resources:', error.message);
    return { count: 0, error: error.message };
  }
}


// Sync Timeline
async function syncTimeline() {
  try {
    console.log('Syncing timeline events...');


    const pages = await getAllPages(DATABASES.timeline);
    const timelineEvents = [];
    const errors = [];


    for (const page of pages) {
      try {
        const timeline = {
          notion_id: page.id,
          title: extractText(page.properties.Title?.title),
          event_date: extractDate(page.properties['Event date']?.date),
          term: page.properties.Term?.select?.name || null,
          description: extractText(page.properties.Description?.rich_text),
          tags: page.properties.Tags?.multi_select?.map(t => t.name) || [],
          icon: extractText(page.properties.Icon?.rich_text) || null,
          image_url: extractImageUrl(page.properties.Image),
          created_at: page.created_time
        };
        if (timeline.title) {
          timelineEvents.push(timeline);
        }
        await delay(RATE_LIMIT_DELAY);
      } catch (err) {
        errors.push({
          pageId: page.id,
          title: extractText(page.properties.Title?.title),
          error: err.message
        });
        debugLog(`Failed to process timeline event ${page.id}:`, err.message);
      }
    }
    if (errors.length > 0) {
      console.warn(`⚠️  ${errors.length} timeline events failed to sync`);
    }


    if (timelineEvents.length === 0) {
      console.log('⚠️  No valid timeline events found');
      return { count: 0, data: null, errors };
    }


    // Upsert timeline events into Supabase
    const { data, error } = await supabase
      .from('timeline_events')
      .upsert(timelineEvents, {
        onConflict: 'notion_id',
        ignoreDuplicates: false
      });


    if (error) throw error;


    console.log(`✓ Synced ${timelineEvents.length} timeline events`);
    return { count: timelineEvents.length, data, errors };
  } catch (error) {
    console.error('Error syncing timeline events:', error.message);
    return { count: 0, error: error.message };
  }
}

// Sync Gallery
async function syncGallery() {
  try {
    console.log('Syncing gallery items...');


    const pages = await getAllPages(DATABASES.gallery);
    const galleryItems = [];
    const errors = [];


    for (const page of pages) {
      try {
        const gallery = {
          notion_id: page.id,
          title: extractText(page.properties.Title?.title),
          event_date: extractDate(page.properties['Event Date']?.date),
          description: extractText(page.properties.Description?.rich_text),
          tags: page.properties.Tags?.multi_select?.map(t => t.name) || [],
          image_url: extractImageUrl(page.properties.Image),
          created_at: page.created_time
        };
        if (gallery.title) {
          galleryItems.push(gallery);
        }
        await delay(RATE_LIMIT_DELAY);
      } catch (err) {
        errors.push({
          pageId: page.id,
          title: extractText(page.properties.Title?.title),
          error: err.message
        });
        debugLog(`Failed to process gallery items ${page.id}:`, err.message);
      }
    }
    if (errors.length > 0) {
      console.warn(`⚠️  ${errors.length} gallery items failed to sync`);
    }


    if (galleryItems.length === 0) {
      console.log('⚠️  No valid gallery items found');
      return { count: 0, data: null, errors };
    }


    // Upsert gallery items into Supabase  WORKKKKKK ONNN
    const { data, error } = await supabase
      .from('timeline_events')
      .upsert(timelineEvents, {
        onConflict: 'notion_id',
        ignoreDuplicates: false
      });


    if (error) throw error;


    console.log(`✓ Synced ${timelineEvents.length} timeline events`);
    return { count: timelineEvents.length, data, errors };
  } catch (error) {
    console.error('Error syncing timeline events:', error.message);
    return { count: 0, error: error.message };
  }
}


// Main Sync
async function syncAllData() {
  console.log('\n🔄 Starting sync...\n');
  const startTime = Date.now();


  const results = {
    events: null,
    blogPosts: null,
    projects: null,
    guides: null,
    members: null,
    glossary: null,
    resources: null,
    timeline: null,
    timestamp: new Date().toISOString()
  };


  try {
    if (DATABASES.events) {
      results.events = await syncEvents();
      console.log('');
    }
    if (DATABASES.blog) {
      results.blogPosts = await syncBlogPosts();
      console.log('');
    }
    if (DATABASES.projects) {
      results.projects = await syncProjects();
      console.log('');
    }
    if (DATABASES.guides) {
      results.guides = await syncGuides();
      console.log('');
    }
    if (DATABASES.members) {
      results.members = await syncMembers();
      console.log('');
    }
    if (DATABASES.glossary) {
      results.glossary = await syncGlossary();
      console.log('');
    }
    if (DATABASES.resources) {
      results.resources = await syncResources();
      console.log('');
    }
    if (DATABASES.timeline) {
      results.timeline = await syncTimeline();
      console.log('');
    }


    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const totalSynced = Object.values(results)
      .filter(r => r && typeof r === 'object')
      .reduce((sum, r) => sum + (r.count || 0), 0);


    console.log(`✅ Sync completed in ${duration}s - ${totalSynced} records synced\n`);


    return results;
  } catch (error) {
    console.error('\n❌ Sync failed:', error);
    throw error;
  }
}


module.exports = {
  syncAllData,
  syncEvents,
  syncBlogPosts,
  syncProjects,
  syncGuides,
  syncMembers,
  syncGlossary,
  syncResources,
  syncTimeline
};


if (require.main === module) {
  syncAllData()
    .then(() => {
      console.log('✓ Sync complete\n');
      process.exit(0);
    })
    .catch(error => {
      console.error('✗ Sync failed:', error);
      process.exit(1);
    });
}