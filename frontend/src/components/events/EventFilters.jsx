import React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/components/ui/segmented-control';

const CATEGORIES = [
  'All',
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Seminar',
  'Competition',
];

const EventFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  timeframe,
  setTimeframe,
  sort,
  setSort,
  onReset,
}) => {
  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4 transition-colors duration-300">
      {/* Top Row: Search Input + Timeframe Segmented Control + Sort */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event title, organizer, or venue..."
            className="w-full pl-10 pr-9 py-2 rounded-lg border border-input focus:border-primary text-sm transition-colors outline-none bg-background text-foreground placeholder:text-muted-foreground"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Timeframe Segmented Control */}
        <SegmentedControl size="default" aria-label="Event timeframe">
          {['all', 'upcoming', 'past'].map((tab) => (
            <SegmentedControlItem
              key={tab}
              active={timeframe === tab}
              onClick={() => setTimeframe(tab)}
              className="capitalize"
            >
              {tab}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>

        {/* Sort Select */}
        <div className="relative w-full md:w-52">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <ArrowUpDown className="w-4 h-4" />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-input text-sm font-medium text-foreground bg-background focus:border-primary outline-none cursor-pointer"
          >
            <option value="date_asc">Date (Earliest First)</option>
            <option value="date_desc">Date (Latest First)</option>
            <option value="capacity">Largest Capacity</option>
            <option value="title">Alphabetical (A-Z)</option>
            <option value="newest">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pt-1 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap border transition-colors ${
              category === cat
                ? 'bg-primary text-primary-foreground border-border'
                : 'bg-muted text-muted-foreground hover:text-foreground border-border/50'
            }`}
          >
            {cat}
          </button>
        ))}
        {(search || category !== 'All' || timeframe !== 'all' || sort !== 'date_asc') && (
          <button
            onClick={onReset}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors ml-auto whitespace-nowrap"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default EventFilters;
