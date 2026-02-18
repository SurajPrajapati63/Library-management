const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const jwtSecret = process.env.JWT_SECRET || 'change_me';
const User = require('../models/User');
const Book = require('../models/Book');
const Membership = require('../models/Membership');

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function roleMiddleware(requiredRole) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (req.user.role !== requiredRole) return res.status(403).json({ error: 'Forbidden' });
    return next();
  };
}

// Maintenance check: ensure at least one book and one membership exist
async function maintenanceExists(req, res, next) {
  try {
    const books = await Book.countDocuments();
    const memb = await Membership.countDocuments();
    if ((books || 0) === 0 || (memb || 0) === 0) {
      return res.status(400).json({ error: 'Maintenance records required before using this function' });
    }
    return next();
  } catch (err) {
    return res.status(500).json({ error: 'DB error' });
  }
}

module.exports = { authMiddleware, roleMiddleware, maintenanceExists };
