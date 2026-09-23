const express = require('express');
const router = express.Router();
const {
  getMyRegistrations,
  updateParticipantStatus,
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Student get my registrations
router.get('/my', protect, getMyRegistrations);

// Admin update participant attendance/status
router.patch('/:id/status', protect, authorize('admin'), updateParticipantStatus);

module.exports = router;
