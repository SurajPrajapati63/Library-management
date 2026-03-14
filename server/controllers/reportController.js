const Book = require('../models/Book');
const Transaction = require('../models/Transaction');

async function getDashboardReports(req, res, next) {
  try {
    const [availableBooks, issuedBooks, overdueTransactions] = await Promise.all([
      Book.countDocuments({ available: true }),
      Book.countDocuments({ available: false }),
      Transaction.countDocuments({
        actualReturnDate: null,
        returnDate: { $lt: new Date() }
      })
    ]);

    return res.json({
      availableBooks,
      issuedBooks,
      overdueTransactions
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getDashboardReports
};
