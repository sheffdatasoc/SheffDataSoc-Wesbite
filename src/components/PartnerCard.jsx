// /components/PartnerCard.jsx
import React from 'react';
import { ExternalLink } from 'lucide-react';
import './PartnerCard.css';

function PartnerCard({ name, description, tier, logo, website }) {

  const safeTier = (tier || "Bronze").toLowerCase();
  const safeName = name || "Partner";
  const safeDescription = description && description !== "EMPTY" ? description : "";
  const safeWebsite = website || "#";
  const safeLogo = logo || "";

  return (
    <div className="partner-card">
      <span className={`partner-tier tier-${safeTier}`}>
        {(tier || "Bronze")} Partner
      </span>
      
      <div className="partner-logo-container">
        {safeLogo ? (
          <img 
            src={safeLogo}
            alt={safeName}
            className="partner-logo"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        <div className="partner-logo-fallback" style={{display: safeLogo ? "none" : "flex"}}>
          {safeName}
        </div>
      </div>

      <h3 className="partner-name">{safeName}</h3>

      {safeDescription && (
        <p className="partner-description">{safeDescription}</p>
      )}
      
      <a 
        href={safeWebsite}
        target="_blank"
        rel="noopener noreferrer"
        className="partner-link"
      >
        Visit Website
        <ExternalLink size={16} />
      </a>
    </div>
  );
}

export default PartnerCard;
