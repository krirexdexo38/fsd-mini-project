import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  XCircle,
  ArrowRight,
  Compass,
  GraduationCap,
} from 'lucide-react';
import { registrationService } from '../services/registrationService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/common/Badge';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';

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
      <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
            <GraduationCap className="w-4 h-4" />
            <span>Student Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-serif">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium flex items-center gap-2 flex-wrap">
            <span>{user?.department}</span>
            {user?.studentId && (
              <>
                <span>•</span>
                <span className="font-bold text-foreground">
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
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:opacity-90 shadow-soft transition-all self-start md:self-auto"
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
          color="indigo"
          subtitle="Events enrolled to date"
        />
        <StatCard
          title="Upcoming Events"
          value={upcomingRegistrations.length}
          icon={Clock}
          color="emerald"
          subtitle="Scheduled to attend"
        />
        <StatCard
          title="Attended Events"
          value={attendedCount}
          icon={CheckCircle2}
          color="purple"
          subtitle="Completed campus activities"
        />
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b border-border">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'upcoming'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Upcoming Schedule ({upcomingRegistrations.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'history'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Past & History ({historyRegistrations.length})
          </button>
        </div>

        {/* Tab Content: Upcoming */}
        {activeTab === 'upcoming' && (
          <div>
            {upcomingRegistrations.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="No Upcoming Events"
                message="You have not registered for any upcoming events yet. Discover exciting hackathons, workshops, and sports meets!"
                actionText="Explore Events Catalog"
                actionLink="/events"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingRegistrations.map((reg) => {
                  const ev = reg.event;
                  const eventDate = new Date(ev.date);
                  return (
                    <div
                      key={reg._id}
                      className="bg-card rounded-2xl border border-border p-5 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant={ev.category}>{ev.category}</Badge>
                          <Badge variant={reg.status} className="capitalize">
                            {reg.status}
                          </Badge>
                        </div>

                        <Link to={`/events/${ev._id}`}>
                          <h3 className="text-base font-bold text-foreground hover:text-primary transition-colors font-serif">
                            {ev.title}
                          </h3>
                        </Link>

                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {ev.description}
                        </p>

                        <div className="space-y-1.5 text-xs text-foreground/80 pt-2 border-t border-border font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span>
                              {eventDate.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span>
                              {ev.startTime} - {ev.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            <span className="truncate">{ev.venue}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-border flex items-center justify-between gap-3">
                        <button
                          onClick={() => setSelectedCancelEvent(reg)}
                          className="text-xs font-semibold text-destructive hover:underline"
                        >
                          Cancel Registration
                        </button>
                        <Link
                          to={`/events/${ev._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <span>Event Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: History */}
        {activeTab === 'history' && (
          <div>
            {historyRegistrations.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="No Registration History"
                message="Your past event registrations and attendance history will be archived here."
              />
            ) : (
              <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-soft">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted text-[11px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border">
                      <tr>
                        <th className="py-3 px-4">Event</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Venue</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-xs text-foreground/85">
                      {historyRegistrations.map((reg) => {
                        const ev = reg.event;
                        const eventDate = new Date(ev.date);
                        return (
                          <tr key={reg._id} className="hover:bg-muted/40 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-foreground font-serif">
                              {ev.title}
                            </td>
                            <td className="py-3.5 px-4">
                              <Badge variant={ev.category}>{ev.category}</Badge>
                            </td>
                            <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                              {eventDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="py-3.5 px-4 text-muted-foreground truncate max-w-[150px]">
                              {ev.venue}
                            </td>
                            <td className="py-3.5 px-4">
                              <Badge variant={reg.status} className="capitalize">
                                {reg.status}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <Link
                                to={`/events/${ev._id}`}
                                className="text-primary hover:underline font-bold"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={!!selectedCancelEvent}
        onClose={() => setSelectedCancelEvent(null)}
        title="Cancel Registration"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to cancel your seat for{' '}
            <strong className="text-foreground">
              {selectedCancelEvent?.event?.title}
            </strong>
            ? Your seat will be freed up for fellow students.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              onClick={() => setSelectedCancelEvent(null)}
              className="px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted rounded-xl transition-colors"
            >
              Keep My Registration
            </button>
            <button
              onClick={handleCancelRegistration}
              disabled={cancelLoading}
              className="px-4 py-2 text-xs font-bold text-destructive-foreground bg-destructive hover:opacity-90 rounded-xl transition-opacity disabled:opacity-50"
            >
              {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserDashboardPage;
