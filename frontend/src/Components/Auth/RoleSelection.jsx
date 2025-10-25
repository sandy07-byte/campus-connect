import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Auth/Auth.css';

function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Select Your Role</h2>
        <p className="role-subtitle">Choose how you want to access the portal</p>
        
        <div className="role-selection">
          <div className="role-card" onClick={() => handleRoleSelect('student')}>
            <div className="role-icon">🎓</div>
            <h3>Student</h3>
            <p>Access your dashboard, submit assignments, and track your progress.</p>
          </div>
          
          <div className="role-card" onClick={() => handleRoleSelect('teacher')}>
            <div className="role-icon">👨‍🏫</div>
            <h3>Faculty</h3>
            <p>Manage your courses, grade assignments, and interact with students.</p>
          </div>
          
          <div className="role-card" onClick={() => handleRoleSelect('admin')}>
            <div className="role-icon">🔑</div>
            <h3>Admin</h3>
            <p>Manage users, courses, and system settings.</p>
          </div>
        </div>
        
        <p className="role-footer">
          Don't have an account? <span onClick={() => navigate('/register')} className="auth-link">Register here</span>
        </p>
      </div>
    </div>
  );
}

export default RoleSelection;
