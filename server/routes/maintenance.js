const express = require('express');
const router = express.Router();
const { roleMiddleware, authMiddleware } = require('../middleware/auth');
const Membership = require('../models/Membership');
const Book = require('../models/Book');
const User = require('../models/User');

// All maintenance routes require admin
router.use(authMiddleware, roleMiddleware('admin'));

// Add Membership
router.post('/memberships', async (req, res) => {
  const { name, address, contact, email, duration } = req.body;
  if (!name || !address || !contact || !email || !duration) return res.status(400).json({ error: 'All fields mandatory' });
  const months = duration === '1 year' ? 12 : duration === '2 years' ? 24 : 6;
  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + months);
  try {
    const m = new Membership({ name, address, contact, email, duration, expiry, status: 'active' });
    await m.save();
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

// Update Membership: extend or cancel
router.put('/memberships/:id', async (req, res) => {
  const id = req.params.id;
  const { action, extendMonths } = req.body;
  if (!id) return res.status(400).json({ error: 'Membership id required' });
  try {
    const m = await Membership.findById(id);
    if (!m) return res.status(404).json({ error: 'Not found' });
    if (action === 'cancel') {
      m.status = 'cancelled';
    } else {
      const months = extendMonths || 6;
      const expiry = new Date(m.expiry || new Date());
      expiry.setMonth(expiry.getMonth() + months);
      m.expiry = expiry;
    }
    await m.save();
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

// Add Book
router.post('/books', async (req, res) => {
  const { title, author, serial_no, available_count, type } = req.body;
  if (!title || !author || !serial_no || available_count === undefined) return res.status(400).json({ error: 'All fields mandatory' });
  try {
    const b = new Book({ title, author, serial_no, available_count, type: type || 'book' });
    await b.save();
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

// Update Book
router.put('/books/:id', async (req, res) => {
  const id = req.params.id;
  const { title, author, serial_no, available_count, type } = req.body;
  if (!title || !author || !serial_no || available_count === undefined) return res.status(400).json({ error: 'All fields mandatory' });
  try {
    const b = await Book.findById(id);
    if (!b) return res.status(404).json({ error: 'Not found' });
    b.title = title; b.author = author; b.serial_no = serial_no; b.available_count = available_count; b.type = type || 'book';
    await b.save();
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

// User Management: create or fetch
router.post('/users', async (req, res) => {
  const { name, email, password, role } = req.body;
  const normalizedName = String(name || '').trim();
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!normalizedName || !normalizedEmail) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const bcrypt = require('bcrypt');
    const hashed = await bcrypt.hash(password || 'password', 10);
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(409).json({ error: 'User already exists' });

    const u = new User({
      name: normalizedName,
      email: normalizedEmail,
      password: hashed,
      role: role || 'user'
    });
    await u.save();
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
