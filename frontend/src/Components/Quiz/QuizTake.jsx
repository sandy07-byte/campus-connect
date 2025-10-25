import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import './QuizTake.css';
import './QuizTake.css';

function QuizTake({ quizId }) {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const { socket } = useSocket();

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (quiz && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (quiz && timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, quiz, submitted]);

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/quizzes/class/${localStorage.getItem('userClass')}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      const foundQuiz = data.find(q => q._id === quizId);
      if (foundQuiz) {
        setQuiz(foundQuiz);
        setTimeLeft(foundQuiz.duration * 60); // Convert minutes to seconds
        setAnswers(new Array(foundQuiz.questions.length).fill(-1));
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (submitted) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers })
      });
      
      const result = await response.json();
      setScore(result);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quiz) {
    return <div className="quiz-loading">Loading quiz...</div>;
  }

  if (submitted && score) {
    return (
      <div className="quiz-result">
        <h2>Quiz Completed!</h2>
        <div className="score-display">
          <h3>Your Score: {score.score}/{score.totalQuestions}</h3>
          <p>Percentage: {Math.round((score.score / score.totalQuestions) * 100)}%</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.href = '/dashboard/student'}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="quiz-take">
      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        <div className="quiz-timer">
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>
      
      <div className="quiz-progress">
        Question {currentQuestion + 1} of {quiz.questions.length}
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="question-container">
        <h3>{question.question}</h3>
        <div className="options">
          {question.options.map((option, index) => (
            <label key={index} className="option-label">
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={index}
                checked={answers[currentQuestion] === index}
                onChange={() => handleAnswerSelect(currentQuestion, index)}
              />
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        <button 
          className="btn btn-secondary"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </button>
        
        <div className="question-numbers">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              className={`question-number ${index === currentQuestion ? 'active' : ''} ${answers[index] !== -1 ? 'answered' : ''}`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button 
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Submit Quiz
          </button>
        ) : (
          <button 
            className="btn btn-primary"
            onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizTake;
