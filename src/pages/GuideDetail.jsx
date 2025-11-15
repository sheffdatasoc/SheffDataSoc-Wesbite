import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Tag, Menu, X, ArrowUp, List } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";
import { unified } from "unified";
import remarkParse from "remark-parse";

import { supabase } from "../lib/supabase";
import "./GuideDetail.css";
import "prismjs/themes/prism-tomorrow.css";

function GuideDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tocOpen, setTocOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  /* Scroll to top */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setFabOpen(false);
  };

  /* Fetch guide */
  useEffect(() => {
    async function fetchGuide() {
      const { data } = await supabase
        .from("guides")
        .select("*")
        .eq("id", id)
        .single();

      setGuide(data);
      setLoading(false);
    }
    fetchGuide();
  }, [id]);

  /* Slug generator */
  const generateSlug = (text) =>
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  /* Extract headings */
  const toc = useMemo(() => {
    if (!guide?.content) return [];

    const tree = unified().use(remarkParse).parse(guide.content);
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
          headings.push({
            level: node.depth,
            text,
            id: generateSlug(text),
          });
        }
      }

      if (node.children) node.children.forEach(walk);
    }

    walk(tree);
    return headings;
  }, [guide?.content]);

  /* Scroll spy */
  useEffect(() => {
    if (toc.length === 0) return;

    const onScroll = () => {
      let activeHeading = null;

      for (const heading of toc) {
        const el = document.getElementById(heading.id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= 150) {
          activeHeading = heading;
        }
      }

      document
        .querySelectorAll(".floating-toc a")
        .forEach((a) => a.classList.remove("active"));

      if (activeHeading) {
        const link = document.querySelector(
          `.floating-toc a[href="#${activeHeading.id}"]`
        );
        if (link) link.classList.add("active");
      }
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [toc]);

  /* Markdown heading components */
  const components = {
    h1: ({ children }) => {
      const text = String(children);
      const id = generateSlug(text);
      return (
        <h1 id={id} className="markdown-heading">
          {children}
          <a href={`#${id}`} className="header-anchor">#</a>
        </h1>
      );
    },
    h2: ({ children }) => {
      const text = String(children);
      const id = generateSlug(text);
      return (
        <h2 id={id} className="markdown-heading">
          {children}
          <a href={`#${id}`} className="header-anchor">#</a>
        </h2>
      );
    },
    h3: ({ children }) => {
      const text = String(children);
      const id = generateSlug(text);
      return (
        <h3 id={id} className="markdown-heading">
          {children}
          <a href={`#${id}`} className="header-anchor">#</a>
        </h3>
      );
    },
  };

  if (loading) return <div className="guide-detail-page">Loading...</div>;
  if (!guide) return <div className="guide-detail-page">Guide not found.</div>;

  return (
    <div className="guide-detail-page">
      <button onClick={() => navigate("/guides")} className="back-button">
        <ArrowLeft size={20} /> Back to Guides
      </button>

      {/* Floating Action Buttons */}
      {toc.length > 0 && (
        <div className="fab-container">
          <button
            className={`floating-toc-button ${fabOpen ? "active" : ""}`}
            onClick={() => setFabOpen(!fabOpen)}
            aria-label="Quick actions"
          >
            {fabOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`fab-actions ${fabOpen ? "open" : ""}`}>
            <button
              className="fab-action-btn"
              onClick={scrollToTop}
              aria-label="Scroll to top"
            >
              <ArrowUp size={20} />
              <span>Top</span>
            </button>

            <button
              className="fab-action-btn"
              onClick={() => {
                setTocOpen(true);
                setFabOpen(false);
              }}
              aria-label="Open table of contents"
            >
              <List size={20} />
              <span>Contents</span>
            </button>
          </div>
        </div>
      )}

      {/* TOC Drawer */}
      {toc.length > 0 && (
        <>
          <div
            className={`toc-backdrop ${tocOpen ? "active" : ""}`}
            onClick={() => setTocOpen(false)}
          />

          <aside className={`floating-toc ${tocOpen ? "open" : ""}`}>
            <div className="toc-header">
              <h2>Contents</h2>
              <button
                className="toc-close-btn"
                onClick={() => setTocOpen(false)}
                aria-label="Close table of contents"
              >
                <X size={20} />
              </button>
            </div>

            <ul>
              {toc.map((h) => (
                <li key={h.id} className={`level-${h.level}`}>
                  <a href={`#${h.id}`} onClick={() => setTocOpen(false)}>
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </>
      )}

      <div className="guide-layout">
        <div className="guide-layout-right">
          <article className="guide-detail-container">
            <h1 className="guide-title">{guide.title}</h1>

            <div className="guide-meta">
              {guide.author && <span>{guide.author}</span>}
              {guide.difficulty && <span>{guide.difficulty}</span>}
              {guide.read_time && (
                <span className="guide-readtime">
                  <Clock size={16} /> {guide.read_time} min read
                </span>
              )}
            </div>

            {guide.category && (
              <div className="guide-category">
                <Tag size={16} />
                <span>{guide.category}</span>
              </div>
            )}

            {guide.description && (
              <p className="guide-description">{guide.description}</p>
            )}

            <div className="guide-content markdown-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypePrism]}
                components={components}
              >
                {guide.content}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

export default GuideDetail;
