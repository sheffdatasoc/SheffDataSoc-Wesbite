/* ========================================
   MemberCard.jsx
   ======================================== */

import React from 'react';
import './MemberCard.css';

function MemberCard({ name, role, bio, skills = [], image, social = {} }) {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="member-card">
      <div className="member-avatar">
        {image ? (
          <img src={image} alt={name} />
        ) : (
          getInitials(name)
        )}
      </div>
      <h3 className="member-name">{name}</h3>
      <p className="member-role">{role}</p>
      <p className="member-bio">{bio}</p>
      {skills.length > 0 && (
        <div className="member-skills">
          {skills.map((skill, index) => (
            <span key={index} className="tag">{skill}</span>
          ))}
        </div>
      )}
      <div className="member-social">
        {social.linkedin && (
          <a href={social.linkedin} className="social-link" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        )}
        {social.github && (
          <a href={social.github} className="social-link" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        )}
        {social.twitter && (
          <a href={social.twitter} className="social-link" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        )}
      </div>
    </div>
  );
}

export default MemberCard;