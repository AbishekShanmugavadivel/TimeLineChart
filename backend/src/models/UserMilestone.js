const mongoose = require('mongoose');

const UserMilestoneSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    milestoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milestone',
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

UserMilestoneSchema.index({ userId: 1, milestoneId: 1 }, { unique: true });

module.exports = mongoose.model('UserMilestone', UserMilestoneSchema);
