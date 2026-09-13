const StudySession = require('../models/StudySession');

// @desc    Record a study session (from Study Timer or manual entry)
// @route   POST /api/study/sessions
const recordSession = async (req, res, next) => {
  try {
    const { phaseNumber, topicName, duration, source } = req.body;

    if (!duration || duration <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid session duration' });
    }

    const session = await StudySession.create({
      userId: req.user._id,
      phaseNumber: phaseNumber || 1,
      topicName: topicName || 'General AI Study',
      duration, // in minutes
      source: source || 'timer',
      date: new Date()
    });

    res.status(201).json({ success: true, message: 'Study session recorded successfully', data: session });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's study session history
// @route   GET /api/study/sessions
const getSessions = async (req, res, next) => {
  try {
    const sessions = await StudySession.find({ userId: req.user._id }).sort({ date: -1 }).limit(50);
    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed study statistics
// @route   GET /api/study/stats
const getStudyStats = async (req, res, next) => {
  try {
    const sessions = await StudySession.find({ userId: req.user._id });
    const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
    const totalHours = parseFloat((totalMinutes / 60).toFixed(1));
    const totalSessions = sessions.length;

    res.json({
      success: true,
      data: {
        totalHours,
        totalMinutes,
        totalSessions,
        averageSessionMinutes: totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recordSession,
  getSessions,
  getStudyStats
};
