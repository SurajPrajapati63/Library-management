const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  membership: { type: Schema.Types.ObjectId, ref: 'Membership', required: true },
  issue_date: { type: Date, required: true },
  expected_return_date: { type: Date, required: true },
  actual_return_date: { type: Date },
  fine: { type: Number, default: 0 }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
