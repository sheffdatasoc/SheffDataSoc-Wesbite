/* ========================================
   PartnerCard Component
   /components/PartnerCard.jsx
   ======================================== */

import React from 'react';
import { ExternalLink } from 'lucide-react';
import './PartnerCard.css';

function PartnerCard({ name, description, tier, logo, website }) {
  return (
    <div className="partner-card">
      <span className={`partner-tier tier-${tier.toLowerCase()}`}>
        {tier} Partner
      </span>
      
      <div className="partner-logo-container">
        <img 
          src={logo} 
          alt={name}
          className="partner-logo"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="partner-logo-fallback" style={{display: 'none'}}>
          {name}
        </div>
      </div>

      <h3 className="partner-name">{name}</h3>
      <p className="partner-description">{description}</p>
      
      <a 
        href={website} 
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