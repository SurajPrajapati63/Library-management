const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FinePaymentSchema = new Schema({
  transaction: { type: Schema.Types.ObjectId, ref: 'Transaction', required: true },
  fine_amount: { type: Number, required: true },
  paid: { type: Boolean, default: false },
  remarks: { type: String }
});

module.exports = mongoose.model('FinePayment', FinePaymentSchema);
