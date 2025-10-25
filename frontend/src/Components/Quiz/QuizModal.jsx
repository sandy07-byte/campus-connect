import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './QuizModal.css';

const QuizModal = ({ isOpen, onClose, onSubmit }) => {
  const [quizData, setQuizData] = useState({
    title: '',
    subject: '',
    class: '',
    duration: 30,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    questions: [
      { questionText: '', options: ['', '', '', ''], correctAnswer: 0 },
      { questionText: '', options: ['', '', '', ''], correctAnswer: 0 },
      { questionText: '', options: ['', '', '', ''], correctAnswer: 0 },
      { questionText: '', options: ['', '', '', ''], correctAnswer: 0 },
      { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setQuizData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex][field] = value;
    setQuizData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuizData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].correctAnswer = optionIndex;
    setQuizData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const validateQuiz = () => {
    if (!quizData.title.trim()) {
      setError('Quiz title is required');
      return false;
    }
    if (!quizData.subject.trim()) {
      setError('Subject is required');
      return false;
    }
    if (!quizData.class.trim()) {
      setError('Class is required');
      return false;
    }

    // Validate questions
    for (let i = 0; i < quizData.questions.length; i++) {
      const question = quizData.questions[i];
      if (!question.questionText.trim()) {
        setError(`Question ${i + 1} text is required`);
        return false;
      }
      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].trim()) {
          setError(`Question ${i + 1}, Option ${j + 1} is required`);
          return false;
        }
      }
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateQuiz()) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/quizzes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...quizData,
          isActive: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create quiz');
      }

      const createdQuiz = await response.json();
      
      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit(createdQuiz);
      }

      // Reset form
      setQuizData({
        title: '',
        subject: '',
        class: '',
        duration: 30,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        questions: [
          { questionText: '', options: ['', '', '', ''], correctAnswer: 0 },
          { questionText: '', options: ['', '', '', ''], correctAnswer: 0 },
          { questionText: '', options: ['', '', '', ''], correctAnswer: 0 },
          { questionText: '', options: ['', '', '', ''], correctAnswer: 0 },
          { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }
        ]
      });

      // Close modal
      onClose();
      
      alert('Quiz created successfully! Students can now see it.');
    } catch (err) {
      console.error('Error creating quiz:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="quiz-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="quiz-modal-container"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="quiz-modal-header">
            <h2>📝 Create New Quiz</h2>
            <button className="close-btn" onClick={onClose}>✖️</button>
          </div>

          <form onSubmit={handleSubmit} className="quiz-modal-form">
            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}

            <div className="form-section">
              <h3>Quiz Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Quiz Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Algebra Basics Test"
                    value={quizData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    placeholder="e.g., Mathematics"
                    value={quizData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Class *</label>
                  <input
                    type="text"
                    placeholder="e.g., Grade 5"
                    value={quizData.class}
                    onChange={(e) => handleInputChange('class', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={quizData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={quizData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={quizData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section questions-section">
              <h3>Questions (5 Required)</h3>

              {quizData.questions.map((question, qIndex) => (
                <div key={qIndex} className="question-block">
                  <h4>Question {qIndex + 1}</h4>
                  
                  <div className="form-group">
                    <label>Question Text *</label>
                    <textarea
                      rows="2"
                      placeholder="Enter your question here..."
                      value={question.questionText}
                      onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                      required
                    />
                  </div>

                  <div className="options-grid">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="option-group">
                        <label>
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correctAnswer === oIndex}
                            onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                          />
                          <span className="option-label">Option {oIndex + 1} {question.correctAnswer === oIndex && '✅'}</span>
                        </label>
                        <input
                          type="text"
                          placeholder={`Option ${oIndex + 1}`}
                          value={option}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? '⏳ Creating...' : '✨ Create Quiz'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuizModal;
