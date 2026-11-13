import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CalendarDays, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    typeof location.state?.from === 'string'
      ? location.state.from
      : location.state?.from?.pathname || '/';

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

  // Demo auto-fill helpers
  const fillStudentDemo = () => {
    setEmail('student@campushub.edu');
    setPassword('Student@123');
  };

  const fillAdminDemo = () => {
    setEmail('admin@campushub.edu');
    setPassword('Admin@123');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-card rounded-xl p-8 border border-border space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-lg bg-primary border border-border text-primary-foreground flex items-center justify-center mx-auto">
            <CalendarDays className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-foreground font-display">
            Welcome to CampusHub
          </h2>
          <p className="text-sm text-muted-foreground">
            Sign in with your university account to continue
          </p>
        </div>

        {/* Demo Credentials Quick-Fill */}
        <div className="bg-muted p-3.5 rounded-lg border border-border space-y-2.5">
          <p className="text-sm font-medium text-foreground">
            Demo Accounts:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillStudentDemo}
              className="py-1.5 px-3 rounded-md bg-card border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Student Demo
            </button>
            <button
              type="button"
              onClick={fillAdminDemo}
              className="py-1.5 px-3 rounded-md bg-card border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Admin Demo
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Campus Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@campushub.edu"
              className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:border-primary outline-none transition-colors placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:border-primary outline-none transition-colors pr-10 placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
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
            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-primary-foreground bg-primary border border-border hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-muted-foreground">
          New to CampusHub?{' '}
          <Link
            to="/register"
            className="font-medium text-foreground hover:text-primary transition-colors underline"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
