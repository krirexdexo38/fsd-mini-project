import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Heart, GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md">
                <CalendarDays className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                CampusHub
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              The unified campus event platform connecting students with hackathons,
              cultural fests, technical workshops, and sports championships.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-indigo-400">
              <GraduationCap className="w-4 h-4" /> Full Stack Dev II Mini Project
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link to="/events?category=Technical" className="hover:text-white transition-colors">
                  Hackathons & Coding
                </Link>
              </li>
              <li>
                <Link to="/events?category=Cultural" className="hover:text-white transition-colors">
                  Cultural Galas
                </Link>
              </li>
              <li>
                <Link to="/events?category=Sports" className="hover:text-white transition-colors">
                  Sports Tournaments
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Portal */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Student Hub
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  My Registrations
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Organizer Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack Info */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              MERN Stack Architecture
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Engineered with MongoDB Atlas, Express.js, React.js (Vite), Node.js,
              and Tailwind CSS with JWT security.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['MongoDB', 'Express', 'React', 'Node.js', 'Tailwind', 'JWT'].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} CampusHub Event Portal. Built for 5th Sem CSE Mini-Project.</p>
          <p className="flex items-center gap-1.5">
            Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for university viva demonstration
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
