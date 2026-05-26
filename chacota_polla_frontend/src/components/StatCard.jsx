import React from "react";

export default function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
        {subtitle && <small>{subtitle}</small>}
      </div>
    </div>
  );
}
