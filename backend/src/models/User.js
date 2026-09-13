const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['OWNER'],
      default: 'OWNER'
    },
    refreshTokenHash: {
      type: String,
      select: false
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

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
