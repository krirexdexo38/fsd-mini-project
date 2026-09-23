const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    Register logged-in student for an event
// @route   POST /api/events/:id/register
// @access  Private (Student)
const registerForEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    if (event.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: `Registration is unavailable because the event is marked as ${event.status}.`,
      });
    }

    // Check registration deadline
    const now = new Date();
    if (now > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline for this event has passed.',
      });
    }

    // Check capacity
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Registration full. Maximum capacity for this event has been reached.',
      });
    }

    // Check if user has an existing registration record
    let registration = await Registration.findOne({
      event: eventId,
      user: userId,
    });

    if (registration) {
      if (registration.status === 'registered') {
        return res.status(400).json({
          success: false,
          message: 'You have already registered for this event.',
        });
      }

      // If previously cancelled, re-activate registration
      registration.status = 'registered';
      registration.registeredAt = new Date();
      await registration.save();
    } else {
      registration = await Registration.create({
        event: eventId,
        user: userId,
        status: 'registered',
        registeredAt: new Date(),
      });
    }

    // Update event registered count atomically
    event.registeredCount += 1;
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Successfully registered for the event!',
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel user registration for an event
// @route   DELETE /api/events/:id/register
// @access  Private (Student)
const cancelRegistration = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // Check if event has already occurred
    if (new Date() >= new Date(event.date)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel registration for an ongoing or past event.',
      });
    }

    const registration = await Registration.findOne({
      event: eventId,
      user: userId,
      status: 'registered',
    });

    if (!registration) {
      return res.status(400).json({
        success: false,
        message: 'Active registration not found for this event.',
      });
    }

    // Mark as cancelled
    registration.status = 'cancelled';
    await registration.save();

    // Decrement registered count safely
    if (event.registeredCount > 0) {
      event.registeredCount -= 1;
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: 'Your registration has been cancelled successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registrations of the logged-in student
// @route   GET /api/registrations/my
// @access  Private (Student)
const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate({
        path: 'event',
        select:
          'title description category date startTime endTime venue organizer bannerUrl status capacity registeredCount registrationDeadline',
      })
      .sort({ registeredAt: -1 });

    // Filter out any registrations where event was hard deleted
    const validRegistrations = registrations.filter((reg) => reg.event !== null);

    res.status(200).json({
      success: true,
      count: validRegistrations.length,
      data: validRegistrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all participants registered for a specific event
// @route   GET /api/events/:id/registrations
// @access  Private (Admin / Organizer)
const getEventParticipants = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = { event: req.params.id };

    if (status && status !== 'all') {
      query.status = status;
    }

    let registrations = await Registration.find(query)
      .populate('user', 'name email department studentId')
      .sort({ registeredAt: -1 });

    // Client search filter on populated user fields
    if (search && search.trim()) {
      const term = search.toLowerCase().trim();
      registrations = registrations.filter((r) => {
        if (!r.user) return false;
        return (
          r.user.name.toLowerCase().includes(term) ||
          r.user.email.toLowerCase().includes(term) ||
          (r.user.studentId && r.user.studentId.toLowerCase().includes(term))
        );
      });
    }

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a participant's attendance or registration status
// @route   PATCH /api/registrations/:id/status
// @access  Private (Admin / Organizer)
const updateParticipantStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['registered', 'attended', 'absent', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const registration = await Registration.findById(req.params.id).populate('event');
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found.',
      });
    }

    const previousStatus = registration.status;
    registration.status = status;
    await registration.save();

    // Adjust event registered count if status transitions to/from 'cancelled'
    if (registration.event) {
      const event = await Event.findById(registration.event._id);
      if (event) {
        if (previousStatus !== 'cancelled' && status === 'cancelled') {
          event.registeredCount = Math.max(0, event.registeredCount - 1);
          await event.save();
        } else if (previousStatus === 'cancelled' && status !== 'cancelled') {
          event.registeredCount += 1;
          await event.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `Participant status updated to ${status}.`,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventParticipants,
  updateParticipantStatus,
};
