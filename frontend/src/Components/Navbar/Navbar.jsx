import React, { useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.jpg";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [aboutDropdown, setAboutDropdown] = useState(false);

  return (
    <nav className="navbar">
      {/* Left side: Logo */}
      <div className="nav-left">
        <img src={logo} alt="School Logo" className="logo" />
      </div>

      {/* Center: Menu items */}
      <ul className="nav-center">
        <li><Link to="/">Home</Link></li>

        <li
          className="dropdown"
          onMouseEnter={() => setAboutDropdown(true)}
          onMouseLeave={() => setAboutDropdown(false)}
        >
          <a href="/history">About Us</a>
          {aboutDropdown && (
            <ul className="dropdown-menu">
              <li><Link to="/history">History</Link></li>
              <li><Link to="/vision">Vision</Link></li>
              <li><Link to="/achievements">Achievements</Link></li>
              <li><Link to="/message">Message</Link></li>
              <li><Link to="/management">Management</Link></li>
            </ul>
          )}
        </li>

        <li><Link to="/gallery">Gallery</Link></li>
        <li><Link to="/management">Faculty</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
        <li><Link to="/admission">Admission</Link></li>
      </ul>

      {/* Right side: Auth actions */}
      <div className="nav-right" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Link to="/login" className="btn">Login</Link>
        <Link to="/register" className="btn">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
