import React from 'react';
import useRealtimeQuizzes from '../../hooks/useRealtimeQuizzes';
import './QuizList.css';

function QuizList({ userClass, userRole }) {
  const token = localStorage.getItem('token');
  const { quizzes, loading, error, isConnected } = useRealtimeQuizzes(userClass, token);

  if (loading) {
    return <div className="quiz-loading">Loading quizzes...</div>;
  }

  if (error) {
    return <div className="quiz-error">Error loading quizzes: {error}</div>;
  }

  return (
    <div className="quiz-list">
      <div className="quiz-list-header">
        <h2>Available Quizzes - Class {userClass}</h2>
        <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 Live' : '🔴 Offline'}
        </span>
      </div>
      {quizzes.length === 0 ? (
        <div className="no-quizzes">No quizzes available at the moment.</div>
      ) : (
        <div className="quiz-grid">
          {quizzes.map(quiz => (
            <div key={quiz._id} className="quiz-card">
              <div className="quiz-header">
                <h3>{quiz.title}</h3>
                <span className="quiz-teacher">by {quiz.teacher.name}</span>
              </div>
              <div className="quiz-info">
                <p><strong>Questions:</strong> {quiz.questions.length}</p>
                <p><strong>Duration:</strong> {quiz.duration} minutes</p>
                <p><strong>Available until:</strong> {new Date(quiz.endDate).toLocaleString()}</p>
              </div>
              <div className="quiz-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.href = `/quiz/${quiz._id}`}
                >
                  {userRole === 'student' ? 'Take Quiz' : 'View Quiz'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizList;
