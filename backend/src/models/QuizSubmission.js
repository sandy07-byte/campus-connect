const mongoose = require('mongoose');

const quizSubmissionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ type: Number, required: true }], // Array of selected option indices
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('QuizSubmission', quizSubmissionSchema);


