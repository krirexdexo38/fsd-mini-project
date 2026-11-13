import React from 'react';
import { CalendarX } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = CalendarX,
  title = 'No items found',
  message = "There are no entries matching your current filters. Try resetting your criteria.",
  description,
  actionText,
  actionLabel,
  actionLink,
  onAction,
}) => {
  const displayText = actionLabel || actionText;
  const desc = description || message;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-xl border border-dashed border-border max-w-lg mx-auto my-8">
      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-foreground mb-4 border border-border">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-foreground font-display">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm leading-relaxed">
        {desc}
      </p>

      {displayText && actionLink && (
        <Link
          to={actionLink}
          className="mt-6 inline-flex items-center px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg border border-border hover:opacity-90 transition-opacity"
        >
          {displayText}
        </Link>
      )}

      {displayText && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg border border-border hover:opacity-90 transition-opacity"
        >
          {displayText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
