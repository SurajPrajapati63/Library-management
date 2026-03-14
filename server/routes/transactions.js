const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { calculateFine } = require('../utils/fine');
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');
const Membership = require('../models/Membership');
const FinePayment = require('../models/FinePayment');

router.use(authMiddleware);

router.get('/memberships', async (req, res) => {
  try {
    const rows = await Membership.find({ status: 'active' }).sort({ name: 1 }).lean();
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

router.get('/active-issues', async (req, res) => {
  try {
    const rows = await Transaction.find({ actual_return_date: null })
      .populate('book')
      .populate('membership')
      .sort({ issue_date: -1 })
      .lean();
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

router.get('/payments/:id', async (req, res) => {
  try {
    const payment = await FinePayment.findById(req.params.id).populate({
      path: 'transaction',
      populate: [{ path: 'book' }, { path: 'membership' }]
    }).lean();
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    return res.json(payment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

// Book Available (search) - at least one of title or author
router.get('/books/search', async (req, res) => {
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
router.post('/issue', async (req, res) => {
  const { book_id, membership_id, issue_date, return_date } = req.body;
  if (!book_id || !membership_id || !issue_date || !return_date) return res.status(400).json({ error: 'Missing fields' });
  try {
    const issue = new Date(issue_date);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (issue < today) return res.status(400).json({ error: 'Issue date cannot be earlier than today' });
    const maxReturn = new Date(issue);
    maxReturn.setDate(maxReturn.getDate() + 15);
    const ret = new Date(return_date);
    if (ret < issue) return res.status(400).json({ error: 'Return date cannot be earlier than issue date' });
    if (ret > maxReturn) return res.status(400).json({ error: 'Return date cannot be later than 15 days from issue' });

    const book = await Book.findById(book_id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    if (book.available_count <= 0) return res.status(400).json({ error: 'Book not available' });

    const membership = await Membership.findById(membership_id);
    if (!membership) return res.status(404).json({ error: 'Membership not found' });
    if (membership.status !== 'active') return res.status(400).json({ error: 'Membership is not active' });
    if (membership.expiry && new Date(membership.expiry) < today) {
      return res.status(400).json({ error: 'Membership has expired' });
    }

    const tx = new Transaction({ book: book._id, membership: membership._id, issue_date: issue, expected_return_date: ret });
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
router.post('/return', async (req, res) => {
  const { transaction_id, actual_return_date } = req.body;
  if (!transaction_id || !actual_return_date) return res.status(400).json({ error: 'Missing fields' });
  try {
    const tx = await Transaction.findById(transaction_id).populate('book');
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });

    if (tx.actual_return_date) {
      return res.status(400).json({ error: 'Book has already been returned' });
    }

    const actualReturn = new Date(actual_return_date);
    if (actualReturn < tx.issue_date) {
      return res.status(400).json({ error: 'Return date cannot be earlier than issue date' });
    }

    tx.actual_return_date = actualReturn;
    const fine = calculateFine(tx.expected_return_date, tx.actual_return_date);
    tx.fine = fine;
    await tx.save();
    // increment book available_count
    const book = tx.book;
    book.available_count = (book.available_count || 0) + 1;
    await book.save();
    let payment = await FinePayment.findOne({ transaction: tx._id });
    if (!payment) {
      payment = new FinePayment({ transaction: tx._id, fine_amount: fine, paid: fine === 0 });
    } else {
      payment.fine_amount = fine;
      payment.paid = fine === 0 ? true : payment.paid;
    }
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
