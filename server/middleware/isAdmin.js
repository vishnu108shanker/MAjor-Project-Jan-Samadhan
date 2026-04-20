// middleware/isAdmin.js
// Runs AFTER verifyJWT — req.user is already populated by that point.

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }
  next();
};

module.exports = isAdmin;
