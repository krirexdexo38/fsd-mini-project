import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-soft">
      {/* Banner Skeleton */}
      <div className="h-48 w-full skeleton-shimmer bg-slate-200" />

      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 skeleton-shimmer bg-slate-200 rounded-full" />
          <div className="h-4 w-16 skeleton-shimmer bg-slate-200 rounded-md" />
        </div>

        <div className="h-6 w-3/4 skeleton-shimmer bg-slate-200 rounded-md" />
        <div className="h-4 w-full skeleton-shimmer bg-slate-200 rounded-md" />

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="h-4 w-28 skeleton-shimmer bg-slate-200 rounded-md" />
          <div className="h-4 w-20 skeleton-shimmer bg-slate-200 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
