import React from 'react';
import EventCard from './EventCard';
import SkeletonCard from '../common/SkeletonCard';
import EmptyState from '../common/EmptyState';
import { CalendarX } from 'lucide-react';

const EventGrid = ({
  events = [],
  loading = false,
  emptyTitle = 'No events found',
  emptyMessage = 'We could not find any events matching your selected criteria. Try adjusting your search or filters.',
  onResetFilters,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon={CalendarX}
        title={emptyTitle}
        message={emptyMessage}
        actionText={onResetFilters ? 'Clear All Filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
};

export default EventGrid;
