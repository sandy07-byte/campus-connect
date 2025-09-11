import React, { useEffect, useState } from "react";
import "./AuthModal.css";

const ROLES = [
  { key: "student", label: "Student", initial: "S" },
  { key: "parent", label: "Parent", initial: "P" },
  { key: "teacher", label: "Teacher", initial: "T" },
];

const AuthModal = ({ open, onClose, view = "login" }) => {
  const [currentView, setCurrentView] = useState(view); // 'login' | 'register'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  useEffect(() => {
    setCurrentView(view);
  }, [view]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const title = currentView === "register" ? "Register" : "Log In";
  const primaryText = currentView === "register" ? "Register" : "Log In";

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hook up to your auth API here
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" aria-label="Close" onClick={onClose}>×</button>
        <h2 className="auth-title">{title}</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="auth-username">Username</label>
            <input
              id="auth-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="auth-primary">{primaryText}</button>
        </form>

        <div className="auth-links">
          <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password</a>
          <span> / </span>
          <a href="#" onClick={(e) => e.preventDefault()}>Unlock Account</a>
        </div>

        <div className="auth-role-label">Continue as</div>
        <div className="auth-roles">
          {ROLES.map((r) => (
            <button
              key={r.key}
              className={`auth-role ${role === r.key ? "active" : ""}`}
              onClick={() => setRole(r.key)}
              type="button"
            >
              <span className="auth-role-icon" aria-hidden>
                {r.initial}
              </span>
              <span className="auth-role-text">{r.label}</span>
            </button>
          ))}
        </div>

        <div className="auth-switch">
          {currentView === "register" ? (
            <>
              Already have an account? {" "}
              <button className="auth-link-button" onClick={() => setCurrentView("login")}>Log In</button>
            </>
          ) : (
            <>
              New here? {" "}
              <button className="auth-link-button" onClick={() => setCurrentView("register")}>Register</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
