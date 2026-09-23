import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Sparkles,
  ArrowRight,
  Users,
  Building2,
  Trophy,
  CheckCircle,
  Search,
  Compass,
} from 'lucide-react';
import { eventService } from '../services/eventService';
import EventCard from '../components/events/EventCard';
import SkeletonCard from '../components/common/SkeletonCard';

const CATEGORY_CARDS = [
  {
    name: 'Technical',
    desc: 'Hackathons, coding challenges, AI seminars',
    icon: '💻',
    color: 'from-blue-600 to-indigo-600',
    count: 'Hackathons & Dev',
  },
  {
    name: 'Cultural',
    desc: 'Music concerts, dance battles, dramatics',
    icon: '🎭',
    color: 'from-pink-600 to-rose-600',
    count: 'Arts & Galas',
  },
  {
    name: 'Sports',
    desc: 'Futsal, cricket, badminton, esports',
    icon: '⚽',
    color: 'from-emerald-600 to-teal-600',
    count: 'Tournaments',
  },
  {
    name: 'Workshop',
    desc: 'MERN stack, cloud dev, robotics labs',
    icon: '🛠️',
    color: 'from-amber-600 to-orange-600',
    count: 'Hands-on Labs',
  },
];

const HomePage = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
    totalClubs: 0,
  });
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [statsRes, eventsRes] = await Promise.all([
          eventService.getEventStats(),
          eventService.getEvents({ timeframe: 'upcoming', limit: 3, sort: 'date_asc' }),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (eventsRes.success) setFeaturedEvents(eventsRes.data);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 bg-gradient-to-b from-indigo-50/60 via-white to-transparent">
        {/* Background glow dots */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-xs font-bold text-indigo-700 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>The Official Campus Event Hub</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Discover, Register & Experience{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              Every Campus Event
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            From 24-hour hackathons and technical masterclasses to cultural galas
            and sports leagues — explore everything happening across clubs and departments.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Compass className="w-4 h-4" />
              <span>Explore All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-soft transition-all duration-200"
            >
              <span>Join as Student</span>
            </Link>
          </div>

          {/* Live Platform Counters Bar */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-soft">
            <div className="text-center p-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
                {stats.totalEvents || 12}+
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Total Events
              </p>
            </div>
            <div className="text-center p-2 border-l border-slate-100">
              <p className="text-2xl sm:text-3xl font-extrabold text-violet-600">
                {stats.upcomingEvents || 11}+
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Upcoming
              </p>
            </div>
            <div className="text-center p-2 border-l border-slate-100">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                {stats.totalRegistrations || 12}+
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Registrations
              </p>
            </div>
            <div className="text-center p-2 border-l border-slate-100">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">
                {stats.totalClubs || 8}+
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Campus Clubs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              <CalendarDays className="w-4 h-4" />
              Featured Highlights
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Upcoming Campus Events
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 group"
          >
            <span>Browse All Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Event Categories Exploration Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse By Category
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Find events that match your interests, passions, and career aspirations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_CARDS.map((cat) => (
            <Link
              key={cat.name}
              to={`/events?category=${cat.name}`}
              className="group relative bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{cat.icon}</div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {cat.desc}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>{cat.count}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              How CampusHub Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-lg mb-4 shadow-sm">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Discover Events
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Filter and search through upcoming competitions, workshops, and sports matches across campus.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="w-12 h-12 rounded-xl bg-violet-600 text-white flex items-center justify-center font-extrabold text-lg mb-4 shadow-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Instant Registration
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Sign in with your university credentials and register in one click. Instant verification with real-time seat tracking.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg mb-4 shadow-sm">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Attend & Track
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                View your registered events timeline in your student dashboard and stay updated on venue timings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Organizer Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-card">
          <div className="relative z-10 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold border border-indigo-400/30">
              For Faculty & Club Coordinators
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-4 tracking-tight">
              Organizing a College Event or Workshop?
            </h2>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              Use the Organizer Console to create events, monitor live student participant lists,
              track capacities, and mark attendance easily during your fest.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/admin"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-indigo-900 bg-white hover:bg-slate-100 transition-colors shadow-sm"
              >
                Access Organizer Console
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
