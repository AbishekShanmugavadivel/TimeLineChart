const express = require('express');
const router = express.Router();
const { recordSession, getSessions, getStudyStats } = require('../controllers/studyController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/sessions', recordSession);
router.get('/sessions', getSessions);
router.get('/stats', getStudyStats);

module.exports = router;
