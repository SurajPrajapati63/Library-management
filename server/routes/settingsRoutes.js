const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  getAdminRegistrationCode,
  updateAdminRegistrationCode,
  generateRandomAdminRegistrationCode
} = require('../controllers/settingsController');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('admin'));
router.get('/admin-registration-code', getAdminRegistrationCode);
router.put('/admin-registration-code', updateAdminRegistrationCode);
router.post('/admin-registration-code/generate', generateRandomAdminRegistrationCode);

module.exports = router;
