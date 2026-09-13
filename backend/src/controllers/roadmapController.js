const RoadmapPhase = require('../models/RoadmapPhase');
const Topic = require('../models/Topic');
const DailyTask = require('../models/DailyTask');
const UserTaskProgress = require('../models/UserTaskProgress');

// @desc    Get all roadmap phases with user's completion progress
// @route   GET /api/roadmap
const getAllPhases = async (req, res, next) => {
  try {
    const phases = await RoadmapPhase.find().sort({ phaseNumber: 1 });
    const userId = req.user ? req.user._id : null;

    // Fetch user progress if logged in
    let userProgressMap = {};
    if (userId) {
      const progresses = await UserTaskProgress.find({ userId, status: 'COMPLETED' });
      progresses.forEach((p) => {
        userProgressMap[p.taskId.toString()] = true;
      });
    }

    const phasesWithStats = await Promise.all(
      phases.map(async (phase) => {
        const totalTasksInPhase = await DailyTask.countDocuments({ phaseId: phase._id });
        let completedTasksInPhase = 0;

        if (userId && totalTasksInPhase > 0) {
          const tasksInPhase = await DailyTask.find({ phaseId: phase._id }).select('_id');
          const taskIds = tasksInPhase.map((t) => t._id);
          completedTasksInPhase = await UserTaskProgress.countDocuments({
            userId,
            taskId: { $in: taskIds },
            status: 'COMPLETED'
          });
        }

        const progressPercent = totalTasksInPhase > 0 ? Math.round((completedTasksInPhase / totalTasksInPhase) * 100) : 0;

        // Determine status: COMPLETED, IN_PROGRESS, NOT_STARTED, LOCKED
        let status = 'NOT_STARTED';
        if (progressPercent === 100) {
          status = 'COMPLETED';
        } else if (progressPercent > 0) {
          status = 'IN_PROGRESS';
        } else if (phase.phaseNumber === 1) {
          status = 'NOT_STARTED';
        } else {
          // If previous phase is completed or in progress, unlock this phase
          status = 'NOT_STARTED';
        }

        return {
          ...phase.toObject(),
          totalTasks: totalTasksInPhase,
          completedTasks: completedTasksInPhase,
          progressPercent,
          status
        };
      })
    );

    res.json({ success: true, data: phasesWithStats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get phase detail by phase number or Mongo ID
// @route   GET /api/roadmap/:phaseId
const getPhaseById = async (req, res, next) => {
  try {
    const { phaseId } = req.params;
    let phase;

    if (phaseId.match(/^[0-9a-fA-F]{24}$/)) {
      phase = await RoadmapPhase.findById(phaseId);
    } else {
      phase = await RoadmapPhase.findOne({ phaseNumber: parseInt(phaseId) });
    }

    if (!phase) {
      return res.status(404).json({ success: false, message: 'Phase not found' });
    }

    const topics = await Topic.find({ phaseId: phase._id }).sort({ order: 1 });
    const dailyTasks = await DailyTask.find({ phaseId: phase._id }).sort({ dayNumber: 1 });

    const userId = req.user ? req.user._id : null;
    let completedTaskIds = new Set();
    if (userId) {
      const userProgress = await UserTaskProgress.find({ userId, status: 'COMPLETED' });
      userProgress.forEach((up) => completedTaskIds.add(up.taskId.toString()));
    }

    // Attach completion state to tasks
    const tasksWithProgress = dailyTasks.map((task) => ({
      ...task.toObject(),
      completed: completedTaskIds.has(task._id.toString())
    }));

    const completedCount = tasksWithProgress.filter((t) => t.completed).length;
    const progressPercent = tasksWithProgress.length > 0 ? Math.round((completedCount / tasksWithProgress.length) * 100) : 0;

    res.json({
      success: true,
      data: {
        ...phase.toObject(),
        topics,
        dailyTasks: tasksWithProgress,
        totalTasks: tasksWithProgress.length,
        completedTasks: completedCount,
        progressPercent
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task/day details by day number
// @route   GET /api/roadmap/day/:dayNumber
const getDayByNumber = async (req, res, next) => {
  try {
    const dayNumber = parseInt(req.params.dayNumber);
    const task = await DailyTask.findOne({ dayNumber }).populate('phaseId');

    if (!task) {
      return res.status(404).json({ success: false, message: `Day ${dayNumber} not found` });
    }

    let completed = false;
    if (req.user) {
      const progress = await UserTaskProgress.findOne({ userId: req.user._id, taskId: task._id });
      completed = progress ? progress.status === 'COMPLETED' : false;
    }

    res.json({
      success: true,
      data: {
        ...task.toObject(),
        completed
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPhases,
  getPhaseById,
  getDayByNumber
};
