# Jan Samadhan Project Roadmap (todo.md)

## Immediate Priorities
- Implement user registration and login (backend + frontend)
- Connect frontend login/register forms to backend
- Implement JWT issuance and storage on login
- Complete issue reporting (real citizenId, photo upload, validation)
- Implement issue tracking (status updates, timeline)
- Build admin workflows (assign/resolve issues, update status)
- Display department credibility scores on dashboard

## Technical Tasks & How-To Guidance

### 1. Implement User Registration & Login (Backend)
- **Files:** `server/controllers/authController.js`, `server/routes/auth.js`, `server/models/User.js`
- **How-to:**
  - Create POST `/register` and `/login` endpoints
  - Hash passwords with bcrypt
  - On login, issue JWT (use `jsonwebtoken`)
  - Store only last 4 digits of Aadhaar

### 2. Connect Frontend Auth Forms
- **Files:** `client/src/pages/Register.jsx`, `client/src/pages/Login.jsx`, `client/src/api/axios.js`
- **How-to:**
  - Build forms for user input
  - POST to `/api/auth/register` and `/api/auth/login`
  - On login, store JWT in localStorage
  - Redirect to dashboard on success

### 3. Complete Issue Reporting
- **Files:** `client/src/pages/ReportIssue.jsx`, `server/routes/issues.js`, `server/models/Issue.js`
- **How-to:**
  - Use real citizenId from JWT (not hardcoded)
  - Add photo upload (use multer on backend)
  - Validate required fields

### 4. Implement Issue Tracking
- **Files:** `client/src/pages/TrackStatus.jsx`, `server/routes/issues.js`, `server/models/Issue.js`
- **How-to:**
  - Add GET `/api/issues/:token` to fetch issue by token
  - Display status timeline in frontend

### 5. Admin Workflows
- **Files:** `server/routes/issues.js`, `server/middleware/isAdmin.js`, `client/src/pages/AdminPanel.jsx`
- **How-to:**
  - Implement `isAdmin` middleware
  - Add endpoints for assigning/resolving issues
  - Build admin UI for managing issues

### 6. Department Score Dashboard
- **Files:** `client/src/pages/Dashboard.jsx`, `server/utils/scoreCalculator.js`, `server/routes/stats.js`
- **How-to:**
  - Add GET `/api/stats/scores` endpoint
  - Fetch and display scores in dashboard

## Future Considerations
- Add email/SMS notifications for status updates
- Implement rate limiting and brute-force protection
- Add audit logs for admin actions
- Improve UI/UX and accessibility
- Add multi-language support
- Enhance security (helmet config, input validation, CORS policies)
- Add automated tests (Jest, Supertest, React Testing Library)

---
*Generated on 2026-04-19 by GitHub Copilot (GPT-4.1)*
