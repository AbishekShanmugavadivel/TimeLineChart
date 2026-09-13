const mongoose = require('mongoose');

const RoadmapPhaseSchema = new mongoose.Schema(
  {
    phaseNumber: {
      type: Number,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    startDay: {
      type: Number,
      required: true
    },
    endDay: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      required: true // in days
    },
    studyHours: {
      type: Number,
      required: true
    },
    topics: [{
      type: String
    }],
    theme: {
      type: String, // blue, green, purple, orange, pink, cyan, indigo
      default: 'blue'
    },
    icon: {
      type: String,
      default: 'Brain'
    },
    order: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('RoadmapPhase', RoadmapPhaseSchema);
