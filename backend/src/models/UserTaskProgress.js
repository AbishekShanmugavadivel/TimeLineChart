const mongoose = require('mongoose');

const UserTaskProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DailyTask',
      required: true
    },
    dayNumber: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED'],
      default: 'PENDING'
    },
    completedAt: {
      type: Date
    },
    timeSpent: {
      type: Number, // in minutes
      default: 0
    }
  },
  { timestamps: true }
);

UserTaskProgressSchema.index({ userId: 1, taskId: 1 }, { unique: true });

module.exports = mongoose.model('UserTaskProgress', UserTaskProgressSchema);
