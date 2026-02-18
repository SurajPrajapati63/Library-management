const express = require('express');
const router = express.Router();
const { authMiddleware, maintenanceExists } = require('../middleware/auth');
const Book = require('../models/Book');
const Membership = require('../models/Membership');
const Transaction = require('../models/Transaction');

router.use(authMiddleware, maintenanceExists);

router.get('/books', async (req, res) => {
  const rows = await Book.find({ type: 'book' }).lean();
  res.json(rows);
});

router.get('/movies', async (req, res) => {
  const rows = await Book.find({ type: 'movie' }).lean();
  res.json(rows);
});

router.get('/memberships', async (req, res) => {
  const rows = await Membership.find().lean();
  res.json(rows);
});

router.get('/active-issues', async (req, res) => {
  const rows = await Transaction.find({ actual_return_date: null }).populate('book').populate('membership').lean();
  res.json(rows);
});

router.get('/overdue', async (req, res) => {
  const rows = await Transaction.find({ actual_return_date: null, expected_return_date: { $lt: new Date() } }).populate('book').populate('membership').lean();
  res.json(rows);
});

router.get('/issue-requests', async (req, res) => {
  const rows = await Transaction.find().populate('book').populate('membership').lean();
  res.json(rows);
});

module.exports = router;
