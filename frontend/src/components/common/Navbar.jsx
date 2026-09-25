import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Compass,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out successfully.');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-all duration-200 px-3.5 py-1.5 rounded-lg ${
      isActive
        ? 'text-primary-foreground bg-primary shadow-xs'
        : 'text-foreground/80 hover:text-foreground hover:bg-muted'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-xs group-hover:scale-105 transition-transform duration-200">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-normal text-foreground">
                CampusHub
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-muted-foreground tracking-wider uppercase -mt-0.5">
                Event Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/events" className={navLinkClass}>
              Explore Events
            </NavLink>

            {isAuthenticated && !isAdmin && (
              <NavLink to="/dashboard" className={navLinkClass}>
                My Registrations
              </NavLink>
            )}

            {isAuthenticated && isAdmin && (
              <NavLink to="/admin" className={navLinkClass}>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Admin Console
                </span>
              </NavLink>
            )}
          </nav>

          {/* Desktop Auth Controls & Theme Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-xl text-foreground hover:bg-muted border border-border transition-all duration-200"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-accent" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-card border border-border shadow-xs">
                  <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold uppercase shadow-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-foreground leading-tight">
                      {user?.name?.split(' ')[0]}
                    </p>
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 rounded-xl shadow-xs transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Theme Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-300" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fadeIn">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-primary/10 hover:text-primary"
          >
            <Compass className="w-4 h-4" /> Home
          </NavLink>
          <NavLink
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-primary/10 hover:text-primary"
          >
            <CalendarDays className="w-4 h-4" /> Explore Events
          </NavLink>

          {isAuthenticated && !isAdmin && (
            <NavLink
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-primary/10 hover:text-primary"
            >
              <LayoutDashboard className="w-4 h-4" /> My Registrations
            </NavLink>
          )}

          {isAuthenticated && isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-primary/10 hover:text-primary"
            >
              <ShieldCheck className="w-4 h-4 text-primary" /> Admin Console
            </NavLink>
          )}

          <div className="pt-3 border-t border-border">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2 bg-muted/60 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-foreground hover:bg-muted rounded-xl border border-border"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 rounded-xl shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
