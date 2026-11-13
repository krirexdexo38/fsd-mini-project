import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Orbit,
  Sun,
  Moon,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  LayoutDashboard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

// 3D Rolling Flip Text Component (Spin Text on Hover matching Dribbble inspiration)
function SpinText({ children, className = '' }) {
  return (
    <span className={`spin-text-wrapper ${className}`}>
      <span className="spin-text-item">{children}</span>
      <span className="spin-text-clone" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const dropdownRef = useRef(null);
  const lastScrollY = useRef(0);
  const scrollAccumulator = useRef(0);
  const isScrollingDown = useRef(false);

  const pathname = location.pathname;
  const search = location.search;

  // Calm, stabilized scroll reactivity with hysteresis & rAF frame throttling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = currentScrollY - lastScrollY.current;

          setIsScrolled(currentScrollY > 15);

          // Always stay expanded near top of the page
          if (currentScrollY <= 40) {
            setIsCollapsed(false);
            scrollAccumulator.current = 0;
            lastScrollY.current = currentScrollY;
            ticking = false;
            return;
          }

          // Check scroll direction with accumulated distance threshold to prevent rash flipping
          if (delta > 0) {
            // Scrolling down
            if (!isScrollingDown.current) {
              isScrollingDown.current = true;
              scrollAccumulator.current = 0;
            }
            scrollAccumulator.current += delta;

            // Require deliberate downward movement of at least 50px past 75px before morphing
            if (scrollAccumulator.current > 50 && currentScrollY > 75) {
              setIsCollapsed(true);
              setDropdownOpen(false);
              setMobileMenuOpen(false);
            }
          } else if (delta < 0) {
            // Scrolling up
            if (isScrollingDown.current) {
              isScrollingDown.current = false;
              scrollAccumulator.current = 0;
            }
            scrollAccumulator.current += Math.abs(delta);

            // Require deliberate upward movement of at least 35px before expanding
            if (scrollAccumulator.current > 35) {
              setIsCollapsed(false);
            }
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname, search]);

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out.');
    navigate('/');
    setDropdownOpen(false);
  };

  // Determine dynamic middle links depending on the active page & context
  const getNavLinks = () => {
    if (pathname.startsWith('/admin')) {
      return [
        { label: 'Event Hub', href: '/' },
        { label: 'Organizer Console', href: '/admin' },
        { label: 'Explore Events', href: '/events' },
      ];
    }

    if (pathname === '/dashboard') {
      return [
        { label: 'Home', href: '/' },
        { label: 'Explore Events', href: '/events' },
        { label: 'My Registrations', href: '/dashboard' },
      ];
    }

    if (pathname.startsWith('/events')) {
      return [
        { label: 'All Events', href: '/events' },
        { label: 'Technical', href: '/events?category=Technical' },
        { label: 'Cultural', href: '/events?category=Cultural' },
        { label: 'Sports', href: '/events?category=Sports' },
        { label: 'Workshops', href: '/events?category=Workshop' },
      ];
    }

    if (pathname === '/login' || pathname === '/register') {
      return [
        { label: 'Home', href: '/' },
        { label: 'Explore Events', href: '/events' },
      ];
    }

    return [
      { label: 'Home', href: '/' },
      { label: 'Events', href: '/events' },
      { label: 'Hackathons', href: '/events?category=Technical' },
      { label: 'Workshops', href: '/events?category=Workshop' },
    ];
  };

  const navLinks = getNavLinks();

  const isLinkActive = (href) => {
    if (href.includes('?')) {
      return `${pathname}${search}` === href;
    }
    if (href === '/') {
      return pathname === '/' && !search;
    }
    return pathname.startsWith(href) && !search;
  };

  return (
    <header
      className={`fixed top-3 sm:top-4 inset-x-0 z-50 pointer-events-none px-4 sm:px-6 flex transition-none ${
        isCollapsed ? 'justify-start' : 'justify-center'
      }`}
    >
      <div className="relative pointer-events-auto flex flex-col items-start">
        {/* Floating Capsule Bar with Hardware Spring Physics */}
        <motion.nav
          layout
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 30,
            mass: 0.8,
          }}
          onClick={() => {
            if (isCollapsed) setIsCollapsed(false);
          }}
          aria-label="Main Navigation"
          className={`inline-flex items-center rounded-full text-white border select-none ${
            isCollapsed
              ? 'p-1 bg-[#101010]/95 backdrop-blur-xl border-neutral-700/80 shadow-[0_12px_36px_rgba(0,0,0,0.6)] cursor-pointer hover:scale-105 active:scale-95'
              : isScrolled
              ? 'p-1 sm:p-1.5 bg-[#101010]/95 backdrop-blur-xl border-neutral-700/80 shadow-[0_16px_40px_rgba(0,0,0,0.55)] scale-[0.99]'
              : 'p-1 sm:p-1.5 bg-[#141414] border-neutral-800 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
          }`}
        >
          {/* Campus Hub Circular Logo */}
          <motion.div layout="position" className="shrink-0">
            <Link
              to="/"
              onClick={(e) => {
                if (isCollapsed) {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsCollapsed(false);
                }
              }}
              title={isCollapsed ? 'Click to expand navigation' : 'CampusHub Home'}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-black flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 hover:rotate-12"
            >
              <Orbit className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-black stroke-[2.2]" />
            </Link>
          </motion.div>

          {/* Interactive Content: Nav Links, Theme Switcher, Email Capsule */}
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                key="navbar-interactive-content"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{
                  opacity: { duration: 0.16, ease: 'easeOut' },
                  width: { type: 'spring', stiffness: 280, damping: 30, mass: 0.8 },
                }}
                className="overflow-hidden"
              >
                <div className="flex items-center ml-1.5 sm:ml-2.5 gap-1.5 sm:gap-2.5 whitespace-nowrap shrink-0 pr-0.5">
                  {/* Center: Dynamic Navigation Links with 3D Spin Hover */}
                  <div className="hidden md:flex items-center gap-0.5 sm:gap-1 px-1">
                    {navLinks.map((link) => {
                      const active = isLinkActive(link.href);
                      return (
                        <Link
                          key={link.href}
                          to={link.href}
                          className={`group relative text-sm font-medium px-3.5 py-1.5 rounded-full transition-colors duration-150 ${
                            active
                              ? 'text-white font-semibold bg-white/12 shadow-xs'
                              : 'text-neutral-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <SpinText>{link.label}</SpinText>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Theme Switcher Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTheme();
                    }}
                    aria-label="Toggle color theme"
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors shrink-0"
                  >
                    {isDark ? (
                      <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-200" />
                    )}
                  </button>

                  {/* Right: High-Contrast White Pill Capsule with 3D Spin Text on Hover */}
                  <div className="relative shrink-0" ref={dropdownRef}>
                    {isAuthenticated ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDropdownOpen(!dropdownOpen);
                        }}
                        className="group h-8 sm:h-9 px-3.5 sm:px-4 rounded-full bg-white text-black text-xs sm:text-sm font-semibold flex items-center justify-center shrink-0 shadow-sm hover:bg-neutral-100 active:scale-95 transition-all max-w-[170px] sm:max-w-[220px]"
                        title={user?.email}
                      >
                        <SpinText className="max-w-[150px] sm:max-w-[200px] truncate">{user?.email || 'Account'}</SpinText>
                      </button>
                    ) : (
                      <Link
                        to={pathname === '/login' ? '/register' : '/login'}
                        className="group h-8 sm:h-9 px-3.5 sm:px-4 rounded-full bg-white text-black text-xs sm:text-sm font-semibold flex items-center justify-center shrink-0 shadow-sm hover:bg-neutral-100 active:scale-95 transition-all whitespace-nowrap"
                      >
                        <SpinText>{pathname === '/login' ? 'Register' : 'Sign In'}</SpinText>
                      </Link>
                    )}

                    {/* Profile Dropdown Menu for Authenticated User */}
                    <AnimatePresence>
                      {dropdownOpen && isAuthenticated && !isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#1a1a1a] border border-neutral-800 p-2 shadow-2xl text-white z-50"
                        >
                          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 mb-1.5">
                            <p className="text-sm font-semibold text-white truncate">
                              {user?.name}
                            </p>
                            <p className="text-xs text-neutral-400 truncate mt-0.5">
                              {user?.email}
                            </p>
                            <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded bg-white/10 text-neutral-200 uppercase tracking-wider">
                              {user?.role || 'Student'}
                            </span>
                          </div>

                          <div className="space-y-0.5 text-sm">
                            {!isAdmin && (
                              <Link
                                to="/dashboard"
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                              >
                                <LayoutDashboard className="w-4 h-4" />
                                <span>My Registrations</span>
                              </Link>
                            )}

                            {isAdmin && (
                              <Link
                                to="/admin"
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                              >
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span>Organizer Console</span>
                              </Link>
                            )}

                            <Link
                              to="/events"
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              <Orbit className="w-4 h-4" />
                              <span>Explore Events</span>
                            </Link>

                            <div className="pt-1 mt-1 border-t border-neutral-800">
                              <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                              >
                                <span>Sign Out</span>
                                <LogOut className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Mobile Menu Expander Button */}
                  <div className="flex md:hidden shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMobileMenuOpen(!mobileMenuOpen);
                      }}
                      className="w-7 h-7 rounded-full text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                      aria-label="Toggle navigation"
                    >
                      {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

        {/* Mobile Expanded Links */}
        <AnimatePresence>
          {mobileMenuOpen && !isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="md:hidden mt-2 p-2.5 rounded-2xl bg-[#141414] border border-neutral-800 shadow-2xl flex flex-col gap-1 text-white"
            >
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-sm font-medium px-3.5 py-2 rounded-xl transition-colors ${
                      active
                        ? 'text-white font-semibold bg-white/15'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
