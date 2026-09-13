const express = require('express');
const router = express.Router();
const { getOverallProgress, getWeeklyProgress, getMonthlyProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getOverallProgress);
router.get('/weekly', getWeeklyProgress);
router.get('/monthly', getMonthlyProgress);

module.exports = router;
