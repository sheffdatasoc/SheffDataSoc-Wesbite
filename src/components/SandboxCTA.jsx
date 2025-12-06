// src/components/SandboxCTA.jsx
import React from "react";
import "./SandboxCTA.css";

const SandboxCTA = () => {
  return (
    // 👇 ADD THIS ID HERE
    <div className="blog-cta" id="propose-idea">
      <h2>Help Shape DataSoc</h2>
      
      <p>
        Share your project ideas. <br className="mobile-break" />
        <strong>Fill out our interest form to bring them to life.</strong>
      </p>

      <a
        href="https://tr.ee/ZJHyPXI9IE"
        target="_blank"
        rel="noopener noreferrer"
        className="cta-button"
      >
        Submit Your Idea
      </a>
    </div>
  );
};

export default SandboxCTA;