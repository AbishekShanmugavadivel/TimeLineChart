const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

// ============================================================
// LOAD ENVIRONMENT VARIABLES
// ============================================================
dotenv.config();

// ============================================================
// CONNECT DATABASE
// ============================================================
connectDB();

// ============================================================
// CREATE EXPRESS APP
// ============================================================
const app = express();

// ============================================================
// SECURITY
// ============================================================
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(cookieParser());

// ============================================================
// CORS CONFIGURATION
// ============================================================

const allowedOrigins = [
  // Production frontend
  "https://time-line-chart.vercel.app",

  // Environment variable
  process.env.CLIENT_URL,

  // Local development
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

console.log("Allowed CORS origins:", allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without an Origin header
    // (Postman, server-to-server requests, health checks, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`CORS blocked origin: ${origin}`);

    return callback(
      new Error(`CORS policy blocked this origin: ${origin}`)
    );
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],

  exposedHeaders: [],

  optionsSuccessStatus: 204,
};

// Apply CORS globally
app.use(cors(corsOptions));

// Explicitly handle browser preflight requests
app.options("*", cors(corsOptions));

// ============================================================
// RATE LIMITING
// ============================================================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use("/api", limiter);

// ============================================================
// BODY PARSERS
// ============================================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ============================================================
// ROOT HEALTH CHECK
// ============================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GenAI Roadmap API is running",
    environment: process.env.NODE_ENV || "development",
  });
});

// ============================================================
// API HEALTH CHECK
// ============================================================

app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;

  if (dbState === 1) {
    return res.status(200).json({
      success: true,
      message: "GenAI Roadmap API is running",
      database: "connected",
    });
  }

  return res.status(503).json({
    success: false,
    message: "Database unavailable",
    databaseState: dbState,
  });
});

// ============================================================
// API ROUTES
// ============================================================

app.use(
  "/api/access",
  require("./routes/accessRoutes")
);

app.use(
  "/api/profile",
  require("./routes/profileRoutes")
);

app.use(
  "/api/settings",
  require("./routes/settingsRoutes")
);

app.use(
  "/api/roadmap",
  require("./routes/roadmapRoutes")
);

app.use(
  "/api/tasks",
  require("./routes/taskRoutes")
);

app.use(
  "/api/progress",
  require("./routes/progressRoutes")
);

app.use(
  "/api/study",
  require("./routes/studyRoutes")
);

app.use(
  "/api/projects",
  require("./routes/projectRoutes")
);

app.use(
  "/api/notes",
  require("./routes/noteRoutes")
);

app.use(
  "/api/resources",
  require("./routes/resourceRoutes")
);

app.use(
  "/api/milestones",
  require("./routes/milestoneRoutes")
);

app.use(
  "/api/career",
  require("./routes/careerRoutes")
);

app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);

// ============================================================
// 404 HANDLER
// ============================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ============================================================
// CENTRALIZED ERROR HANDLER
// ============================================================

app.use(errorHandler);

// ============================================================
// START SERVER
// ============================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("================================================");
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("================================================");
});

