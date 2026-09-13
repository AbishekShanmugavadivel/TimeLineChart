const express = require('express');
const router = express.Router();
const { getTodayTasks, getAllTasks, completeTask, uncompleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/today', getTodayTasks);
router.get('/', getAllTasks);
router.put('/:id/complete', completeTask);
router.put('/:id/uncomplete', uncompleteTask);

module.exports = router;
