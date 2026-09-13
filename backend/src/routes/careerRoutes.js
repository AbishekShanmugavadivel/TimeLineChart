const express = require('express');
const router = express.Router();
const { getCareerReadiness } = require('../controllers/careerController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getCareerReadiness);

module.exports = router;
