const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_ACCESS_SECRET = process.env.JWT_SECRET || 'genai_roadmap_access_secret_2026_key';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User/Owner not found' });
      }
      return next();
    } catch (error) {
      console.error('Auth middleware token verification failed:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'OWNER')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as an admin/owner' });
  }
};

module.exports = { protect, admin };
