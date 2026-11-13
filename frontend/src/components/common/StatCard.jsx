import React from 'react';

const StatCard = ({ title, value, icon: Icon, subtitle }) => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2 font-display">
            {value !== undefined ? value : '—'}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted border border-border text-foreground">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
