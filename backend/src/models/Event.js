const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [120, 'Event title cannot exceed 120 characters'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Technical',
          'Cultural',
          'Sports',
          'Workshop',
          'Seminar',
          'Competition',
          'Other',
        ],
        message: '{VALUE} is not a supported event category',
      },
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
      index: true,
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required (e.g. 10:00 AM)'],
      trim: true,
    },
    endTime: {
      type: String,
      required: [true, 'End time is required (e.g. 01:00 PM)'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
      trim: true,
    },
    organizer: {
      type: String,
      required: [true, 'Organizer club/department is required'],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Event capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: [0, 'Registered count cannot be negative'],
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required'],
    },
    bannerUrl: {
      type: String,
      trim: true,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'completed', 'cancelled'],
      default: 'published',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for remaining seats
eventSchema.virtual('remainingSeats').get(function () {
  return Math.max(0, this.capacity - this.registeredCount);
});

// Virtual for isRegistrationOpen
eventSchema.virtual('isRegistrationOpen').get(function () {
  if (!this.registrationDeadline) return this.status === 'published' && this.registeredCount < this.capacity;
  const now = new Date();
  const deadline = new Date(this.registrationDeadline);
  return (
    this.status === 'published' &&
    now <= deadline &&
    this.registeredCount < this.capacity
  );
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
