// middleware/verifyJWT.js
const { verify } = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded; // { id, role, ... }
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = verifyJWT;