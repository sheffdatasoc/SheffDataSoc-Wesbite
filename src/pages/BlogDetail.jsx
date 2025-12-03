import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, ArrowUp, List, Menu, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypePrism from 'rehype-prism-plus';
import { unified } from "unified";
import remarkParse from "remark-parse";
import GiscusThemeSwitcher from '../components/GiscusTheme';

import { getBlogPostById } from '../lib/supabase';
import './BlogDetail.css';
import "prismjs/themes/prism-tomorrow.css";

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tocOpen, setTocOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  /* Scroll to top */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setFabOpen(false);
  };

  /* Fetch Blog Post */
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        const data = await getBlogPostById(id);
        setPost(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPost();
  }, [id]);

  /* --- TOC Logic --- */
  const generateSlug = (text) =>
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const toc = useMemo(() => {
    if (!post?.content) return [];
    const tree = unified().use(remarkParse).parse(post.content);
    const headings = [];
    function walk(node) {
      if (node.type === "heading" && node.depth <= 3) {
        const text = node.children
          .map((c) => {
            if (c.type === "text") return c.value;
            if (c.type === "inlineCode") return c.value;
            if (c.type === "emphasis" || c.type === "strong") {
              return c.children.map((child) => child.value).join("");
            }
            return "";
          })
          .join("")
          .trim();

        if (text) {
          headings.push({ level: node.depth, text, id: generateSlug(text) });
        }
      }
      if (node.children) node.children.forEach(walk);
    }
    walk(tree);
    return headings;
  }, [post?.content]);

  useEffect(() => {
    if (toc.length === 0) return;
    const onScroll = () => {
      let activeHeading = null;
      for (const heading of toc) {
        const el = document.getElementById(heading.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 150) activeHeading = heading;
      }
      document.querySelectorAll(".floating-toc a").forEach((a) => a.classList.remove("active"));
      if (activeHeading) {
        const link = document.querySelector(`.floating-toc a[href="#${activeHeading.id}"]`);
        if (link) link.classList.add("active");
      }
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [toc]);

  /* Markdown components with headings */
  const components = {
    h1: ({ children }) => {
      const text = String(children);
      const id = generateSlug(text);
      return <h1 id={id} className="markdown-heading">{children}<a href={`#${id}`} className="header-anchor">#</a></h1>;
    },
    h2: ({ children }) => {
      const text = String(children);
      const id = generateSlug(text);
      return <h2 id={id} className="markdown-heading">{children}<a href={`#${id}`} className="header-anchor">#</a></h2>;
    },
    h3: ({ children }) => {
      const text = String(children);
      const id = generateSlug(text);
      return <h3 id={id} className="markdown-heading">{children}<a href={`#${id}`} className="header-anchor">#</a></h3>;
    },
  };

  /* --- Giscus Integration --- */
  useEffect(() => {
    if (!post) return;
    const script = document.createElement('script');
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", "sheffdatasoc/SheffDataSoc-Wesbite");
    script.setAttribute("data-repo-id", "R_kgDOP3f9TQ"); 
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", "DIC_kwDOP3f9Tc4CzUdv"); 
    script.setAttribute("data-mapping", "pathname"); // each page uses pathname for unique comments
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "en");

    const container = document.getElementById("giscus-container");
    if (container) container.appendChild(script);
  }, [post]);

  const formattedDate = post?.published_date
    ? new Date(post.published_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : null;

  if (loading) return <div className="blog-detail-page"><div className="loading">Loading...</div></div>;
  if (error || !post) return (
    <div className="blog-detail-page">
      <div className="error">{error ? `Error: ${error}` : 'Blog post not found'}</div>
      <button onClick={() => navigate('/blog')} className="back-button"><ArrowLeft size={20} /> Back to Blog</button>
    </div>
  );

  return (
    <div className="blog-detail-page">
      <button onClick={() => navigate('/blog')} className="back-button"><ArrowLeft size={20} /> Back to Blog</button>

      {/* --- FAB / TOC --- */}
      {toc.length > 0 && (
        <div className="fab-container">
          <button className={`floating-toc-button ${fabOpen ? "active" : ""}`} onClick={() => setFabOpen(!fabOpen)}>
            {fabOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className={`fab-actions ${fabOpen ? "open" : ""}`}>
            <button className="fab-action-btn" onClick={scrollToTop}><ArrowUp size={20} /><span>Top</span></button>
            <button className="fab-action-btn" onClick={() => { setTocOpen(true); setFabOpen(false); }}><List size={20} /><span>Contents</span></button>
          </div>
        </div>
      )}

      {toc.length > 0 && (
        <>
          <div className={`toc-backdrop ${tocOpen ? "active" : ""}`} onClick={() => setTocOpen(false)} />
          <aside className={`floating-toc ${tocOpen ? "open" : ""}`}>
            <div className="toc-header"><h2>Contents</h2>
              <button className="toc-close-btn" onClick={() => setTocOpen(false)}><X size={20} /></button>
            </div>
            <ul>{toc.map((h) => <li key={h.id} className={`level-${h.level}`}><a href={`#${h.id}`} onClick={() => setTocOpen(false)}>{h.text}</a></li>)}</ul>
          </aside>
        </>
      )}

      <article className="blog-detail-container">
        {post.category && <span className="blog-detail-tag">{post.category}</span>}
        <h1 className="blog-detail-title">{post.title}</h1>
        <div className="blog-detail-meta">
          <span className="blog-detail-author">{post.author}</span>
          {formattedDate && <div className="blog-detail-date"><Clock size={16} /><span>{formattedDate}</span></div>}
        </div>

        {post.image && (
          <div className="blog-detail-image-wrapper"><img src={post.image} alt={post.title} className="blog-detail-image" /></div>
        )}

        <div className="blog-detail-content markdown-body">
          {post.excerpt && <p className="blog-detail-excerpt">{post.excerpt}</p>}
          {post.content && <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypePrism]} components={components}>{post.content}</ReactMarkdown>}
        </div>

        <div className="comments-section">
          <h2>Comments</h2>
          <GiscusThemeSwitcher />
          <div id="giscus-container"></div>
        </div>
      </article>
    </div>
  );
}

export default BlogDetail;
