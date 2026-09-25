import React from 'react';

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    // Categories
    Technical: 'bg-primary/15 text-primary border-primary/30',
    Cultural: 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30',
    Sports: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
    Workshop: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30',
    Seminar: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30',
    Competition: 'bg-primary/15 text-primary border-primary/30',
    Other: 'bg-muted text-muted-foreground border-border',

    // Event Statuses
    published: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
    draft: 'bg-muted text-muted-foreground border-border',
    completed: 'bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/30',
    cancelled: 'bg-destructive/15 text-destructive border-destructive/30',

    // Registration Statuses
    registered: 'bg-primary/15 text-primary border-primary/30',
    attended: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
    absent: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30',

    default: 'bg-muted text-foreground/80 border-border',
  };

  const selectedClass = variants[variant] || variants.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${selectedClass} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
