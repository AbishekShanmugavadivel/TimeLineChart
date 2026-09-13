const Session = require('../models/Session');
const User = require('../models/User');

const requireAccess = async (req, res, next) => {
  let sessionToken = req.cookies.timeline_access;

  if (!sessionToken && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    sessionToken = req.headers.authorization.split(' ')[1];
  }

  if (!sessionToken) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Valid access code session required.'
    });
  }

  try {
    const session = await Session.findOne({ sessionToken });
    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Session expired or invalid. Please re-enter your access code.'
      });
    }

    // Attach single owner profile to request for application controllers
    let owner = await User.findOne({ role: 'OWNER' });
    if (!owner) {
      owner = await User.create({
        name: 'Roadmap Owner',
        email: 'abishekgasckcs@gmail.com',
        role: 'OWNER'
      });
    }

    req.user = owner;
    req.access = true;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Access verification failed.'
    });
  }
};

module.exports = {
  requireAccess,
  protect: requireAccess // Alias for backward compatibility across route files
};
