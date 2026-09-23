const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventStats,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const {
  registerForEvent,
  cancelRegistration,
  getEventParticipants,
} = require('../controllers/registrationController');
const { protect, optionalAuth, authorize } = require('../middleware/authMiddleware');

// Public & Statistics
router.get('/stats', getEventStats);
router.get('/', getEvents);
router.get('/:id', optionalAuth, getEventById);

// Admin Event CRUD
router.post('/', protect, authorize('admin'), createEvent);
router.put('/:id', protect, authorize('admin'), updateEvent);
router.delete('/:id', protect, authorize('admin'), deleteEvent);

// Event Registrations
router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/register', protect, cancelRegistration);
router.get('/:id/registrations', protect, authorize('admin'), getEventParticipants);

module.exports = router;
