import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Plus,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  Edit,
  Trash2,
  Eye,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { eventService } from '../services/eventService';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import EventFormModal from '../components/events/EventFormModal';

const AdminDashboardPage = () => {
  const toast = useToast();

  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteEventTarget, setDeleteEventTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAdminData = async () => {
    try {
      const [statsRes, eventsRes] = await Promise.all([
        eventService.getAdminStats(),
        eventService.getEvents({ limit: 50, sort: 'date_desc', status: 'all' }),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (eventsRes.success) setEvents(eventsRes.data);
    } catch (err) {
      toast.error('Failed to load admin dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (event) => {
    setEditingEvent(event);
    setIsFormModalOpen(true);
  };

  const handleDeleteEvent = async () => {
    if (!deleteEventTarget) return;

    setDeleteLoading(true);
    try {
      const res = await eventService.deleteEvent(deleteEventTarget._id);
      if (res.success) {
        toast.success('Event and associated registrations deleted successfully.');
        setDeleteEventTarget(null);
        await fetchAdminData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete event.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredEvents = events.filter((ev) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      ev.title.toLowerCase().includes(term) ||
      ev.organizer.toLowerCase().includes(term) ||
      ev.category.toLowerCase().includes(term) ||
      ev.venue.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading organizer console..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Organizer Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight font-serif">
            Event Management Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, monitor, and manage campus events and participant registrations.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:opacity-90 shadow-soft transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Events"
          value={stats?.totalEvents || 0}
          icon={CalendarDays}
          color="indigo"
          subtitle="All campus listings"
        />
        <StatCard
          title="Upcoming Events"
          value={stats?.upcomingEvents || 0}
          icon={Clock}
          color="emerald"
          subtitle="Currently open or scheduled"
        />
        <StatCard
          title="Total Registrations"
          value={stats?.totalRegistrations || 0}
          icon={Users}
          color="purple"
          subtitle="Active student bookings"
        />
        <StatCard
          title="Registered Students"
          value={stats?.totalStudents || 0}
          icon={Sparkles}
          color="amber"
          subtitle="Enrolled student accounts"
        />
      </div>

      {/* Category Breakdown Progress */}
      {stats?.categoryStats && stats.categoryStats.length > 0 && (
        <div className="bg-card rounded-2xl p-6 border border-border shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground font-serif">
            Events Distribution by Category
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {stats.categoryStats.map((item) => (
              <div
                key={item._id}
                className="p-3 rounded-xl bg-muted/60 border border-border text-center"
              >
                <p className="text-xs font-bold text-foreground truncate">{item._id}</p>
                <p className="text-xl font-extrabold text-primary mt-1 font-serif">{item.count}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {item.totalRegistrations} enrolled
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Management Table Card */}
      <div className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden space-y-4">
        {/* Table Filter & Search Header */}
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground font-serif">
              Campus Events Roster
            </h3>
            <p className="text-xs text-muted-foreground">
              Manage event publication statuses, edit schedules, and view participants
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search event or club..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-input bg-card text-foreground text-xs focus:border-primary outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-[11px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-5">Event Title & Organizer</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Event Date</th>
                <th className="py-3 px-4">Capacity Status</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs text-foreground/85">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted-foreground">
                    No matching events found.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => {
                  const eventDate = new Date(ev.date);
                  const percentFilled = Math.min(
                    100,
                    Math.round((ev.registeredCount / ev.capacity) * 100)
                  );
                  return (
                    <tr
                      key={ev._id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      {/* Title & Organizer */}
                      <td className="py-4 px-5">
                        <p className="font-bold text-foreground font-serif line-clamp-1">
                          {ev.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                          {ev.organizer} • {ev.venue}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <Badge variant={ev.category}>{ev.category}</Badge>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-muted-foreground font-medium">
                        {eventDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Capacity Progress */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="w-32">
                          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                            <span className="text-foreground">
                              {ev.registeredCount} / {ev.capacity}
                            </span>
                            <span className="text-primary font-semibold">
                              {percentFilled}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${percentFilled}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <Badge variant={ev.status} className="capitalize">
                          {ev.status}
                        </Badge>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Participants */}
                          <Link
                            to={`/admin/events/${ev._id}/participants`}
                            title="View Participants Roster"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Users className="w-4 h-4" />
                          </Link>

                          {/* Public View */}
                          <Link
                            to={`/events/${ev._id}`}
                            title="View Public Page"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Edit Event */}
                          <button
                            onClick={() => handleOpenEditModal(ev)}
                            title="Edit Event"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete Event */}
                          <button
                            onClick={() => setDeleteEventTarget(ev)}
                            title="Delete Event"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal Form */}
      <EventFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        event={editingEvent}
        onSuccess={fetchAdminData}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteEventTarget}
        onClose={() => setDeleteEventTarget(null)}
        title="Confirm Event Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to permanently delete{' '}
            <strong className="text-foreground">
              {deleteEventTarget?.title}
            </strong>
            ? This will also remove all registered student records for this event.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              onClick={() => setDeleteEventTarget(null)}
              className="px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteEvent}
              disabled={deleteLoading}
              className="px-4 py-2 text-xs font-bold text-destructive-foreground bg-destructive hover:opacity-90 rounded-xl transition-opacity disabled:opacity-50"
            >
              {deleteLoading ? 'Deleting...' : 'Delete Event'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;
