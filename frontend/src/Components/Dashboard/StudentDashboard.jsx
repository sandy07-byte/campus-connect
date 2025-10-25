import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './Dashboard.css';
import useStudentDashboard from '../../hooks/useStudentDashboard';
import TimetableView from '../Timetable/TimetableView';
import QuizList from '../Quiz/QuizList';
import EventList from '../Events/EventList';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const dropdownRef = useRef(null);

  // Get token for API calls
  const token = localStorage.getItem('token');
  
  // Get user's class from localStorage
  const userClass = user?.class || JSON.parse(localStorage.getItem('user') || '{}').class || 'Grade 5';

  // Use real-time dashboard hook
  const { 
    quizzes: realQuizzes,
    timetable: realTimetable,
    events: realEvents,
    stats,
    loading, 
    error, 
    isConnected 
  } = useStudentDashboard(userClass, token);

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
    // You can add profile settings functionality here
    alert('Profile settings feature coming soon!');
  };

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setQuizAnswers({});
    setQuizScore(null);
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const submitQuiz = () => {
    if (!selectedQuiz) return;

    let correctAnswers = 0;
    const totalQuestions = selectedQuiz.questions.length;

    selectedQuiz.questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correct_answer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    setQuizScore(score);

    // Here you would typically save the quiz result to the database
    console.log('Quiz submitted:', {
      quizId: selectedQuiz._id,
      answers: quizAnswers,
      score: score
    });
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setQuizAnswers({});
    setQuizScore(null);
  };

  const tabs = [
    { id: 'overview', label: '📚 Overview', icon: '🏠' },
    { id: 'timetable', label: '📅 Timetable', icon: '⏰' },
    { id: 'quizzes', label: '🧠 Quizzes', icon: '📝' },
    { id: 'events', label: '🎉 Events', icon: '🎊' },
    { id: 'messages', label: '📩 Messages', icon: '💬' },
    { id: 'diary', label: '📖 Diary', icon: '📔' }
  ];

  // Mock data for messages and diary (not yet in MongoDB)
  const mockMessages = [
    { id: 1, from: 'Ms. Smith', subject: 'Math Assignment Reminder', message: 'Please submit your algebra homework by Friday.', time: '2 hours ago', read: false },
    { id: 2, from: 'Principal', subject: 'School Holiday Notice', message: 'School will be closed on January 26th for Republic Day.', time: '1 day ago', read: true },
    { id: 3, from: 'Mr. Johnson', subject: 'English Project', message: 'Great work on your essay! Keep it up!', time: '3 days ago', read: true }
  ];
  
  const mockDiary = [
    { date: '2024-01-10', entry: 'Learned about quadratic equations today. Need to practice more problems.', mood: '😊' },
    { date: '2024-01-09', entry: 'Had a great time in science lab. The experiment was fascinating!', mood: '🤩' },
    { date: '2024-01-08', entry: 'English literature class was interesting. Discussed Shakespeare.', mood: '😌' }
  ];

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
        <div className="card-icon">📚</div>
        <h3>Today's Classes</h3>
        <p>{stats.todayClasses} classes scheduled</p>
        <span className="card-highlight">{isConnected ? '🟢 Live' : '🔴 Offline'}</span>
      </motion.div>

      <motion.div 
        className="overview-card"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="card-icon">🧠</div>
        <h3>Pending Quizzes</h3>
        <p>{stats.pendingQuizzes} quizzes available</p>
        <span className="card-highlight">{realQuizzes[0] ? realQuizzes[0].title : 'No quizzes yet'}</span>
      </motion.div>

      <motion.div 
        className="overview-card"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="card-icon">🎉</div>
        <h3>Upcoming Events</h3>
        <p>{stats.upcomingEvents} events upcoming</p>
        <span className="card-highlight">{realEvents[0] ? realEvents[0].title : 'No events yet'}</span>
      </motion.div>

      <motion.div 
        className="overview-card"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="card-icon">📩</div>
        <h3>New Messages</h3>
        <p>{stats.unreadMessages} unread message</p>
        <span className="card-highlight">{isConnected ? '🟢 Real-time updates' : '🔴 Offline'}</span>
      </motion.div>
    </motion.div>
  );

  const renderTimetable = () => (
    <motion.div 
      className="timetable-container"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TimetableView userClass={userClass} userRole="student" />
    </motion.div>
  );

  const renderQuizzes = () => (
    <motion.div 
      className="quizzes-container"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <QuizList userClass={userClass} userRole="student" />
    </motion.div>
  );

  const renderEvents = () => (
    <motion.div 
      className="events-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <EventList userRole="student" />
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
        <h2>📩 Messages & Announcements</h2>
        <div className="unread-count">1 unread</div>
      </div>

      <div className="messages-list">
        {mockMessages.map((message) => (
          <motion.div 
            key={message.id}
            className={`message-card ${message.read ? 'read' : 'unread'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="message-header">
              <div className="sender-info">
                <span className="sender-name">{message.from}</span>
                <span className="message-time">{message.time}</span>
              </div>
              {!message.read && <div className="unread-indicator">🔴</div>}
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
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderDiary = () => (
    <motion.div 
      className="diary-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="diary-header">
        <h2>📖 My Daily Diary</h2>
        <motion.button 
          className="add-entry-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ✏️ Add Entry
        </motion.button>
      </div>

      <div className="diary-entries">
        {mockDiary.map((entry, index) => (
          <motion.div 
            key={index}
            className="diary-entry"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="entry-header">
              <span className="entry-date">{entry.date}</span>
              <span className="entry-mood">{entry.mood}</span>
            </div>
            <div className="entry-content">
              <p>{entry.entry}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'timetable': return renderTimetable();
      case 'quizzes': return renderQuizzes();
      case 'events': return renderEvents();
      case 'messages': return renderMessages();
      case 'diary': return renderDiary();
      default: return renderOverview();
    }
  };

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <motion.div 
          className="welcome-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>👋 Welcome back, {user?.name || 'Student'}!</h1>
          <p>Ready to learn and grow today? 🌟</p>
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
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                </span>
              </div>
              <span className="profile-name">{user?.name || 'Student'}</span>
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
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                      </span>
                    </div>
                    <div className="profile-text">
                      <h4>{user?.name || 'Student'}</h4>
                      <p>{user?.email || 'student@school.com'}</p>
                      <span className="role-badge">Student</span>
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
            <h3>📚 Student Portal</h3>
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

export default StudentDashboard;