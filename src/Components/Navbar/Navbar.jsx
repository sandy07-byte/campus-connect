import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.jpg";    // adjust path if needed
import profile from "../../assets/profile.jpg"; // adjust path if needed
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [aboutDropdown, setAboutDropdown] = useState(false);
  const [facultyDropdown, setFacultyDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const profileRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="navbar">
      {/* Left side: Logo */}
      <div className="nav-left">
        <img src={logo} alt="School Logo" className="logo" />
      </div>

      {/* Center: Menu items */}
      <ul className="nav-center">
        <li><a href="/">Home</a></li>

        <li
          className="dropdown"
          onMouseEnter={() => setAboutDropdown(true)}
          onMouseLeave={() => setAboutDropdown(false)}
        >
          <a href="/history">About Us</a>
          {aboutDropdown && (
            <ul className="dropdown-menu">
              <li><a href="/history">History</a></li>
              <li><a href="/vision">Vision</a></li>
              <li><a href="/achievements">Achievements</a></li>
              <li><a href="/message">Message</a></li>
              <li><a href="/management">Management</a></li>
            </ul>
          )}
        </li>

        <li><a href="/achievements">Gallery</a></li>

        <li><a href="/management">Faculty</a></li>

        <li><a href="/message">Feedback</a></li>
        <li><Link to="/admission">Admission</Link></li>
      </ul>

      {/* Right side: Auth-aware actions */}
      <div className="nav-right" ref={profileRef}>
        {!user ? (
          <div className="nav-actions">
            <Link to="/login" className="nav-btn nav-btn-outline">Login</Link>
            <Link to="/signup" className="nav-btn nav-btn-primary">Register</Link>
          </div>
        ) : (
          <>
            <div className="nav-user" onClick={() => setProfileDropdown(prev => !prev)}>
              <img src={profile} alt="User" className="profile-icon" />
              <span className="nav-username">{user?.name || 'User'}</span>
            </div>
            <ul className={`menu-card profile-menu ${profileDropdown ? 'show' : ''}`}>
              <li><button className="menu-item-button" onClick={() => { setProfileDropdown(false); navigate(user?.role === 'teacher' ? '/teacher' : '/student'); }}>Profile</button></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Settings</a></li>
              <li><button className="menu-item-button" onClick={() => { logout(); setProfileDropdown(false); navigate('/'); }}>Logout</button></li>
            </ul>
          </>
        )}
      </div>
    </nav>
    </>
  );
};

export default Navbar;
