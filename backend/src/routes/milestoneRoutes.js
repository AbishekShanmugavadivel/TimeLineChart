const express = require('express');
const router = express.Router();
const { getMilestones, toggleMilestone } = require('../controllers/milestoneController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getMilestones);
router.put('/:id', toggleMilestone);

module.exports = router;
