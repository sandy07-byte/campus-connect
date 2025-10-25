import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: '', message: '' });
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['student', 'teacher', 'admin'].includes(roleParam)) {
      setRole(roleParam);
    } else {
      // If no valid role in URL, redirect to role selection
      navigate('/role-selection');
    }
  }, [navigate, searchParams]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setStatus({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: 'info', message: 'Signing in...' });

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Login failed. Please check your credentials.");
      }

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Redirect based on role
      switch(data.user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'teacher':
          navigate('/dashboard/teacher');
          break;
        case 'student':
          navigate('/dashboard/student');
          break;
        default:
          navigate('/');
      }
      
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToRoles = () => {
    navigate('/role-selection');
  };

  const getRoleTitle = () => {
    return role.charAt(0).toUpperCase() + role.slice(1) + ' Login';
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <button 
            onClick={handleBackToRoles}
            className="back-button"
            aria-label="Back to role selection"
          >
            ←
          </button>
          <h2>{getRoleTitle()}</h2>
        </div>
        
        {status.message && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}
        
        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`Enter your ${role} email`}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <p className="auth-footer">
            Don't have an account?{' '}
            <span 
              onClick={() => navigate(`/register?role=${role}`)} 
              className="auth-link"
            >
              Register here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;


