const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  type: { type: String, enum: ['book','movie'], default: 'book' },
  serial_no: { type: String, required: true },
  available_count: { type: Number, default: 0 }
});

module.exports = mongoose.model('Book', BookSchema);
