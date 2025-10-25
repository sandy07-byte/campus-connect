const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { 
    type: String, 
    required: [true, 'Question text is required'],
    trim: true,
    minlength: [5, 'Question must be at least 5 characters long'],
    maxlength: [1000, 'Question cannot exceed 1000 characters']
  },
  questionType: {
    type: String,
    enum: ['multiple_choice', 'true_false', 'short_answer', 'essay'],
    default: 'multiple_choice',
    required: true
  },
  options: [{
    text: { 
      type: String, 
      required: function() {
        return this.questionType === 'multiple_choice' || this.questionType === 'true_false';
      },
      trim: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  correctAnswer: { 
    type: mongoose.Schema.Types.Mixed, // Can be Number, String, or [Number] for multiple correct answers
    required: function() {
      return this.questionType === 'multiple_choice' || this.questionType === 'true_false';
    },
    validate: {
      validator: function(value) {
        if (this.questionType === 'multiple_choice' || this.questionType === 'true_false') {
          return value !== undefined && value !== null;
        }
        return true;
      },
      message: 'Correct answer is required for this question type'
    }
  },
  points: {
    type: Number,
    required: true,
    min: [0, 'Points cannot be negative'],
    default: 1
  },
  explanation: {
    type: String,
    trim: true,
    maxlength: [1000, 'Explanation cannot exceed 1000 characters']
  },
  // For file uploads (if question requires it)
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  // For ordering questions
  order: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const quizSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Quiz title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  class: { 
    type: String, 
    required: [true, 'Class is required'],
    trim: true
  },
  section: {
    type: String,
    trim: true
  },
  teacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Teacher reference is required'] 
  },
  questions: {
    type: [questionSchema],
    required: [true, 'At least one question is required'],
    validate: {
      validator: function(questions) {
        return questions && questions.length > 0;
      },
      message: 'At least one question is required'
    }
  },
  duration: { 
    type: Number, // in minutes
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute'],
    max: [1440, 'Duration cannot exceed 24 hours']
  },
  passingScore: {
    type: Number,
    min: [0, 'Passing score cannot be negative'],
    max: [100, 'Passing score cannot exceed 100%'],
    default: 50
  },
  maxAttempts: {
    type: Number,
    min: [0, 'Max attempts cannot be negative'],
    default: 1
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isShuffleQuestions: {
    type: Boolean,
    default: false
  },
  isShuffleOptions: {
    type: Boolean,
    default: false
  },
  showCorrectAnswers: {
    type: Boolean,
    default: false
  },
  showResults: {
    type: String,
    enum: ['after_submission', 'after_deadline', 'never'],
    default: 'after_submission'
  },
  startDate: { 
    type: Date, 
    required: [true, 'Start date is required'] 
  },
  endDate: { 
    type: Date, 
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  timeLimit: {
    type: Number, // in minutes
    default: 0, // 0 means no time limit
    min: [0, 'Time limit cannot be negative']
  },
  // For tracking
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // For soft delete
  isDeleted: {
    type: Boolean,
    default: false
  },
  // For analytics
  totalSubmissions: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  // For versioning
  version: {
    type: Number,
    default: 1
  },
  // For scheduling
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrence: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      required: function() {
        return this.isRecurring === true;
      }
    },
    endAfter: {
      type: Date,
      required: function() {
        return this.isRecurring === true;
      },
      validate: {
        validator: function(value) {
          if (this.isRecurring) {
            return value > this.endDate;
          }
          return true;
        },
        message: 'Recurrence end date must be after the initial end date'
      }
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
quizSchema.index({ class: 1, subject: 1, isActive: 1 });
quizSchema.index({ teacher: 1, isActive: 1 });
quizSchema.index({ startDate: 1, endDate: 1 });
quizSchema.index({ isPublished: 1, isActive: 1 });

// Virtual for total points
quizSchema.virtual('totalPoints').get(function() {
  return this.questions.reduce((sum, question) => sum + (question.points || 0), 0);
});

// Virtual to check if quiz is active
quizSchema.virtual('isOngoing').get(function() {
  const now = new Date();
  return this.isActive && this.isPublished && now >= this.startDate && now <= this.endDate;
});

// Virtual to check if quiz is upcoming
quizSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  return this.isActive && this.isPublished && now < this.startDate;
});

// Virtual to check if quiz has ended
quizSchema.virtual('hasEnded').get(function() {
  const now = new Date();
  return now > this.endDate;
});

// Pre-save hook to validate questions
quizSchema.pre('save', function(next) {
  // Ensure at least one correct answer for multiple choice questions
  this.questions.forEach((question, index) => {
    if ((question.questionType === 'multiple_choice' || question.questionType === 'true_false') && 
        question.options && question.options.length > 0) {
      const hasCorrectAnswer = question.options.some(option => option.isCorrect);
      if (!hasCorrectAnswer) {
        throw new Error(`Question ${index + 1} must have at least one correct answer`);
      }
    }
  });
  
  // Ensure end date is after start date
  if (this.endDate <= this.startDate) {
    throw new Error('End date must be after start date');
  }
  
  next();
});

// Static method to get quizzes for a specific class
quizSchema.statics.getQuizzesForClass = async function(classId, subject = null) {
  const query = {
    class: classId,
    isActive: true,
    isPublished: true,
    isDeleted: false,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  };
  
  if (subject) {
    query.subject = subject;
  }
  
  return this.find(query)
    .populate('teacher', 'name email')
    .sort({ startDate: 1 })
    .lean();
};

// Static method to get quizzes created by a teacher
quizSchema.statics.getQuizzesByTeacher = async function(teacherId, options = {}) {
  const { classId = null, subject = null, isActive = true, isPublished = null } = options;
  
  const query = {
    teacher: teacherId,
    isDeleted: false
  };
  
  if (classId) query.class = classId;
  if (subject) query.subject = subject;
  if (isPublished !== null) query.isPublished = isPublished;
  if (isActive !== null) query.isActive = isActive;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .lean();
};

// Method to check if a student can take the quiz
quizSchema.methods.canTakeQuiz = function(studentId) {
  if (!this.isActive || !this.isPublished) {
    return { canTake: false, reason: 'Quiz is not available' };
  }
  
  const now = new Date();
  if (now < this.startDate) {
    return { canTake: false, reason: 'Quiz has not started yet' };
  }
  
  if (now > this.endDate) {
    return { canTake: false, reason: 'Quiz has ended' };
  }
  
  // Here you would typically check if the student has already taken the quiz
  // and if they've reached the max attempts
  // This would require querying the QuizSubmission model
  
  return { canTake: true };
};

// Method to calculate score for a submission
quizSchema.methods.calculateScore = function(answers) {
  let score = 0;
  let totalPossible = 0;
  
  this.questions.forEach((question, index) => {
    totalPossible += question.points || 1;
    
    if (question.questionType === 'multiple_choice' || question.questionType === 'true_false') {
      const studentAnswer = answers[index];
      const correctAnswer = question.correctAnswer;
      
      if (Array.isArray(correctAnswer)) {
        // For multiple correct answers (checkboxes)
        const correctAnswers = new Set(correctAnswer);
        const studentAnswers = new Set(Array.isArray(studentAnswer) ? studentAnswer : [studentAnswer]);
        
        // Check if all correct answers are selected and no incorrect ones
        const isCorrect = correctAnswer.every(ans => studentAnswers.has(ans)) && 
                         studentAnswer.length === correctAnswer.length;
        
        if (isCorrect) {
          score += question.points || 1;
        }
      } else if (studentAnswer === correctAnswer) {
        // For single correct answer
        score += question.points || 1;
      }
    }
    // Add handling for other question types (short answer, essay, etc.)
  });
  
  const percentage = totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0;
  const passed = percentage >= this.passingScore;
  
  return {
    score,
    totalPossible,
    percentage,
    passed,
    passingScore: this.passingScore
  };
};

module.exports = mongoose.model('Quiz', quizSchema);


