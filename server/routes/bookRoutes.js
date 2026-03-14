const express = require('express');
const { createBook, updateBook, searchBooks, listBooks } = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/search', authMiddleware, searchBooks);
router.get('/', authMiddleware, listBooks);
router.post('/', authMiddleware, roleMiddleware('admin'), createBook);
router.put('/', authMiddleware, roleMiddleware('admin'), updateBook);

module.exports = router;
