// middleware/verifyJWT.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded; // { id, role, ... }
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};