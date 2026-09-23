const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');

// @desc    Get dashboard metrics & analytics for admin/organizer
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res, next) => {
  try {
    const now = new Date();

    const [
      totalEvents,
      upcomingEvents,
      completedEvents,
      cancelledEvents,
      totalRegistrations,
      totalStudents,
      recentRegistrations,
      topEvents,
    ] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ date: { $gte: now }, status: 'published' }),
      Event.countDocuments({
        $or: [{ status: 'completed' }, { date: { $lt: now } }],
      }),
      Event.countDocuments({ status: 'cancelled' }),
      Registration.countDocuments({ status: { $ne: 'cancelled' } }),
      User.countDocuments({ role: 'student' }),
      Registration.find()
        .populate('user', 'name email department studentId')
        .populate('event', 'title date venue category')
        .sort({ registeredAt: -1 })
        .limit(6),
      Event.find({ status: { $ne: 'draft' } })
        .sort({ registeredCount: -1 })
        .limit(5)
        .select('title category registeredCount capacity date venue status registrationDeadline'),
    ]);

    // Aggregate category distribution
    const categoryStats = await Event.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalRegistrations: { $sum: '$registeredCount' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        upcomingEvents,
        completedEvents,
        cancelledEvents,
        totalRegistrations,
        totalStudents,
        categoryStats,
        topEvents,
        recentRegistrations,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
};
