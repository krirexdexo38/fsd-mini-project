import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import Particles from '../components/common/Particles';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biotechnology',
  'Management Studies (MBA)',
];

const RegisterPage = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: 'Computer Science & Engineering',
    studentId: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const user = await register(formData);
      toast.success(`Account created successfully! Welcome, ${user.name}.`);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Full-bleed Interactive Notebook Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={isDark ? ['#ffffff'] : ['#09090b', '#18181b', '#27272a']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <div className="absolute inset-0 bg-background/50 pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-lg bg-card rounded-3xl p-8 border border-border shadow-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-muted border border-border text-primary flex items-center justify-center mx-auto shadow-xs">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-normal">
            Create Campus Account
          </h2>
          <p className="text-xs text-muted-foreground">
            Join thousands of university students registering for events
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ananya Verma"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              University Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="student@campushub.edu"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Password (min. 6 chars) *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
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

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Account Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/15 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 focus:border-indigo-500 outline-none cursor-pointer"
              >
                <option value="student">Student</option>
                <option value="admin">Admin / Club Lead</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Student / Faculty ID
              </label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="e.g. 22CSE045"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:border-indigo-500 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 focus:border-indigo-500 outline-none cursor-pointer"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-glow transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
