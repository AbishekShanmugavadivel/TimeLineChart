const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Please add a project name']
    },
    description: {
      type: String,
      default: ''
    },
    technology: [{
      type: String
    }],
    phaseNumber: {
      type: Number,
      default: 1
    },
    githubUrl: {
      type: String,
      default: ''
    },
    liveUrl: {
      type: String,
      default: ''
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['IDEA', 'PLANNING', 'IN_PROGRESS', 'COMPLETED'],
      default: 'PLANNING'
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);
