const User = require('../models/User');

// @desc    Get owner settings
// @route   GET /api/settings
const getSettings = async (req, res, next) => {
  try {
    const owner = await User.findById(req.user._id);
    res.json({
      success: true,
      data: {
        studyHoursPerDay: owner.studyHoursPerDay,
        studyDaysPerWeek: owner.studyDaysPerWeek,
        weeklyProjectDay: owner.weeklyProjectDay,
        targetDate: owner.targetDate
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update owner settings
// @route   PUT /api/settings
const updateSettings = async (req, res, next) => {
  try {
    const owner = await User.findById(req.user._id);
    if (!owner) return res.status(404).json({ success: false, message: 'Owner not found' });

    if (req.body.studyHoursPerDay !== undefined) owner.studyHoursPerDay = req.body.studyHoursPerDay;
    if (req.body.studyDaysPerWeek !== undefined) owner.studyDaysPerWeek = req.body.studyDaysPerWeek;
    if (req.body.weeklyProjectDay !== undefined) owner.weeklyProjectDay = req.body.weeklyProjectDay;
    if (req.body.targetDate) owner.targetDate = new Date(req.body.targetDate);

    await owner.save();
    res.json({
      success: true,
      data: {
        studyHoursPerDay: owner.studyHoursPerDay,
        studyDaysPerWeek: owner.studyDaysPerWeek,
        weeklyProjectDay: owner.weeklyProjectDay,
        targetDate: owner.targetDate
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings };
