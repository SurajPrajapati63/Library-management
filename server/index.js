const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// static client - serve React build if present
app.use('/', express.static(path.join(__dirname, '..', 'client', 'build')));
app.get('*', (req, res, next) => {
	// let API routes pass through
	if (req.path.startsWith('/api/')) return next();
	res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/reports', require('./routes/reports'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server listening on', port));
