const mongoose = require('mongoose');

const StudySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    phaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoadmapPhase'
    },
    phaseNumber: {
      type: Number
    },
    topicName: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
    duration: {
      type: Number, // in minutes
      required: true
    },
    source: {
      type: String,
      enum: ['timer', 'manual'],
      default: 'timer'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudySession', StudySessionSchema);
