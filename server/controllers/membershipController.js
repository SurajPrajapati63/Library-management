const Membership = require('../models/Membership');

function addMonths(date, months) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
}

function durationToMonths(duration) {
  if (duration === '1 year') return 12;
  if (duration === '2 years') return 24;
  return 6;
}

function buildMembershipNumber() {
  return `MEM-${Date.now()}`;
}

async function createMembership(req, res, next) {
  try {
    const { memberName, address, phone, email, membershipDuration = '6 months' } = req.body;

    if (!memberName || !address || !phone || !email) {
      return res.status(400).json({ error: 'All membership fields are mandatory.' });
    }

    const startDate = new Date();
    const membership = await Membership.create({
      membershipNumber: buildMembershipNumber(),
      memberName: String(memberName).trim(),
      address: String(address).trim(),
      phone: String(phone).trim(),
      email: String(email).trim().toLowerCase(),
      membershipStartDate: startDate,
      membershipEndDate: addMonths(startDate, durationToMonths(membershipDuration)),
      cancelled: false
    });

    return res.status(201).json(membership);
  } catch (error) {
    return next(error);
  }
}

async function updateMembership(req, res, next) {
  try {
    const membershipNumber = String(req.body.membershipNumber || '').trim();
    if (!membershipNumber) {
      return res.status(400).json({ error: 'Membership Number is required.' });
    }

    const membership = await Membership.findOne({ membershipNumber });
    if (!membership) {
      return res.status(404).json({ error: 'Membership not found.' });
    }

    if (req.body.action === 'cancel') {
      membership.cancelled = true;
    } else {
      const months = durationToMonths(req.body.extendDuration || '6 months');
      membership.membershipEndDate = addMonths(membership.membershipEndDate, months);
      membership.cancelled = false;
    }

    await membership.save();
    return res.json(membership);
  } catch (error) {
    return next(error);
  }
}

async function getMembershipByNumber(req, res, next) {
  try {
    const membershipNumber = String(req.params.membershipNumber || '').trim();
    const membership = await Membership.findOne({ membershipNumber }).lean();
    if (!membership) {
      return res.status(404).json({ error: 'Membership not found.' });
    }

    return res.json(membership);
  } catch (error) {
    return next(error);
  }
}

async function listMemberships(req, res, next) {
  try {
    const memberships = await Membership.find().sort({ createdAt: -1 }).lean();
    return res.json(memberships);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createMembership,
  updateMembership,
  getMembershipByNumber,
  listMemberships
};
