const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { resolveAdminRegistrationCode } = require('./settingsController');

function createToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'change_me',
    { expiresIn: '8h' }
  );
}

function validateAuthInput({ name, email, password }) {
  if (name !== undefined && !String(name).trim()) {
    return 'Name is required.';
  }

  if (!String(email || '').trim()) {
    return 'Email is required.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email).trim().toLowerCase())) {
    return 'Please enter a valid email address.';
  }

  if (!password || String(password).length < 6) {
    return 'Password must be at least 6 characters.';
  }

  return '';
}

async function register(req, res, next) {
  try {
    const message = validateAuthInput(req.body);
    if (message) {
      return res.status(400).json({ error: message });
    }

    const requestedRole = req.body.role === 'admin' ? 'admin' : 'user';
    const configuredAdminCode = String(await resolveAdminRegistrationCode()).trim();
    const providedAdminCode = String(req.body.adminCode || '').trim();

    if (requestedRole === 'admin') {
      if (!configuredAdminCode) {
        return res.status(500).json({ error: 'Admin registration is not configured.' });
      }

      if (!providedAdminCode || providedAdminCode !== configuredAdminCode) {
        return res.status(403).json({ error: 'Invalid admin registration code.' });
      }
    }

    const email = String(req.body.email).trim().toLowerCase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: String(req.body.name).trim(),
      email,
      password: hashedPassword,
      role: requestedRole
    });

    return res.status(201).json({
      token: createToken(user),
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const message = validateAuthInput({ email: req.body.email, password: req.body.password });
    if (message) {
      return res.status(400).json({ error: message });
    }

    const email = String(req.body.email).trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    return res.json({
      token: createToken(user),
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login
};
