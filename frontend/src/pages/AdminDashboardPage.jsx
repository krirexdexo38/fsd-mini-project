import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Plus,
  Users,
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-muted border border-border text-sm font-medium text-foreground mb-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Organizer Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight font-display">
            Event Management Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, monitor, and manage campus events and participant registrations.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-primary-foreground bg-primary border border-border hover:opacity-90 transition-opacity self-start sm:self-center"
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
          subtitle="All campus listings"
        />
        <StatCard
          title="Upcoming Events"
          value={stats?.upcomingEvents || 0}
          icon={Clock}
          subtitle="Currently open or scheduled"
        />
        <StatCard
          title="Total Registrations"
          value={stats?.totalRegistrations || 0}
          icon={Users}
          subtitle="Active student bookings"
        />
        <StatCard
          title="Registered Students"
          value={stats?.totalStudents || 0}
          icon={Sparkles}
          subtitle="Enrolled student accounts"
        />
      </div>

      {/* Events Roster Section */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground font-display">
              All Campus Events
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage listings, attendance rosters, and event visibility
            </p>
          </div>

          {/* Search Table */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-lg border border-input bg-background text-foreground text-sm focus:border-primary outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-foreground border-b border-border font-semibold">
              <tr>
                <th className="py-3.5 px-4">Event Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Capacity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-muted-foreground">
                    No matching events found.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => {
                  const evDate = new Date(ev.date);
                  return (
                    <tr key={ev._id} className="hover:bg-muted/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-foreground">{ev.title}</p>
                        <p className="text-sm text-muted-foreground">{ev.organizer}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={ev.category}>{ev.category}</Badge>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        <p>
                          {evDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {ev.startTime} - {ev.endTime}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        <span className="font-semibold text-foreground">
                          {ev.registeredCount}
                        </span>{' '}
                        / {ev.capacity}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={ev.status} className="capitalize">
                          {ev.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/events/${ev._id}/participants`}
                            title="View Participants Roster"
                            className="p-1.5 rounded-lg text-foreground hover:bg-muted border border-border transition-colors"
                          >
                            <Users className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/events/${ev._id}`}
                            title="Public Preview"
                            className="p-1.5 rounded-lg text-foreground hover:bg-muted border border-border transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleOpenEditModal(ev)}
                            title="Edit Event"
                            className="p-1.5 rounded-lg text-foreground hover:bg-muted border border-border transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteEventTarget(ev)}
                            title="Delete Event"
                            className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 border border-destructive/20 transition-colors"
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

      {/* Create / Edit Event Modal */}
      {isFormModalOpen && (
        <EventFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSuccess={fetchAdminData}
          editingEvent={editingEvent}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteEventTarget && (
        <Modal
          isOpen={!!deleteEventTarget}
          onClose={() => setDeleteEventTarget(null)}
          title="Delete Event"
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete{' '}
              <strong className="text-foreground">{deleteEventTarget.title}</strong>? All
              student registration records for this event will be permanently deleted.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteEventTarget(null)}
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg border border-border"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                disabled={deleteLoading}
                className="px-4 py-2 text-sm font-semibold text-destructive-foreground bg-destructive hover:opacity-90 rounded-lg disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboardPage;
