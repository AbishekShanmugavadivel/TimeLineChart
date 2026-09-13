const crypto = require('crypto');
const Session = require('../models/Session');

// Helper to safely compare secret code
const isSecretValid = (inputCode) => {
  if (!inputCode || typeof inputCode !== 'string') return false;
  const targetSecret = process.env.APP_SECRET_CODE || 'abishek@2007';

  const inputBuffer = Buffer.from(inputCode.trim());
  const targetBuffer = Buffer.from(targetSecret.trim());

  if (inputBuffer.length !== targetBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(inputBuffer, targetBuffer);
};

// Set HttpOnly Session Cookie (Cross-Site Production Compatible)
const setSessionCookie = (res, sessionToken) => {
  const isProduction = process.env.NODE_ENV === 'production' || (process.env.CLIENT_URL && process.env.CLIENT_URL.includes('vercel.app'));
  res.cookie('timeline_access', sessionToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  });
};

// @desc    Verify secret code & establish access session
// @route   POST /api/access/verify
const verifyAccess = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code || !isSecretValid(code)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid access code'
      });
    }

    // Generate random 64-char hex session token
    const sessionToken = crypto.randomBytes(32).toString('hex');

    // Persist session in MongoDB
    await Session.create({ sessionToken });

    // Set HttpOnly session cookie
    setSessionCookie(res, sessionToken);

    return res.json({
      success: true,
      message: 'Access granted',
      token: sessionToken
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check current session verification status
// @route   GET /api/access/status
const getAccessStatus = async (req, res, next) => {
  try {
    let sessionToken = req.cookies.timeline_access;

    if (!sessionToken && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      sessionToken = req.headers.authorization.split(' ')[1];
    }

    if (!sessionToken) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        message: 'No active session'
      });
    }

    const session = await Session.findOne({ sessionToken });
    if (!session) {
      const isProduction = process.env.NODE_ENV === 'production' || (process.env.CLIENT_URL && process.env.CLIENT_URL.includes('vercel.app'));
      res.clearCookie('timeline_access', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/'
      });
      return res.status(401).json({
        success: false,
        authenticated: false,
        message: 'Session expired or invalid'
      });
    }

    return res.json({
      success: true,
      authenticated: true
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout & terminate access session
// @route   POST /api/access/logout
const logoutAccess = async (req, res, next) => {
  try {
    let sessionToken = req.cookies.timeline_access;

    if (!sessionToken && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      sessionToken = req.headers.authorization.split(' ')[1];
    }

    if (sessionToken) {
      await Session.deleteOne({ sessionToken });
    }

    const isProduction = process.env.NODE_ENV === 'production' || (process.env.CLIENT_URL && process.env.CLIENT_URL.includes('vercel.app'));
    res.clearCookie('timeline_access', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/'
    });

    return res.json({
      success: true,
      message: 'Access session cleared'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyAccess,
  getAccessStatus,
  logoutAccess
};
