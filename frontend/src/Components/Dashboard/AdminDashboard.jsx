import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './Dashboard.css';
import useRealtimeData from '../../hooks/useRealtimeData';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Get token for API calls
  const token = localStorage.getItem('token');

  // Use real-time data hook
  const { 
    data: dashboardData, 
    loading, 
    error, 
    isConnected 
  } = useRealtimeData('/admin/dashboard', 'admin', token);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleProfileSettings = () => {
    setShowProfileDropdown(false);
    alert('Profile settings feature coming soon!');
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '🏠' },
    { id: 'admissions', label: '📋 Admissions', icon: '📝' },
    { id: 'users', label: '👥 Users', icon: '👤' },
    { id: 'analytics', label: '📈 Analytics', icon: '📊' },
    { id: 'messages', label: '📬 Messages', icon: '💬' },
    { id: 'settings', label: '⚙️ Settings', icon: '🔧' }
  ];

  const mockData = {
    stats: {
      totalStudents: 1250,
      totalTeachers: 45,
      totalAdmins: 5,
      pendingAdmissions: 23,
      approvedAdmissions: 187,
      declinedAdmissions: 12
    },
    recentActivity: [
      { id: 1, type: 'admission', message: 'New admission application from Alice Johnson', time: '2 hours ago' },
      { id: 2, type: 'user', message: 'Teacher John Doe logged in', time: '3 hours ago' },
      { id: 3, type: 'message', message: 'New contact form submission', time: '5 hours ago' },
      { id: 4, type: 'admission', message: 'Admission approved for Bob Smith', time: '1 day ago' }
    ],
    contactMessages: [
      { id: 1, name: 'Sarah Wilson', email: 'sarah@email.com', subject: 'School Bus Inquiry', message: 'I would like to know about the bus routes...', date: '2024-01-10', status: 'unread' },
      { id: 2, name: 'Mike Brown', email: 'mike@email.com', subject: 'Fee Payment', message: 'When is the fee payment due?', date: '2024-01-09', status: 'read' },
      { id: 3, name: 'Lisa Garcia', email: 'lisa@email.com', subject: 'Admission Process', message: 'Can you explain the admission process?', date: '2024-01-08', status: 'read' }
    ]
  };

  const handleAdmissionAction = async (admissionId, action) => {
    try {
      const endpoint = action === 'approved' ? 'approve' : 'decline';
      const response = await fetch(`http://localhost:4000/api/admissions/${admissionId}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        const actionText = action === 'approved' ? 'approved' : 'declined';
        alert(`Admission ${actionText}! SMS sent: ${result.sms_sent ? 'Yes' : 'No'}`);
        
        // The real-time data hook will automatically update the UI
        // No need to manually update local state
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const renderOverview = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p>Error loading data: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      );
    }

    if (!dashboardData) {
      return <div>No data available</div>;
    }

    return (
      <motion.div 
        className="overview-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="overview-card"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="card-icon">👥</div>
          <h3>Total Students</h3>
          <p>{dashboardData.students.total.toLocaleString()} enrolled</p>
          <span className="card-highlight">
            {isConnected ? '🟢 Live Data' : '🔴 Offline'}
          </span>
        </motion.div>

        <motion.div 
          className="overview-card"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="card-icon">👩‍🏫</div>
          <h3>Teachers</h3>
          <p>{dashboardData.teachers.total} active teachers</p>
          <span className="card-highlight">45 departments</span>
        </motion.div>

        <motion.div 
          className="overview-card"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="card-icon">📋</div>
          <h3>Pending Admissions</h3>
          <p>{dashboardData.admissions.pending} applications</p>
          <span className="card-highlight">Requires review</span>
        </motion.div>

        <motion.div 
          className="overview-card"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="card-icon">📬</div>
          <h3>New Messages</h3>
          <p>{dashboardData.contacts.pending} unread messages</p>
          <span className="card-highlight">Contact forms</span>
        </motion.div>
      </motion.div>
    );
  };

  const renderAdmissions = () => (
    <motion.div 
      className="admissions-container"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="admissions-header">
        <h2>📋 Admission Management</h2>
        <div className="admission-filters">
          <select className="filter-select">
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>
      
      <div className="admissions-table">
        <div className="table-header">
          <div className="col">Student Name</div>
          <div className="col">Email</div>
          <div className="col">Class</div>
          <div className="col">Parent Contact</div>
          <div className="col">Status</div>
          <div className="col">Submitted</div>
          <div className="col">Actions</div>
        </div>
        {dashboardData?.admissions?.list?.map((admission) => (
          <motion.div 
            key={admission._id}
            className="table-row"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="col">
              <div className="student-info">
                <div className="student-avatar">👤</div>
                <span className="student-name">{admission.name}</span>
              </div>
                </div>
            <div className="col">{admission.email}</div>
            <div className="col">{admission.class}</div>
            <div className="col">{admission.parent_number}</div>
            <div className="col">
              <span className={`status-badge ${admission.status}`}>
                {admission.status === 'pending' ? '⏳ Pending' : 
                 admission.status === 'approved' ? '✅ Approved' : '❌ Declined'}
              </span>
                </div>
            <div className="col">{new Date(admission.createdAt).toLocaleDateString()}</div>
            <div className="col">
              <div className="action-buttons">
                {admission.status === 'pending' && (
                  <>
                    <motion.button 
                      className="approve-btn"
                      onClick={() => handleAdmissionAction(admission._id, 'approved')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ✅ Approve
                    </motion.button>
                    <motion.button 
                      className="decline-btn"
                      onClick={() => handleAdmissionAction(admission._id, 'declined')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ❌ Decline
                    </motion.button>
                  </>
                )}
                <motion.button 
                  className="view-btn"
                  onClick={() => {
                    setSelectedAdmission(admission);
                    setShowAdmissionModal(true);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  👁️ View
                </motion.button>
              </div>
            </div>
          </motion.div>
          ))}
        </div>
    </motion.div>
  );

  const renderUsers = () => (
    <motion.div 
      className="users-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="users-header">
        <h2>👥 User Management</h2>
        <div className="user-actions">
          <motion.button 
            className="add-user-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ➕ Add User
          </motion.button>
        </div>
      </div>

      <div className="user-tabs">
        <button className="user-tab active">Students</button>
        <button className="user-tab">Teachers</button>
        <button className="user-tab">Admins</button>
      </div>

      <div className="users-grid">
        <motion.div 
          className="user-card"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="user-avatar">👤</div>
          <div className="user-info">
            <h3>Alice Johnson</h3>
            <p>Grade 5A</p>
            <span className="user-status active">Active</span>
          </div>
          <div className="user-actions">
            <motion.button 
              className="edit-user-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✏️ Edit
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="user-card"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="user-avatar">👩‍🏫</div>
          <div className="user-info">
            <h3>Ms. Smith</h3>
            <p>Mathematics Teacher</p>
            <span className="user-status active">Active</span>
          </div>
          <div className="user-actions">
            <motion.button 
              className="edit-user-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✏️ Edit
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="user-card"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="user-avatar">👨‍💼</div>
          <div className="user-info">
            <h3>Mr. Admin</h3>
            <p>System Administrator</p>
            <span className="user-status active">Active</span>
          </div>
          <div className="user-actions">
            <motion.button 
              className="edit-user-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✏️ Edit
            </motion.button>
          </div>
        </motion.div>
    </div>
    </motion.div>
  );

  const renderAnalytics = () => (
    <motion.div 
      className="analytics-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="analytics-header">
        <h2>📈 School Analytics</h2>
        <div className="analytics-period">
          <select className="period-select">
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="analytics-grid">
        <motion.div 
          className="analytics-card"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="analytics-icon">📊</div>
          <h3>Admission Trends</h3>
          <div className="chart-container">
            <div className="chart-bar">
              <div className="bar-label">Jan</div>
              <div className="bar-fill" style={{ width: '75%' }}></div>
              <span className="bar-value">75</span>
            </div>
            <div className="chart-bar">
              <div className="bar-label">Feb</div>
              <div className="bar-fill" style={{ width: '90%' }}></div>
              <span className="bar-value">90</span>
            </div>
            <div className="chart-bar">
              <div className="bar-label">Mar</div>
              <div className="bar-fill" style={{ width: '85%' }}></div>
              <span className="bar-value">85</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="analytics-card"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="analytics-icon">👥</div>
          <h3>User Distribution</h3>
          <div className="distribution-chart">
            <div className="dist-item">
              <span className="dist-label">Students</span>
              <div className="dist-bar">
                <div className="dist-fill" style={{ width: '85%' }}></div>
              </div>
              <span className="dist-value">85%</span>
            </div>
            <div className="dist-item">
              <span className="dist-label">Teachers</span>
              <div className="dist-bar">
                <div className="dist-fill" style={{ width: '12%' }}></div>
              </div>
              <span className="dist-value">12%</span>
            </div>
            <div className="dist-item">
              <span className="dist-label">Admins</span>
              <div className="dist-bar">
                <div className="dist-fill" style={{ width: '3%' }}></div>
              </div>
              <span className="dist-value">3%</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="analytics-card"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="analytics-icon">📈</div>
          <h3>System Performance</h3>
          <div className="performance-metrics">
            <div className="metric-item">
              <span className="metric-label">Active Users</span>
              <span className="metric-value">1,250</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">System Uptime</span>
              <span className="metric-value">99.9%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Response Time</span>
              <span className="metric-value">120ms</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderMessages = () => (
    <motion.div 
      className="messages-container"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="messages-header">
        <h2>📬 Contact Messages</h2>
        <div className="unread-count">1 unread</div>
      </div>

      <div className="messages-list">
        {mockData.contactMessages.map((message) => (
          <motion.div 
            key={message.id}
            className={`message-card ${message.status}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="message-header">
              <div className="sender-info">
                <span className="sender-name">{message.name}</span>
                <span className="message-time">{message.date}</span>
              </div>
              {message.status === 'unread' && <div className="unread-indicator">🔴</div>}
            </div>
            <div className="message-content">
              <h4>{message.subject}</h4>
              <p>{message.message}</p>
            </div>
            <div className="message-actions">
              <motion.button 
                className="reply-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                💬 Reply
              </motion.button>
              <motion.button 
                className="mark-read-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✅ Mark Read
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div 
      className="settings-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="settings-header">
        <h2>⚙️ System Settings</h2>
      </div>

      <div className="settings-grid">
        <motion.div 
          className="settings-card"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h3>📧 Email Settings</h3>
          <p>Configure email notifications and templates</p>
          <motion.button 
            className="settings-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Configure
          </motion.button>
        </motion.div>

        <motion.div 
          className="settings-card"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h3>📱 SMS Settings</h3>
          <p>Set up SMS notifications for admissions</p>
          <motion.button 
            className="settings-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Configure
          </motion.button>
        </motion.div>

        <motion.div 
          className="settings-card"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h3>🔐 Security Settings</h3>
          <p>Manage user permissions and access control</p>
          <motion.button 
            className="settings-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Configure
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'admissions': return renderAdmissions();
      case 'users': return renderUsers();
      case 'analytics': return renderAnalytics();
      case 'messages': return renderMessages();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="admin-dashboard">
        <div className="dashboard-header">
        <motion.div 
          className="welcome-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>👨‍💼 Welcome, {user?.name || 'Admin'}!</h1>
          <p>Manage your school with powerful tools 🚀</p>
        </motion.div>
        
        <motion.div 
          className="profile-section"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="profile-dropdown" ref={dropdownRef}>
            <motion.button
              className="profile-button"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="profile-avatar">
                <span className="avatar-text">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              <span className="profile-name">{user?.name || 'Admin'}</span>
              <span className="dropdown-arrow">▼</span>
            </motion.button>
            
            {showProfileDropdown && (
              <motion.div 
                className="profile-dropdown-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="profile-info">
                  <div className="profile-details">
                    <div className="profile-avatar-large">
                      <span className="avatar-text-large">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                      </span>
                    </div>
                    <div className="profile-text">
                      <h4>{user?.name || 'Admin'}</h4>
                      <p>{user?.email || 'admin@school.com'}</p>
                      <span className="role-badge">Admin</span>
              </div>
            </div>
          </div>
                
                <div className="dropdown-divider"></div>
                
                <motion.button 
                  className="dropdown-item"
                  onClick={handleProfileSettings}
                  whileHover={{ backgroundColor: '#F3F4F6' }}
                >
                  <span className="item-icon">⚙️</span>
                  <span>Profile Settings</span>
                </motion.button>
                
                <motion.button 
                  className="dropdown-item"
                  onClick={handleLogout}
                  whileHover={{ backgroundColor: '#FEE2E2' }}
                >
                  <span className="item-icon">🚪</span>
                  <span>Logout</span>
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="dashboard-content">
        <motion.div 
          className="sidebar"
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="sidebar-header">
            <h3>👨‍💼 Admin Portal</h3>
          </div>
          <nav className="sidebar-nav">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </motion.button>
            ))}
          </nav>
        </motion.div>

        <motion.div 
          className="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;