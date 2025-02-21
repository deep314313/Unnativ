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
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'type'
  },
  type: {
    type: String,
    enum: ['Event', 'Sponsorship', 'TravelSupport'],
    default: 'Event'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  message: String,
  requirements: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Application', applicationSchema);
