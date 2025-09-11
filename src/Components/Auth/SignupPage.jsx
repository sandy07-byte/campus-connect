import React, { useState } from 'react';
import './AuthModal.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const { apiFetch } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/auth/register', { method:'POST', body: JSON.stringify({ name, email, password, role }) });
      alert('Registered successfully. Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-modal">
        <h2 className="auth-title">Register</h2>
        <form className="auth-form" onSubmit={onSubmit}>
          <div className="auth-field">
            <label htmlFor="signup-name">Name</label>
            <input id="signup-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-email">Email</label>
            <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>
            <input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required />
          </div>
          <div className="auth-role-label">Continue as</div>
          <div className="auth-roles">
            {['student','teacher'].map((r) => (
              <button type="button" key={r} className={`auth-role ${role === r ? 'active' : ''}`} onClick={() => setRole(r)}>
                <span className="auth-role-icon">{r[0].toUpperCase()}</span>
                <span className="auth-role-text">{r.charAt(0).toUpperCase()+r.slice(1)}</span>
              </button>
            ))}
          </div>
          <button type="submit" className="auth-primary">Register</button>
        </form>
        <div className="auth-links">
          <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password</a>
          <span> / </span>
          <a href="#" onClick={(e) => e.preventDefault()}>Unlock Account</a>
        </div>
      </div>
    </div>
  );
}
