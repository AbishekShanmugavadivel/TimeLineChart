const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      default: 'Roadmap Owner'
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      lowercase: true,
      default: 'abishekgasckcs@gmail.com'
    },
    role: {
      type: String,
      enum: ['OWNER'],
      default: 'OWNER'
    },
    college: {
      type: String,
      default: '3rd B.Sc Computer Science'
    },
    degree: {
      type: String,
      default: 'Bachelor of Science in Computer Science'
    },
    year: {
      type: String,
      default: '3rd Year'
    },
    graduationYear: {
      type: String,
      default: '2026-2027'
    },
    targetRole: {
      type: String,
      enum: ['AI Engineer', 'ML Engineer', 'GenAI Engineer', 'Full Stack AI Engineer', 'Data Scientist', 'AI Developer'],
      default: 'AI Engineer'
    },
    studyHoursPerDay: {
      type: Number,
      default: 5
    },
    studyDaysPerWeek: {
      type: Number,
      default: 5
    },
    weeklyProjectDay: {
      type: Number,
      default: 1
    },
    targetDate: {
      type: Date,
      default: () => {
        const d = new Date();
        d.setDate(d.getDate() + 299);
        return d;
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
