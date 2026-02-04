const { Client } = require('@notionhq/client');
const { createClient } = require('@supabase/supabase-js');
const { NotionToMarkdown } = require("notion-to-md");
require('dotenv').config();

// Configuration
const DEBUG = process.env.DEBUG === 'true';
const RATE_LIMIT_DELAY = 350;
const INCREMENTAL_SYNC_WINDOW_MINS = 15; // Sync items changed in the last 15 mins

// Initialize clients
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const n2m = new NotionToMarkdown({ notionClient: notion });

// Helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const extractText = (richText) => (richText || []).map(t => t.plain_text).join('');
const extractDate = (dateObj) => dateObj?.start || null;
const extractUrl = (urlObj) => urlObj || null;

function extractImageUrl(imageProperty) {
  if (!imageProperty) return null;
  if (imageProperty.type === 'files') {
    const files = imageProperty.files || [];
    if (files.length === 0) return null;
    return files[0].type === 'external' ? files[0].external.url : files[0].file.url;
  }
  return imageProperty.type === 'url' ? imageProperty.url : null;
}

function robustExtractImage(page) {
  const props = page.properties;
  const possibleNames = ['Image', 'Cover', 'Photo', 'Logo', 'Thumbnail', 'Main Image', 'Image URL', 'image_url', 'image'];

  for (const name of possibleNames) {
    const match = Object.keys(props).find(k => k.toLowerCase() === name.toLowerCase());
    if (match) {
      const url = extractImageUrl(props[match]);
      if (url) return url;
    }
  }

  // Fallback to Page Cover
  return page.cover ? (page.cover.type === 'external' ? page.cover.external.url : page.cover.file.url) : null;
}

function normalizeWorkshopUrl(title, currentUrl, dateStr) {
  if (!title) return currentUrl;

  const date = dateStr ? new Date(dateStr) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  // Determine Academic Year (Sept start)
  const academicYear = month >= 9 ? `${year}-${(year + 1).toString().slice(-2)}` : `${year - 1}-${year.toString().slice(-2)}`;

  // Base Repo for now
  const baseRepo = "https://github.com/sheffdatasoc/2024-25/tree/main";
  const encodedTitle = encodeURIComponent(title.trim());

  // Logic: Rebuild if current is corrupted or missing, otherwise honor it if it's a valid remote URL
  if (currentUrl && currentUrl.startsWith('http') && !currentUrl.includes('"')) {
    return currentUrl;
  }

  if (academicYear === '2024-25') {
    return `${baseRepo}/The%20Sandbox/${encodedTitle}`;
  } else if (academicYear === '2025-26') {
    return `${baseRepo}/2025-26/${encodedTitle}`;
  }

  return `${baseRepo}/The%20Sandbox/${encodedTitle}`;
}

// Generic page fetcher with incremental sync support
async function getAllPages(databaseId, incremental = false) {
  let results = [];
  let hasMore = true;
  let startCursor = undefined;

  const filter = incremental ? {
    timestamp: 'last_edited_time',
    last_edited_time: {
      on_or_after: new Date(Date.now() - INCREMENTAL_SYNC_WINDOW_MINS * 60 * 1000).toISOString()
    }
  } : undefined;

  while (hasMore) {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: startCursor,
      filter: filter
    });

    results.push(...response.results);
    hasMore = response.has_more;
    startCursor = response.next_cursor;
    if (hasMore) await delay(RATE_LIMIT_DELAY);
  }
  return results;
}

