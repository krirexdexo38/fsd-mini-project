import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Building2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User,
  Mail,
  GraduationCap,
  Phone,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TeamSelector from '../components/kokonutui/team-selector';
import Loader from '../components/kokonutui/loader';
import Badge from '../components/common/Badge';

const MEMBER_ROLES = [
  'Team Lead',
  'Co-Developer',
  'UI/UX Designer',
  'Presenter / Speaker',
  'Researcher / Strategist',
  'Member',
];

export default function EventRegistrationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Registration Form State
  const [teamSize, setTeamSize] = useState(1);
  const [teamName, setTeamName] = useState('');
  const [primaryContact, setPrimaryContact] = useState({
    name: user?.name || '',
    email: user?.email || '',
    studentId: user?.studentId || '',
    department: user?.department || '',
    phone: '',
    college: 'Campus University',
    notes: '',
  });

  // Additional Team Members (for teamSize > 1)
  const [teamMembers, setTeamMembers] = useState([
    { name: '', email: '', studentId: '', department: '', role: 'Co-Developer' },
    { name: '', email: '', studentId: '', department: '', role: 'UI/UX Designer' },
    { name: '', email: '', studentId: '', department: '', role: 'Presenter / Speaker' },
    { name: '', email: '', studentId: '', department: '', role: 'Researcher / Strategist' },
  ]);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}/register` } });
      return;
    }

    const fetchEvent = async () => {
      try {
        const res = await eventService.getEventById(id);
        if (res.success && res.data) {
          setEvent(res.data);
          if (res.data.userRegistration?.status === 'registered') {
            toast.info('You are already registered for this event!');
            navigate(`/events/${id}`);
          }
        }
      } catch (err) {
        toast.error(err.message || 'Failed to load event details.');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, isAuthenticated, navigate]);

  // Sync user profile once loaded
  useEffect(() => {
    if (user) {
      setPrimaryContact((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        studentId: prev.studentId || user.studentId || '',
        department: prev.department || user.department || '',
      }));
    }
  }, [user]);

  const handleTeamMemberChange = (index, field, val) => {
    setTeamMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!primaryContact.name.trim()) newErrors.primaryName = 'Primary contact name is required';
    if (!primaryContact.email.trim()) newErrors.primaryEmail = 'Primary email is required';
    if (!primaryContact.phone.trim()) newErrors.primaryPhone = 'Phone number is required for event notices';

    if (teamSize > 1) {
      if (!teamName.trim()) {
        newErrors.teamName = 'Team name is required for team registrations';
      }

      // Validate each additional member
      for (let i = 0; i < teamSize - 1; i++) {
        const m = teamMembers[i];
        if (!m.name.trim()) {
          newErrors[`member_${i}_name`] = `Member ${i + 2} name is required`;
        }
        if (!m.email.trim()) {
          newErrors[`member_${i}_email`] = `Member ${i + 2} email is required`;
        }
      }
    }

    if (!agreeTerms) {
      newErrors.terms = 'Please accept the event registration terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please complete all required fields properly.');
      return;
    }

    setSubmitting(true);
    try {
      const activeMembers =
        teamSize > 1
          ? teamMembers.slice(0, teamSize - 1).map((m) => ({
              name: m.name.trim(),
              email: m.email.trim(),
              studentId: m.studentId.trim(),
              department: m.department.trim(),
              role: m.role || 'Member',
            }))
          : [];

      const payload = {
        registrationType: teamSize > 1 ? 'team' : 'individual',
        teamName: teamSize > 1 ? teamName.trim() : '',
        teamSize,
        teamMembers: activeMembers,
        primaryContact: {
          phone: primaryContact.phone.trim(),
          college: primaryContact.college.trim(),
          notes: primaryContact.notes.trim(),
        },
      };

      const res = await registrationService.registerForEvent(id, payload);
      if (res.success) {
        toast.success(
          teamSize > 1
            ? `🎉 Team "${teamName}" registered successfully for ${event.title}!`
            : `🎉 You are officially registered for ${event.title}!`
        );
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader
          size="lg"
          title="Loading Event Registration..."
          subtitle="Preparing team roster and entry requirements"
        />
      </div>
    );
  }

  if (!event) return null;

  const eventDate = new Date(event.date);
  const deadlineDate = new Date(event.registrationDeadline);
  const isDeadlinePassed = new Date() > deadlineDate;
  const isFull = event.registeredCount >= event.capacity;
  const remainingSeats = Math.max(0, event.capacity - event.registeredCount);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={`/events/${id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Details</span>
        </Link>
        <span className="text-xs text-muted-foreground font-semibold">
          Step 2 of 2: Attendee & Team Entry
        </span>
      </div>

      {/* Header Event Card */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-card relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={event.category}>{event.category}</Badge>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                {remainingSeats} Seats Available
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-serif">
              Register for {event.title}
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {eventDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {event.startTime} - {event.endTime}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {event.venue}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Warning notices if any */}
      {isDeadlinePassed ? (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>Registration deadline has passed. New registrations are currently closed.</span>
        </div>
      ) : isFull ? (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>This event has reached full capacity.</span>
        </div>
      ) : null}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Team Size Selector */}
        <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-6">
          <div className="border-b border-border pb-4 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-bold text-foreground font-serif flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Entry Format & Team Selection</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Register as an individual attendee or assemble a team for this event.
              </p>
            </div>
          </div>

          <div className="py-2">
            {/* KokonutUI Team Selector Component */}
            <TeamSelector
              defaultValue={teamSize}
              onChange={(newCount) => setTeamSize(newCount)}
              maxSize={5}
              label="Select Registration Team Size"
            />
          </div>

          {teamSize > 1 && (
            <div className="pt-4 border-t border-border space-y-2">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                Team Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Quantum Coders, Matrix Innovators"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.teamName ? 'border-destructive' : 'border-border'
                } bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-soft transition-all`}
              />
              {errors.teamName && (
                <p className="text-xs font-semibold text-destructive">{errors.teamName}</p>
              )}
            </div>
          )}
        </div>

        {/* SECTION 2: Primary Registrant Details */}
        <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-bold text-foreground font-serif flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <span>
                {teamSize > 1 ? 'Team Lead (Primary Contact)' : 'Attendee Information'}
              </span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Event credentials, admission ticket, and instructions will be sent here.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={primaryContact.name}
                onChange={(e) =>
                  setPrimaryContact({ ...primaryContact, name: e.target.value })
                }
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.primaryName ? 'border-destructive' : 'border-border'
                } bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-soft`}
                placeholder="John Doe"
              />
              {errors.primaryName && (
                <p className="text-xs font-semibold text-destructive mt-1">
                  {errors.primaryName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Email Address <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                value={primaryContact.email}
                onChange={(e) =>
                  setPrimaryContact({ ...primaryContact, email: e.target.value })
                }
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.primaryEmail ? 'border-destructive' : 'border-border'
                } bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-soft`}
                placeholder="john.doe@campus.edu"
              />
              {errors.primaryEmail && (
                <p className="text-xs font-semibold text-destructive mt-1">
                  {errors.primaryEmail}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Contact Phone <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
                <input
                  type="tel"
                  value={primaryContact.phone}
                  onChange={(e) =>
                    setPrimaryContact({ ...primaryContact, phone: e.target.value })
                  }
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                    errors.primaryPhone ? 'border-destructive' : 'border-border'
                  } bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-soft`}
                  placeholder="+91 98765 43210"
                />
              </div>
              {errors.primaryPhone && (
                <p className="text-xs font-semibold text-destructive mt-1">
                  {errors.primaryPhone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Student / Roll ID
              </label>
              <input
                type="text"
                value={primaryContact.studentId}
                onChange={(e) =>
                  setPrimaryContact({ ...primaryContact, studentId: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-soft"
                placeholder="CS-2024-042"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Department / Program
              </label>
              <input
                type="text"
                value={primaryContact.department}
                onChange={(e) =>
                  setPrimaryContact({ ...primaryContact, department: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-soft"
                placeholder="Computer Science & Engineering"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Additional Team Members (when teamSize > 1) */}
        {teamSize > 1 && (
          <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-6">
            <div className="border-b border-border pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground font-serif flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Team Members Roster ({teamSize - 1} Co-Participants)</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Enter credentials and assigned roles for each additional member.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {Array.from({ length: teamSize - 1 }).map((_, index) => {
                const member = teamMembers[index];
                return (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-muted/40 border border-border/70 space-y-4 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-border/50">
                      <span className="text-xs font-bold text-foreground flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                          {index + 2}
                        </span>
                        <span>Team Member #{index + 2}</span>
                      </span>
                      <span className="text-[11px] font-semibold text-primary bg-card px-2.5 py-0.5 rounded-lg border border-border">
                        {member.role || 'Member'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">
                          Full Name <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) =>
                            handleTeamMemberChange(index, 'name', e.target.value)
                          }
                          className={`w-full px-3.5 py-2 rounded-xl border ${
                            errors[`member_${index}_name`]
                              ? 'border-destructive'
                              : 'border-border'
                          } bg-card text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-soft`}
                          placeholder="Member name"
                        />
                        {errors[`member_${index}_name`] && (
                          <p className="text-[11px] font-semibold text-destructive mt-1">
                            {errors[`member_${index}_name`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">
                          Email Address <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) =>
                            handleTeamMemberChange(index, 'email', e.target.value)
                          }
                          className={`w-full px-3.5 py-2 rounded-xl border ${
                            errors[`member_${index}_email`]
                              ? 'border-destructive'
                              : 'border-border'
                          } bg-card text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-soft`}
                          placeholder="member.email@campus.edu"
                        />
                        {errors[`member_${index}_email`] && (
                          <p className="text-[11px] font-semibold text-destructive mt-1">
                            {errors[`member_${index}_email`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">
                          Student / Roll ID
                        </label>
                        <input
                          type="text"
                          value={member.studentId}
                          onChange={(e) =>
                            handleTeamMemberChange(index, 'studentId', e.target.value)
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-border bg-card text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-soft"
                          placeholder="CS-2024-XXX"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">
                          Role in Team
                        </label>
                        <select
                          value={member.role}
                          onChange={(e) =>
                            handleTeamMemberChange(index, 'role', e.target.value)
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-border bg-card text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-soft"
                        >
                          {MEMBER_ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 4: Special Requirements & Terms */}
        <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Special Requirements or Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={primaryContact.notes}
              onChange={(e) =>
                setPrimaryContact({ ...primaryContact, notes: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-soft resize-none"
              placeholder="e.g. Dietary preferences, accessibility assistance, or equipment requirements..."
            />
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary border-border bg-background"
              />
              <span className="text-xs text-muted-foreground leading-relaxed">
                I hereby declare that all participant details entered are accurate. All team
                members agree to abide by the university campus rules, venue guidelines, and event
                code of conduct.
              </span>
            </label>
            {errors.terms && (
              <p className="text-xs font-semibold text-destructive mt-1 ml-7">
                {errors.terms}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <Link
            to={`/events/${id}`}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border bg-card text-foreground text-xs font-bold text-center hover:bg-muted transition-colors"
          >
            Cancel & Return
          </Link>

          <button
            type="submit"
            disabled={submitting || isDeadlinePassed || isFull}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold text-center hover:opacity-90 shadow-soft transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Submitting Registration...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>
                  Confirm {teamSize > 1 ? `Team (${teamSize})` : 'Individual'} Registration
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
