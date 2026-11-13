import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
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
    desc: 'Full-stack development, cloud computing, robotics',
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
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 sm:pt-20 pb-16 border-b border-border">
        {/* WebGL Particles Canvas */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Particles
            key={isDark ? 'dark' : 'light'}
            particleColors={isDark ? ['#ffffff'] : ['#000000']}
            particleCount={100}
            particleSpread={10}
            speed={0.08}
            particleBaseSize={80}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight max-w-4xl mx-auto leading-tight font-display">
            Discover and Register for Campus Events
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From technical hackathons and workshops to cultural galas and sports championships — explore and manage your campus activities.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg text-sm font-semibold text-primary-foreground bg-primary border border-border hover:opacity-90 transition-opacity"
            >
              <Compass className="w-4 h-4" />
              <span>Explore All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-medium text-foreground bg-card hover:bg-muted border border-border transition-colors"
            >
              <span>Join as Student</span>
            </Link>
          </div>

          {/* Platform Counters */}
          <div className="mt-14 max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 bg-card p-6 rounded-xl border border-border">
            <div className="text-center p-2">
              <p className="text-3xl font-extrabold text-foreground font-display">
                {stats.totalEvents || 12}+
              </p>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                Total Events
              </p>
            </div>
            <div className="text-center p-2 border-l border-border">
              <p className="text-3xl font-extrabold text-foreground font-display">
                {stats.upcomingEvents || 11}+
              </p>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                Upcoming
              </p>
            </div>
            <div className="text-center p-2 border-l border-border">
              <p className="text-3xl font-extrabold text-foreground font-display">
                {stats.totalRegistrations || 12}+
              </p>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                Registrations
              </p>
            </div>
            <div className="text-center p-2 border-l border-border">
              <p className="text-3xl font-extrabold text-foreground font-display">
                {stats.totalClubs || 8}+
              </p>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                Clubs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground font-display">
              Upcoming Events
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Hand-picked events happening this week across departments
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
          >
            <span>Browse All Events</span>
            <ArrowRight className="w-4 h-4" />
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

      {/* Event Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground font-display">
            Browse By Category
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Filter activities based on your department, interests, or competitive tracks
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_CARDS.map((cat) => (
            <Link
              key={cat.name}
              to={`/events?category=${cat.name}`}
              className="group bg-card p-6 rounded-xl border border-border hover:border-foreground/40 transition-colors"
            >
              <div className="text-2xl mb-3">{cat.icon}</div>
              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {cat.desc}
              </p>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-sm font-medium text-muted-foreground group-hover:text-foreground">
                <span>{cat.count}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/40 border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground font-display">
              How CampusHub Works
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              A straightforward process from discovery to attendance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground border border-border flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-foreground">
                Discover Events
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Filter and search through upcoming competitions, workshops, and sports matches across campus.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground border border-border flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-foreground">
                Instant Registration
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Sign in with your university account and reserve your slot with real-time seat availability.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground border border-border flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-foreground">
                Attend & Track
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                View your registered events timeline in your student dashboard and stay updated on venue timings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Organizer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border rounded-xl p-8 sm:p-10 text-foreground">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-foreground font-display">
              Organizing an Event or Workshop?
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Use the Organizer Console to publish events, monitor student attendance, and track venue capacities in real time.
            </p>
            <div className="mt-6">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-primary-foreground bg-primary border border-border hover:opacity-90 transition-opacity"
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
