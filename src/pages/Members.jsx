import React from 'react';
import { useMembers } from '../hooks/useSupabase';

function Members() {
  const { members, loading, error } = useMembers();

  if (loading) return <div className="page"><h1>Loading members...</h1></div>;
  if (error) return <div className="page"><h1>Error: {error}</h1></div>;

  return (
    <div className="page">
      <h1>Our Team</h1>
      <div className="members-grid">
        {members.map(member => (
          <div key={member.id} className="member-card">
            <h3>{member.name}</h3>
            <p className="role">{member.role}</p>
            <p>{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Members;