const express = require('express');
const { createMembership, updateMembership, getMembershipByNumber, listMemberships } = require('../controllers/membershipController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin'), createMembership);
router.put('/', authMiddleware, roleMiddleware('admin'), updateMembership);
router.get('/', authMiddleware, roleMiddleware('admin', 'user'), listMemberships);
router.get('/:membershipNumber', authMiddleware, roleMiddleware('admin'), getMembershipByNumber);

module.exports = router;
