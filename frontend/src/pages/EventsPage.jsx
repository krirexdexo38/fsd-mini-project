import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventService } from '../services/eventService';
import EventGrid from '../components/events/EventGrid';
import EventFilters from '../components/events/EventFilters';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EventsPage = () => {
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
      {/* Header Banner */}
      <div className="rounded-xl border border-border p-6 sm:p-8 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-display">
            Explore Campus Events
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            Discover upcoming hackathons, tech talks, cultural galas, and tournaments across university departments.
          </p>
        </div>

        <div className="text-sm font-medium text-muted-foreground bg-muted px-4 py-2 rounded-lg border border-border self-start sm:self-center">
          Showing <span className="font-bold text-foreground">{events.length}</span> of{' '}
          <span className="font-bold text-foreground">{totalCount}</span> events
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
            className="p-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="p-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
