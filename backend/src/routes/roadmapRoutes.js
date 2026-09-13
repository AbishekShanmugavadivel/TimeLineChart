const express = require('express');
const router = express.Router();
const { getAllPhases, getPhaseById, getDayByNumber } = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

// Public or optional auth for viewing roadmap
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, getAllPhases);
router.get('/day/:dayNumber', optionalAuth, getDayByNumber);
router.get('/:phaseId', optionalAuth, getPhaseById);

module.exports = router;