// Table Mappers
const MAPPERS = {
  events: (page) => ({
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
    image_url: robustExtractImage(page),
    registration_url: page.properties['Registration URL']?.url || null,
    is_featured: page.properties.Featured?.checkbox || false,
    created_at: page.created_time,
    updated_at: page.last_edited_time
  }),
  blog_posts: async (page) => {
    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdBlocks);
    return {
      notion_id: page.id,
      title: extractText(page.properties.Title?.title),
      author: extractText(page.properties.Author?.rich_text),
      published_date: extractDate(page.properties['Published Date']?.date),
      excerpt: extractText(page.properties.Excerpt?.rich_text),
      status: (extractText(page.properties.Status?.rich_text) || 'draft').toLowerCase() === 'published' ? 'published' : 'draft',
      image: robustExtractImage(page),
      content: mdString.parent,
      slug: extractText(page.properties.Slug?.rich_text) || page.id,
      created_at: page.created_time,
      updated_at: page.last_edited_time
    };
  },
  projects: (page) => ({
    notion_id: page.id,
    title: extractText(page.properties.Title?.title),
    description: extractText(page.properties.Description?.rich_text),
    github_url: page.properties.Github?.url || null,
    status: extractText(page.properties.Status?.rich_text) || 'in progress',
    members: page.properties.Members?.number ?? null,
    tags: (page.properties.Tags?.multi_select || []).map(t => t.name),
    demo_url: page.properties["Demo url"]?.url || null,
    featured: page.properties.Featured?.checkbox || false,
    created_at: page.created_time,
    updated_at: page.last_edited_time
  }),
  workshops: (page) => {
    const title = extractText(page.properties.Title?.title);
    const currentUrl = page.properties.Materials?.url || null;
    const date = page.properties.Date?.date?.start || null;

    return {
      notion_id: page.id,
      title: title,
      description: extractText(page.properties.Description?.rich_text),
      materials_url: normalizeWorkshopUrl(title, currentUrl, date),
      status: extractText(page.properties.Status?.rich_text) || 'beginner',
      tags: (page.properties.Tags?.multi_select || []).map(t => t.name),
      date: date,
      duration_minutes: page.properties["Duration Minutes"]?.number ?? null,
      host: extractText(page.properties.Host?.rich_text),
      created_at: page.created_time,
      updated_at: page.last_edited_time
    };
  },
  guides: async (page) => {
    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdBlocks);
    return {
      notion_id: page.id,
      title: extractText(page.properties.Name?.title),
      description: extractText(page.properties.Description?.rich_text),
      content: mdString.parent,
      published_date: extractDate(page.properties['Published Date']?.date),
      category: page.properties.Category?.select?.name || null,
      difficulty: page.properties.Difficulty?.select?.name || 'beginner',
      tags: (page.properties.Tags?.multi_select || []).map(t => t.name),
      author: extractText(page.properties.Author?.rich_text),
      read_time: page.properties['Read Time']?.number,
      github_url: page.properties.GitHub?.url,
      image: robustExtractImage(page),
      featured: page.properties.Featured?.checkbox || false,
      created_at: page.created_time,
      updated_at: page.last_edited_time
    };
  },
  members: (page) => ({
    notion_id: page.id,
    name: extractText(page.properties.Name?.title),
    role: page.properties.Role?.select?.name,
    bio: extractText(page.properties.Bio?.rich_text),
    major: page.properties.major?.select?.name || extractText(page.properties.major?.rich_text) || null,
    image_url: robustExtractImage(page),
    github_url: page.properties['GitHub URL']?.url,
    linkedin_url: page.properties['LinkedIn URL']?.url,
    created_at: page.created_time,
    interests: page.properties.Interests?.multi_select ? page.properties.Interests.multi_select.map(t => t.name) : [],
    academic_year: page.properties.academic_year?.select?.name || extractText(page.properties.academic_year?.rich_text) || null,
    is_committee: page.properties.Committee?.checkbox === true
  }),
  glossary: (page) => ({
    notion_id: page.id,
    term: extractText(page.properties.Term?.title),
    definition: extractText(page.properties.Definition?.rich_text),
    category: extractText(page.properties.Category?.rich_text),
    examples: extractText(page.properties.Examples?.rich_text),
    related_terms: (page.properties['Related Terms']?.multi_select || []).map(item => item.name),
    created_at: page.created_time,
    updated_at: page.last_edited_time
  }),
  resources: (page) => ({
    notion_id: page.id,
    name: extractText(page.properties.Name?.title),
    resource_url: page.properties['Resource url']?.url || null,
    type: extractText(page.properties.Type?.rich_text),
    description: extractText(page.properties.Description?.rich_text),
    category: extractText(page.properties.Category?.rich_text),
    tags: (page.properties.Tags?.multi_select || []).map(tag => tag.name),
    featured: page.properties.Featured?.checkbox || false,
    created_at: page.created_time,
    updated_at: page.last_edited_time
  }),
  timeline_events: (page) => ({
    notion_id: page.id,
    title: extractText(page.properties.Title?.title),
    event_date: extractDate(page.properties['Event date']?.date),
    term: page.properties.Term?.select?.name || null,
    description: extractText(page.properties.Description?.rich_text),
    tags: (page.properties.Tags?.multi_select || []).map(t => t.name),
    icon: extractText(page.properties.Icon?.rich_text) || null,
    image_url: robustExtractImage(page),
    created_at: page.created_time
  }),
  gallery_items: (page) => ({
    notion_id: page.id,
    title: extractText(page.properties.Title?.title || page.properties.Name?.title || page.properties.Image?.title),
    event_date: extractDate(page.properties['Event Date']?.date || page.properties.Date?.date),
    description: extractText(page.properties.Description?.rich_text),
    category: page.properties.Category?.select?.name || extractText(page.properties.Category?.rich_text) || 'Uncategorized',
    image_url: robustExtractImage(page),
    created_at: page.created_time
  }),
  partners: (page) => ({
    notion_id: page.id,
    name: extractText(page.properties.Name?.title),
    description: extractText(page.properties.Description?.rich_text),
    tier: page.properties.Tier?.select?.name || 'Bronze',
    logo: robustExtractImage(page),
    website: page.properties.Website?.url || null,
    about_blurb: extractText(page.properties['About Blurb']?.rich_text),
    why_sponsor: extractText(page.properties['Why Sponsor']?.rich_text),
    cta_link: page.properties['CTA Link']?.url || null,
    active: page.properties.Active?.checkbox !== false,
    created_at: page.created_time,
    updated_at: page.last_edited_time
  })
};

