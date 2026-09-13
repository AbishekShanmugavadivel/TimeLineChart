# GenAI Roadmap - From Beginner to AI Engineer

> A complete, production-ready MERN stack web application providing a structured 299-day learning operating system for aspiring AI Engineers.

Inspired by modern SaaS dashboard layouts and high-converting visual roadmaps, **GenAI Roadmap** guides students through 10 sequential phases: from Computer Science fundamentals to Deep Learning, Transformers, Vector Databases, AI Agents (MCP), and Voice AI.

---

## Key Features

- **10 Sequential Roadmap Phases**: Foundation & Core CS, Python Advanced, Mathematics for AI, Machine Learning, Deep Learning, Computer Vision & NLP, Transformers & LLMs, RAG & Vector Databases, AI Agents & MCP, Voice AI & Multimodal Projects.
- **Interactive Home Dashboard**: Top status cards, user-configurable study summary, vertical timeline cards matching reference visual design, Time Summary, Key Milestones, and Success Tips.
- **Interactive Daily Learning & Study Timer**: Live Pomodoro & custom study timer (25m/50m/90m/custom) that automatically logs sessions directly to MongoDB.
- **Progress Tracking & Analytics**: Visual charts powered by Recharts (Weekly & Monthly hours, overall completion %, consecutive study streaks).
- **Portfolio Project Tracker**: Create, track, and manage real-world AI applications with GitHub repository and live demo URL links.
- **Study Notes & Resource Library**: Full CRUD notes manager with tag search, plus bookmarked tutorials, documentation, and repositories.
- **Career Readiness Radar**: Dynamic job readiness percentage calculated from completed roadmap tasks and portfolio projects.
- **Admin Control System**: Role-based access control (`ADMIN` vs `USER`) to manage roadmap phases, topics, daily tasks, and view platform metrics.
- **Full JWT Authentication & Security**: Password hashing with bcrypt, protected routes, Helmet, CORS, and Express rate limiting.

---

## Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Analytics**: Recharts
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose
- **Auth**: JSON Web Tokens (JWT) + bcryptjs
- **Security**: Helmet, CORS, Express Rate Limit

---

## Directory Structure

```
genai-roadmap/
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components (Navbar, Sidebar, RoadmapCard, StudyTimer, etc.)
│   │   ├── context/      # AuthContext
│   │   ├── layouts/      # DashboardLayout, AuthLayout
│   │   ├── pages/        # Dashboard, Roadmap, PhaseDetail, Today, Progress, Projects, Notes, Resources, Career, Milestones, Profile, Settings, Admin, Login, Register
│   │   ├── services/     # Axios API configuration & entity services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Auth, Roadmap, Task, Progress, Study, Project, Note, Resource, Milestone, Admin controllers
│   │   ├── middleware/   # Auth & Error handling middlewares
│   │   ├── models/       # Mongoose Schemas (User, RoadmapPhase, Topic, DailyTask, StudySession, Project, Note, Resource, Milestone)
│   │   ├── routes/       # Express route handlers
│   │   ├── seed/         # Automated DB seed script for 10 phases & 299 daily tasks
│   │   └── server.js     # Entry point
│   ├── package.json
│   └── .env.example
├── README.md
└── .gitignore
```

---

## Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally on `mongodb://127.0.0.1:27017/genai_roadmap` OR MongoDB Atlas connection URI.

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # Populates 10 phases, topics, 299 daily tasks, milestones, and default admin user
npm run dev      # Starts Express backend server on http://localhost:5000
```

Default Demo Admin Credentials created by seed:
- **Email**: `admin@genai.com`
- **Password**: `password123`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

---

## Verification & API Endpoints

- **Health Check**: `GET http://localhost:5000/api/health` -> `{ "success": true, "message": "GenAI Roadmap API is running" }`
- **Frontend App**: Open `http://localhost:5173` in your browser.
