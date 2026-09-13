const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { verifyAccess, getAccessStatus, logoutAccess } = require('../controllers/accessController');

// Rate limiter specifically for secret code verification (prevent brute-forcing)
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit to 10 verification attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many verification attempts. Please try again after 15 minutes.'
  }
});

router.post('/verify', verifyLimiter, verifyAccess);
router.get('/status', getAccessStatus);
router.post('/logout', logoutAccess);

module.exports = router;
