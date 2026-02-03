import React, { useState } from 'react';
import { useMembers } from '../hooks/useSupabase';
import MemberCard from '../components/MemberCard';
import { Search } from 'lucide-react';
import './Members.css';

// --- Helper Functions ---

const getMemberYear = (member) => {
  return member.getAcademicYear ? member.getAcademicYear() : (member.academic_year || 'Unknown');
};

const isCommitteeMember = (member) => {
  // NEW LOGIC: Checks the database flag directly
  // This gives you manual control via the Notion column
  return member.is_committee === true;
};

const checkMemberMatches = (member, query) => {
  if (member.matchesSearch) return member.matchesSearch(query);

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
      const yearA = parseInt(a.split('/')[0]);
      const yearB = parseInt(b.split('/')[0]);
      return yearB - yearA;
    });

  // Hierarchy mapping
  const roleHierarchy = [
    { key: 'president', weight: 0 },
    { key: 'secretary', weight: 1 },
    { key: 'treasurer', weight: 2 },
    { key: 'inclusion officer', weight: 3 },
    { key: 'inclusions officer', weight: 3 },
    { key: 'social secretary', weight: 4 },
    { key: 'education officer', weight: 5 },
    { key: 'technical officer', weight: 6 },
    { key: 'vice president', weight: 0.5 } // Between President and Secretary
  ];

  const getRoleWeight = (role) => {
    if (!role) return 99;
    const lowerRole = role.trim().toLowerCase();

    // First try exact match for priority roles
    const exactMatch = roleHierarchy.find(h => lowerRole === h.key);
    if (exactMatch) return exactMatch.weight;

    // Then try include match for variations, but find the most specific one
    const includeMatch = roleHierarchy
      .filter(h => lowerRole.includes(h.key))
      .sort((a, b) => b.key.length - a.length)[0]; // Longest match first

    return includeMatch ? includeMatch.weight : 99;
  };

  // Group and sort members by academic year
  const membersByYear = academicYears.reduce((acc, year) => {
    const yearMembers = members.filter(member => {
      const matchesSearch = checkMemberMatches(member, searchQuery);
      const matchesYear = getMemberYear(member) === year;
      const matchesTab = activeTab === 'extended' ? true : isCommitteeMember(member);
      return matchesSearch && matchesYear && matchesTab;
    });

    // Sort by hierarchy then name
    acc[year] = yearMembers.sort((a, b) => {
      const weightA = getRoleWeight(a.role);
      const weightB = getRoleWeight(b.role);
      if (weightA !== weightB) return weightA - weightB;
      return (a.name || '').localeCompare(b.name || '');
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
                <h2 className="year-heading">
                  {year} {year === '2024/25' && <span className="founding-badge">(Founding Committee)</span>}
                </h2>
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