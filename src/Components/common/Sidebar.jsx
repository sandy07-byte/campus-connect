import React, { useState } from 'react';
import './Sidebar.css';

export default function Sidebar({ items = [], onNavigate }) {
  const [open, setOpen] = useState(false);
  return (
    <aside className={"cc-sidebar " + (open ? 'open' : '')}>
      <button className="cc-sidebar-toggle" onClick={() => setOpen(o => !o)}>☰</button>
      <nav className="cc-sidebar-nav">
        {items.map((it) => (
          <button key={it.key} className="cc-sidebar-item" onClick={() => onNavigate?.(it)}>
            {it.icon && <span className="cc-sidebar-icon">{it.icon}</span>}
            <span className="cc-sidebar-label">{it.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}


