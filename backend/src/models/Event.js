const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    trim: true
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
        return value >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  allDay: {
    type: Boolean,
    default: false
  },
  location: { 
    type: String, 
    trim: true,
    maxlength: [200, 'Location cannot be more than 200 characters']
  },
  eventType: { 
    type: String, 
    required: true, 
    enum: [
      'academic', 
      'sports', 
      'cultural', 
      'holiday',
      'exam',
      'meeting',
      'other'
    ],
    default: 'other'
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // For school-wide, class-specific, or teacher-specific events
  scope: { 
    type: String, 
    enum: ['school', 'class', 'teacher'], 
    default: 'school',
    required: true
  },
  // Only required if scope is 'class' or 'teacher'
  targetClasses: [{
    type: String,
    required: function() {
      return this.scope === 'class';
    }
  }],
  targetTeachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: function(v) {
        if (this.scope !== 'teacher') return true;
        return v && v.length > 0;
      },
      message: 'At least one teacher must be selected for teacher-scoped events'
    }
  }],
  // For recurring events
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrence: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: function() {
        return this.isRecurring === true;
      }
    },
    endDate: {
      type: Date,
      required: function() {
        return this.isRecurring === true;
      },
      validate: {
        validator: function(value) {
          if (this.isRecurring) {
            return value > this.startDate;
          }
          return true;
        },
        message: 'Recurrence end date must be after start date'
      }
    },
    daysOfWeek: [{
      type: Number,
      min: 0, // Sunday
      max: 6  // Saturday
    }]
  },
  // Additional metadata
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  },
  // For soft delete
  isDeleted: {
    type: Boolean,
    default: false
  },
  // For tracking
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
eventSchema.index({ startDate: 1 });
eventSchema.index({ endDate: 1 });
eventSchema.index({ scope: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ 'targetClasses': 1 });
eventSchema.index({ 'targetTeachers': 1 });

// Virtual for event duration in minutes
eventSchema.virtual('duration').get(function() {
  if (!this.startDate || !this.endDate) return 0;
  return (this.endDate - this.startDate) / (1000 * 60); // duration in minutes
});

// Virtual to check if event is happening now
eventSchema.virtual('isHappeningNow').get(function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate;
});

// Pre-save hook to handle recurring events
eventSchema.pre('save', async function(next) {
  if (this.isRecurring && this.isNew) {
    // Additional validation for recurring events
    if (this.recurrence.frequency === 'weekly' && 
        (!this.recurrence.daysOfWeek || this.recurrence.daysOfWeek.length === 0)) {
      throw new Error('Weekly recurring events must specify days of the week');
    }
  }
  
  // Ensure end date is after start date
  if (this.endDate <= this.startDate) {
    throw new Error('End date must be after start date');
  }
  
  next();
});

// Static method to get events for a specific user
// This will handle the logic of which events a user should see based on their role and class
eventSchema.statics.getEventsForUser = async function(userId, userRole, userClass = null) {
  const query = {
    $or: [
      { scope: 'school' },
      { createdBy: userId }
    ],
    isActive: true,
    isDeleted: false
  };

  // Add class-specific events if user is a student or teacher with a class
  if (userClass) {
    query.$or.push({ 
      scope: 'class', 
      targetClasses: userClass 
    });
  }

  // If user is a teacher, include events where they are the target
  if (userRole === 'teacher') {
    query.$or.push({ 
      scope: 'teacher', 
      targetTeachers: userId 
    });
  }

  return this.find(query)
    .populate('createdBy', 'name email')
    .populate('targetTeachers', 'name email')
    .sort({ startDate: 1 })
    .lean();
};

// Method to get upcoming events
eventSchema.statics.getUpcomingEvents = async function(limit = 10) {
  return this.find({
    endDate: { $gte: new Date() },
    isActive: true,
    isDeleted: false
  })
  .sort({ startDate: 1 })
  .limit(limit)
  .lean();
};

// Method to check for event conflicts
eventSchema.statics.hasConflict = async function(eventData) {
  const { startDate, endDate, targetClasses = [], targetTeachers = [], scope } = eventData;
  
  const query = {
    _id: { $ne: eventData._id || null }, // Exclude current event when updating
    $or: [
      // Starts during another event
      { startDate: { $lt: endDate, $gte: startDate } },
      // Ends during another event
      { endDate: { $gt: startDate, $lte: endDate } },
      // Completely contains another event
      { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
    ],
    isActive: true,
    isDeleted: false
  };

  // Add scope-specific conditions
  if (scope === 'class' && targetClasses && targetClasses.length > 0) {
    query.$or.push({
      scope: 'class',
      targetClasses: { $in: targetClasses }
    });
  } else if (scope === 'teacher' && targetTeachers && targetTeachers.length > 0) {
    query.$or.push({
      scope: 'teacher',
      targetTeachers: { $in: targetTeachers }
    });
  } else if (scope === 'school') {
    query.$or.push({ scope: 'school' });
  }

  const conflict = await this.findOne(query);
  return !!conflict;
};

module.exports = mongoose.model('Event', eventSchema);


