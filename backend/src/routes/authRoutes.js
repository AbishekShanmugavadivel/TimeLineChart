const express = require('express');
const router = express.Router();

router.all('*', (req, res) => {
  res.status(410).json({
    success: false,
    message: 'Traditional user auth has been replaced with secret code access (/api/access/verify).'
  });
});

module.exports = router;
