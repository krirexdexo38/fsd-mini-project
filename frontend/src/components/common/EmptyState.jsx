import React from 'react';
import { CalendarX } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = CalendarX,
  title = 'No items found',
  message = "There are no entries matching your current filters. Try resetting your criteria.",
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-2xl border border-dashed border-border max-w-lg mx-auto my-8 shadow-soft">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20 shadow-2xs">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-foreground font-serif">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm leading-relaxed">
        {message}
      </p>

      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="mt-6 inline-flex items-center px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:opacity-90 shadow-2xs transition-opacity"
        >
          {actionText}
        </Link>
      )}

      {actionText && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:opacity-90 shadow-2xs transition-opacity"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
