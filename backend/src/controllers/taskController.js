const DailyTask = require('../models/DailyTask');
const UserTaskProgress = require('../models/UserTaskProgress');
const RoadmapPhase = require('../models/RoadmapPhase');

// @desc    Get user's today learning plan and active tasks
// @route   GET /api/tasks/today
const getTodayTasks = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find highest completed day number
    const completedProgress = await UserTaskProgress.find({ userId, status: 'COMPLETED' })
      .populate('taskId');

    let completedDayNumbers = completedProgress.map((p) => (p.taskId ? p.taskId.dayNumber : 0));
    let currentDayNumber = completedDayNumbers.length > 0 ? Math.max(...completedDayNumbers) + 1 : 1;

    if (currentDayNumber > 299) currentDayNumber = 299;

    const todayTask = await DailyTask.findOne({ dayNumber: currentDayNumber }).populate('phaseId');
    if (!todayTask) {
      return res.status(404).json({ success: false, message: 'No task found for today' });
    }

    const progress = await UserTaskProgress.findOne({ userId, taskId: todayTask._id });
    const isCompleted = progress ? progress.status === 'COMPLETED' : false;

    // Calculate completed vs target hours for today
    const targetHours = req.user.studyHoursPerDay || 5;
    const timeSpentMinutes = progress ? progress.timeSpent || 0 : 0;
    const completedHours = parseFloat((timeSpentMinutes / 60).toFixed(1));
    const remainingHours = Math.max(0, parseFloat((targetHours - completedHours).toFixed(1)));

    res.json({
      success: true,
      data: {
        currentDay: currentDayNumber,
        totalDays: 299,
        targetHours,
        completedHours,
        remainingHours,
        phaseTitle: todayTask.phaseId ? todayTask.phaseId.title : 'Foundation & Core CS',
        phaseNumber: todayTask.phaseNumber,
        task: {
          ...todayTask.toObject(),
          completed: isCompleted
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks list with optional filtering
// @route   GET /api/tasks
const getAllTasks = async (req, res, next) => {
  try {
    const { phaseNumber } = req.query;
    let query = {};
    if (phaseNumber) {
      query.phaseNumber = parseInt(phaseNumber);
    }

    const tasks = await DailyTask.find(query).sort({ dayNumber: 1 });
    const userProgress = await UserTaskProgress.find({ userId: req.user._id });
    const progressMap = {};
    userProgress.forEach((p) => {
      progressMap[p.taskId.toString()] = p.status;
    });

    const tasksWithStatus = tasks.map((t) => ({
      ...t.toObject(),
      status: progressMap[t._id.toString()] || 'PENDING'
    }));

    res.json({ success: true, count: tasksWithStatus.length, data: tasksWithStatus });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark task as completed
// @route   PUT /api/tasks/:id/complete
const completeTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const userId = req.user._id;

    const task = await DailyTask.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    let progress = await UserTaskProgress.findOne({ userId, taskId });
    if (!progress) {
      progress = new UserTaskProgress({
        userId,
        taskId,
        dayNumber: task.dayNumber,
        status: 'COMPLETED',
        completedAt: new Date(),
        timeSpent: (task.estimatedHours || 4) * 60
      });
    } else {
      progress.status = 'COMPLETED';
      progress.completedAt = new Date();
    }

    await progress.save();
    res.json({ success: true, message: 'Task marked as completed', data: progress });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark task as incomplete
// @route   PUT /api/tasks/:id/uncomplete
const uncompleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const userId = req.user._id;

    let progress = await UserTaskProgress.findOne({ userId, taskId });
    if (progress) {
      progress.status = 'PENDING';
      await progress.save();
    }

    res.json({ success: true, message: 'Task marked as incomplete' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodayTasks,
  getAllTasks,
  completeTask,
  uncompleteTask
};
