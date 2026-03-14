const Book = require('../models/Book');
const Membership = require('../models/Membership');
const Transaction = require('../models/Transaction');

function calculateFine(returnDate, actualReturnDate) {
  const due = new Date(returnDate);
  const actual = new Date(actualReturnDate);
  const diff = Math.ceil((actual - due) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

async function issueBook(req, res, next) {
  try {
    const { bookId, memberId, issueDate, returnDate, remarks = '' } = req.body;

    if (!bookId || !memberId || !issueDate || !returnDate) {
      return res.status(400).json({ error: 'Book, member, issue date, and return date are required.' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }
    if (!book.available) {
      return res.status(400).json({ error: 'Selected book is not available.' });
    }

    const member = await Membership.findById(memberId);
    if (!member || member.cancelled) {
      return res.status(400).json({ error: 'Membership is not active.' });
    }

    const issue = new Date(issueDate);
    const due = new Date(returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (issue < today) {
      return res.status(400).json({ error: 'Issue Date cannot be earlier than today.' });
    }

    const maxDate = new Date(issue);
    maxDate.setDate(maxDate.getDate() + 15);
    if (due > maxDate) {
      return res.status(400).json({ error: 'Return Date cannot exceed 15 days from Issue Date.' });
    }

    const transaction = await Transaction.create({
      bookId: book._id,
      memberId: member._id,
      issueDate: issue,
      returnDate: due,
      remarks
    });

    book.available = false;
    await book.save();

    return res.status(201).json(transaction);
  } catch (error) {
    return next(error);
  }
}

async function returnBook(req, res, next) {
  try {
    const { transactionId, actualReturnDate } = req.body;

    if (!transactionId || !actualReturnDate) {
      return res.status(400).json({ error: 'Transaction and return date are required.' });
    }

    const transaction = await Transaction.findById(transactionId).populate('bookId');
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    const actualDate = new Date(actualReturnDate);
    transaction.actualReturnDate = actualDate;
    transaction.fineAmount = calculateFine(transaction.returnDate, actualDate);
    transaction.finePaid = transaction.fineAmount === 0;
    await transaction.save();

    if (transaction.bookId) {
      transaction.bookId.available = transaction.fineAmount === 0;
      await transaction.bookId.save();
    }

    return res.json(transaction);
  } catch (error) {
    return next(error);
  }
}

async function payFine(req, res, next) {
  try {
    const { transactionId, finePaid, remarks = '' } = req.body;
    if (!transactionId) {
      return res.status(400).json({ error: 'Transaction is required.' });
    }

    const transaction = await Transaction.findById(transactionId).populate('bookId');
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    if (transaction.fineAmount > 0 && !finePaid) {
      return res.status(400).json({ error: 'Please confirm that the fine has been paid.' });
    }

    transaction.finePaid = transaction.fineAmount === 0 ? true : Boolean(finePaid);
    transaction.remarks = remarks;
    await transaction.save();

    if (transaction.bookId) {
      transaction.bookId.available = true;
      await transaction.bookId.save();
    }

    return res.json(transaction);
  } catch (error) {
    return next(error);
  }
}

async function getOpenTransactions(req, res, next) {
  try {
    const transactions = await Transaction.find({ actualReturnDate: null })
      .populate('bookId')
      .populate('memberId')
      .sort({ issueDate: -1 })
      .lean();

    return res.json(transactions);
  } catch (error) {
    return next(error);
  }
}

async function getTransactionById(req, res, next) {
  try {
    const transaction = await Transaction.findById(req.params.transactionId)
      .populate('bookId')
      .populate('memberId')
      .lean();

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    return res.json(transaction);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  issueBook,
  returnBook,
  payFine,
  getOpenTransactions,
  getTransactionById
};
