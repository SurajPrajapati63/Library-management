const Book = require('../models/Book');

function normalizeBookPayload(body) {
  return {
    title: String(body.title || '').trim(),
    author: String(body.author || '').trim(),
    category: String(body.category || '').trim(),
    serialNumber: String(body.serialNumber || '').trim(),
    available: body.available === true || body.available === 'true' || body.available === 'Yes',
    mediaType: body.mediaType === 'movie' ? 'movie' : 'book'
  };
}

function validateBookPayload(book) {
  if (!book.title || !book.author || !book.category || !book.serialNumber) {
    return 'All book fields are mandatory.';
  }

  return '';
}

async function createBook(req, res, next) {
  try {
    const payload = normalizeBookPayload(req.body);
    const message = validateBookPayload(payload);
    if (message) {
      return res.status(400).json({ error: message });
    }

    const existing = await Book.findOne({ serialNumber: payload.serialNumber });
    if (existing) {
      return res.status(409).json({ error: 'Serial number already exists.' });
    }

    const book = await Book.create(payload);
    return res.status(201).json(book);
  } catch (error) {
    return next(error);
  }
}

async function updateBook(req, res, next) {
  try {
    const payload = normalizeBookPayload(req.body);
    const message = validateBookPayload(payload);
    if (message) {
      return res.status(400).json({ error: message });
    }

    const serialNumber = String(req.body.serialNumber || '').trim();
    const book = await Book.findOne({ serialNumber });
    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    Object.assign(book, payload);
    await book.save();

    return res.json(book);
  } catch (error) {
    return next(error);
  }
}

async function searchBooks(req, res, next) {
  try {
    const title = String(req.query.title || '').trim();
    const author = String(req.query.author || '').trim();

    if (!title && !author) {
      return res.status(400).json({ error: 'Please enter Book Name or Author Name.' });
    }

    const filter = {};
    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    if (author) {
      filter.author = { $regex: author, $options: 'i' };
    }

    const books = await Book.find(filter).sort({ title: 1 }).lean();
    return res.json(books);
  } catch (error) {
    return next(error);
  }
}

async function listBooks(req, res, next) {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).lean();
    return res.json(books);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createBook,
  updateBook,
  searchBooks,
  listBooks
};
