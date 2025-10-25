const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password_hash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'teacher', 'admin'], 
    required: true 
  },
  // Student specific fields
  studentId: { type: String, unique: true, sparse: true },
  class: { type: String },
  section: { type: String },
  admissionDate: { type: Date },
  
  // Teacher specific fields
  teacherId: { type: String, unique: true, sparse: true },
  subjects: [{ type: String }],
  qualification: { type: String },
  joiningDate: { type: Date },
  
  // Common fields
  phone: { type: String },
  address: { type: String },
  profilePicture: { type: String },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  
  // For password reset
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { 
  timestamps: true,
  // Add index for better query performance
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ studentId: 1 }, { sparse: true });
userSchema.index({ teacherId: 1 }, { sparse: true });

// Pre-save hook to generate studentId or teacherId
userSchema.pre('save', async function(next) {
  if (this.isNew) {
    const User = this.constructor;
    if (this.role === 'student' && !this.studentId) {
      const count = await User.countDocuments({ role: 'student' });
      this.studentId = `STU${String(count + 1).padStart(4, '0')}`;
    } else if (this.role === 'teacher' && !this.teacherId) {
      const count = await User.countDocuments({ role: 'teacher' });
      this.teacherId = `TCH${String(count + 1).padStart(4, '0')}`;
    }
  }
  next();
});

module.exports = mongoose.model('User', userSchema);



