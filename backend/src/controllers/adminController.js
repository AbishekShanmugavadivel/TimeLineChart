const RoadmapPhase = require('../models/RoadmapPhase');
const Topic = require('../models/Topic');
const DailyTask = require('../models/DailyTask');
const User = require('../models/User');

// @desc    Get overall admin stats and platform metrics
// @route   GET /api/admin/stats
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPhases = await RoadmapPhase.countDocuments();
    const totalTopics = await Topic.countDocuments();
    const totalTasks = await DailyTask.countDocuments();

    res.json({
      success: true,
      data: {
        totalUsers,
        totalPhases,
        totalTopics,
        totalTasks
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list for admin
// @route   GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Create/Update roadmap phase
// @route   POST /api/admin/roadmap
const savePhase = async (req, res, next) => {
  try {
    const { phaseNumber, title, description, startDay, endDay, duration, studyHours, theme, icon } = req.body;

    let phase = await RoadmapPhase.findOne({ phaseNumber });
    if (phase) {
      phase = await RoadmapPhase.findOneAndUpdate({ phaseNumber }, req.body, { new: true });
    } else {
      phase = await RoadmapPhase.create(req.body);
    }

    res.json({ success: true, data: phase });
  } catch (error) {
    next(error);
  }
};

// @desc    Create daily task
// @route   POST /api/admin/tasks
const saveTask = async (req, res, next) => {
  try {
    const { dayNumber, phaseNumber, topicName, title, description, tasksList, estimatedHours, practiceTask } = req.body;

    const phase = await RoadmapPhase.findOne({ phaseNumber });
    if (!phase) {
      return res.status(400).json({ success: false, message: 'Phase number not found' });
    }

    let task = await DailyTask.findOne({ dayNumber });
    if (task) {
      task = await DailyTask.findOneAndUpdate({ dayNumber }, { ...req.body, phaseId: phase._id }, { new: true });
    } else {
      task = await DailyTask.create({ ...req.body, phaseId: phase._id });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getUsers,
  savePhase,
  saveTask
};
