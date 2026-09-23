import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import { eventService } from '../../services/eventService';

const CATEGORIES = [
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Seminar',
  'Competition',
  'Other',
];

const EventFormModal = ({ isOpen, onClose, event = null, onSuccess }) => {
  const toast = useToast();
  const isEditing = !!event;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    date: '',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    venue: '',
    organizer: '',
    capacity: 100,
    registrationDeadline: '',
    bannerUrl: '',
    status: 'published',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      // Format dates to YYYY-MM-DD for HTML input
      const formattedDate = event.date ? event.date.split('T')[0] : '';
      const formattedDeadline = event.registrationDeadline
        ? event.registrationDeadline.split('T')[0]
        : '';

      setFormData({
        title: event.title || '',
        description: event.description || '',
        category: event.category || 'Technical',
        date: formattedDate,
        startTime: event.startTime || '10:00 AM',
        endTime: event.endTime || '01:00 PM',
        venue: event.venue || '',
        organizer: event.organizer || '',
        capacity: event.capacity || 100,
        registrationDeadline: formattedDeadline,
        bannerUrl: event.bannerUrl || '',
        status: event.status || 'published',
      });
    } else {
      // Defaults for new event
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      const defaultDeadline = new Date();
      defaultDeadline.setDate(defaultDeadline.getDate() + 5);

      setFormData({
        title: '',
        description: '',
        category: 'Technical',
        date: defaultDate.toISOString().split('T')[0],
        startTime: '10:00 AM',
        endTime: '01:00 PM',
        venue: '',
        organizer: '',
        capacity: 100,
        registrationDeadline: defaultDeadline.toISOString().split('T')[0],
        bannerUrl:
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        status: 'published',
      });
    }
  }, [event, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (new Date(formData.registrationDeadline) > new Date(formData.date)) {
      toast.error('Registration deadline cannot be after the event date.');
      return;
    }

    if (formData.capacity <= 0) {
      toast.error('Event capacity must be at least 1.');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await eventService.updateEvent(event._id, formData);
        toast.success('Event updated successfully!');
      } else {
        await eventService.createEvent(formData);
        toast.success('Event created and published successfully!');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Campus Event' : 'Create New Campus Event'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Event Title *
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. CodeSprint 2026: 24h Campus Hackathon"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Description *
          </label>
          <textarea
            name="description"
            required
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the schedule, eligibility, perks, and highlights..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
          />
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none bg-white capitalize"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Organizer & Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Organizer / Club *
            </label>
            <input
              type="text"
              name="organizer"
              required
              value={formData.organizer}
              onChange={handleChange}
              placeholder="e.g. ACM Student Chapter"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Venue *
            </label>
            <input
              type="text"
              name="venue"
              required
              value={formData.venue}
              onChange={handleChange}
              placeholder="e.g. Auditorium Hall B"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Date & Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Event Date *
            </label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Registration Deadline *
            </label>
            <input
              type="date"
              name="registrationDeadline"
              required
              value={formData.registrationDeadline}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Timings & Capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Start Time *
            </label>
            <input
              type="text"
              name="startTime"
              required
              value={formData.startTime}
              onChange={handleChange}
              placeholder="10:00 AM"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              End Time *
            </label>
            <input
              type="text"
              name="endTime"
              required
              value={formData.endTime}
              onChange={handleChange}
              placeholder="01:00 PM"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Capacity (Seats) *
            </label>
            <input
              type="number"
              name="capacity"
              required
              min={1}
              value={formData.capacity}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Banner URL */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Banner Image URL
          </label>
          <input
            type="url"
            name="bannerUrl"
            value={formData.bannerUrl}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none text-xs"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Accepts any valid image URL or Unsplash photo link.
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EventFormModal;
