import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventService } from '../services/eventService';
import EventGrid from '../components/events/EventGrid';
import EventFilters from '../components/events/EventFilters';
import Particles from '../components/common/Particles';
import { useTheme } from '../context/ThemeContext';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

const EventsPage = () => {
  const { isDark } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL query parameters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [timeframe, setTimeframe] = useState(searchParams.get('timeframe') || 'upcoming');
  const [sort, setSort] = useState(searchParams.get('sort') || 'date_asc');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [events, setEvents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync state with URL params
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category && category !== 'All') params.category = category;
    if (timeframe && timeframe !== 'upcoming') params.timeframe = timeframe;
    if (sort && sort !== 'date_asc') params.sort = sort;
    if (page > 1) params.page = page;

    setSearchParams(params, { replace: true });
  }, [search, category, timeframe, sort, page, setSearchParams]);

  // Fetch events when filters change
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const query = {
          search,
          category,
          timeframe,
          sort,
          page,
          limit: 9,
        };
        const res = await eventService.getEvents(query);
        if (res.success) {
          setEvents(res.data);
          setTotalCount(res.total);
          setTotalPages(res.pages || 1);
        }
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search input slightly
    const timer = setTimeout(fetchEvents, 300);
    return () => clearTimeout(timer);
  }, [search, category, timeframe, sort, page]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setTimeframe('all');
    setSort('date_asc');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Notebook Header Banner with Particles Canvas */}
      <div className="relative overflow-hidden rounded-3xl border border-border p-6 sm:p-8 bg-card shadow-sm">
        {/* WebGL Particles Canvas */}
        <div className="absolute inset-0 z-0">
          <Particles
            particleColors={isDark ? ['#ffffff'] : ['#09090b', '#18181b', '#27272a']}
            particleCount={120}
            particleSpread={8}
            speed={0.1}
            particleBaseSize={80}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/85 to-transparent pointer-events-none z-0" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1.5">
              <CalendarDays className="w-4 h-4" />
              <span>Campus Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-normal">
              Explore Campus Events
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Discover upcoming hackathons, tech talks, cultural galas, and tournaments across universities.
            </p>
          </div>

          <div className="text-xs font-semibold text-muted-foreground bg-card px-4 py-2.5 rounded-xl border border-border shadow-xs self-start sm:self-center">
            Showing <span className="font-bold text-foreground">{events.length}</span> of{' '}
            <span className="font-bold text-foreground">{totalCount}</span> events
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <EventFilters
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        category={category}
        setCategory={(val) => {
          setCategory(val);
          setPage(1);
        }}
        timeframe={timeframe}
        setTimeframe={(val) => {
          setTimeframe(val);
          setPage(1);
        }}
        sort={sort}
        setSort={(val) => {
          setSort(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Event Grid */}
      <EventGrid
        events={events}
        loading={loading}
        onResetFilters={handleResetFilters}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="p-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="px-4 py-2 text-xs font-bold text-foreground bg-card border border-border rounded-xl shadow-soft">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="p-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
            aria-label="Next Page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
