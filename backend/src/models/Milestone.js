const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    phaseNumber: {
      type: Number
    },
    condition: {
      type: String, // e.g., 'PHASE_1_COMPLETE', 'FIRST_PROJECT', 'STREAK_7'
      required: true
    },
    order: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Milestone', MilestoneSchema);
