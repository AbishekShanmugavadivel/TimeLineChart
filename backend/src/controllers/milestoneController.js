const Milestone = require('../models/Milestone');
const UserMilestone = require('../models/UserMilestone');
const UserTaskProgress = require('../models/UserTaskProgress');
const DailyTask = require('../models/DailyTask');
const Project = require('../models/Project');

// @desc    Get milestones with user's auto-calculated and manual completion status
// @route   GET /api/milestones
const getMilestones = async (req, res, next) => {
  try {
    const milestones = await Milestone.find().sort({ order: 1 });
    const userId = req.user._id;

    const userMilestones = await UserMilestone.find({ userId });
    const userMilestoneMap = {};
    userMilestones.forEach((um) => {
      userMilestoneMap[um.milestoneId.toString()] = um.completed;
    });

    // Fetch user progress for auto calculation
    const completedTaskCount = await UserTaskProgress.countDocuments({ userId, status: 'COMPLETED' });
    const completedProjectsCount = await Project.countDocuments({ userId, status: 'COMPLETED' });

    const milestonesWithStatus = milestones.map((m) => {
      let isCompleted = userMilestoneMap[m._id.toString()] || false;

      // Auto-unlock conditions if not manually set
      if (!isCompleted) {
        if (m.condition === 'PHASE_2_COMPLETE' && completedTaskCount >= 45) isCompleted = true;
        if (m.condition === 'PHASE_5_COMPLETE' && completedTaskCount >= 120) isCompleted = true;
        if (m.condition === 'PHASE_8_COMPLETE' && completedTaskCount >= 200) isCompleted = true;
        if (m.condition === 'PHASE_9_COMPLETE' && completedTaskCount >= 220) isCompleted = true;
        if (m.condition === 'PHASE_10_COMPLETE' && completedTaskCount >= 299) isCompleted = true;
        if (m.condition === 'PORTFOLIO_READY' && completedProjectsCount >= 3) isCompleted = true;
      }

      return {
        ...m.toObject(),
        completed: isCompleted
      };
    });

    res.json({ success: true, count: milestonesWithStatus.length, data: milestonesWithStatus });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle milestone manual completion
// @route   PUT /api/milestones/:id
const toggleMilestone = async (req, res, next) => {
  try {
    const milestoneId = req.params.id;
    const userId = req.user._id;

    let userMilestone = await UserMilestone.findOne({ userId, milestoneId });
    if (!userMilestone) {
      userMilestone = new UserMilestone({
        userId,
        milestoneId,
        completed: true,
        completedAt: new Date()
      });
    } else {
      userMilestone.completed = !userMilestone.completed;
      userMilestone.completedAt = userMilestone.completed ? new Date() : null;
    }

    await userMilestone.save();
    res.json({ success: true, data: userMilestone });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMilestones,
  toggleMilestone
};
