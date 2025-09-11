import React, { useState } from 'react';
import './DashboardNavbar.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardNavbar({ logoText = 'CampusConnect' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <header className="cc-topbar">
      <div className="cc-topbar-left">
        <div className="cc-logo">{logoText}</div>
        <div className="cc-welcome">Welcome, {user?.id} {user?.name}</div>
      </div>
      <div className="cc-topbar-right">
        <div className="cc-profile" onClick={() => setOpen(o => !o)}>
          <img className="cc-avatar" src="/vite.svg" alt="profile" />
        </div>
        {open && (
          <div className="cc-dropdown">
            <button onClick={() => { setOpen(false); navigate(user?.role === 'teacher' ? '/teacher' : '/student'); }}>Profile</button>
            <button onClick={() => setOpen(false)}>Change Password</button>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}


