const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema(
  {
    phaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoadmapPhase',
      required: true
    },
    phaseNumber: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    subtopics: [{
      type: String
    }],
    estimatedHours: {
      type: Number,
      default: 6
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate'
    },
    order: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Topic', TopicSchema);
