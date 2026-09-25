import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-soft">
      {/* Banner Skeleton */}
      <div className="h-48 w-full skeleton-shimmer bg-muted" />

      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 skeleton-shimmer bg-muted rounded-full" />
          <div className="h-4 w-16 skeleton-shimmer bg-muted rounded-md" />
        </div>

        <div className="h-6 w-3/4 skeleton-shimmer bg-muted rounded-md" />
        <div className="h-4 w-full skeleton-shimmer bg-muted rounded-md" />

        <div className="pt-3 border-t border-border flex items-center justify-between">
          <div className="h-4 w-28 skeleton-shimmer bg-muted rounded-md" />
          <div className="h-4 w-20 skeleton-shimmer bg-muted rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
