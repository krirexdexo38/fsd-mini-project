import React, { useState } from "react";
import {
  X,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User,
  Mail,
  GraduationCap,
  FileText,
} from "lucide-react";
import TeamSelector from "../kokonutui/team-selector";

export default function EventRegisterModal({
  isOpen,
  onClose,
  event,
  user,
  onSubmit,
  loading,
}) {
  const [teamSize, setTeamSize] = useState(1);
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState([
    { name: "", email: "", studentId: "", role: "Co-Developer" },
    { name: "", email: "", studentId: "", role: "Designer" },
    { name: "", email: "", studentId: "", role: "Presenter" },
    { name: "", email: "", studentId: "", role: "Member" },
  ]);
  const [notes, setNotes] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  if (!isOpen || !event) return null;

  const handleMemberChange = (index, field, value) => {
    setTeamMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeTerms) return;

    // Filter relevant additional members based on teamSize
    const activeAdditionalMembers =
      teamSize > 1 ? teamMembers.slice(0, teamSize - 1) : [];

    onSubmit({
      teamSize,
      teamName: teamSize > 1 ? teamName.trim() || `${user?.name}'s Team` : "",
      teamMembers: activeAdditionalMembers,
      notes: notes.trim(),
    });
  };

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-0">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-3xl border border-border shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Event Registration</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-normal">
              {event.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-2 font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {formattedDate} • {event.startTime}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {event.venue}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Primary Registrant Info (Pre-filled) */}
          <div className="p-4 rounded-2xl bg-muted/50 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary" />
                <span>Primary Participant (You)</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Verified Account
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Full Name
                </label>
                <div className="p-2.5 rounded-xl bg-card border border-border font-bold text-foreground">
                  {user?.name}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Email
                </label>
                <div className="p-2.5 rounded-xl bg-card border border-border font-medium text-foreground truncate">
                  {user?.email}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Department
                </label>
                <div className="p-2.5 rounded-xl bg-card border border-border text-foreground truncate">
                  {user?.department || "Computer Science"}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Student ID
                </label>
                <div className="p-2.5 rounded-xl bg-card border border-border font-mono font-bold text-foreground">
                  {user?.studentId || "22CSE045"}
                </div>
              </div>
            </div>
          </div>

          {/* KokonutUI Team Selector */}
          <div className="space-y-4">
            <TeamSelector
              defaultValue={teamSize}
              onChange={(size) => setTeamSize(size)}
              maxSize={5}
              label="Select Team Participation"
            />

            {/* If Team Size > 1, show Team Name & Additional Members Inputs */}
            {teamSize > 1 && (
              <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 space-y-4 animate-in fade-in-0 duration-200">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Algorand Hackers, PixelCraft"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-3 pt-2 border-t border-border/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span>Additional Team Members ({teamSize - 1})</span>
                  </span>

                  {Array.from({ length: teamSize - 1 }).map((_, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-xl bg-card border border-border space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-primary">
                        <span>Member #{index + 2}</span>
                        <span className="text-[10px] text-muted-foreground font-normal">
                          Teammate
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          required
                          value={teamMembers[index]?.name || ""}
                          onChange={(e) =>
                            handleMemberChange(index, "name", e.target.value)
                          }
                          placeholder="Member Name *"
                          className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-xs focus:border-primary outline-none"
                        />
                        <input
                          type="email"
                          required
                          value={teamMembers[index]?.email || ""}
                          onChange={(e) =>
                            handleMemberChange(index, "email", e.target.value)
                          }
                          placeholder="University Email *"
                          className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-xs focus:border-primary outline-none"
                        />
                        <input
                          type="text"
                          value={teamMembers[index]?.studentId || ""}
                          onChange={(e) =>
                            handleMemberChange(
                              index,
                              "studentId",
                              e.target.value
                            )
                          }
                          placeholder="Student ID (Optional)"
                          className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-xs focus:border-primary outline-none font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notes or Special Requests */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>Special Notes or Requirements (Optional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific questions, tech requirements, or dietary preferences..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground resize-none"
            />
          </div>

          {/* Guidelines agreement checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-muted-foreground select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-border text-primary focus:ring-primary"
            />
            <span>
              I confirm that all provided details are accurate and agree to follow
              campus event guidelines and the code of conduct.
            </span>
          </label>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !agreeTerms}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Registering...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Confirm Registration {teamSize > 1 ? `(${teamSize} Members)` : ""}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
