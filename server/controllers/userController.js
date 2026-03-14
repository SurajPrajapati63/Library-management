const bcrypt = require('bcrypt');
const User = require('../models/User');

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

async function createUser(req, res, next) {
  try {
    const { name, email, role = 'user' } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    const password = req.body.password || 'password123';
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user'
    });

    return res.status(201).json(serializeUser(user));
  } catch (error) {
    return next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ error: 'Email is required to update user.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (req.body.name) user.name = String(req.body.name).trim();
    if (req.body.role) user.role = req.body.role === 'admin' ? 'admin' : 'user';
    await user.save();

    return res.json(serializeUser(user));
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createUser,
  updateUser
};
