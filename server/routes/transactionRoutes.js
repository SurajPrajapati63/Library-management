const express = require('express');
const { issueBook, returnBook, payFine, getOpenTransactions, getTransactionById } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('admin', 'user'));
router.get('/open', getOpenTransactions);
router.get('/:transactionId', getTransactionById);
router.post('/issue', issueBook);
router.post('/return', returnBook);
router.post('/payfine', payFine);

module.exports = router;
