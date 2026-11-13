const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference is required'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['registered', 'cancelled', 'attended', 'absent'],
      default: 'registered',
      index: true,
    },
    registrationType: {
      type: String,
      enum: ['individual', 'team'],
      default: 'individual',
    },
    teamName: {
      type: String,
      trim: true,
      default: '',
    },
    teamSize: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
    teamMembers: [
      {
        name: { type: String, trim: true },
        email: { type: String, trim: true },
        studentId: { type: String, trim: true },
        department: { type: String, trim: true },
        role: { type: String, trim: true, default: 'Member' },
        phone: { type: String, trim: true },
      },
    ],
    primaryContact: {
      phone: { type: String, trim: true },
      college: { type: String, trim: true },
      notes: { type: String, trim: true },
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate registrations for the same user and event
registrationSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
