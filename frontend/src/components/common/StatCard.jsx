import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'indigo', subtitle }) => {
  const colorMap = {
    indigo: {
      bg: 'bg-primary/15',
      icon: 'text-primary',
      border: 'border-primary/25',
    },
    purple: {
      bg: 'bg-accent/15',
      icon: 'text-accent',
      border: 'border-accent/25',
    },
    emerald: {
      bg: 'bg-emerald-500/15',
      icon: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/25',
    },
    amber: {
      bg: 'bg-amber-500/15',
      icon: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500/25',
    },
    rose: {
      bg: 'bg-destructive/15',
      icon: 'text-destructive',
      border: 'border-destructive/25',
    },
  };

  const current = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-card transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-extrabold text-foreground mt-2 tracking-tight font-serif">
            {value !== undefined ? value : '—'}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border ${current.bg} ${current.border} ${current.icon} shadow-2xs`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
