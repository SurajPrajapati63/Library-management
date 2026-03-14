const crypto = require('crypto');
const SystemSetting = require('../models/SystemSetting');

const ADMIN_REGISTRATION_CODE_KEY = 'adminRegistrationCode';

function generateAdminCode() {
  return `ADM-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

async function findAdminRegistrationCodeSetting() {
  return SystemSetting.findOne({ key: ADMIN_REGISTRATION_CODE_KEY });
}

async function resolveAdminRegistrationCode() {
  const setting = await findAdminRegistrationCodeSetting();
  if (setting?.value) {
    return setting.value;
  }

  return String(process.env.ADMIN_REGISTRATION_CODE || '').trim();
}

async function getAdminRegistrationCode(req, res, next) {
  try {
    const code = await resolveAdminRegistrationCode();
    return res.json({ code });
  } catch (error) {
    return next(error);
  }
}

async function updateAdminRegistrationCode(req, res, next) {
  try {
    const code = String(req.body.code || '').trim();
    if (!code) {
      return res.status(400).json({ error: 'Registration code is required.' });
    }

    const setting = await SystemSetting.findOneAndUpdate(
      { key: ADMIN_REGISTRATION_CODE_KEY },
      { value: code, updatedBy: req.user?.id || null },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.json({ code: setting.value });
  } catch (error) {
    return next(error);
  }
}

async function generateRandomAdminRegistrationCode(req, res, next) {
  try {
    const generatedCode = generateAdminCode();
    const setting = await SystemSetting.findOneAndUpdate(
      { key: ADMIN_REGISTRATION_CODE_KEY },
      { value: generatedCode, updatedBy: req.user?.id || null },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.json({ code: setting.value });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAdminRegistrationCode,
  updateAdminRegistrationCode,
  generateRandomAdminRegistrationCode,
  resolveAdminRegistrationCode
};
