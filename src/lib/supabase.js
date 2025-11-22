import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;


// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using mock data mode.');
}


export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;


// Cache for frequently accessed data
let glossaryCache = null;
let glossaryCacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes


// ============================================================================
// BLOG POSTS
// ============================================================================


export async function getBlogPosts(filters = {}) {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array');
    return [];
  }


  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published'); // Only published posts


  if (filters.author) {
    query = query.eq('author', filters.author);
  }


  query = query.order('published_date', { ascending: false });


  const { data, error } = await query;


  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }


  return data || [];
}


export async function getBlogPostById(id) {
  if (!supabase) return null;


  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .single();


  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
  return data;
}


export async function getBlogPostBySlug(slug) {
  if (!supabase) return null;


  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();


  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
  return data;
}


// ============================================================================
// EVENTS
// ============================================================================


export async function getEvents(options = {}) {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array');
    return [];
  }
  
  const { includeAll = true } = options; 

  let query = supabase
    .from('events')
    .select('*');

  if (!includeAll) {
    query = query.in('status', ['upcoming', 'ongoing']);
  }

  query = query.order('date', { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  return data || [];
}


export async function getUpcomingEvents(limit = 5) {
  if (!supabase) return [];


  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'upcoming')
    .order('date', { ascending: true })
    .limit(limit);


  if (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }


  return data || [];
}


export async function getPastEvents(limit = 10) {
  if (!supabase) return [];


  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'past')
    .order('date', { ascending: false })
    .limit(limit);


  if (error) {
    console.error('Error fetching past events:', error);
    return [];
  }


  return data || [];
}




// ============================================================================
// PROJECTS
// ============================================================================
export async function getProjects(status = null) {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array');
    return [];
  }
  let query = supabase
    .from('projects')
    .select('*');


  if (status) {
    query = query.eq('status', status);
  }
  query = query.order('created_at', { ascending: false });


  const { data, error } = await query;


  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }


  return data || [];
}




// ============================================================================
// MEMBERS
// ============================================================================
export async function getMembers(role = null) {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array');
    return [];
  }
  let query = supabase
    .from('members')
    .select('*');


  if (role) {
    query = query.eq('role', role);
  }
  query = query.order('name', { ascending: true });


  const { data, error } = await query;


  if (error) {
    console.error('Error fetching members:', error);
    return [];
  }
  return data || [];
}




// ============================================================================
// GUIDES
// ============================================================================
export async function getGuides(filters = {}) {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array');
    return [];
  }


  let query = supabase
    .from('guides')
    .select('*');


  if (filters.category) {
    query = query.eq('category', filters.category);
  }


  if (filters.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }


  if (filters.featured) {
    query = query.eq('featured', true);
  }


  if (filters.tags && filters.tags.length > 0) {
    query = query.contains('tags', filters.tags);
  }


  query = query.order('published_date', { ascending: false });


  const { data, error } = await query;


  if (error) {
    console.error('Error fetching guides:', error);
    return [];
  }
  return data || [];
}


export async function getGuideById(id) {
  if (!supabase) return null;


  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .eq('id', id)
    .single();


  if (error) {
    console.error('Error fetching guide:', error);
    return null;
  }
  return data;
}


export async function getFeaturedGuides(limit = 3) {
  if (!supabase) return [];


  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .eq('featured', true)
    .order('published_date', { ascending: false })
    .limit(limit);


  if (error) {
    console.error('Error fetching featured guides:', error);
    return [];
  }
  return data || [];
}




// ============================================================================
// GLOSSARY
// ============================================================================
export async function getGlossary(forceRefresh = false) {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array');
    return [];
  }


  // Return cached data if still valid
  if (!forceRefresh && glossaryCache && Date.now() - glossaryCacheTime < CACHE_DURATION) {
    return glossaryCache;
  }


  const { data, error } = await supabase
    .from('glossary')
    .select('*')
    .order('term', { ascending: true });


  if (error) {
    console.error('Error fetching glossary:', error);
    return glossaryCache || []; // Return stale cache if available
  }


  glossaryCache = data || [];
  glossaryCacheTime = Date.now();
  return glossaryCache;
}


export async function getGlossaryByCategory(category) {
  if (!supabase) return [];


  const { data, error } = await supabase
    .from('glossary')
    .select('*')
    .eq('category', category)
    .order('term', { ascending: true });


  if (error) {
    console.error('Error fetching glossary by category:', error);
    return [];
  }
  return data || [];
}


export async function searchGlossary(searchTerm) {
  if (!supabase) return [];


  const { data, error } = await supabase
    .from('glossary')
    .select('*')
    .or(`term.ilike.%${searchTerm}%,definition.ilike.%${searchTerm}%`)
    .order('term', { ascending: true });


  if (error) {
    console.error('Error searching glossary:', error);
    return [];
  }
  return data || [];
}


// ============================================================================
// RESOURCES
// ============================================================================
export async function getResources(category = null) {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array');
    return [];
  }


  let query = supabase
    .from('resources')
    .select('*');


  if (category) {
    query = query.eq('category', category);
  }


  query = query.order('created_at', { ascending: false });


  const { data, error } = await query;


  if (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
  return data || [];
}


// ============================================================================
// GALLERY
// ============================================================================


export async function getGalleryItems(limit = null) {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array');
    return [];
  }


  let query = supabase
    .from('gallery_items')
    .select('*')
    .order('event_date', { ascending: false });


  if (limit) {
    query = query.limit(limit);
  }


  const { data, error } = await query;


  if (error) {
    console.error('Error fetching gallery items:', error);
    return [];
  }
  return data || [];
}


// ============================================================================
// TIMELINE
// ============================================================================


export async function getTimelineEvents() {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array');
    return [];
  }


  const { data, error } = await supabase
    .from('timeline_events')
    .select('*');


  if (error) {
    console.error('Error fetching timeline events:', error);
    return [];
  }


  if (!data) return [];


  // Map events to include year/month and sort in descending order
  const timelineEvents = data
    .map(event => {
      const date = event.event_date ? new Date(event.event_date) : null;
      return {
        ...event,
        year: date ? date.getFullYear() : 0,
        month: date ? date.getMonth() + 1 : 0 // JS months are 0-indexed
      };
    })
    .sort((a, b) => {
      // Sort by year descending, then month descending
      if (b.year !== a.year) return b.year - a.year;
      return b.month - a.month;
    });


  return timelineEvents;
}




// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================


// Clear all caches (useful after sync operations)
export function clearCache() {
  glossaryCache = null;
  glossaryCacheTime = null;
}


// Check if Supabase is configured
export function isSupabaseConfigured() {
  return supabase !== null;
}
