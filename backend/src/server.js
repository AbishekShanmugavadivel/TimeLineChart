const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cookieParser());

// CORS configuration supporting HttpOnly credentials
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: [allowedOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  if (dbState === 1) {
    return res.status(200).json({
      success: true,
      message: 'GenAI Roadmap API is running',
      database: 'connected'
    });
  } else {
    return res.status(503).json({
      success: false,
      message: 'Database unavailable'
    });
  }
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/roadmap', require('./routes/roadmapRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/study', require('./routes/studyRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/milestones', require('./routes/milestoneRoutes'));
app.use('/api/career', require('./routes/careerRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Centralized Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
