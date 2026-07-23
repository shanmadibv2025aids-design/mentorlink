import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, Mail, Lock, LogIn, UserCheck, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'mentor'>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fromPath = (location.state as any)?.from?.pathname || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const user = await login({ email, password, role });
      showToast('Welcome back!', `Logged in as ${user.name} (${user.role})`);

      if (fromPath) {
        navigate(fromPath);
      } else if (user.role === 'mentor') {
        navigate('/mentor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      showToast('Login Failed', err.message || 'Please check your credentials', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (demoRole: 'student' | 'mentor') => {
    setIsSubmitting(true);
    try {
      const demoEmail = demoRole === 'mentor' ? 'sarah@mentor.com' : 'alex@student.com';
      const user = await login({ email: demoEmail, password: 'password123', role: demoRole });
      showToast('Demo Account Loaded', `Logged in as ${user.name} (${demoRole})`);

      if (demoRole === 'mentor') {
        navigate('/mentor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      showToast('Login Error', 'Could not load demo user', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#151515] border border-white/5 shadow-2xl shadow-black/80 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 mb-1">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Log In to MentorLink
          </h1>
          <p className="text-xs text-slate-400">
            Triggers <code className="text-blue-400">POST /auth/login</code>
          </p>
        </div>

        {/* Quick Demo Login Triggers */}
        <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
          <p className="text-[11px] font-semibold text-blue-300 text-center uppercase tracking-wider">
            ⚡ Quick Demo Accounts (One-Click)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="px-3 py-2 rounded-xl bg-[#1A1A1A] hover:bg-white/10 border border-blue-500/30 text-xs font-semibold text-blue-300 transition-colors shadow-xs"
            >
              Student Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('mentor')}
              className="px-3 py-2 rounded-xl bg-[#1A1A1A] hover:bg-white/10 border border-blue-500/30 text-xs font-semibold text-blue-300 transition-colors shadow-xs"
            >
              Mentor Demo
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role selector */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#111111] border border-white/5">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  role === 'student'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Student Mentee
              </button>
              <button
                type="button"
                onClick={() => setRole('mentor')}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  role === 'mentor'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Industry Mentor
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'mentor' ? 'sarah@mentor.com' : 'alex@student.com'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Authenticate & Enter
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-blue-400 hover:underline">
            Sign Up Now
          </Link>
        </p>

      </div>
    </div>
  );
};