// Generic Sync Function
async function genericSync(tableName, databaseId, incremental = false) {
  if (!databaseId) return { count: 0, error: 'Database ID missing' };

  try {
    console.log(`Syncing ${tableName}...${incremental ? ' (incremental)' : ''}`);
    const pages = await getAllPages(databaseId, incremental);
    if (pages.length === 0) return { count: 0 };

    const mapper = MAPPERS[tableName];
    const data = [];

    for (const page of pages) {
      const item = await mapper(page);
      if (item && (item.title || item.name || item.term)) data.push(item);
      if (tableName.includes('blog') || tableName.includes('guides')) await delay(RATE_LIMIT_DELAY);
    }

    const { error } = await supabase.from(tableName).upsert(data, { onConflict: 'notion_id' });
    if (error) throw error;

    console.log(`✓ Synced ${data.length} ${tableName}`);
    return { count: data.length };
  } catch (error) {
    console.error(`Error syncing ${tableName}:`, error.message);
    return { count: 0, error: error.message };
  }
}

async function syncAllData(incremental = false) {
  console.log(`\n🔄 Starting sync... ${incremental ? '(Incremental)' : '(Full)'}\n`);
  const startTime = Date.now();

  const DB_CONFIGS = [
    { table: 'events', id: process.env.NOTION_EVENTS_DB_ID },
    { table: 'blog_posts', id: process.env.NOTION_BLOG_DB_ID },
    { table: 'projects', id: process.env.NOTION_PROJECTS_DB_ID },
    { table: 'workshops', id: process.env.NOTION_WORKSHOPS_DB_ID },
    { table: 'guides', id: process.env.NOTION_GUIDES_DB_ID },
    { table: 'members', id: process.env.NOTION_MEMBERS_DB_ID },
    { table: 'glossary', id: process.env.NOTION_GLOSSARY_DB_ID },
    { table: 'resources', id: process.env.NOTION_RESOURCES_DB_ID },
    { table: 'timeline_events', id: process.env.NOTION_TIMELINE_DB_ID },
    { table: 'gallery_items', id: process.env.NOTION_GALLERY_DB_ID },
    { table: 'partners', id: process.env.NOTION_PARTNERS_DB_ID }
  ];

  const results = { timestamp: new Date().toISOString() };

  for (const config of DB_CONFIGS) {
    if (config.id) {
      try {
        results[config.table] = await genericSync(config.table, config.id, incremental);
      } catch (err) {
        console.error(`FAILED to sync ${config.table}:`, err.message);
        results[config.table] = { count: 0, error: err.message };
      }
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const total = Object.values(results).reduce((sum, r) => sum + (r.count || 0), 0);
  console.log(`✅ Sync completed in ${duration}s - ${total} records synced\n`);
  return results;
}

module.exports = {
  syncAllData,
  syncEvents: async () => genericSync('events', process.env.NOTION_EVENTS_DB_ID),
  syncBlogPosts: async () => genericSync('blog_posts', process.env.NOTION_BLOG_DB_ID),
  syncProjects: async () => genericSync('projects', process.env.NOTION_PROJECTS_DB_ID),
  syncWorkshops: async () => genericSync('workshops', process.env.NOTION_WORKSHOPS_DB_ID),
  syncGuides: async () => genericSync('guides', process.env.NOTION_GUIDES_DB_ID),
  syncMembers: async () => genericSync('members', process.env.NOTION_MEMBERS_DB_ID),
  syncGlossary: async () => genericSync('glossary', process.env.NOTION_GLOSSARY_DB_ID),
  syncResources: async () => genericSync('resources', process.env.NOTION_RESOURCES_DB_ID),
  syncTimeline: async () => genericSync('timeline_events', process.env.NOTION_TIMELINE_DB_ID),
  syncGallery: async () => genericSync('gallery_items', process.env.NOTION_GALLERY_DB_ID),
  syncPartners: async () => genericSync('partners', process.env.NOTION_PARTNERS_DB_ID)
};

if (require.main === module) {
  const isIncremental = process.argv.includes('--incremental');
  syncAllData(isIncremental)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
