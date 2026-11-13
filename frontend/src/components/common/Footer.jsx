import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card text-muted-foreground pt-16 pb-12 border-t border-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground border border-border">
                <CalendarDays className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground font-display">
                CampusHub
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A streamlined campus platform connecting students with hackathons, workshops, and college tournaments.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-foreground font-bold text-sm mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/events" className="hover:text-foreground transition-colors">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link to="/events?category=Technical" className="hover:text-foreground transition-colors">
                  Hackathons & Coding
                </Link>
              </li>
              <li>
                <Link to="/events?category=Cultural" className="hover:text-foreground transition-colors">
                  Cultural Events
                </Link>
              </li>
              <li>
                <Link to="/events?category=Sports" className="hover:text-foreground transition-colors">
                  Sports Tournaments
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Portal */}
          <div>
            <h4 className="text-foreground font-bold text-sm mb-4">
              Portal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-foreground transition-colors">
                  My Registrations
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-foreground transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-foreground transition-colors">
                  Organizer Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Info */}
          <div>
            <h4 className="text-foreground font-bold text-sm mb-4">
              Architecture
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Full stack platform built with MongoDB, Express, React, and Node.js.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} CampusHub. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/events" className="hover:text-foreground transition-colors">
              Events
            </Link>
            <Link to="/login" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
