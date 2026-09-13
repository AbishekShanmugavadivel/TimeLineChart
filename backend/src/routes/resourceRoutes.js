const express = require('express');
const router = express.Router();
const { getResources, createResource, deleteResource } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, getResources);
router.post('/', protect, createResource);
router.delete('/:id', protect, deleteResource);

module.exports = router;
