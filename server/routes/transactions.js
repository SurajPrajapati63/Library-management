const express = require('express');
const router = express.Router();
const { authMiddleware, maintenanceExists } = require('../middleware/auth');
const { calculateFine } = require('../utils/fine');
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');
const Membership = require('../models/Membership');
const FinePayment = require('../models/FinePayment');

router.use(authMiddleware);

// Book Available (search) - at least one of title or author
router.get('/books/search', maintenanceExists, async (req, res) => {
  const { title, author } = req.query;
  if (!title && !author) return res.status(400).json({ error: 'Enter book name or select author' });
  try {
    const q = {};
    if (title) q.title = { $regex: title, $options: 'i' };
    if (author) q.author = author;
    const rows = await Book.find(q).lean();
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

// Get authors list for dropdown
router.get('/books/authors', async (req, res) => {
  try {
    const rows = await Book.distinct('author');
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'DB error' });
  }
});

// Issue book
router.post('/issue', maintenanceExists, async (req, res) => {
  const { book_id, membership_id, issue_date, return_date, remarks } = req.body;
  if (!book_id || !membership_id || !issue_date || !return_date) return res.status(400).json({ error: 'Missing fields' });
  try {
    const issue = new Date(issue_date);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (issue < today) return res.status(400).json({ error: 'Issue date cannot be earlier than today' });
    const maxReturn = new Date(issue);
    maxReturn.setDate(maxReturn.getDate() + 15);
    const ret = new Date(return_date);
    if (ret > maxReturn) return res.status(400).json({ error: 'Return date cannot be later than 15 days from issue' });

    const book = await Book.findById(book_id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    if (book.available_count <= 0) return res.status(400).json({ error: 'Book not available' });

    const tx = new Transaction({ book: book._id, membership: membership_id, issue_date: issue, expected_return_date: ret });
    await tx.save();
    book.available_count = book.available_count - 1;
    await book.save();
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Return book: create actual_return_date and route to pay fine
router.post('/return', maintenanceExists, async (req, res) => {
  const { transaction_id, actual_return_date } = req.body;
  if (!transaction_id || !actual_return_date) return res.status(400).json({ error: 'Missing fields' });
  try {
    const tx = await Transaction.findById(transaction_id).populate('book');
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });
    tx.actual_return_date = new Date(actual_return_date);
    const fine = calculateFine(tx.expected_return_date, tx.actual_return_date);
    tx.fine = fine;
    await tx.save();
    // increment book available_count
    const book = tx.book;
    book.available_count = (book.available_count || 0) + 1;
    await book.save();
    const payment = new FinePayment({ transaction: tx._id, fine_amount: fine, paid: false });
    await payment.save();
    return res.json({ ok: true, fine, payment_id: payment._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Pay fine
router.post('/payfine', async (req, res) => {
  const { payment_id, paid, remarks } = req.body;
  if (!payment_id) return res.status(400).json({ error: 'Payment id required' });
  try {
    const p = await FinePayment.findById(payment_id);
    if (!p) return res.status(404).json({ error: 'Payment not found' });
    if (p.fine_amount > 0 && !paid) return res.status(400).json({ error: 'Fine must be marked paid before completion' });
    p.paid = !!paid;
    p.remarks = remarks || '';
    await p.save();
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
