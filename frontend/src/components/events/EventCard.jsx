import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
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

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden transition-colors duration-200 flex flex-col group">
      {/* Banner Image */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
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
            <span className="px-3 py-1 rounded-md text-sm font-medium bg-destructive text-destructive-foreground">
              Sold Out
            </span>
          )}
        </div>

        {/* Organizer info at bottom of banner */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-sm font-medium text-white/90 truncate">
            {event.organizer}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/events/${event._id}`}>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {event.title}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Meta Details */}
          <div className="mt-5 space-y-2.5 text-sm text-foreground/80 font-medium">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-foreground/70 flex-shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-foreground/70 flex-shrink-0" />
              <span>
                {event.startTime} - {event.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-foreground/70 flex-shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Seats Capacity & Action Footer */}
        <div className="pt-5 mt-5 border-t border-border">
          <div className="flex items-center justify-between text-sm font-medium mb-2">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-4 h-4" />
              Seats
            </span>
            <span
              className={
                isFull
                  ? 'text-destructive font-semibold'
                  : 'text-foreground font-semibold'
              }
            >
              {event.registeredCount} / {event.capacity} filled
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-5 border border-border/40">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isFull ? 'bg-destructive' : 'bg-primary'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>

          <Link
            to={`/events/${event._id}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-primary-foreground bg-primary border border-border hover:opacity-90 transition-opacity"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
