const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema(
  {
    sessionToken: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '7d' // Automatically expires after 7 days
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', SessionSchema);
