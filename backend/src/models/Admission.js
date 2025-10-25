const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent_number: { type: String, required: true },
  email: { type: String, required: true },
  class: { type: String, required: true },
  address: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined'],
    default: 'pending'
  },
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approved_at: {
    type: Date
  },
  declined_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  declined_at: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Admission', admissionSchema);


