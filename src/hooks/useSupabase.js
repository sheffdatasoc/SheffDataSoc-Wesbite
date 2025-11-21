import { useState, useEffect } from 'react';
import {
  getBlogPosts,
  getBlogPostById,
  getEvents,
  getProjects,
  getMembers,
  getGuides,
  getResources,
  getGlossary,
  getGalleryItems,
  getTimelineEvents
} from '../lib/supabase';




// Custom hook to fetch blog posts
export function useBlogPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);




  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const data = await getBlogPosts();
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error('Error in useBlogPosts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }




    fetchPosts();
  }, []);




  return { posts, loading, error };
}




// Custom hook to fetch a single blog post by ID
export function useBlogPost(id) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);




  useEffect(() => {
    async function fetchPost() {
      if (!id) {
        setLoading(false);
        return;
      }




      try {
        setLoading(true);
        const data = await getBlogPostById(id);
        setPost(data);
        setError(null);
      } catch (err) {
        console.error('Error in useBlogPost:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }




    fetchPost();
  }, [id]);




  return { post, loading, error };
}




// Custom hook to fetch events
export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);




  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error('Error in useEvents:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }




    fetchEvents();
  }, []);




  return { events, loading, error };
}




// Custom hook to fetch projects
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);




  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error in useProjects:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }




    fetchProjects();
  }, []);




  return { projects, loading, error };
}




// Custom hook to fetch members
export function useMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);




  useEffect(() => {
    async function fetchMembers() {
      try {
        setLoading(true);
        const data = await getMembers();
        setMembers(data);
        setError(null);
      } catch (err) {
        console.error('Error in useMembers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }




    fetchMembers();
  }, []);




  return { members, loading, error };
}




export function useGuides() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);




  useEffect(() => {
    async function fetchGuides() {
      try {
        setLoading(true);
        const data = await getGuides();
        setGuides(data);
        setError(null);
      } catch (err) {
        console.error('Error in useGuides:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
   
    fetchGuides();
  }, []);




  return { guides, loading, error };
}




export function useGlossary() {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);




  useEffect(() => {
    async function fetchTerms() {
      try {
        setLoading(true);
        const data = await getGlossary();
        setTerms(data);
        setError(null);
      } catch (err) {
        console.error('Error in useGlossary:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
   
    fetchTerms();
  }, []);




  return { terms, loading, error };
}




export function useResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);




  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        const data = await getResources();
        setResources(data);
        setError(null);
      } catch (err) {
        console.error('Error in useResources:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
   
    fetchResources();
  }, []);




  return { resources, loading, error };
}




export function useTimelineEvents() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);




  useEffect(() => {
    async function fetchTimeline() {
      try {
        setLoading(true);
        const data = await getTimelineEvents(); // your Supabase query
        setTimeline(data);
        setError(null);
      } catch (err) {
        console.error('Error in useTimelineEvents:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }


    fetchTimeline();
  }, []);


  return { timeline, loading, error };
}


// Custom hook to fetch gallery items
export function useGalleryItems(limit = null) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    async function fetchGallery() {
      try {
        setLoading(true);
        const data = await getGalleryItems(limit);
        setItems(data);
        setError(null);
      } catch (err) {
        console.error("Error in useGalleryItems:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }


    fetchGallery();
  }, [limit]);


  return { items, loading, error };
}

