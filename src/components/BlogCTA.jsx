// src/components/BlogCTA.jsx
import React from "react";
import "./BlogCTA.css";

const BlogCTA = () => {
  return (
    <div className="blog-cta">
      <h2>Write for DataSoc – Get Featured!</h2>

      <p>Share a topic you’re passionate about!</p>
      <p><strong>Fill out our interest form to get featured on our website.</strong></p>

      {/* External link (100% reliable) */}
      <a
        href="https://tr.ee/ZJHyPXI9IE"
        target="_blank"
        rel="noopener noreferrer"
        className="cta-button"
      >
        Submit Your Blog
      </a>
    </div>
  );
};

export default BlogCTA;
