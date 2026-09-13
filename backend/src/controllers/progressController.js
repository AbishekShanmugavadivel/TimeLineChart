const DailyTask = require('../models/DailyTask');
const UserTaskProgress = require('../models/UserTaskProgress');
const StudySession = require('../models/StudySession');
const RoadmapPhase = require('../models/RoadmapPhase');

// Helper to calculate consecutive streaks
const calculateStreaks = (activityDates) => {
  if (!activityDates || activityDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Normalize dates to YYYY-MM-DD
  const dateStrings = Array.from(
    new Set(activityDates.map((d) => new Date(d).toISOString().split('T')[0]))
  ).sort().reverse(); // Most recent first

  if (dateStrings.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let currentStreak = 0;
  let maxStreak = 0;

  // Check if today or yesterday has activity
  let checkIndex = 0;
  if (dateStrings.includes(todayStr) || dateStrings.includes(yesterdayStr)) {
    let curr = new Date(dateStrings.includes(todayStr) ? todayStr : yesterdayStr);
    while (true) {
      const currStr = curr.toISOString().split('T')[0];
      if (dateStrings.includes(currStr)) {
        currentStreak++;
        curr.setDate(curr.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak historical
  let tempStreak = 1;
  const sortedAsc = [...dateStrings].sort();
  for (let i = 1; i < sortedAsc.length; i++) {
    const prev = new Date(sortedAsc[i - 1]);
    const curr = new Date(sortedAsc[i]);
    const diffTime = Math.abs(curr - prev);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      tempStreak++;
    } else {
      maxStreak = Math.max(maxStreak, tempStreak);
      tempStreak = 1;
    }
  }
  maxStreak = Math.max(maxStreak, tempStreak, currentStreak);

  return { currentStreak, longestStreak: maxStreak };
};

// @desc    Get overall user progress dashboard statistics
// @route   GET /api/progress
const getOverallProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totalTasksCount = (await DailyTask.countDocuments()) || 299;
    const completedTasks = await UserTaskProgress.find({ userId, status: 'COMPLETED' }).populate('taskId');

    const completedTasksCount = completedTasks.length;
    const overallProgressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

    // Study sessions total hours
    const sessions = await StudySession.find({ userId });
    const sessionMinutes = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    const totalHoursStudied = Math.round((sessionMinutes / 60) + (completedTasksCount * 4)); // combining completed task hours + logged timer sessions

    // Determine current phase
    const highestCompletedDay = completedTasks.reduce((max, p) => (p.taskId && p.taskId.dayNumber > max ? p.taskId.dayNumber : max), 0);
    const currentDay = Math.min(299, highestCompletedDay + 1);

    const currentPhaseTask = await DailyTask.findOne({ dayNumber: currentDay }).populate('phaseId');
    const currentPhaseTitle = currentPhaseTask && currentPhaseTask.phaseId ? currentPhaseTask.phaseId.title : 'Foundation & Core CS';

    // Activity dates for streak calculation
    const taskDates = completedTasks.map((t) => t.completedAt).filter(Boolean);
    const sessionDates = sessions.map((s) => s.date).filter(Boolean);
    const allActivityDates = [...taskDates, ...sessionDates];

    const { currentStreak, longestStreak } = calculateStreaks(allActivityDates);

    // Calculate weekly and monthly hours
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const weeklySessions = sessions.filter((s) => new Date(s.date) >= startOfWeek);
    const monthlySessions = sessions.filter((s) => new Date(s.date) >= startOfMonth);

    const weeklyHours = parseFloat(((weeklySessions.reduce((acc, s) => acc + s.duration, 0) / 60) + (completedTasks.filter(t => new Date(t.completedAt) >= startOfWeek).length * 4)).toFixed(1));
    const monthlyHours = parseFloat(((monthlySessions.reduce((acc, s) => acc + s.duration, 0) / 60) + (completedTasks.filter(t => new Date(t.completedAt) >= startOfMonth).length * 4)).toFixed(1));

    // Dynamic days remaining until user's target date
    const targetDate = req.user.targetDate ? new Date(req.user.targetDate) : new Date(Date.now() + 299 * 24 * 60 * 60 * 1000);
    const diffTime = targetDate - new Date();
    const remainingDaysAvailable = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    res.json({
      success: true,
      data: {
        overallProgressPercent,
        completedDays: Math.min(299, completedTasksCount),
        totalDays: 299,
        hoursStudied: totalHoursStudied,
        targetHours: 1495,
        currentPhase: currentPhaseTitle,
        currentDay,
        currentStreak,
        longestStreak,
        weeklyHours,
        monthlyHours,
        remainingDaysAvailable
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weekly study chart data
// @route   GET /api/progress/weekly
const getWeeklyProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = days.map((day) => ({ day, hours: 0 }));

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const sessions = await StudySession.find({
      userId,
      date: { $gte: startOfWeek }
    });

    sessions.forEach((s) => {
      const dayIdx = new Date(s.date).getDay();
      result[dayIdx].hours += s.duration / 60;
    });

    result.forEach((item) => {
      item.hours = parseFloat(item.hours.toFixed(1));
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly study chart data
// @route   GET /api/progress/monthly
const getMonthlyProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = months.map((month) => ({ month, hours: 0 }));

    const yearStart = new Date(new Date().getFullYear(), 0, 1);
    const sessions = await StudySession.find({
      userId,
      date: { $gte: yearStart }
    });

    sessions.forEach((s) => {
      const monthIdx = new Date(s.date).getMonth();
      result[monthIdx].hours += s.duration / 60;
    });

    result.forEach((item) => {
      item.hours = Math.round(item.hours);
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverallProgress,
  getWeeklyProgress,
  getMonthlyProgress
};
