// Mongoose connection
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongoUri = process.env.MONGO_URI || process.env.DB_URI || 'mongodb://localhost:27017/library_db';
mongoose.set('strictQuery', false);
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

module.exports = mongoose;
