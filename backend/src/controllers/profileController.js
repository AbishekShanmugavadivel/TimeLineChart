const User = require('../models/User');

// @desc    Get owner profile & degree details
// @route   GET /api/profile
const getProfile = async (req, res, next) => {
  try {
    const owner = await User.findById(req.user._id);
    res.json({ success: true, data: owner });
  } catch (error) {
    next(error);
  }
};

// @desc    Update owner profile
// @route   PUT /api/profile
const updateProfile = async (req, res, next) => {
  try {
    const owner = await User.findById(req.user._id);
    if (!owner) return res.status(404).json({ success: false, message: 'Owner not found' });

    owner.name = req.body.name || owner.name;
    owner.college = req.body.college || owner.college;
    owner.degree = req.body.degree || owner.degree;
    owner.year = req.body.year || owner.year;
    owner.graduationYear = req.body.graduationYear || owner.graduationYear;
    owner.targetRole = req.body.targetRole || owner.targetRole;

    await owner.save();
    res.json({ success: true, data: owner });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
