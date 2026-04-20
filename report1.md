# Jan Samadhan Project Status Report

## 1. Project Overview (from README)
Jan Samadhan is a civic grievance and accountability platform for Indian citizens, built with the MERN stack. Its mission is to:
- Allow citizens to report civic issues (with photo, location, description)
- Provide a unique tracking token for each complaint
- Enable citizens to track complaint status
- Publicly display a credibility score for each government department, based on resolution rate and speed

## 2. Server (Backend) Technical Breakdown
- **Frameworks & Libraries:** Express.js, Mongoose, JWT, Helmet, Morgan, CORS, dotenv, bcrypt, multer, express-rate-limit
- **Database:** MongoDB (connection via Mongoose, URI in .env)
- **App Entry:** `server/app.js` sets up middleware, connects to MongoDB, and starts the server
- **Middleware:**
  - `helmet` for security headers
  - `morgan` for logging
  - `cors` for cross-origin requests (frontend URL from env)
  - `express.json()` for JSON parsing
  - `verifyJWT.js` for JWT authentication (implemented)
  - `isAdmin.js` (empty, needs implementation)
- **Models:**
  - `User.js`: Citizen/admin schema with hashed password, Aadhaar last 4, phone/email (unique)
  - `Issue.js`: Issue schema with token, citizenId, department, status, timestamps, etc.
- **Routes:**
  - `/api/issues` (implemented): POST route to create issues (test only, uses fake citizenId)
  - `/api/auth` and `/api/stats` exist but are empty
- **Controllers:**
  - `issueController.js`, `authController.js`, `statsController.js` exist but are empty
- **Utils:**
  - `scoreCalculator.js`: Calculates department credibility score based on resolution rate and speed

## 3. Client (Frontend) Technical Breakdown
- **Frameworks & Libraries:** React 19, Vite, React Router DOM, Axios, Tailwind CSS, ESLint
- **Entry Point:** `src/main.jsx` renders `App.jsx` inside `<StrictMode>`
- **Routing:** `App.jsx` uses React Router to define routes for Home, Login, Register, ReportIssue, TrackStatus, Dashboard, AdminPanel
- **API Layer:** `src/api/axios.js` sets up Axios with base URL and JWT auto-attach
- **Pages:**
  - `Home.jsx`, `Login.jsx` (empty), `Register.jsx` (empty), `ReportIssue.jsx` (submits issues), `TrackStatus.jsx` (empty), `Dashboard.jsx`, `AdminPanel.jsx`, `Financial.jsx`
- **Features:**
  - `ReportIssue.jsx` posts to `/api/issues` and displays token
  - Other pages are placeholders or empty

## 4. Implemented Features & Milestones
- Project structure and folder organization (MERN best practices)
- MongoDB connection and Express server setup
- JWT authentication middleware (verifyJWT)
- Issue model and test POST route for issue creation
- Department credibility score calculation utility
- React frontend with routing and Axios API layer
- Issue reporting form (backend and frontend integration for test route)

## 5. Major Gaps / Incomplete Areas
- Auth, stats, and admin routes/controllers are empty
- Most frontend pages are empty or placeholders
- No real user registration/login or JWT issuance
- No real issue tracking, status updates, or admin workflows
- No dashboard or public score display yet

---

*Generated on 2026-04-19 by GitHub Copilot in direction of @the_evil_lord*
