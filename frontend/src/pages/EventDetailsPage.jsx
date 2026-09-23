import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Share2,
  XCircle,
} from 'lucide-react';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [userRegistration, setUserRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Fetch event details
  const fetchEventData = async () => {
    try {
      const res = await eventService.getEventById(id);
      if (res.success && res.data) {
        setEvent(res.data);
        setUserRegistration(res.data.userRegistration);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load event details.');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [id, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading event details..." />
      </div>
    );
  }

  if (!event) return null;

  const eventDate = new Date(event.date);
  const deadlineDate = new Date(event.registrationDeadline);
  const now = new Date();

  const isDeadlinePassed = now > deadlineDate;
  const isPastEvent = now > eventDate;
  const isFull = event.registeredCount >= event.capacity;
  const isRegistered =
    userRegistration && userRegistration.status === 'registered';

  const percentFilled = Math.min(
    100,
    Math.round((event.registeredCount / event.capacity) * 100)
  );
  const remainingSeats = Math.max(0, event.capacity - event.registeredCount);

  // Handle Event Registration
  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    setActionLoading(true);
    try {
      const res = await registrationService.registerForEvent(id);
      if (res.success) {
        toast.success('🎉 You have successfully registered for this event!');
        await fetchEventData();
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Registration Cancellation
  const handleCancelRegistration = async () => {
    setActionLoading(true);
    try {
      const res = await registrationService.cancelRegistration(id);
      if (res.success) {
        toast.info('Your registration has been cancelled.');
        setShowCancelModal(false);
        await fetchEventData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel registration.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.info('Event URL copied to clipboard!');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button & Share */}
      <div className="flex items-center justify-between">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-soft"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Share</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-card border border-slate-200/80">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-64 sm:h-96 object-cover opacity-90"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={event.category}>{event.category}</Badge>
            <Badge variant={event.status} className="capitalize">
              {event.status}
            </Badge>
            {isRegistered && (
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                You're Registered
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {event.title}
          </h1>
          <p className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            Organized by {event.organizer}
          </p>
        </div>
      </div>

      {/* Main Grid: Details + Registration Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Event Description & Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              About This Event
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </div>

            {/* Event Highlights / Requirements */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Key Guidelines for Attendees
              </h3>
              <ul className="space-y-2 text-xs text-slate-500 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Valid college ID card mandatory at entry gate.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Certificates of participation provided to all verified attendees.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Please arrive at the venue 15 minutes before scheduled start time.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Meta Card & Smart Registration */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-soft space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400">
              Event Details
            </h3>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">
                    {eventDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-slate-500">Event Date</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">
                    {event.startTime} - {event.endTime}
                  </p>
                  <p className="text-xs text-slate-500">Session Timings</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">{event.venue}</p>
                  <p className="text-xs text-slate-500">Campus Venue</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">
                    {deadlineDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-slate-500">Registration Closes</p>
                </div>
              </div>
            </div>

            {/* Capacity Meter */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> Capacity
                </span>
                <span
                  className={
                    isFull
                      ? 'text-rose-600'
                      : percentFilled > 80
                      ? 'text-amber-600'
                      : 'text-indigo-600'
                  }
                >
                  {remainingSeats} seats left ({event.registeredCount} /{' '}
                  {event.capacity})
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isFull
                      ? 'bg-rose-500'
                      : percentFilled > 80
                      ? 'bg-amber-500'
                      : 'bg-indigo-600'
                  }`}
                  style={{ width: `${percentFilled}%` }}
                />
              </div>
            </div>

            {/* Smart Action Button States */}
            <div className="pt-2">
              {!isAuthenticated ? (
                <button
                  onClick={handleRegister}
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
                >
                  Sign In to Register
                </button>
              ) : isRegistered ? (
                <div className="space-y-3">
                  <div className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Registered Successfully</span>
                  </div>

                  {!isPastEvent && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      disabled={actionLoading}
                      className="w-full py-2 px-4 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
                    >
                      Cancel Registration
                    </button>
                  )}
                </div>
              ) : isPastEvent || event.status === 'completed' ? (
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold text-slate-400 bg-slate-100 cursor-not-allowed text-center"
                >
                  Event Ended
                </button>
              ) : event.status === 'cancelled' ? (
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold text-rose-500 bg-rose-50 cursor-not-allowed text-center"
                >
                  Event Cancelled
                </button>
              ) : isDeadlinePassed ? (
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 cursor-not-allowed text-center"
                >
                  Registration Closed (Deadline Passed)
                </button>
              ) : isFull ? (
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold text-rose-700 bg-rose-50 border border-rose-200 cursor-not-allowed text-center"
                >
                  Event Full (Capacity Reached)
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={actionLoading}
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {actionLoading ? 'Registering...' : 'Register For Event'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Event Registration"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to cancel your registration for{' '}
            <strong className="text-slate-900">{event.title}</strong>? Your seat
            will be freed up for other students.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setShowCancelModal(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Keep Registration
            </button>
            <button
              onClick={handleCancelRegistration}
              disabled={actionLoading}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors disabled:opacity-50"
            >
              {actionLoading ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventDetailsPage;
