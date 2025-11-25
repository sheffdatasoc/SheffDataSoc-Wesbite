import React, { useState } from 'react';
import { useMembers } from '../hooks/useSupabase';
import MemberCard from '../components/MemberCard';
import { Search } from 'lucide-react';
import './Members.css';

// --- Helper Functions ---

const getMemberYear = (member) => {
  return member.academic_year || 'Unknown';
};

const isCommitteeMember = (member) => {
  // NEW LOGIC: Checks the database flag directly
  // This gives you manual control via the Notion column
  return member.is_committee === true;
};

const checkMemberMatches = (member, query) => {
  if (!query) return true;
  const lowerQuery = query.toLowerCase();
  
  return (
    (member.name && member.name.toLowerCase().includes(lowerQuery)) ||
    (member.role && member.role.toLowerCase().includes(lowerQuery)) ||
    (member.major && member.major.toLowerCase().includes(lowerQuery))
  );
};

// ------------------------------------------------

function Members() {
  const { members, loading } = useMembers();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('extended');

  // Get unique academic years and sort them (most recent first)
  const academicYears = [...new Set(members.map(m => getMemberYear(m)))]
    .filter(year => year !== 'Unknown')
    .sort((a, b) => {
      // Sort by first year in format "2024/25"
      const yearA = parseInt(a.split('/')[0]);
      const yearB = parseInt(b.split('/')[0]);
      return yearB - yearA; // Most recent first
    });

  // Group members by academic year
  const membersByYear = academicYears.reduce((acc, year) => {
    acc[year] = members.filter(member => {
      
      const matchesSearch = checkMemberMatches(member, searchQuery);
      const matchesYear = getMemberYear(member) === year;
      
      // Tab Logic:
      // 'extended' -> Shows everyone (Extended + Core + Members)
      // 'committee' -> Shows only those marked as Committee in Notion
      const matchesTab = activeTab === 'extended' 
        ? true 
        : isCommitteeMember(member);
      
      return matchesSearch && matchesYear && matchesTab;
    });
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="members-page">
        <div className="members-header">
          <h1>Our Team</h1>
          <p>Loading members...</p>
        </div>
      </div>
    );
  }

  // Check if there are any members to display
  const hasMembers = academicYears.some(year => membersByYear[year] && membersByYear[year].length > 0);

  return (
    <div className="members-page">
      {/* Header */}
      <div className="members-header">
        <h1>Our Team</h1>
        <p>Meet the amazing people who make our society vibrant and dynamic</p>
      </div>

      {/* Search Bar */}
      <div className="members-search">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search members by name, position, or major..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="members-tabs">
        <button
          className={`tab-button ${activeTab === 'extended' ? 'active' : ''}`}
          onClick={() => setActiveTab('extended')}
        >
          Extended Committee
        </button>
        <button
          className={`tab-button ${activeTab === 'committee' ? 'active' : ''}`}
          onClick={() => setActiveTab('committee')}
        >
          Committee
        </button>
      </div>

      {/* Members Grid by Year */}
      {hasMembers ? (
        <div className="members-by-year">
          {academicYears.map(year => {
            const yearMembers = membersByYear[year];
            if (!yearMembers || yearMembers.length === 0) return null;

            return (
              <div key={year} className="year-section">
                <h2 className="year-heading">{year}</h2>
                <div className="members-grid">
                  {yearMembers.map(member => (
                    <MemberCard key={member.id || member.notion_id} member={member} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <p>No members found {searchQuery && `matching "${searchQuery}"`}</p>
        </div>
      )}
    </div>
  );
}

export default Members;