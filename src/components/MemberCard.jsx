/* ========================================
   MemberCard.jsx
   ======================================== */
import React from 'react';
import { Github, Linkedin } from 'lucide-react';
import './MemberCard.css';

function MemberCard({ member }) {
  // Check if member has the toJSON method (it's a Member instance)
  const memberData = member.toJSON ? member.toJSON() : member;

  return (
    <div className="member-card">
      <div className="member-avatar">
        {memberData.imageUrl ? (
          <img src={memberData.imageUrl} alt={memberData.name} />
        ) : (
          <div className="avatar-initials">
            {memberData.initials}
          </div>
        )}
      </div>

      <div className="member-info">
        <h3 className="member-name">{memberData.name}</h3>
        <p className="member-position">{memberData.role}</p>
        
        {memberData.year && (
          <p className="member-detail">{memberData.year}</p>
        )}
        
        {memberData.major && (
          <p className="member-detail">{memberData.major}</p>
        )}
        
        {memberData.cleanBio && memberData.cleanBio !== 'No bio available' && (
          <p className="member-bio">{memberData.cleanBio}</p>
        )}

        {memberData.interests && memberData.interests.length > 0 && (
          <div className="member-interests">
            {memberData.interests.map((interest, index) => (
              <span key={index} className="interest-tag">
                {interest}
              </span>
            ))}
          </div>
        )}

        {/* Social Links */}
        {(memberData.linkedinUrl || memberData.githubUrl) && (
          <div className="social-links">
            {memberData.linkedinUrl && (
              <a 
                href={memberData.linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-button"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            )}
            {memberData.githubUrl && (
              <a 
                href={memberData.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-button"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MemberCard;