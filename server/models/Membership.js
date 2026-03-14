const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
  {
    membershipNumber: { type: String, required: true, unique: true, trim: true },
    memberName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    membershipStartDate: { type: Date, required: true },
    membershipEndDate: { type: Date, required: true },
    cancelled: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Membership', membershipSchema);
