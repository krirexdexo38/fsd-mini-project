import React from 'react';

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    // Categories & Types
    Technical: 'bg-muted text-foreground border-border',
    Cultural: 'bg-muted text-foreground border-border',
    Sports: 'bg-muted text-foreground border-border',
    Workshop: 'bg-muted text-foreground border-border',
    Seminar: 'bg-muted text-foreground border-border',
    Competition: 'bg-muted text-foreground border-border',
    Other: 'bg-muted text-muted-foreground border-border',

    // Event & Registration Statuses
    published: 'bg-muted text-foreground border-border',
    draft: 'bg-muted/70 text-muted-foreground border-border',
    completed: 'bg-muted text-foreground/80 border-border',
    cancelled: 'bg-destructive/15 text-destructive border-destructive/30',
    registered: 'bg-primary/20 text-foreground font-semibold border-primary/40',
    attended: 'bg-muted text-foreground border-border',
    absent: 'bg-muted text-muted-foreground border-border',

    default: 'bg-muted text-foreground border-border',
  };

  const selectedClass = variants[variant] || variants.default;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${selectedClass} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
