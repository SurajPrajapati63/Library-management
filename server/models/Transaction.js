const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership', required: true },
    issueDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    actualReturnDate: { type: Date, default: null },
    fineAmount: { type: Number, default: 0 },
    finePaid: { type: Boolean, default: false },
    remarks: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
