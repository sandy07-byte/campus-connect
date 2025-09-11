import React, { useState } from 'react';
import './AuthModal.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, apiFetch } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch('/auth/login', { method:'POST', body: JSON.stringify({ email, password }) });
      login(data.user, data.token);
      if (data.user.role === 'student') navigate('/student');
      else if (data.user.role === 'teacher') navigate('/teacher');
      else navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-modal">
        <h2 className="auth-title">Log In</h2>
        <form className="auth-form" onSubmit={onSubmit}>
          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input id="login-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
          </div>
          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
          </div>
          <button type="submit" className="auth-primary">Log In</button>
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
