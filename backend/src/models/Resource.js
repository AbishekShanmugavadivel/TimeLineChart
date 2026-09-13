const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['Documentation', 'Course', 'Video', 'Article', 'GitHub', 'Practice'],
      default: 'Documentation'
    },
    phaseNumber: {
      type: Number,
      required: true
    },
    topicName: {
      type: String
    },
    description: {
      type: String,
      default: ''
    },
    isGlobal: {
      type: Boolean,
      default: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', ResourceSchema);
