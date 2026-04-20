# Jan Samadhan Project Status Report 2: From Skeleton to Fully Functional

## Executive Summary
In Report 1, we established the foundational MERN (MongoDB, Express, React, Node.js) structure. We had the database connected, models defined, and a basic shell for the frontend, but the core features—like user authentication, real issue tracking, department scoring, and admin controls—were empty placeholders. 

Since then, the project has taken a major leap. We have successfully transformed the structural skeleton into a fully functional, secure, and visually polished civic accountability platform. The backend now securely handles user data, issues JSON Web Tokens (JWT) for stateless sessions, and calculates real-time credibility scores. The frontend has been brought to life with dynamic React components, comprehensive global state management, and a premium user interface using Tailwind CSS. Jan Samadhan is now a working, interactive application.

## Progress Log (The 'What')
Here is a breakdown of the key features and milestones completed since Report 1:

*   **Complete User Authentication System:** Registration and login endpoints are fully operational. Passwords are encrypted before saving, and successful logins issue a secure JWT.
*   **Global Auth State Management (Frontend):** Implemented an `AuthContext` in React to seamlessly track whether a user is logged in, their role (citizen vs. admin), and to persist their session across page reloads.
*   **Issue Reporting & Tracking:** The frontend `ReportIssue` form now correctly links complaints to the logged-in user. The `TrackStatus` page allows citizens to enter their unique token and view a live, visual timeline of their complaint's progress.
*   **Credibility Score Engine:** The empty `statsController` is now powered by a robust MongoDB aggregation pipeline that accurately computes department scores based on resolution rates and speed.
*   **Live Dashboard:** Built a dynamic, visually appealing `Dashboard.jsx` that automatically fetches and color-codes department performance scores.
*   **Secure Admin Panel:** Created a protected `AdminPanel.jsx` where authorized administrators can view all complaints, change their statuses (e.g., "In Progress", "Resolved"), and leave official notes for citizens. This is backed by strict `isAdmin` middleware on the server.

## Implementation Details (The 'How')
To help you understand the mechanics behind these updates, here is a simplified explanation of the core technical changes:

### 1. Securing Users with bcrypt & JWT
Instead of storing passwords as plain text, we use `bcrypt` to mathematically scramble them. When a user logs in, we don't use server memory to remember them (traditional sessions). Instead, we give them a JSON Web Token (JWT).
**Why:** This makes the server "stateless" and highly scalable. The token itself proves who the user is.

```javascript
// Inside server/middleware/verifyJWT.js
// We intercept every protected request to verify the user's token
const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
req.user = decoded; // Safely attaches user info (like ID and Role) to the request
next();
```

### 2. Protecting Admin Actions
We built an `isAdmin.js` middleware that runs *after* the JWT is verified. It simply checks if the user's role is set to 'admin'.
**Why:** It ensures that even if a regular citizen discovers the hidden Admin URL, the server will actively reject their attempts to alter issue statuses.

### 3. The Credibility Score Algorithm
The `scoreCalculator.js` utility uses MongoDB's "aggregation framework" to crunch data directly inside the database, rather than loading all issues into server memory.
**Why:** It calculates how fast issues are resolved by subtracting the `createdAt` timestamp from the `resolvedAt` timestamp. The final score applies a 70% weight to the *resolution rate* and a 30% weight to the *speed of resolution*.

### 4. React Context for Global State
We introduced `AuthContext.jsx` using React's Context API to manage the user's identity. 
**Why:** Without this, we would have to pass user data manually from the `App` component down to every single page (Login, Dashboard, Admin). Context acts as a global broadcast system—any page can instantly ask, "Is the user logged in?" and "Are they an admin?".

## Future-Proofing & Notes (Developer Diary)
*   **Aadhaar Placeholder:** In `authController.js`, the `aadhaarLast4` value is currently hardcoded as `'0000'` during registration. A future update must add an Aadhaar input field to the frontend register form and pass it to the backend.
*   **Admin Role Assignment:** Currently, there is no UI to "promote" a citizen to an admin. To test the Admin Panel, you must manually change a user's role from `'citizen'` to `'admin'` directly in the MongoDB database.
*   **Token Expiration:** JWTs are set to expire in 7 days (`expiresIn: '7d'`). We currently handle expiration by logging the user out. In the future, a "refresh token" system could be implemented for a smoother user experience.
*   **Image Storage:** The `photoUrl` field on issues expects a string (like an external link). We need to integrate a cloud storage solution (like AWS S3 or Cloudinary) to handle actual image file uploads via `multer`.

## Getting Started / Current State
If you are picking up the project today, here is how to get it running and test the new features:

1.  **Environment Setup:** Ensure you have `.env` files configured in both the `server` and `client` directories. 
    *   `server/.env`: Needs `PORT=5000`, `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL=http://localhost:5173`.
    *   `client/.env`: If applicable, ensure Axios is pointing to `http://localhost:5000/api`.
2.  **Start the Backend:** Navigate to the `server` directory, run `npm install`, and start the server using `npm run dev` (or `node app.js`).
3.  **Start the Frontend:** Navigate to the `client` directory, run `npm install`, and start the Vite development server using `npm run dev`.
4.  **Test the Flow:** 
    *   Open the app in your browser (usually `http://localhost:5173`).
    *   Register a new account, then log in.
    *   Report an issue and copy the generated token (e.g., `TOK123456`).
    *   Use the "Track Issue" page to search for your token.
    *   *(Optional)* Edit your user document in MongoDB, set `role: "admin"`, refresh the app, and visit the Admin Panel to update your issue's status. Watch the Credibility Dashboard update!
