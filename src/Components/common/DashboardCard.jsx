import React from 'react';
import './DashboardCard.css';

export default function DashboardCard({ title, subtitle, onClick }) {
  return (
    <button className="cc-card" onClick={onClick}>
      <div className="cc-card-title">{title}</div>
      {subtitle && <div className="cc-card-sub">{subtitle}</div>}
    </button>
  );
}


