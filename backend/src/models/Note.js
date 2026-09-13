const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Please add a note title']
    },
    content: {
      type: String,
      required: [true, 'Please add note content']
    },
    phaseNumber: {
      type: Number
    },
    topicName: {
      type: String
    },
    tags: [{
      type: String
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', NoteSchema);
