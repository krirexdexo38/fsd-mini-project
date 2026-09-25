import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

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
    <div className="bg-card rounded-2xl border border-border p-5 shadow-soft space-y-5 transition-colors duration-300">
      {/* Top Row: Search Input + Timeframe + Sort */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event title, club, or venue..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-input focus:border-primary focus:ring-2 focus:ring-ring/20 text-sm transition-all outline-none bg-card text-foreground placeholder:text-muted-foreground/60"
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

        {/* Timeframe Filter Tabs */}
        <div className="flex items-center bg-muted p-1 rounded-xl w-full md:w-auto border border-border/40">
          {['all', 'upcoming', 'past'].map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeframe(tab)}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                timeframe === tab
                  ? 'bg-card text-primary shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="relative w-full md:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <ArrowUpDown className="w-3.5 h-3.5" />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full pl-8 pr-4 py-2 rounded-xl border border-input text-xs font-semibold text-foreground bg-card focus:border-primary outline-none cursor-pointer"
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
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Categories:
        </span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              category === cat
                ? 'bg-primary text-primary-foreground shadow-2xs'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventFilters;
