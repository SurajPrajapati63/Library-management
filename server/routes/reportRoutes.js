const express = require('express');
const { getDashboardReports } = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('admin', 'user'), getDashboardReports);

module.exports = router;
