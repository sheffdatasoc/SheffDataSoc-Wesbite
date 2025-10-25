import React from 'react';

function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <h3 className="stat-value">{value}</h3>
      <p className="stat-title">{title}</p>
    </div>
  );
}

export default StatCard;