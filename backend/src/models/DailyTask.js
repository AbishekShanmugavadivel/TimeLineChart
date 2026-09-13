const mongoose = require('mongoose');

const DailyTaskSchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
      index: true
    },
    phaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoadmapPhase',
      required: true
    },
    phaseNumber: {
      type: Number,
      required: true
    },
    topicName: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    tasksList: [{
      type: String
    }],
    estimatedHours: {
      type: Number,
      default: 4
    },
    practiceTask: {
      type: String,
      default: ''
    },
    revisionTask: {
      type: String,
      default: 'Review today concepts for 20 minutes'
    },
    order: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('DailyTask', DailyTaskSchema);
