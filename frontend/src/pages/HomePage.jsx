import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Sparkles,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { eventService } from '../services/eventService';
import EventCard from '../components/events/EventCard';
import SkeletonCard from '../components/common/SkeletonCard';
import Particles from '../components/common/Particles';
import { useTheme } from '../context/ThemeContext';

const CATEGORY_CARDS = [
  {
    name: 'Technical',
    desc: 'Hackathons, coding challenges, AI seminars',
    icon: '💻',
    count: 'Hackathons & Dev',
  },
  {
    name: 'Cultural',
    desc: 'Music concerts, dance battles, dramatics',
    icon: '🎭',
    count: 'Arts & Galas',
  },
  {
    name: 'Sports',
    desc: 'Futsal, cricket, badminton, esports',
    icon: '⚽',
    count: 'Tournaments',
  },
  {
    name: 'Workshop',
    desc: 'MERN stack, cloud dev, robotics labs',
    icon: '🛠️',
    count: 'Hands-on Labs',
  },
];

const HomePage = () => {
  const { isDark } = useTheme();
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
      {/* Hero Section with Notebook Particles Background */}
      <section className="relative overflow-hidden pt-16 md:pt-24 pb-20 border-b border-border">
        {/* WebGL Particles Canvas */}
        <div className="absolute inset-0 z-0">
          <Particles
            key={isDark ? 'dark' : 'light'}
            particleColors={isDark ? ['#ffffff'] : ['#000000', '#09090b', '#18181b']}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>

        {/* Ambient Gradient Overlay ensuring high contrast and legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/60 pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pointer-events-none">
          {/* Top Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground border border-border text-xs font-semibold mb-6 shadow-xs pointer-events-auto">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="tracking-wide">The Official Campus Event Hub</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-foreground tracking-normal max-w-4xl mx-auto leading-[1.25] pointer-events-auto">
            Discover, Register & Experience{' '}
            <span className="text-primary underline underline-offset-8 decoration-wavy decoration-2 decoration-accent">
              Every Campus Event
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed pointer-events-auto font-normal">
            From 24-hour hackathons and technical masterclasses to cultural galas
            and sports championships — explore everything happening across campus with an authentic notebook experience.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
            <Link
              to="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-primary-foreground bg-primary hover:opacity-90 shadow-md hover:scale-[1.02] transition-all duration-200"
            >
              <Compass className="w-4 h-4" />
              <span>Explore All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-foreground bg-card hover:bg-muted border border-border shadow-xs transition-all duration-200"
            >
              <span>Join as Student</span>
            </Link>
          </div>

          {/* Live Platform Counters Bar */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 bg-card p-6 rounded-2xl border border-border shadow-md pointer-events-auto">
            <div className="text-center p-2">
              <p className="text-3xl sm:text-4xl font-extrabold text-primary">
                {stats.totalEvents || 12}+
              </p>
              <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">
                Total Events
              </p>
            </div>
            <div className="text-center p-2 border-l border-border">
              <p className="text-3xl sm:text-4xl font-extrabold text-foreground">
                {stats.upcomingEvents || 11}+
              </p>
              <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">
                Upcoming
              </p>
            </div>
            <div className="text-center p-2 border-l border-border">
              <p className="text-3xl sm:text-4xl font-extrabold text-primary">
                {stats.totalRegistrations || 12}+
              </p>
              <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">
                Registrations
              </p>
            </div>
            <div className="text-center p-2 border-l border-border">
              <p className="text-3xl sm:text-4xl font-extrabold text-foreground">
                {stats.totalClubs || 8}+
              </p>
              <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">
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
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <CalendarDays className="w-4 h-4" />
              Featured Highlights
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Upcoming Campus Events
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80 group"
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Browse By Category
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Find events that match your interests, passions, and career aspirations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_CARDS.map((cat) => (
            <Link
              key={cat.name}
              to={`/events?category=${cat.name}`}
              className="group relative bg-card p-6 rounded-2xl border border-border shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{cat.icon}</div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                {cat.desc}
              </p>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
                <span>{cat.count}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/40 border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
              How CampusHub Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-lg mb-4 shadow-xs">
                1
              </div>
              <h3 className="text-base font-bold text-foreground">
                Discover Events
              </h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Filter and search through upcoming competitions, workshops, and sports matches across campus.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-lg mb-4 shadow-xs">
                2
              </div>
              <h3 className="text-base font-bold text-foreground">
                Instant Registration
              </h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Sign in with your university credentials and register in one click. Instant verification with real-time seat tracking.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-lg mb-4 shadow-xs">
                3
              </div>
              <h3 className="text-base font-bold text-foreground">
                Attend & Track
              </h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                View your registered events timeline in your student dashboard and stay updated on venue timings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Organizer Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 text-foreground relative overflow-hidden shadow-md">
          <div className="relative z-10 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold border border-border">
              For Faculty & Club Coordinators
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-4 tracking-tight text-foreground">
              Organizing a College Event or Workshop?
            </h2>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Use the Organizer Console to create events, monitor live student participant lists,
              track capacities, and mark attendance easily during your fest.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/admin"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:opacity-90 transition-opacity shadow-xs"
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
