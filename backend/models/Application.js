const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  athlete: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Athlete',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  sponsorship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sponsorship'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  message: String,
  organizationResponse: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);
