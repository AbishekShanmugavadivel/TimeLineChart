const UserTaskProgress = require('../models/UserTaskProgress');
const Project = require('../models/Project');

// @desc    Get AI Engineer Career Readiness statistics
// @route   GET /api/career
const getCareerReadiness = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch user task progress with populates
    const completedProgresses = await UserTaskProgress.find({ userId, status: 'COMPLETED' }).populate('taskId');

    let phaseCompletions = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0
    };

    completedProgresses.forEach((p) => {
      if (p.taskId && p.taskId.phaseNumber) {
        phaseCompletions[p.taskId.phaseNumber] = (phaseCompletions[p.taskId.phaseNumber] || 0) + 1;
      }
    });

    // Phase max days: P1:20, P2:25, P3:15, P4:30, P5:30, P6:30, P7:30, P8:20, P9:20, P10:79
    const maxDays = { 1: 20, 2: 25, 3: 15, 4: 30, 5: 30, 6: 30, 7: 30, 8: 20, 9: 20, 10: 79 };

    const getPhasePercent = (pNum) => {
      const done = phaseCompletions[pNum] || 0;
      const total = maxDays[pNum] || 20;
      return Math.min(100, Math.round((done / total) * 100));
    };

    // Calculate skill scores
    const pythonScore = Math.max(15, getPhasePercent(2));
    const dsaScore = Math.max(10, getPhasePercent(1));
    const mlScore = Math.max(5, getPhasePercent(4));
    const dlScore = Math.max(5, getPhasePercent(5));
    const llmScore = Math.max(5, Math.round((getPhasePercent(7) + getPhasePercent(8)) / 2));
    
    // Project score
    const projectsCount = await Project.countDocuments({ userId });
    const completedProjectsCount = await Project.countDocuments({ userId, status: 'COMPLETED' });
    const projectScore = Math.min(100, Math.round((completedProjectsCount * 25) + (projectsCount * 10)));

    const overallReadiness = Math.round(
      (pythonScore * 0.2) +
      (dsaScore * 0.15) +
      (mlScore * 0.2) +
      (dlScore * 0.15) +
      (llmScore * 0.15) +
      (projectScore * 0.15)
    );

    const skillsBreakdown = [
      { name: 'Core CS & DSA', category: 'Foundation', percentage: dsaScore },
      { name: 'Python Programming', category: 'Language', percentage: pythonScore },
      { name: 'Machine Learning', category: 'AI Core', percentage: mlScore },
      { name: 'Deep Learning & PyTorch', category: 'AI Core', percentage: dlScore },
      { name: 'LLMs & RAG Architectures', category: 'GenAI', percentage: llmScore },
      { name: 'Real Projects & Portfolio', category: 'Practical', percentage: projectScore }
    ];

    res.json({
      success: true,
      data: {
        overallReadiness,
        skillsBreakdown,
        targetRole: req.user.targetRole || 'AI Engineer'
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCareerReadiness
};
