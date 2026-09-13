const express = require('express');
const router = express.Router();
const { getAdminStats, getUsers, savePhase, saveTask } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.post('/roadmap', savePhase);
router.post('/tasks', saveTask);

module.exports = router;
