const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MembershipSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  duration: { type: String, required: true },
  expiry: { type: Date },
  status: { type: String, default: 'active' }
});

module.exports = mongoose.model('Membership', MembershipSchema);
