const express = require('express');
const { authenticateToken, authorizeRoles } = require('../auth');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');

module.exports = function(io) {
  const router = express.Router();

  // Get quizzes for a specific class (students)
  router.get('/class/:class', authenticateToken, async (req, res) => {
    try {
      const { class: className } = req.params;
      const now = new Date();
      const quizzes = await Quiz.find({ 
        class: className, 
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now }
      }).populate('teacher', 'name');
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all quizzes (teachers/admin)
  router.get('/', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
    try {
      const quizzes = await Quiz.find().populate('teacher', 'name').sort({ createdAt: -1 });
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create quiz (teachers/admin)
  router.post('/', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
    try {
      // Transform questions from modal format to database format
      const transformedQuestions = req.body.questions.map((q, index) => ({
        question: q.questionText,
        questionType: 'multiple_choice',
        options: q.options.map((opt, optIndex) => ({
          text: opt,
          isCorrect: optIndex === q.correctAnswer
        })),
        correctAnswer: q.correctAnswer,
        points: 1,
        order: index
      }));

      const quizData = {
        title: req.body.title,
        subject: req.body.subject,
        class: req.body.class,
        duration: req.body.duration || 30,
        startDate: req.body.startDate || new Date(),
        endDate: req.body.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        teacher: req.user.id,
        createdBy: req.user.id,
        questions: transformedQuestions,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true,
        isPublished: true
      };

      const quiz = await Quiz.create(quizData);
      const populatedQuiz = await Quiz.findById(quiz._id).populate('teacher', 'name email');
      
      // Emit via Socket.IO - Change Streams will also emit, but this ensures immediate update
      io.to(`class:${quiz.class}`).emit('quiz_created', { class: quiz.class, quiz: populatedQuiz });
      
      res.json(populatedQuiz);
    } catch (error) {
      console.error('Error creating quiz:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Submit quiz (students)
  router.post('/:id/submit', authenticateToken, authorizeRoles('student'), async (req, res) => {
    try {
      const { answers } = req.body;
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

      // Check if already submitted
      const existingSubmission = await QuizSubmission.findOne({ 
        quiz: req.params.id, 
        student: req.user.id 
      });
      if (existingSubmission) {
        return res.status(400).json({ error: 'Quiz already submitted' });
      }

      // Calculate score
      let score = 0;
      quiz.questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
          score++;
        }
      });

      const submission = await QuizSubmission.create({
        quiz: req.params.id,
        student: req.user.id,
        answers,
        score,
        totalQuestions: quiz.questions.length
      });

      // Notify teacher/admin of new submission
      io.to(`class:${quiz.class}`).emit('quiz_submitted', { 
        class: quiz.class,
        quizId: req.params.id, 
        studentId: req.user.id, 
        score, 
        totalQuestions: quiz.questions.length 
      });

      res.json({ score, totalQuestions: quiz.questions.length });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get quiz submissions (teachers/admin)
  router.get('/:id/submissions', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
    try {
      const submissions = await QuizSubmission.find({ quiz: req.params.id })
        .populate('student', 'name email')
        .sort({ submittedAt: -1 });
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update quiz (teachers/admin)
  router.put('/:id', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
    try {
      const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .populate('teacher', 'name');
      if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
      io.to(`class:${quiz.class}`).emit('quiz_updated', { class: quiz.class, quiz });
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete quiz (teachers/admin)
  router.delete('/:id', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
    try {
      const quiz = await Quiz.findByIdAndDelete(req.params.id);
      if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
      io.to(`class:${quiz.class}`).emit('quiz_deleted', { class: quiz.class, quizId: req.params.id });
      res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
