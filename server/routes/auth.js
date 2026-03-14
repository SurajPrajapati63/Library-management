const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');
dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'change_me';
const adminRegistrationCode = String(process.env.ADMIN_REGISTRATION_CODE || '').trim();

function buildAuthPayload(user) {
  return { id: user._id, name: user.name, role: user.role };
}

function signToken(user) {
  return jwt.sign(buildAuthPayload(user), jwtSecret, { expiresIn: '8h' });
}

async function loginUser(email, password) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail || !password) {
    return { status: 400, body: { error: 'Email and password are required' } };
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return { status: 401, body: { error: 'Invalid credentials' } };
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return { status: 401, body: { error: 'Invalid credentials' } };
  }

  return {
    status: 200,
    body: {
      token: signToken(user),
      role: user.role
    }
  };
}

async function registerUser({ name, email, password, role }) {
  const normalizedName = String(name || '').trim();
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!normalizedName || !normalizedEmail || !password) {
    return { status: 400, body: { error: 'Name, email, and password are required' } };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return { status: 400, body: { error: 'Invalid email format' } };
  }

  if (password.length < 6) {
    return { status: 400, body: { error: 'Password must be at least 6 characters' } };
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return { status: 409, body: { error: 'User with this email already exists' } };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: normalizedName,
    email: normalizedEmail,
    password: hashedPassword,
    role
  });

  return {
    status: 201,
    body: {
      token: signToken(user),
      role: user.role
    }
  };
}

// POST /api/auth/user-register
router.post('/user-register', async (req, res) => {
  try {
    const result = await registerUser({ ...req.body, role: 'user' });
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/admin-register
router.post('/admin-register', async (req, res) => {
  const submittedCode = String(req.body.adminCode || '').trim();

  if (!adminRegistrationCode) {
    return res.status(503).json({ error: 'Admin registration is not configured' });
  }

  if (submittedCode !== adminRegistrationCode) {
    return res.status(403).json({ error: 'Invalid admin registration code' });
  }

  try {
    const result = await registerUser({ ...req.body, role: 'admin' });
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/user-login
router.post('/user-login', async (req, res) => {
  const { password } = req.body;
  try {
    const result = await loginUser(req.body.email, password);
    if (result.status !== 200) {
      return res.status(result.status).json(result.body);
    }

    if (result.body.role !== 'user') {
      return res.status(403).json({ error: 'User account required' });
    }

    return res.json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/admin-login
router.post('/admin-login', async (req, res) => {
  const { password } = req.body;
  try {
    const result = await loginUser(req.body.email, password);
    if (result.status !== 200) {
      return res.status(result.status).json(result.body);
    }

    if (result.body.role !== 'admin') {
      return res.status(403).json({ error: 'Admin account required' });
    }

    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Backward-compatible aliases
router.post('/register', async (req, res) => {
  try {
    const result = await registerUser({ ...req.body, role: 'user' });
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { password } = req.body;
  try {
    const result = await loginUser(req.body.email, password);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
