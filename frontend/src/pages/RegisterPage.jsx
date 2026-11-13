import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-card rounded-xl p-8 border border-border space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-lg bg-primary border border-border text-primary-foreground flex items-center justify-center mx-auto">
            <CalendarDays className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-foreground font-display">
            Create Campus Account
          </h2>
          <p className="text-sm text-muted-foreground">
            Register to participate in hackathons, workshops, and college events
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Krish Khanna"
              className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:border-primary outline-none transition-colors placeholder:text-muted-foreground"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              University Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="student@campushub.edu"
              className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:border-primary outline-none transition-colors placeholder:text-muted-foreground"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Password (min. 6 characters) *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
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

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Department *
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:border-primary outline-none transition-colors cursor-pointer"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Student Roll / ID Number (Optional)
            </label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="e.g. 21BCS1045"
              className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:border-primary outline-none transition-colors placeholder:text-muted-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-primary-foreground bg-primary border border-border hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already registered?{' '}
          <Link
            to="/login"
            className="font-medium text-foreground hover:text-primary transition-colors underline"
          >
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
