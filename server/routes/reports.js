const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Book = require('../models/Book');
const Membership = require('../models/Membership');
const Transaction = require('../models/Transaction');

router.use(authMiddleware);

router.get('/books', async (req, res) => {
  try {
    const rows = await Book.find({ type: 'book' }).lean();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.get('/movies', async (req, res) => {
  try {
    const rows = await Book.find({ type: 'movie' }).lean();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.get('/memberships', async (req, res) => {
  try {
    const rows = await Membership.find().lean();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.get('/active-issues', async (req, res) => {
  try {
    const rows = await Transaction.find({ actual_return_date: null }).populate('book').populate('membership').lean();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.get('/overdue', async (req, res) => {
  try {
    const rows = await Transaction.find({ actual_return_date: null, expected_return_date: { $lt: new Date() } }).populate('book').populate('membership').lean();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.get('/issue-requests', async (req, res) => {
  try {
    const rows = await Transaction.find().populate('book').populate('membership').lean();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
