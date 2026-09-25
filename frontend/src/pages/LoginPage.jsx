import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CalendarDays, LogIn, Eye, EyeOff, Sparkles, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import Particles from '../components/common/Particles';

const LoginPage = () => {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const userData = await login(email, password);
      toast.success(`Welcome back, ${userData.name}!`);
      // If admin, go to /admin by default if coming from generic login
      if (userData.role === 'admin' && from === '/') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Demo auto-fill helpers for viva presentation
  const fillStudentDemo = () => {
    setEmail('student@campushub.edu');
    setPassword('Student@123');
  };

  const fillAdminDemo = () => {
    setEmail('admin@campushub.edu');
    setPassword('Admin@123');
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Full-bleed Interactive Notebook Particles Background */}
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

      {/* Ambient background vignette */}
      <div className="absolute inset-0 bg-background/20 pointer-events-none z-0" />

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md bg-card rounded-3xl p-8 border border-border shadow-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-muted border border-border text-primary flex items-center justify-center mx-auto shadow-xs">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-normal">
            Welcome to CampusHub
          </h2>
          <p className="text-xs text-muted-foreground">
            Sign in with your university account to explore and register
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Buttons for Viva */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200/70 dark:border-white/10 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>1-Click Demo Login (Viva Demo)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillStudentDemo}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-white dark:bg-slate-700/60 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Demo Student</span>
            </button>
            <button
              type="button"
              onClick={fillAdminDemo}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-white dark:bg-slate-700/60 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Campus Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@campushub.edu"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all pr-10 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-glow transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          New to CampusHub?{' '}
          <Link
            to="/register"
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
