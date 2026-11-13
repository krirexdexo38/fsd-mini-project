import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Building2,
  CheckCircle2,
  ArrowLeft,
  Share2,
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

  // Handle Event Registration navigation
  const handleRegister = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}/register` } });
      return;
    }
    navigate(`/events/${id}/register`);
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
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Share2 className="w-4 h-4 text-muted-foreground" />
          <span>Share</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-xl overflow-hidden bg-card border border-border">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-64 sm:h-96 object-cover"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={event.category}>{event.category}</Badge>
            {event.status !== 'published' && (
              <Badge variant={event.status} className="capitalize">
                {event.status}
              </Badge>
            )}
            {isRegistered && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium bg-primary text-primary-foreground border border-border">
                <CheckCircle2 className="w-4 h-4" />
                You're Registered
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-display">
            {event.title}
          </h1>
          <p className="text-sm font-medium text-white/80 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Organized by {event.organizer}
          </p>
        </div>
      </div>

      {/* Main Grid: Details + Registration Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Event Description & Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl p-6 sm:p-8 border border-border space-y-6">
            <h2 className="text-lg font-bold text-foreground border-b border-border pb-3 font-display">
              About This Event
            </h2>
            <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </div>

            {/* Event Highlights / Requirements */}
            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-bold text-foreground mb-3 font-display">
                Key Guidelines for Attendees
              </h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-foreground flex-shrink-0" />
                  <span>Valid college ID card mandatory at entry gate.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-foreground flex-shrink-0" />
                  <span>Certificates of participation provided to all verified attendees.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-foreground flex-shrink-0" />
                  <span>Please arrive at the venue 15 minutes before scheduled start time.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Key Logistics & Registration Status */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border space-y-5">
            <h3 className="text-base font-bold text-foreground border-b border-border pb-3 font-display">
              Event Details
            </h3>

            <div className="space-y-4 text-sm font-medium">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-foreground/70 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="text-foreground">
                    {eventDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-foreground/70 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Time</p>
                  <p className="text-foreground">
                    {event.startTime} - {event.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-foreground/70 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="text-foreground">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-foreground/70 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Registration Capacity</p>
                  <p className="text-foreground">
                    {event.registeredCount} / {event.capacity} registered
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {remainingSeats} {remainingSeats === 1 ? 'seat' : 'seats'} remaining
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden border border-border/40">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isFull ? 'bg-destructive' : 'bg-primary'
                }`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              {isRegistered ? (
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg border border-border text-center text-sm font-medium text-foreground">
                    You have a confirmed reservation for this event.
                  </div>
                  {!isPastEvent && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-destructive hover:bg-destructive/10 border border-destructive/20 transition-colors"
                    >
                      Cancel Registration
                    </button>
                  )}
                </div>
              ) : isPastEvent ? (
                <div className="p-3 bg-muted rounded-lg border border-border text-center text-sm font-medium text-muted-foreground">
                  This event has already concluded.
                </div>
              ) : isDeadlinePassed ? (
                <div className="p-3 bg-muted rounded-lg border border-border text-center text-sm font-medium text-muted-foreground">
                  Registration for this event has closed.
                </div>
              ) : isFull ? (
                <div className="p-3 bg-muted rounded-lg border border-border text-center text-sm font-medium text-destructive">
                  All seats have been filled.
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  className="w-full py-3 px-4 rounded-lg text-sm font-semibold text-primary-foreground bg-primary border border-border hover:opacity-90 transition-opacity"
                >
                  {isAuthenticated ? 'Register Now' : 'Sign In to Register'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      {showCancelModal && (
        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Cancel Registration"
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to cancel your registration for{' '}
              <strong className="text-foreground">{event.title}</strong>? Your seat will be freed up for other students.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg border border-border"
              >
                Keep Reservation
              </button>
              <button
                onClick={handleCancelRegistration}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-semibold text-destructive-foreground bg-destructive hover:opacity-90 rounded-lg disabled:opacity-50"
              >
                {actionLoading ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EventDetailsPage;
