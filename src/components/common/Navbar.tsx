import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { checkApiHealth, API_BASE_URL } from '../../services/api';
import { Logo } from './Logo';
import {
  Sparkles,
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Search,
  Wifi,
  WifiOff,
  UserCheck,
  Menu,
  X,
  Compass,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyApi = async () => {
      const healthy = await checkApiHealth();
      setApiOnline(healthy);
    };
    verifyApi();
    const interval = setInterval(verifyApi, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0A0A0A]/80 border-b border-white/5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center group">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              isActive('/')
                ? 'text-white bg-white/10 border border-white/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Explore
          </Link>
          <Link
            to="/matching"
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/matching')
                ? 'text-white bg-white/10 border border-white/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4 text-blue-400" />
            AI Match
          </Link>
          <Link
            to="/chat"
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/chat')
                ? 'text-white bg-white/10 border border-white/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-400" />
            AI Chat
          </Link>
          <Link
            to="/bookings"
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/bookings')
                ? 'text-white bg-white/10 border border-white/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4 text-blue-400" />
            Bookings
          </Link>

          {user && (
            <Link
              to={user.role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard'}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
                location.pathname.includes('dashboard')
                  ? 'text-white bg-white/10 border border-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right Section Controls */}
        <div className="flex items-center gap-2">

          {/* API Connection Indicator */}
          <div
            title={`API Endpoint: ${API_BASE_URL} (${apiOnline ? 'Backend Connected' : 'Demo API Mode Active'})`}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              apiOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            {apiOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{apiOnline ? 'Live Backend' : 'API Service'}</span>
          </div>

          {/* Quick Demo Role Switcher Pill */}
          {user && (
            <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-[#151515] border border-white/10 text-xs font-medium">
              <button
                onClick={() => switchDemoRole('student')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  user.role === 'student'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => switchDemoRole('mentor')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  user.role === 'mentor'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mentor
              </button>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-xl text-slate-300 hover:bg-white/5 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Auth State & Profile Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <span className="hidden sm:inline font-medium text-sm text-slate-200 max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#111111] border border-white/10 shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setIsProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-white/5">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      View Profile
                    </Link>

                    <Link
                      to={user.role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard'}
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      {user.role === 'mentor' ? 'Mentor Dashboard' : 'Student Dashboard'}
                    </Link>

                    {user.role === 'mentor' && (
                      <Link
                        to="/mentor/requests"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                      >
                        <UserCheck className="w-4 h-4 text-slate-400" />
                        Mentee Requests
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-white/5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-rose-950/30 transition-colors text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/5 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-white/5"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Explore Mentors
          </Link>
          <Link
            to="/matching"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            AI Matching
          </Link>
          <Link
            to="/chat"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            AI Mentor Chat
          </Link>
          <Link
            to="/bookings"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Bookings Management
          </Link>
          
          {user && (
            <Link
              to={user.role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard'}
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40"
            >
              Dashboard
            </Link>
          )}

          {user && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Active Role Mode:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => switchDemoRole('student')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    user.role === 'student' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  Student
                </button>
                <button
                  onClick={() => switchDemoRole('mentor')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    user.role === 'mentor' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  Mentor
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
