// src/components/SandboxCTA.jsx
import React from "react";
import "./SandboxCTA.css";

const SandboxCTA = () => {
  return (
    <div className="blog-cta">
      <h2>Help Shape DataSoc: Share Your Project/Workshop Ideas</h2>

      <p>Share a topic you’re passionate about!</p>
      <p><strong>Fill out our interest form to make that idea to life.</strong></p>

      {/* External link (100% reliable) */}
      <a
        href="https://tr.ee/ZJHyPXI9IE"// replace with actual link
        target="_blank"
        rel="noopener noreferrer"
        className="cta-button"
      >
        Submit Your Sandbox
      </a>
    </div>
  );
};

export default SandboxCTA;