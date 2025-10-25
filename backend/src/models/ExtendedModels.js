const mongoose = require('mongoose');

// Quiz Model
const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: String,
    required: true,
    trim: true
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correct_answer: {
      type: Number,
      required: true
    },
    points: {
      type: Number,
      default: 1
    }
  }],
  total_points: {
    type: Number,
    default: 0
  },
  time_limit: {
    type: Number, // in minutes
    default: 30
  },
  due_date: {
    type: Date,
    required: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  submissions: [{
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    answers: [{
      question_index: Number,
      selected_answer: Number,
      is_correct: Boolean,
      points_earned: Number
    }],
    total_score: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    },
    submitted_at: {
      type: Date,
      default: Date.now
    },
    time_taken: {
      type: Number // in minutes
    }
  }]
}, {
  timestamps: true
});

// Event Model
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['academic', 'sports', 'cultural', 'social', 'holiday'],
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  organizer: {
    type: String,
    trim: true
  },
  target_audience: {
    type: String,
    enum: ['all', 'students', 'teachers', 'parents', 'specific_class'],
    default: 'all'
  },
  specific_classes: [{
    type: String
  }],
  registration_required: {
    type: Boolean,
    default: false
  },
  registration_deadline: {
    type: Date
  },
  max_participants: {
    type: Number
  },
  registered_participants: [{
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registered_at: {
      type: Date,
      default: Date.now
    }
  }],
  is_active: {
    type: Boolean,
    default: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Diary Entry Model
const diarySchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  entry: {
    type: String,
    required: true,
    trim: true
  },
  mood: {
    type: String,
    enum: ['😊', '😄', '😌', '😔', '😢', '😴', '🤩', '😎', '😤', '😅'],
    default: '😊'
  },
  tags: [{
    type: String,
    trim: true
  }],
  is_private: {
    type: Boolean,
    default: true
  },
  teacher_comments: [{
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: {
      type: String,
      trim: true
    },
    commented_at: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Contact Message Model
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['general', 'admission', 'academic', 'transport', 'fees', 'complaint', 'suggestion'],
    default: 'general'
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  replies: [{
    replied_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reply_message: {
      type: String,
      trim: true
    },
    replied_at: {
      type: Date,
      default: Date.now
    }
  }],
  resolved_at: {
    type: Date
  }
}, {
  timestamps: true
});

// Timetable Model
const timetableSchema = new mongoose.Schema({
  class_name: {
    type: String,
    required: true,
    trim: true
  },
  day_of_week: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  periods: [{
    period_number: {
      type: Number,
      required: true
    },
    start_time: {
      type: String,
      required: true
    },
    end_time: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    room: {
      type: String,
      trim: true
    },
    is_break: {
      type: Boolean,
      default: false
    }
  }],
  academic_year: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    enum: ['1', '2'],
    required: true
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Announcement Model
const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['general', 'academic', 'event', 'emergency', 'reminder'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  target_audience: {
    type: String,
    enum: ['all', 'students', 'teachers', 'parents', 'specific_class'],
    default: 'all'
  },
  specific_classes: [{
    type: String
  }],
  scheduled_at: {
    type: Date,
    default: Date.now
  },
  expires_at: {
    type: Date
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sent_to: [{
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sent_at: {
      type: Date,
      default: Date.now
    },
    read_at: {
      type: Date
    }
  }]
}, {
  timestamps: true
});

// Create models
const Quiz = mongoose.model('Quiz', quizSchema);
const Event = mongoose.model('Event', eventSchema);
const Diary = mongoose.model('Diary', diarySchema);
const Contact = mongoose.model('Contact', contactSchema);
const Timetable = mongoose.model('Timetable', timetableSchema);
const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = {
  Quiz,
  Event,
  Diary,
  Contact,
  Timetable,
  Announcement
};


