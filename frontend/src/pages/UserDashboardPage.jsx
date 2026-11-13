import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Compass,
  GraduationCap,
} from 'lucide-react';
import { registrationService } from '../services/registrationService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/components/ui/segmented-control';

const UserDashboardPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'history'

  const [selectedCancelEvent, setSelectedCancelEvent] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchRegistrations = async () => {
    try {
      const res = await registrationService.getMyRegistrations();
      if (res.success) {
        setRegistrations(res.data);
      }
    } catch (err) {
      toast.error('Failed to load your registrations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancelRegistration = async () => {
    if (!selectedCancelEvent) return;

    setCancelLoading(true);
    try {
      const res = await registrationService.cancelRegistration(
        selectedCancelEvent.event._id
      );
      if (res.success) {
        toast.info('Registration has been cancelled.');
        setSelectedCancelEvent(null);
        await fetchRegistrations();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel registration.');
    } finally {
      setCancelLoading(false);
    }
  };

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Split registrations
  const upcomingRegistrations = registrations.filter((reg) => {
    const eventDate = new Date(reg.event?.date);
    return eventDate >= now && reg.status === 'registered';
  });

  const historyRegistrations = registrations.filter((reg) => {
    const eventDate = new Date(reg.event?.date);
    return eventDate < now || reg.status !== 'registered';
  });

  const attendedCount = registrations.filter((r) => r.status === 'attended').length;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your campus registrations..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Student Welcome Header */}
      <div className="bg-card rounded-xl p-6 sm:p-8 border border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-muted border border-border text-sm font-medium text-foreground">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span>Student Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-display">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2 flex-wrap">
            <span>{user?.department}</span>
            {user?.studentId && (
              <>
                <span>•</span>
                <span className="text-foreground">
                  ID: {user?.studentId}
                </span>
              </>
            )}
            <span>•</span>
            <span>{user?.email}</span>
          </p>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-primary-foreground bg-primary border border-border hover:opacity-90 transition-opacity self-start md:self-auto"
        >
          <Compass className="w-4 h-4" />
          <span>Browse More Events</span>
        </Link>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Registrations"
          value={registrations.length}
          icon={CalendarDays}
          subtitle="Events enrolled to date"
        />
        <StatCard
          title="Upcoming Events"
          value={upcomingRegistrations.length}
          icon={Clock}
          subtitle="Scheduled to attend"
        />
        <StatCard
          title="Attended Events"
          value={attendedCount}
          icon={CheckCircle2}
          subtitle="Completed campus activities"
        />
      </div>

      {/* Segmented Control Tabs */}
      <div className="space-y-6">
        <SegmentedControl size="lg" aria-label="Registration status filter">
          <SegmentedControlItem
            active={activeTab === 'upcoming'}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Events ({upcomingRegistrations.length})
          </SegmentedControlItem>
          <SegmentedControlItem
            active={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
          >
            Past & Completed ({historyRegistrations.length})
          </SegmentedControlItem>
        </SegmentedControl>

        {/* Tab Content */}
        {activeTab === 'upcoming' ? (
          upcomingRegistrations.length === 0 ? (
            <EmptyState
              title="No upcoming event registrations"
              description="You have not enrolled in any upcoming campus events yet. Explore upcoming hackathons and workshops."
              actionLabel="Discover Events"
              actionLink="/events"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingRegistrations.map((reg) => {
                const event = reg.event;
                if (!event) return null;
                const eventDate = new Date(event.date);

                return (
                  <div
                    key={reg._id}
                    className="bg-card rounded-xl border border-border p-5 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-md text-sm font-medium bg-muted text-foreground border border-border">
                          {event.category}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md text-sm font-medium bg-primary/20 text-foreground border border-primary/40">
                          Confirmed
                        </span>
                      </div>
                      <Link to={`/events/${event._id}`}>
                        <h3 className="text-base font-bold text-foreground hover:text-primary transition-colors line-clamp-1">
                          {event.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="mt-3 space-y-1.5 text-sm text-foreground/80 font-medium">
                        <p>
                          📅{' '}
                          {eventDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <p>
                          ⏰ {event.startTime} - {event.endTime}
                        </p>
                        <p>📍 {event.venue}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                      <Link
                        to={`/events/${event._id}`}
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors underline"
                      >
                        Event Details
                      </Link>
                      <button
                        onClick={() => setSelectedCancelEvent(reg)}
                        className="text-sm font-medium text-destructive hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : historyRegistrations.length === 0 ? (
          <EmptyState
            title="No past activity found"
            description="Your past event attendance and completed registrations will appear here."
            actionLabel="Browse Events"
            actionLink="/events"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyRegistrations.map((reg) => {
              const event = reg.event;
              if (!event) return null;
              const eventDate = new Date(event.date);

              return (
                <div
                  key={reg._id}
                  className="bg-card rounded-xl border border-border p-5 flex flex-col justify-between space-y-4 opacity-80"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-md text-sm font-medium bg-muted text-foreground border border-border">
                        {event.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-sm font-medium bg-muted text-muted-foreground border border-border capitalize">
                        {reg.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="mt-3 space-y-1.5 text-sm text-foreground/80 font-medium">
                      <p>
                        📅{' '}
                        {eventDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p>📍 {event.venue}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <Link
                      to={`/events/${event._id}`}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline"
                    >
                      View Archive
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      {selectedCancelEvent && (
        <Modal
          isOpen={!!selectedCancelEvent}
          onClose={() => setSelectedCancelEvent(null)}
          title="Cancel Registration"
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to cancel your registration for{' '}
              <strong className="text-foreground">
                {selectedCancelEvent.event?.title}
              </strong>
              ?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedCancelEvent(null)}
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg border border-border"
              >
                Keep Seat
              </button>
              <button
                onClick={handleCancelRegistration}
                disabled={cancelLoading}
                className="px-4 py-2 text-sm font-semibold text-destructive-foreground bg-destructive hover:opacity-90 rounded-lg disabled:opacity-50"
              >
                {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserDashboardPage;
