const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const getAccessTokenSecret = () => process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || 'genai_roadmap_access_secret_2026_key';
const getRefreshTokenSecret = () => process.env.JWT_REFRESH_SECRET || process.env.REFRESH_TOKEN_SECRET || 'genai_roadmap_refresh_secret_2026_key';

const generateAccessToken = (id) => {
  return jwt.sign({ id }, getAccessTokenSecret(), {
    expiresIn: '15m'
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, getRefreshTokenSecret(), {
    expiresIn: '30d'
  });
};

// Set HttpOnly Refresh Token Cookie (Cross-Site Production Compatible)
const setRefreshTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production' || (process.env.CLIENT_URL && process.env.CLIENT_URL.includes('vercel.app'));
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
};

// @desc    Authenticate single owner & set HttpOnly refresh token cookie
// @route   POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const ownerEmail = (process.env.OWNER_EMAIL || 'owner@genai.com').toLowerCase().trim();
    const ownerPassword = process.env.OWNER_PASSWORD || 'OwnerSecurePassword2026!';

    // Find owner account flexible lookup
    let owner = await User.findOne({
      $or: [
        { role: 'OWNER' },
        { role: 'ADMIN' },
        { email: email.toLowerCase().trim() },
        { email: ownerEmail }
      ]
    }).select('+password');

    // Auto-create/upsert owner if DB is fresh
    if (!owner) {
      owner = await User.create({
        name: 'Roadmap Owner',
        email: ownerEmail,
        password: ownerPassword,
        role: 'OWNER'
      });
      owner = await User.findById(owner._id).select('+password');
    }

    // Match password
    let isPasswordValid = await owner.matchPassword(password);

    // Self-healing: if entered password matches configured OWNER_PASSWORD env/default, sync stored DB password
    if (!isPasswordValid && password === ownerPassword) {
      owner.password = ownerPassword;
      await owner.save();
      isPasswordValid = true;
    }

    const inputEmail = email.toLowerCase().trim();
    const isEmailValid = inputEmail === owner.email.toLowerCase().trim() || inputEmail === ownerEmail || owner.role === 'OWNER';

    if (!isEmailValid || !isPasswordValid) {
      console.warn(`[AUTH LOGIN FAILED] Attempted email: ${email} | Owner email: ${owner.email} | Reason: ${!isEmailValid ? 'Email mismatch' : 'Password mismatch'}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate Tokens
    const accessToken = generateAccessToken(owner._id);
    const refreshToken = generateRefreshToken(owner._id);

    // Hash refresh token for DB storage
    const salt = await bcrypt.genSalt(10);
    owner.refreshTokenHash = await bcrypt.hash(refreshToken, salt);
    await owner.save();

    // Set HttpOnly cookie
    setRefreshTokenCookie(res, refreshToken);

    res.json({
      success: true,
      accessToken,
      data: {
        _id: owner._id,
        name: owner.name,
        email: owner.email,
        role: owner.role,
        college: owner.college,
        degree: owner.degree,
        year: owner.year,
        graduationYear: owner.graduationYear,
        targetRole: owner.targetRole,
        studyHoursPerDay: owner.studyHoursPerDay,
        studyDaysPerWeek: owner.studyDaysPerWeek,
        weeklyProjectDay: owner.weeklyProjectDay,
        targetDate: owner.targetDate
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token using HttpOnly refresh cookie
// @route   POST /api/auth/refresh
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Refresh token missing. Please log in.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, getRefreshTokenSecret());
    } catch (err) {
      const isProduction = process.env.NODE_ENV === 'production' || (process.env.CLIENT_URL && process.env.CLIENT_URL.includes('vercel.app'));
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
      });
      return res.status(401).json({ success: false, message: 'Refresh token expired or invalid' });
    }

    const owner = await User.findById(decoded.id).select('+refreshTokenHash');
    if (!owner || !owner.refreshTokenHash) {
      const isProduction = process.env.NODE_ENV === 'production' || (process.env.CLIENT_URL && process.env.CLIENT_URL.includes('vercel.app'));
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
      });
      return res.status(401).json({ success: false, message: 'Session revoked or owner not found' });
    }

    // Verify refresh token against stored hash
    const isTokenMatched = await bcrypt.compare(token, owner.refreshTokenHash);
    if (!isTokenMatched) {
      const isProduction = process.env.NODE_ENV === 'production' || (process.env.CLIENT_URL && process.env.CLIENT_URL.includes('vercel.app'));
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
      });
      return res.status(401).json({ success: false, message: 'Session revoked' });
    }

    // Issue new access token
    const newAccessToken = generateAccessToken(owner._id);

    res.json({
      success: true,
      accessToken: newAccessToken,
      data: {
        _id: owner._id,
        name: owner.name,
        email: owner.email,
        role: owner.role,
        college: owner.college,
        degree: owner.degree,
        year: owner.year,
        graduationYear: owner.graduationYear,
        targetRole: owner.targetRole,
        studyHoursPerDay: owner.studyHoursPerDay,
        studyDaysPerWeek: owner.studyDaysPerWeek,
        targetDate: owner.targetDate
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout owner & clear session
// @route   POST /api/auth/logout
const logoutUser = async (req, res, next) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $unset: { refreshTokenHash: 1 } });
    }

    const isProduction = process.env.NODE_ENV === 'production' || (process.env.CLIENT_URL && process.env.CLIENT_URL.includes('vercel.app'));
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax'
    });

    res.json({ success: true, message: 'You have been logged out.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in owner profile
// @route   GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const owner = await User.findById(req.user._id);
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }
    res.json({ success: true, data: owner });
  } catch (error) {
    next(error);
  }
};

// @desc    Update owner profile & preferences
// @route   PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const owner = await User.findById(req.user._id);
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }

    owner.name = req.body.name || owner.name;
    owner.college = req.body.college || owner.college;
    owner.degree = req.body.degree || owner.degree;
    owner.year = req.body.year || owner.year;
    owner.graduationYear = req.body.graduationYear || owner.graduationYear;
    owner.targetRole = req.body.targetRole || owner.targetRole;
    owner.studyHoursPerDay = req.body.studyHoursPerDay !== undefined ? req.body.studyHoursPerDay : owner.studyHoursPerDay;
    owner.studyDaysPerWeek = req.body.studyDaysPerWeek !== undefined ? req.body.studyDaysPerWeek : owner.studyDaysPerWeek;
    owner.weeklyProjectDay = req.body.weeklyProjectDay !== undefined ? req.body.weeklyProjectDay : owner.weeklyProjectDay;
    if (req.body.targetDate) {
      owner.targetDate = new Date(req.body.targetDate);
    }

    if (req.body.password) {
      owner.password = req.body.password;
    }

    const updatedOwner = await owner.save();

    res.json({
      success: true,
      data: {
        _id: updatedOwner._id,
        name: updatedOwner.name,
        email: updatedOwner.email,
        role: updatedOwner.role,
        college: updatedOwner.college,
        degree: updatedOwner.degree,
        year: updatedOwner.year,
        graduationYear: updatedOwner.graduationYear,
        targetRole: updatedOwner.targetRole,
        studyHoursPerDay: updatedOwner.studyHoursPerDay,
        studyDaysPerWeek: updatedOwner.studyDaysPerWeek,
        weeklyProjectDay: updatedOwner.weeklyProjectDay,
        targetDate: updatedOwner.targetDate
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginUser,
  refreshToken,
  logoutUser,
  getMe,
  updateProfile
};
