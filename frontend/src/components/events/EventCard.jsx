import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import Badge from '../common/Badge';

const EventCard = ({ event }) => {
  if (!event) return null;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const percentFilled = Math.min(
    100,
    Math.round((event.registeredCount / event.capacity) * 100)
  );

  const isFull = event.registeredCount >= event.capacity;
  const isPast = new Date() > new Date(event.date);

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col group">
      {/* Banner Image */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <Badge variant={event.category}>{event.category}</Badge>
          {event.status !== 'published' && (
            <Badge variant={event.status} className="capitalize">
              {event.status}
            </Badge>
          )}
          {isFull && event.status === 'published' && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-destructive text-destructive-foreground shadow-2xs">
              Sold Out
            </span>
          )}
        </div>

        {/* Organizer badge at bottom of banner */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-xs font-semibold text-white/90 truncate">
            {event.organizer}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/events/${event._id}`}>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary font-serif transition-colors line-clamp-1">
              {event.title}
            </h3>
          </Link>

          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Meta Details */}
          <div className="mt-4 space-y-2 text-xs text-foreground/80 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
              <span>
                {event.startTime} - {event.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Seats Capacity & Action Footer */}
        <div className="pt-4 mt-4 border-t border-border/70">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              Seats
            </span>
            <span
              className={
                isFull
                  ? 'text-destructive font-bold'
                  : percentFilled > 80
                  ? 'text-amber-500 font-bold'
                  : 'text-primary font-bold'
              }
            >
              {event.registeredCount} / {event.capacity} filled
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-4">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull
                  ? 'bg-destructive'
                  : percentFilled > 80
                  ? 'bg-amber-500'
                  : 'bg-primary'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>

          <Link
            to={`/events/${event._id}`}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground shadow-2xs transition-all duration-200"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
