const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get all events with filters, search, and pagination
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res, next) => {
  try {
    const {
      search,
      category,
      status,
      timeframe,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Filter by status (default to published for public browsing, unless explicitly requested)
    if (status && status !== 'all') {
      query.status = status;
    } else if (!status) {
      query.status = 'published';
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search filter across title, organizer, venue, or description
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { organizer: searchRegex },
        { venue: searchRegex },
        { description: searchRegex },
      ];
    }

    // Timeframe filter
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (timeframe === 'upcoming') {
      query.date = { $gte: now };
    } else if (timeframe === 'past') {
      query.date = { $lt: now };
    }

    // Sorting
    let sortOptions = { date: 1 }; // Default: earliest upcoming first
    if (sort === 'date_desc') {
      sortOptions = { date: -1 };
    } else if (sort === 'capacity') {
      sortOptions = { capacity: -1 };
    } else if (sort === 'title') {
      sortOptions = { title: 1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform statistics for homepage and overview
// @route   GET /api/events/stats
// @access  Public
const getEventStats = async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments({ status: { $ne: 'draft' } });
    const now = new Date();
    const upcomingEvents = await Event.countDocuments({
      status: 'published',
      date: { $gte: now },
    });

    const totalRegistrations = await Registration.countDocuments({
      status: { $in: ['registered', 'attended'] },
    });

    const organizers = await Event.distinct('organizer');

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        upcomingEvents,
        totalRegistrations,
        totalClubs: organizers.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public (Optional auth for user registration status)
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    let userRegistration = null;
    if (req.user) {
      userRegistration = await Registration.findOne({
        event: event._id,
        user: req.user._id,
      });
    }

    const eventObj = event.toObject();
    eventObj.userRegistration = userRegistration;

    res.status(200).json({
      success: true,
      data: eventObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Admin / Organizer)
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      venue,
      organizer,
      capacity,
      registrationDeadline,
      bannerUrl,
      status,
    } = req.body;

    // Validate dates
    const eventDate = new Date(date);
    const deadlineDate = new Date(registrationDeadline);

    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event date provided.',
      });
    }

    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration deadline provided.',
      });
    }

    if (deadlineDate > eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline cannot be after the event date.',
      });
    }

    if (capacity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Capacity must be greater than 0.',
      });
    }

    const newEvent = await Event.create({
      title: title.trim(),
      description: description.trim(),
      category,
      date: eventDate,
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      venue: venue.trim(),
      organizer: organizer.trim(),
      createdBy: req.user._id,
      capacity: Number(capacity),
      registrationDeadline: deadlineDate,
      bannerUrl: bannerUrl && bannerUrl.trim() ? bannerUrl.trim() : undefined,
      status: status || 'published',
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      data: newEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing event
// @route   PUT /api/events/:id
// @access  Private (Admin / Organizer)
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    const {
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      venue,
      organizer,
      capacity,
      registrationDeadline,
      bannerUrl,
      status,
    } = req.body;

    if (capacity !== undefined) {
      if (Number(capacity) < event.registeredCount) {
        return res.status(400).json({
          success: false,
          message: `Capacity cannot be lower than existing registered participants (${event.registeredCount}).`,
        });
      }
      event.capacity = Number(capacity);
    }

    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid event date.' });
      }
      event.date = parsedDate;
    }

    if (registrationDeadline) {
      const parsedDeadline = new Date(registrationDeadline);
      if (isNaN(parsedDeadline.getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid registration deadline.' });
      }
      if (parsedDeadline > (event.date || new Date(date))) {
        return res.status(400).json({
          success: false,
          message: 'Registration deadline cannot be after the event date.',
        });
      }
      event.registrationDeadline = parsedDeadline;
    }

    if (title) event.title = title.trim();
    if (description) event.description = description.trim();
    if (category) event.category = category;
    if (startTime) event.startTime = startTime.trim();
    if (endTime) event.endTime = endTime.trim();
    if (venue) event.venue = venue.trim();
    if (organizer) event.organizer = organizer.trim();
    if (bannerUrl) event.bannerUrl = bannerUrl.trim();
    if (status) event.status = status;

    const updatedEvent = await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Admin / Organizer)
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // Delete event and cascade delete all related registrations
    await Event.findByIdAndDelete(req.params.id);
    await Registration.deleteMany({ event: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Event and associated registrations deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getEventStats,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
