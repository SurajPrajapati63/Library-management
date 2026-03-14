const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

function resolveMongoUri() {
  const rawUri = process.env.MONGO_URI || process.env.DB_URI || 'mongodb://127.0.0.1:27017/library_management_system';
  const fallbackDbName = process.env.MONGO_DB_NAME || 'library_management_system';

  try {
    const parsed = new URL(rawUri);
    if (parsed.protocol.startsWith('mongodb') && (!parsed.pathname || parsed.pathname === '/')) {
      parsed.pathname = `/${fallbackDbName}`;
      return parsed.toString();
    }
  } catch (error) {
    return rawUri;
  }

  return rawUri;
}

async function connectDb() {
  const mongoUri = resolveMongoUri();
  mongoose.set('strictQuery', false);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection failed.');
    console.error('Check MONGO_URI in server/.env and confirm your MongoDB Atlas IP access list allows this machine.');
    throw error;
  }
}

module.exports = connectDb;
