const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    serialNumber: { type: String, required: true, unique: true, trim: true },
    available: { type: Boolean, default: true },
    mediaType: { type: String, enum: ['book', 'movie'], default: 'book' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
