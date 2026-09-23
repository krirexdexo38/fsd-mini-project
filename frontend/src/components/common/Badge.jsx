import React from 'react';

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    // Categories
    Technical: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    Cultural: 'bg-pink-50 text-pink-700 border-pink-200/80',
    Sports: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    Workshop: 'bg-amber-50 text-amber-700 border-amber-200/80',
    Seminar: 'bg-purple-50 text-purple-700 border-purple-200/80',
    Competition: 'bg-rose-50 text-rose-700 border-rose-200/80',
    Other: 'bg-slate-100 text-slate-700 border-slate-200',

    // Event Statuses
    published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    draft: 'bg-slate-100 text-slate-600 border-slate-200',
    completed: 'bg-blue-50 text-blue-700 border-blue-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',

    // Registration Statuses
    registered: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    attended: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    absent: 'bg-amber-50 text-amber-700 border-amber-200',

    default: 'bg-slate-100 text-slate-700 border-slate-200',
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
