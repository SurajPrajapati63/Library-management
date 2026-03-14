const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/memberships', require('./routes/membershipRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found.' });
});

app.use('/', express.static(path.join(__dirname, '..', 'client', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.use(errorHandler);

async function startServer() {
  try {
    await connectDb();
    const port = Number(process.env.PORT) || 5002;
    app.listen(port, () => {
      console.log(`Server listening on ${port}`);
    });
  } catch (error) {
    console.error('Server startup failed', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;
