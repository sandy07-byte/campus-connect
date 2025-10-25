import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './Dashboard.css';
import useTeacherDashboard from '../../hooks/useTeacherDashboard';
import TimetableManage from '../Timetable/TimetableManage';
import EventManage from '../Events/EventManage';
import QuizModal from '../Quiz/QuizModal';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Get token for API calls
  const token = localStorage.getItem('token');

  // Use real-time dashboard hook
  const { 
    quizzes: realQuizzes,
    students: realStudents,
    classes: realClasses,
    stats,
    loading, 
    error, 
    isConnected 
  } = useTeacherDashboard(token);

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

  const handleQuizCreated = (quiz) => {
    console.log('Quiz created successfully:', quiz);
    // The quiz will be added automatically via the socket.io listener in useTeacherDashboard
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '🏠' },
    { id: 'quizzes', label: '📝 Quizzes', icon: '🧠' },
    { id: 'students', label: '👥 Students', icon: '🎓' },
    { id: 'timetable', label: '📅 Timetable', icon: '⏰' },
    { id: 'events', label: '🎉 Events', icon: '🎊' }
  ];

  // All data is now fetched from MongoDB via useTeacherDashboard hook
  // No more mock/static data!

  const renderOverview = () => (
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
        <p>{stats.totalStudents} students</p>
        <span className="card-highlight">{isConnected ? '🟢 Live' : '🔴 Offline'}</span>
      </motion.div>

      <motion.div 
        className="overview-card"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="card-icon">📝</div>
        <h3>Active Quizzes</h3>
        <p>{stats.activeQuizzes} quizzes currently active</p>
        <span className="card-highlight">{stats.totalSubmissions} total submissions</span>
      </motion.div>

      <motion.div 
        className="overview-card"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="card-icon">📊</div>
        <h3>Average Score</h3>
        <p>{stats.averageScore}% average across all classes</p>
        <span className="card-highlight">{isConnected ? '🟢 Real-time updates' : '🔴 Offline'}</span>
      </motion.div>

    </motion.div>
  );

  const renderQuizzes = () => (
    <motion.div 
      className="quizzes-container"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="quizzes-header">
        <h2>📝 Quiz Management</h2>
        <motion.button 
          className="create-quiz-btn"
          onClick={() => setShowQuizModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ➕ Create New Quiz
        </motion.button>
      </div>

      <div className="quizzes-grid">
        {realQuizzes.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', gridColumn: '1 / -1' }}>
            <p>No quizzes created yet. Click "Create New Quiz" to get started!</p>
          </div>
        ) : (
          realQuizzes.map((quiz) => (
          <motion.div 
            key={quiz.id}
            className="quiz-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="quiz-header">
              <h3>{quiz.title}</h3>
              <span className="quiz-class">{quiz.class}</span>
            </div>
            <div className="quiz-stats">
              <div className="stat-row">
                <span>❓ {quiz.questions?.length || 0} Questions</span>
                <span>📊 {quiz.submissions || 0} Submissions</span>
              </div>
              <div className="stat-row">
                <span>📅 Due: {new Date(quiz.endDate).toLocaleDateString()}</span>
                <span>🎯 Avg: {quiz.avgScore || 0}%</span>
              </div>
            </div>
            <div className="quiz-actions">
              <motion.button 
                className="view-results-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📊 View Results
              </motion.button>
              <motion.button 
                className="edit-quiz-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✏️ Edit
              </motion.button>
            </div>
          </motion.div>
        ))
        )}
      </div>
    </motion.div>
  );

  const renderStudents = () => (
    <motion.div 
      className="students-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="students-header">
        <h2>👥 Student Management</h2>
        <div className="class-filter">
          <select className="filter-select">
            <option value="all">All Classes</option>
            <option value="grade5a">Grade 5A</option>
            <option value="grade6b">Grade 6B</option>
            <option value="grade7a">Grade 7A</option>
          </select>
        </div>
      </div>

      <div className="students-table">
        <div className="table-header">
          <div className="col">Student Name</div>
          <div className="col">Class</div>
          <div className="col">Score</div>
          <div className="col">Attendance</div>
          <div className="col">Last Active</div>
          <div className="col">Actions</div>
        </div>
        {realStudents.length === 0 ? (
          <div className="table-row" style={{ textAlign: 'center', padding: '20px' }}>
            <div className="col" style={{ gridColumn: '1 / -1' }}>No student data available yet.</div>
          </div>
        ) : (
          realStudents.map((student) => (
          <motion.div 
            key={student.id}
            className="table-row"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="col student-info">
              <div className="student-avatar">👤</div>
              <span className="student-name">{student.name}</span>
            </div>
            <div className="col">{student.class}</div>
            <div className="col">
              <span className={`score-badge ${student.score >= 80 ? 'high' : student.score >= 60 ? 'medium' : 'low'}`}>
                {student.score}%
              </span>
            </div>
            <div className="col">
              <span className={`attendance-badge ${student.attendance >= 90 ? 'high' : student.attendance >= 75 ? 'medium' : 'low'}`}>
                {student.attendance}%
              </span>
            </div>
            <div className="col">{student.lastActive}</div>
            <div className="col">
              <motion.button 
                className="message-student-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                💬 Message
              </motion.button>
            </div>
          </motion.div>
        )))
        }
      </div>
    </motion.div>
  );

  const renderTimetable = () => (
    <motion.div 
      className="timetable-container"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TimetableManage />
    </motion.div>
  );

  const renderEvents = () => (
    <motion.div 
      className="events-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <EventManage />
    </motion.div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'quizzes': return renderQuizzes();
      case 'students': return renderStudents();
      case 'timetable': return renderTimetable();
      case 'events': return renderEvents();
      default: return renderOverview();
    }
  };

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <motion.div 
          className="welcome-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>👩‍🏫 Welcome, {user?.name || 'Teacher'}!</h1>
          <p>Manage your classes and inspire young minds 🌟</p>
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
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
                </span>
              </div>
              <span className="profile-name">{user?.name || 'Teacher'}</span>
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
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
                      </span>
                    </div>
                    <div className="profile-text">
                      <h4>{user?.name || 'Teacher'}</h4>
                      <p>{user?.email || 'teacher@school.com'}</p>
                      <span className="role-badge">Teacher</span>
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
            <h3>👩‍🏫 Teacher Portal</h3>
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

      {/* Quiz Creation Modal */}
      <QuizModal 
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        onSubmit={handleQuizCreated}
      />
    </div>
  );
};

export default TeacherDashboard;