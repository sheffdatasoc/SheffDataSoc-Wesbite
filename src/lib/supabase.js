import { createClient } from '@supabase/supabase-js';
import { createMembers } from '../entities/Member';
import { createBlogPost, createBlogPosts } from '../entities/BlogPost';

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

// Helper function to fetch all blog posts
export async function getBlogPosts() {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array');
    return [];
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_date', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return createBlogPosts(data);
}

// Helper function to fetch a single blog post by ID
export async function getBlogPostById(id) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }

  return createBlogPost(data);
}

// Helper function to fetch all events
export async function getEvents() {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array');
    return [];
  }

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return data;
}

// Helper function to fetch all projects
export async function getProjects() {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array');
    return [];
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data;
}

// Helper function to fetch all members
export async function getMembers() {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array');
    return [];
  }

  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching members:', error);
    return [];
  }

  return createMembers(data);
}

// Helper function to fetch all guides
export async function getGuides() {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array');
    return [];
  }

  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching guides:', error);
    return [];
  }

  return data;
}

// Helper function to fetch a single guide by ID
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

// Helper function to fetch all resources
export async function getResources() {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array');
    return [];
  }

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching resources:', error);
    return [];
  }

  return data;
}

// Helper function to fetch all glossary terms
export async function getGlossary() {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array');
    return [];
  }

  const { data, error } = await supabase
    .from('glossary')
    .select('*')
    .order('term', { ascending: true });

  if (error) {
    console.error('Error fetching glossary:', error);
    return [];
  }

  return data;
}

// Helper function to fetch all gallery items
export async function getGalleryItems() {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array');
    return [];
  }

  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching gallery items:', error);
    return [];
  }

  return data;
}

// Helper function to fetch all timeline events
export async function getTimelineEvents() {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array');
    return [];
  }

  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .order('year', { ascending: false })
    .order('month', { ascending: false });

  if (error) {
    console.error('Error fetching timeline events:', error);
    return [];
  }

  return data;
}