const express = require('express');
const { createUser, updateUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin'), createUser);
router.put('/', authMiddleware, roleMiddleware('admin'), updateUser);

module.exports = router;
